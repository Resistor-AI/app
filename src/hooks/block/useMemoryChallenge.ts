import { useState, useCallback, useEffect, useRef } from "react";
import { MemoryChallenge, ChallengePhase } from "@/src/types/Block/challenges";
import { generateChallenge } from "@/src/lib/focus/friction/generateChallenge";

export function useMemoryChallenge() {
  const [challenge] = useState<MemoryChallenge>(() => generateChallenge());
  const [phase, setPhase] = useState<ChallengePhase>("memorize");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const getMemorizeMs = (c: MemoryChallenge): number => {
    switch (c.type) {
      case "word_recall": return c.memorizeMs;
      case "color_sequence": return c.colors.length * c.flashMs + 500;
      case "grid_pattern": return c.memorizeMs;
    }
  };

  useEffect(() => {
    if (phase !== "memorize") return;
    const ms = getMemorizeMs(challenge);
    timerRef.current = setTimeout(() => setPhase("recall"), ms);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [challenge, phase]);

  const retry = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setPhase("memorize");
  }, []);

  return { challenge, phase, retry };
}
