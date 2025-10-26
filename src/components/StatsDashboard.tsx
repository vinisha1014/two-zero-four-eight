import { useGame } from '../context/GameContext';

const StatsDashboard = () => {
  const { moves, merges, averageTileValue } = useGame();

  return (
    <div className="mt-6 p-4 bg-[#bbada0] rounded-lg text-white flex justify-around shadow-md">
      <Stat label="Moves" value={moves} />
      <Stat label="Merges" value={merges} />
      <Stat label="Avg Tile" value={averageTileValue} />
    </div>
  );
};

interface StatProps {
  label: string;
  value: number;
}

const Stat = ({ label, value }: StatProps) => (
  <div className="text-center mx-2">
    <div className="text-lg font-bold">{value}</div>
    <div className="text-xs text-[#eee4da] uppercase">{label}</div>
  </div>
);

export default StatsDashboard;