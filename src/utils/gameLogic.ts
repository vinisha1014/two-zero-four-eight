import { Tile, Direction } from '../types/game';

/**
 * Initialize a 4x4 grid with two random tiles
 */
export const initializeGrid = (boardSize = 4): (Tile | null)[][] => {
  const grid: (Tile | null)[][] = Array(boardSize)
    .fill(null)
    .map(() => Array(boardSize).fill(null));
  addRandomTile(grid, boardSize);
  addRandomTile(grid, boardSize);
  return grid;
};

const BOARD_SIZE = 4;


/**
 * Add a random tile (2 or 4) to an empty cell
 */
export const addRandomTile = (grid: (Tile | null)[][], boardSize = 4): void => {
  const emptyCells: { row: number; col: number }[] = [];

  for (let row = 0; row < boardSize; row++) {
    for (let col = 0; col < boardSize; col++) {
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
): {
  grid: (Tile | null)[][];
  moved: boolean;
  scoreGained: number;
  mergedTiles: number;
} => {
  // Deep clone the grid
  const newGrid: (Tile | null)[][] = grid.map(row =>
    row.map(cell => (cell ? { ...cell, mergedFrom: undefined, isNew: false } : null))
  );

  let moved = false;
  let scoreGained = 0;
  let mergedTiles = 0;

  const { lines, setCell } = getLines(newGrid, direction);

  lines.forEach((line, lineIndex) => {
    const { newLine, lineMoved, lineScore, lineMerges } = mergeLine(line);
    if (lineMoved) moved = true;
    scoreGained += lineScore;
    mergedTiles += lineMerges;

    newLine.forEach((tile, position) => {
      setCell(lineIndex, position, tile);
    });
  });

  if (moved) addRandomTile(newGrid);

  return { grid: newGrid, moved, scoreGained, mergedTiles };
};


/**
 * Extract lines based on direction
 */
const getLines = (grid: (Tile | null)[][], direction: Direction) => {
  const lines: (Tile | null)[][] = [];
  const setCell = (lineIndex: number, position: number, tile: Tile | null) => {
    const pos = getGridPosition(direction, lineIndex, position);
    grid[pos.row][pos.col] = tile;
    if (tile) tile.position = pos;
  };

  for (let i = 0; i < BOARD_SIZE; i++) {
    const line: (Tile | null)[] = [];
    for (let j = 0; j < BOARD_SIZE; j++) {
      const pos = getGridPosition(direction, i, j);
      line.push(grid[pos.row][pos.col]);
    }
    lines.push(line);
  }

  return { lines, setCell };
};

/**
 * Get position in grid based on direction
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
      return { row: lineIndex, col: BOARD_SIZE - 1 - position };
    case 'up':
      return { row: position, col: lineIndex };
    case 'down':
      return { row: BOARD_SIZE - 1 - position, col: lineIndex };
  }
};

/**
 * Merge tiles in a single line
 */
const mergeLine = (
  line: (Tile | null)[]
): { newLine: (Tile | null)[]; lineMoved: boolean; lineScore: number; lineMerges: number } => {
  const tiles = line.filter((tile): tile is Tile => tile !== null);
  const newLine: (Tile | null)[] = Array(BOARD_SIZE).fill(null);

  let lineMoved = false;
  let lineScore = 0;
  let lineMerges = 0;
  let writeIndex = 0;

  for (let i = 0; i < tiles.length; i++) {
    const current = tiles[i];
    if (i < tiles.length - 1 && current.value === tiles[i + 1].value) {
      const mergedValue = current.value * 2;
      newLine[writeIndex] = {
        id: `${Date.now()}-${Math.random()}`,
        value: mergedValue,
        position: { row: 0, col: 0 },
        mergedFrom: [current, tiles[i + 1]],
      };
      lineScore += mergedValue;
      lineMerges += 1;
      lineMoved = true;
      i++; // skip next tile
    } else {
      newLine[writeIndex] = { ...current };
    }
    writeIndex++;
  }

  // Detect movement by comparing positions
  if (!lineMoved) {
    for (let i = 0; i < BOARD_SIZE; i++) {
      if (line[i]?.value !== newLine[i]?.value) {
        lineMoved = true;
        break;
      }
    }
  }

  return { newLine, lineMoved, lineScore, lineMerges };
};


/**
 * Check if any moves are possible
 */
export const canMove = (grid: (Tile | null)[][]): boolean => {
  const size = grid.length;
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const current = grid[row][col];
      if (!current) return true;
      const right = grid[row]?.[col + 1];
      const down = grid[row + 1]?.[col];
      if (right?.value === current.value || down?.value === current.value) return true;
    }
  }
  return false;
};

/**
 * Game over condition
 */
export const checkGameOver = (grid: (Tile | null)[][]): boolean => !canMove(grid);

/**
 * Win condition (2048 reached)
 */
export const checkWin = (grid: (Tile | null)[][]): boolean => {
  return grid.some(row => row.some(tile => tile?.value === 2048));
};
