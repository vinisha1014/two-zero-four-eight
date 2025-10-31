import { memo } from 'react';
import { useGame } from '../context/GameContext';

interface StatProps {
  label: string;
  value: number;
}

const Stat = memo(({ label, value }: StatProps) => (
  <div className="text-center mx-2" role="group" aria-label={`${label}: ${value}`}>
    <div className="text-lg font-bold" aria-label={value.toString()}>{value}</div>
    <div className="text-xs text-[#eee4da] uppercase">{label}</div>
  </div>
));

Stat.displayName = 'Stat';

const StatsDashboard = memo(() => {
  const { moves, merges, averageTileValue } = useGame();

  return (
    <div 
      className="mt-6 p-4 bg-[#bbada0] rounded-lg text-white flex justify-around shadow-md"
      role="region"
      aria-label="Game statistics"
    >
      <Stat label="Moves" value={moves} />
      <Stat label="Merges" value={merges} />
      <Stat label="Avg Tile" value={averageTileValue} />
    </div>
  );
});

StatsDashboard.displayName = 'StatsDashboard';

export default StatsDashboard;
