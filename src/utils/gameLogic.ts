import { Tile, Direction } from '../types/game';

/**
 * Initialize a 4x4 grid with two random tiles
 */
export const initializeGrid = (): (Tile | null)[][] => {
  const grid: (Tile | null)[][] = Array(4).fill(null).map(() => Array(4).fill(null));
  addRandomTile(grid);
  addRandomTile(grid);
  return grid;
};

/**
 * Add a random tile (2 or 4) to an empty cell
 * 90% chance of 2, 10% chance of 4
 */
export const addRandomTile = (grid: (Tile | null)[][]): void => {
  const emptyCells: { row: number; col: number }[] = [];

  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      if (!grid[row][col]) {
        emptyCells.push({ row, col });
      }
    }
  }

  if (emptyCells.length === 0) return;

  const { row, col } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  const value = Math.random() < 0.9 ? 2 : 4;

  grid[row][col] = {
    id: `${Date.now()}-${Math.random()}`,
    value,
    position: { row, col },
    isNew: true,
  };
};

/**
 * Move tiles in the specified direction and return the new grid
 */
export const moveTiles = (
  grid: (Tile | null)[][],
  direction: Direction
): { grid: (Tile | null)[][]; moved: boolean; scoreGained: number } => {
  // Deep clone the grid
  const newGrid: (Tile | null)[][] = grid.map(row => row.map(cell =>
    cell ? { ...cell, mergedFrom: undefined, isNew: false } : null
  ));

  let moved = false;
  let scoreGained = 0;

  // Transform grid based on direction to simplify logic
  const { lines, setCell } = getLines(newGrid, direction);

  lines.forEach((line, lineIndex) => {
    const { newLine, lineMoved, lineScore } = mergeLine(line, direction, lineIndex);
    if (lineMoved) moved = true;
    scoreGained += lineScore;

    // Write the line back to the grid
    newLine.forEach((tile, position) => {
      setCell(lineIndex, position, tile);
    });
  });

  // Add a new random tile if any movement occurred
  if (moved) {
    addRandomTile(newGrid);
  }

  return { grid: newGrid, moved, scoreGained };
};

/**
 * Extract lines from grid based on direction
 */
const getLines = (grid: (Tile | null)[][], direction: Direction) => {
  const lines: (Tile | null)[][] = [];
  const setCell = (lineIndex: number, position: number, tile: Tile | null) => {
    const pos = getGridPosition(direction, lineIndex, position);
    grid[pos.row][pos.col] = tile;
    if (tile) {
      tile.position = pos;
    }
  };

  for (let i = 0; i < 4; i++) {
    const line: (Tile | null)[] = [];
    for (let j = 0; j < 4; j++) {
      const pos = getGridPosition(direction, i, j);
      line.push(grid[pos.row][pos.col]);
    }
    lines.push(line);
  }

  return { lines, setCell };
};

/**
 * Convert line index and position to grid coordinates based on direction
 */
const getGridPosition = (
  direction: Direction,
  lineIndex: number,
  position: number
): { row: number; col: number } => {
  switch (direction) {
    case 'left':
      return { row: lineIndex, col: position };
    case 'right':
      return { row: lineIndex, col: 3 - position };
    case 'up':
      return { row: position, col: lineIndex };
    case 'down':
      return { row: 3 - position, col: lineIndex };
  }
};

/**
 * Merge tiles in a single line
 */
const mergeLine = (
  line: (Tile | null)[],
  direction: Direction,
  lineIndex: number
): { newLine: (Tile | null)[]; lineMoved: boolean; lineScore: number } => {
  // Remove nulls and extract tiles
  const tiles = line.filter((tile): tile is Tile => tile !== null);
  const newLine: (Tile | null)[] = Array(4).fill(null);

  let lineMoved = false;
  let lineScore = 0;
  let writeIndex = 0;

  for (let i = 0; i < tiles.length; i++) {
    const current = tiles[i];

    // Check if we can merge with the next tile
    if (i < tiles.length - 1 && current.value === tiles[i + 1].value) {
      const mergedValue = current.value * 2;
      newLine[writeIndex] = {
        id: `${Date.now()}-${Math.random()}`,
        value: mergedValue,
        position: { row: 0, col: 0 }, // Will be set by setCell
        mergedFrom: [current, tiles[i + 1]],
      };
      lineScore += mergedValue;
      lineMoved = true;
      i++; // Skip the next tile since we merged it
    } else {
      newLine[writeIndex] = { ...current };
    }

    writeIndex++;
  }

  // Check if anything moved
  if (!lineMoved) {
    for (let i = 0; i < line.length; i++) {
      if (line[i]?.value !== newLine[i]?.value) {
        lineMoved = true;
        break;
      }
    }
  }

  return { newLine, lineMoved, lineScore };
};

/**
 * Check if any moves are possible
 */
export const canMove = (grid: (Tile | null)[][]): boolean => {
  // Check for empty cells
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      if (!grid[row][col]) return true;
    }
  }

  // Check for possible merges
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      const current = grid[row][col];
      if (!current) continue;

      // Check right
      if (col < 3 && grid[row][col + 1]?.value === current.value) return true;
      // Check down
      if (row < 3 && grid[row + 1][col]?.value === current.value) return true;
    }
  }

  return false;
};

/**
 * Check if the game is over (no moves possible)
 */
export const checkGameOver = (grid: (Tile | null)[][]): boolean => {
  return !canMove(grid);
};

/**
 * Check if the player has won (2048 tile exists)
 */
export const checkWin = (grid: (Tile | null)[][]): boolean => {
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      if (grid[row][col]?.value === 2048) return true;
    }
  }
  return false;
};
