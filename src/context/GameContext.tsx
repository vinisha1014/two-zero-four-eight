import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { GameState, GameHistory, Direction } from "../types/game";
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

  // Safely calculate average tile value (works with Tile | null)
  const calculateAverageTile = (grid: (any | null)[][]): number => {
    const values = grid
      .flat()
      .map((v) => (v && typeof v === "object" && "value" in v ? v.value : 0))
      .filter((v) => v !== 0);

    const sum = values.reduce((a, b) => a + b, 0);
    return values.length ? Math.round(sum / values.length) : 0;
  };

  // Main move logic
  const move = useCallback(
    (direction: Direction) => {
      if (gameState.isGameOver) return;

      // Save history for undo
      setHistory((prev) => [
        ...prev,
        { grid: gameState.grid.map((r) => [...r]), score: gameState.score },
      ]);

      const result = moveTiles(gameState.grid, direction);

      if (!result.moved) {
        setHistory((prev) => prev.slice(0, -1));
        return;
      }

      const newScore = gameState.score + result.scoreGained;
      const newBestScore = Math.max(gameState.bestScore, newScore);
      const isWon = checkWin(result.grid);
      const isGameOver = checkGameOver(result.grid);

      setMoves((prev) => prev + 1);
      setMerges((prev) => prev + (result.mergedTiles || 0));

      setGameState({
        grid: result.grid,
        score: newScore,
        bestScore: newBestScore,
        isGameOver,
        isWon,
      });

      // Keep last 10 states only
      setHistory((prev) => prev.slice(-10));
    },
    [gameState]
  );

  // Restart game
  const restart = useCallback(() => {
    setGameState((prev) => ({
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
    setGameState((prev) => ({
      ...prev,
      grid: previousState.grid,
      score: previousState.score,
      isGameOver: false,
      isWon: false,
    }));
    setHistory((prev) => prev.slice(0, -1));
    setMoves((prev) => Math.max(prev - 1, 0));
  }, [history]);

  const averageTileValue = calculateAverageTile(gameState.grid);

  const value: GameContextType = {
    ...gameState,
    move,
    restart,
    undo,
    canUndo: history.length > 0,
    moves,
    merges,
    averageTileValue,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};