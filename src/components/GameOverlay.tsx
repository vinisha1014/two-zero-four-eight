import { useGame } from '../context/GameContext';
import { RotateCcw } from 'lucide-react';

/**
 * GameOverlay component displays game over or win messages
 */
const GameOverlay = () => {
  const { isGameOver, isWon, restart } = useGame();

  if (!isGameOver && !isWon) return null;

  return (
    <div className="absolute inset-0 bg-white/70 backdrop-blur-sm rounded-lg
                    flex flex-col items-center justify-center z-10">
      <div className="text-center">
        <h2 className={`text-6xl font-bold mb-4 ${
          isWon ? 'text-[#edc22e]' : 'text-[#8f7a66]'
        }`}>
          {isWon ? 'You Win!' : 'Game Over!'}
        </h2>
        <button
          onClick={restart}
          className="px-8 py-3 bg-[#8f7a66] text-white rounded-md font-semibold
                   hover:bg-[#9f8a76] transition-colors text-lg flex items-center
                   gap-2 mx-auto"
        >
          <RotateCcw size={20} />
          Try Again
        </button>
      </div>
    </div>
  );
};

export default GameOverlay;
