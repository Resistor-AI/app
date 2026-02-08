import { ChallengeType } from "./index";

export interface WordRecallChallenge {
  type: "word_recall";
  words: string[];
  memorizeMs: number;
}

export interface ColorSequenceChallenge {
  type: "color_sequence";
  colors: string[];
  colorNames: string[];
  flashMs: number;
}

export interface GridPatternChallenge {
  type: "grid_pattern";
  gridSize: number;
  activeCells: number[];
  memorizeMs: number;
}

export type MemoryChallenge =
  | WordRecallChallenge
  | ColorSequenceChallenge
  | GridPatternChallenge;

export type ChallengePhase = "memorize" | "recall";

export interface ChallengeColor {
  name: string;
  hex: string;
}

export interface ChallengeResult {
  passed: boolean;
  challengeType: ChallengeType;
}
