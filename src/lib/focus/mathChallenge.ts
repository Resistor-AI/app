import { MathChallenge } from "@/src/types/Focus/EnhancedFrictionModal";

export function generateMathChallenge(): MathChallenge {
  const a = Math.floor(Math.random() * 12) + 2;
  const b = Math.floor(Math.random() * 12) + 2;
  return { question: `${a} × ${b}`, answer: a * b };
}
