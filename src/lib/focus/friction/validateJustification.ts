const MIN_CHARS = 100;
const MIN_DISTINCT_WORDS = 3;

export function validateJustification(text: string): {
  valid: boolean;
  message?: string;
} {
  const trimmed = text.trim();

  if (trimmed.length < MIN_CHARS) {
    return { valid: false, message: `At least ${MIN_CHARS} characters required` };
  }

  const distinctWords = new Set(
    trimmed.toLowerCase().split(/\s+/).filter((w) => w.length > 1),
  );

  if (distinctWords.size < MIN_DISTINCT_WORDS) {
    return { valid: false, message: "Please write a meaningful justification" };
  }

  return { valid: true };
}
