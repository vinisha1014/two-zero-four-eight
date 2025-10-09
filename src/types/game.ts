export interface Tile {
  id: string;
  value: number;
  position: { row: number; col: number };
  mergedFrom?: Tile[];
  isNew?: boolean;
}

export interface GameState {
  grid: (Tile | null)[][];
  score: number;
  bestScore: number;
  isGameOver: boolean;
  isWon: boolean;
}

export interface GameHistory {
  grid: (Tile | null)[][];
  score: number;
}

export type Direction = 'up' | 'down' | 'left' | 'right';
