export type Category = 'TACTICAL' | 'POSITIONAL' | 'DEFENSIVE' | 'TECHNICAL';
export type Difficulty = 'ALL' | 'EASY' | 'INTERMEDIATE' | 'ADVANCED';
export type GamePhase = 'ALL' | 'OPENING' | 'MIDDLEGAME' | 'ENDGAME';

export interface SetupFilters {
  categories: readonly Category[];
  difficulty: Difficulty;
  phase: GamePhase;
}

export interface SetupConfig extends SetupFilters {
  length: number;
}

export const ALL_CATEGORIES: readonly Category[] = [
  'TACTICAL',
  'POSITIONAL',
  'DEFENSIVE',
  'TECHNICAL',
];

export const LENGTH_OPTIONS: readonly number[] = [5, 10, 15, 20];
