import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { Opik } from "npm:opik";

const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY")!;
const MODEL = "claude-sonnet-4-5-20250929";

const SYSTEM_PROMPT = `You are a focus session planner. Given a time window and optionally a brain dump of tasks, create an optimized focus schedule.

Return ONLY valid JSON matching this exact structure:
{
  "tasks": [{ "id": string, "title": string, "estimatedMinutes": number, "priority": "urgent"|"high"|"normal"|"low", "originalText": string, "notes": string|null }],
  "schedule": [{ "id": string, "type": "task"|"short_break"|"regenerative_break", "title": string, "taskId": string (for tasks only), "startTime": ISO string, "endTime": ISO string, "durationMinutes": number, "priority": "urgent"|"high"|"normal"|"low" (for tasks only) }],
  "summary": { "totalTasks": number, "scheduledTasks": number, "totalFocusMinutes": number, "totalBreakMinutes": number, "urgentTasks": number, "unscheduledTasks": string[], "suggestion": string }
}

Rules:
- If a brain dump is provided, extract individual tasks from it
- If no brain dump is provided, create focused deep work blocks with descriptive titles (e.g., "Deep Focus Block 1", "Creative Work Sprint")
- Assign priorities based on urgency cues (deadlines, importance words)
- Order: urgent first, then high, normal, low
- Insert 5-min short breaks every 25 min of focus
- Insert 15-min regenerative breaks every 4 focus blocks
- Breaks should have fun activity suggestions as titles (e.g., "Stretch & breathe", "Quick walk")
- If tasks exceed the time window, schedule what fits and list the rest in unscheduledTasks
- The suggestion field should be an encouraging, practical tip about the session
- All times must fall within the provided start/end window
- Never use dashes (-, —, –) in any text fields. Use commas or periods instead
- No markdown, no explanation, JSON only`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders() });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return errorResponse("Missing authorization header", 401);
    }

    const body = await req.json();
    const { brainDump, startTime, endTime, breakPreference } = body;

    if (!startTime || !endTime) {
      return errorResponse("Missing required fields: startTime and endTime", 400);
    }

    const durationMinutes =
      body.durationMinutes ??
      Math.round(
        (new Date(endTime).getTime() - new Date(startTime).getTime()) / 60000,
      );

    const userPrompt = buildUserPrompt(
      brainDump ?? "",
      startTime,
      endTime,
      durationMinutes,
      breakPreference,
    );
    const { schedule, traceId } = await traceScheduleGeneration(userPrompt);

    return new Response(
      JSON.stringify({ success: true, data: schedule, traceId }),
      { headers: { ...corsHeaders(), "Content-Type": "application/json" } },
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return errorResponse(message, 500);
  }
});

function buildUserPrompt(
  brainDump: string,
  startTime: string,
  endTime: string,
  durationMinutes: number,
  breakPreference: string,
): string {
  const breakStyle =
    breakPreference === "short"
      ? "Minimize break duration (3-min short, 8-min long)"
      : breakPreference === "extended"
        ? "Generous breaks (8-min short, 20-min long)"
        : "Standard Pomodoro breaks (5-min short, 15-min long)";

  const taskSection = brainDump?.trim()
    ? `Brain dump:\n${brainDump}`
    : "No specific tasks provided. Create an optimized deep work schedule with focused blocks.";

  return `${taskSection}\n\nTime window: ${startTime} to ${endTime} (${durationMinutes} minutes total)\nBreak style: ${breakStyle}`;
}

function getOpikClient(): Opik | null {
  const apiKey = Deno.env.get("OPIK_API_KEY");
  const workspace = Deno.env.get("OPIK_WORKSPACE");
  if (!apiKey || !workspace) return null;

  return new Opik({
    apiKey,
    workspaceName: workspace,
    projectName: Deno.env.get("OPIK_PROJECT_NAME") || "resistor-ai",
  });
}

async function callClaudeRaw(
  userPrompt: string,
): Promise<{ text: string; inputTokens: number; outputTokens: number }> {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userPrompt }],
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Claude API error: ${response.status} - ${errorBody}`);
  }

  const result = await response.json();
  const text = result.content?.[0]?.text;
  if (!text) throw new Error("Empty response from Claude");

  return {
    text,
    inputTokens: result.usage?.input_tokens ?? 0,
    outputTokens: result.usage?.output_tokens ?? 0,
  };
}

function parseScheduleText(text: string): unknown {
  const cleaned = text
    .replace(/```json\n?/g, "")
    .replace(/```\n?/g, "")
    .trim();
  return JSON.parse(cleaned);
}

async function traceScheduleGeneration(
  userPrompt: string,
): Promise<{ schedule: unknown; traceId: string | null }> {
  const opik = getOpikClient();
  if (!opik) {
    const raw = await callClaudeRaw(userPrompt);
    return { schedule: parseScheduleText(raw.text), traceId: null };
  }

  const trace = opik.trace({ name: "generate-schedule", input: { userPrompt } });
  const span = trace.span({
    name: "claude-schedule-call",
    type: "llm",
    input: { system: SYSTEM_PROMPT, user: userPrompt },
    model: MODEL,
    provider: "anthropic",
  });

  const startMs = Date.now();
  const raw = await callClaudeRaw(userPrompt);
  const durationMs = Date.now() - startMs;
  const schedule = parseScheduleText(raw.text);

  span.end({
    output: { schedule },
    usage: { total_tokens: raw.inputTokens + raw.outputTokens },
    metadata: {
      input_tokens: raw.inputTokens,
      output_tokens: raw.outputTokens,
      duration_ms: durationMs,
    },
  });
  trace.end({ output: { schedule } });

  // Flush in background — don't block response
  opik.flush().catch(() => {});

  return { schedule, traceId: trace.id };
}

function corsHeaders(): Record<string, string> {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type",
  };
}

function errorResponse(message: string, status: number): Response {
  return new Response(JSON.stringify({ success: false, error: message }), {
    status,
    headers: { ...corsHeaders(), "Content-Type": "application/json" },
  });
}
