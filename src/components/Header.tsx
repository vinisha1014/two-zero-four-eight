import { RotateCcw, Undo2 } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { useState, useEffect } from 'react';

/**
 * Header component displays score, best score, and control buttons
 */
const Header = () => {
  const { score, bestScore, restart, undo, canUndo } = useGame();
  const [speed, setSpeed] = useState<'normal' | 'fast' | 'off'>(
    (localStorage.getItem('animationSpeed') as 'normal' | 'fast' | 'off') || 'normal'
  );

  useEffect(() => {
    // Apply the CSS variable for tile animation speed
    const speedMap: Record<typeof speed, string> = {
      normal: '150ms',
      fast: '75ms',
      off: '0ms',
    };
    document.documentElement.style.setProperty('--tile-speed', speedMap[speed]);
  }, [speed]);

  const handleSpeedChange = (value: 'normal' | 'fast' | 'off') => {
    setSpeed(value);
    localStorage.setItem('animationSpeed', value);
    window.dispatchEvent(new CustomEvent('animationSpeedChange', { detail: value }));
  };

  return (
    <div className="w-full max-w-[410px] mb-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-6xl font-bold text-[#776e65]">2048</h1>
        <div className="flex gap-3">
          <ScoreBox label="Score" value={score} />
          <ScoreBox label="Best" value={bestScore} />
        </div>
      </div>

      <div className="flex justify-between">
        <p className="text-[#776e65] text-sm mt-3">
          Join tiles to reach <strong>2048!</strong>
        </p>
        <div className="flex gap-2 items-center">
          <select
            value={speed}
            onChange={(e) => handleSpeedChange(e.target.value as 'normal' | 'fast' | 'off')}
            className="px-3 py-2 bg-[#8f7a66] text-white rounded-md font-semibold 
                       hover:bg-[#9f8a76] transition-colors cursor-pointer focus:outline-none"
            title="Animation speed"
          >
            <option value="normal">Normal</option>
            <option value="fast">Fast</option>
            <option value="off">Off</option>
          </select>

          <button
            onClick={undo}
            disabled={!canUndo}
            className="px-4 py-2 bg-[#8f7a66] text-white rounded-md font-semibold
                     hover:bg-[#9f8a76] transition-colors disabled:opacity-50
                     disabled:cursor-not-allowed flex items-center gap-2"
            title="Undo last move"
          >
            <Undo2 size={18} />
            Undo
          </button>
          <button
            onClick={restart}
            className="px-4 py-2 bg-[#8f7a66] text-white rounded-md font-semibold
                     hover:bg-[#9f8a76] transition-colors flex items-center gap-2"
            title="Start new game"
          >
            <RotateCcw size={18} />
            New Game
          </button>
        </div>
      </div>
    </div>
  );
};

interface ScoreBoxProps {
  label: string;
  value: number;
}

const ScoreBox = ({ label, value }: ScoreBoxProps) => {
  return (
    <div className="bg-[#bbada0] px-6 py-2 rounded-md text-center min-w-[80px]">
      <div className="text-[#eee4da] text-xs font-semibold uppercase">{label}</div>
      <div className="text-white text-2xl font-bold">{value}</div>
    </div>
  );
};

export default Header;