import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { Opik } from "npm:opik";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders() });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return errorResponse("Missing authorization header", 401);
    }

    const { traceId, rating, comment } = await req.json();

    if (!traceId || !rating || rating < 1 || rating > 5) {
      return errorResponse("Missing or invalid traceId/rating", 400);
    }

    const opik = getOpikClient();
    if (!opik) {
      return errorResponse("Opik not configured", 503);
    }

    await opik.logTracesFeedbackScores([
      {
        id: traceId,
        name: "schedule-quality",
        value: (rating - 1) / 4,
        reason: comment || undefined,
      },
    ]);
    await opik.flush();

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders(), "Content-Type": "application/json" },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return errorResponse(message, 500);
  }
});

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
