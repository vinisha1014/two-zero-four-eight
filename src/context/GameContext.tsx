import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { GameState, GameHistory, Direction } from '../types/game';
import {
  initializeGrid,
  moveTiles,
  canMove,
  checkGameOver,
  checkWin
} from '../utils/gameLogic';

interface GameContextType extends GameState {
  move: (direction: Direction) => void;
  restart: () => void;
  undo: () => void;
  canUndo: boolean;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within GameProvider');
  }
  return context;
};

interface GameProviderProps {
  children: ReactNode;
}

export const GameProvider = ({ children }: GameProviderProps) => {
  const [gameState, setGameState] = useState<GameState>(() => {
    const bestScore = parseInt(localStorage.getItem('bestScore') || '0', 10);
    return {
      grid: initializeGrid(),
      score: 0,
      bestScore,
      isGameOver: false,
      isWon: false,
    };
  });

  const [history, setHistory] = useState<GameHistory[]>([]);

  // Save best score to localStorage
  useEffect(() => {
    if (gameState.score > gameState.bestScore) {
      localStorage.setItem('bestScore', gameState.score.toString());
    }
  }, [gameState.score, gameState.bestScore]);

  const move = useCallback((direction: Direction) => {
    if (gameState.isGameOver) return;

    // Save current state to history before moving
    setHistory(prev => [...prev, {
      grid: gameState.grid.map(row => [...row]),
      score: gameState.score,
    }]);

    const result = moveTiles(gameState.grid, direction);

    if (!result.moved) {
      // Remove the history entry we just added since nothing changed
      setHistory(prev => prev.slice(0, -1));
      return;
    }

    const newScore = gameState.score + result.scoreGained;
    const newBestScore = Math.max(gameState.bestScore, newScore);
    const isWon = checkWin(result.grid);
    const isGameOver = checkGameOver(result.grid);

    setGameState({
      grid: result.grid,
      score: newScore,
      bestScore: newBestScore,
      isGameOver,
      isWon,
    });

    // Keep only last 10 moves in history to prevent memory issues
    setHistory(prev => prev.slice(-10));
  }, [gameState]);

  const restart = useCallback(() => {
    setGameState(prev => ({
      grid: initializeGrid(),
      score: 0,
      bestScore: prev.bestScore,
      isGameOver: false,
      isWon: false,
    }));
    setHistory([]);
  }, []);

  const undo = useCallback(() => {
    if (history.length === 0) return;

    const previousState = history[history.length - 1];
    setGameState(prev => ({
      ...prev,
      grid: previousState.grid,
      score: previousState.score,
      isGameOver: false,
      isWon: false,
    }));
    setHistory(prev => prev.slice(0, -1));
  }, [history]);

  const value: GameContextType = {
    ...gameState,
    move,
    restart,
    undo,
    canUndo: history.length > 0,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};
