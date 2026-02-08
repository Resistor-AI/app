import {
  MemoryChallenge,
  WordRecallChallenge,
  ColorSequenceChallenge,
  GridPatternChallenge,
} from "@/src/types/Block/challenges";
import { WORD_POOL, COLOR_PALETTE } from "./challengeData";

function shuffleAndPick<T>(arr: readonly T[], count: number): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, count);
}

function generateWordRecall(): WordRecallChallenge {
  return {
    type: "word_recall",
    words: shuffleAndPick(WORD_POOL, 6),
    memorizeMs: 5000,
  };
}

function generateColorSequence(): ColorSequenceChallenge {
  const picked = shuffleAndPick(COLOR_PALETTE, 6);
  return {
    type: "color_sequence",
    colors: picked.map((c) => c.hex),
    colorNames: picked.map((c) => c.name),
    flashMs: 800,
  };
}

function generateGridPattern(): GridPatternChallenge {
  const totalCells = 16;
  const activeCount = 6 + Math.floor(Math.random() * 3); // 6-8
  const indices = Array.from({ length: totalCells }, (_, i) => i);
  const activeCells = shuffleAndPick(indices, activeCount);
  return {
    type: "grid_pattern",
    gridSize: 4,
    activeCells,
    memorizeMs: 4000,
  };
}

const generators = [generateWordRecall, generateColorSequence, generateGridPattern];

export function generateChallenge(): MemoryChallenge {
  const idx = Math.floor(Math.random() * generators.length);
  return generators[idx]();
}
