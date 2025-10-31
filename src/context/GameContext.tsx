import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  ReactNode,
} from "react";
import { GameState, GameHistory, Direction, Tile } from "../types/game";
import {
  initializeGrid,
  moveTiles,
  checkGameOver,
  checkWin,
} from "../utils/gameLogic";

interface GameContextType extends GameState {
  move: (direction: Direction) => void;
  restart: () => void;
  undo: () => void;
  canUndo: boolean;
  moves: number;
  merges: number;
  averageTileValue: number;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within GameProvider");
  }
  return context;
};

interface GameProviderProps {
  children: ReactNode;
}

export const GameProvider = ({ children }: GameProviderProps) => {
  const [gameState, setGameState] = useState<GameState>(() => {
    const bestScore = parseInt(localStorage.getItem("bestScore") || "0", 10);
    return {
      grid: initializeGrid(),
      score: 0,
      bestScore,
      isGameOver: false,
      isWon: false,
    };
  });

  const [history, setHistory] = useState<GameHistory[]>([]);
  const [moves, setMoves] = useState(0);
  const [merges, setMerges] = useState(0);

  // Calculate average tile value
  const calculateAverageTile = useCallback((grid: (Tile | null)[][]): number => {
    const values = grid
      .flat()
      .filter((tile): tile is Tile => tile !== null)
      .map((tile) => tile.value);

    if (values.length === 0) return 0;
    const sum = values.reduce((a, b) => a + b, 0);
    return Math.round(sum / values.length);
  }, []);

  // Main move logic
  const move = useCallback(
    (direction: Direction) => {
      if (gameState.isGameOver) return;

      // Save history for undo
      setHistory((prev: GameHistory[]) => [
        ...prev,
        { grid: gameState.grid.map((r: (Tile | null)[]) => [...r]), score: gameState.score },
      ]);

      const result = moveTiles(gameState.grid, direction);

      if (!result.moved) {
        setHistory((prev: GameHistory[]) => prev.slice(0, -1));
        return;
      }

      const newScore = gameState.score + result.scoreGained;
      const newBestScore = Math.max(gameState.bestScore, newScore);
      const isWon = checkWin(result.grid);
      const isGameOver = checkGameOver(result.grid);

      setMoves((prev: number) => prev + 1);
      setMerges((prev: number) => prev + (result.mergedTiles || 0));

      setGameState({
        grid: result.grid,
        score: newScore,
        bestScore: newBestScore,
        isGameOver,
        isWon,
      });

      // Save best score to localStorage
      if (newBestScore > gameState.bestScore) {
        localStorage.setItem("bestScore", newBestScore.toString());
      }

      // Keep last 10 states only
      setHistory((prev: GameHistory[]) => prev.slice(-10));
    },
    [gameState]
  );

  // Restart game
  const restart = useCallback(() => {
    setGameState((prev: GameState) => ({
      grid: initializeGrid(),
      score: 0,
      bestScore: prev.bestScore,
      isGameOver: false,
      isWon: false,
    }));
    setHistory([]);
    setMoves(0);
    setMerges(0);
  }, []);

  // Undo last move
  const undo = useCallback(() => {
    if (history.length === 0) return;

    const previousState = history[history.length - 1];
    setGameState((prev: GameState) => ({
      ...prev,
      grid: previousState.grid,
      score: previousState.score,
      isGameOver: false,
      isWon: false,
    }));
    setHistory((prev: GameHistory[]) => prev.slice(0, -1));
    setMoves((prev: number) => Math.max(prev - 1, 0));
  }, [history]);

  const averageTileValue = useMemo(
    () => calculateAverageTile(gameState.grid),
    [gameState.grid, calculateAverageTile]
  );

  const value: GameContextType = useMemo(
    () => ({
      ...gameState,
      move,
      restart,
      undo,
      canUndo: history.length > 0,
      moves,
      merges,
      averageTileValue,
    }),
    [gameState, move, restart, undo, history.length, moves, merges, averageTileValue]
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};
