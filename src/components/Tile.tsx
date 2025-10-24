import { Tile as TileType } from '../types/game';

interface TileProps {
  tile: TileType;
}

const Tile = ({ tile }: TileProps) => {
  const { row, col } = tile.position;
  const left = col * 92 + 'px';
  const top = row * 92 + 'px';

  const getTileColor = (value: number): string => {
    const colors: Record<number, string> = {
      2: 'bg-[#eee4da] text-[#776e65]',
      4: 'bg-[#ede0c8] text-[#776e65]',
      8: 'bg-[#f2b179] text-white',
      16: 'bg-[#f59563] text-white',
      32: 'bg-[#f67c5f] text-white',
      64: 'bg-[#f65e3b] text-white',
      128: 'bg-[#edcf72] text-white',
      256: 'bg-[#edcc61] text-white',
      512: 'bg-[#edc850] text-white',
      1024: 'bg-[#edc53f] text-white',
      2048: 'bg-[#edc22e] text-white',
    };
    return colors[value] || 'bg-[#3c3a32] text-white';
  };

  const getFontSize = (value: number): string => {
    const digits = value.toString().length;
    if (digits <= 2) return 'text-5xl';
    if (digits === 3) return 'text-4xl';
    return 'text-3xl';
  };

  return (
    <div
      className={`
        absolute w-20 h-20 rounded-md flex items-center justify-center
        font-bold ease-in-out
        ${getTileColor(tile.value)}
        ${getFontSize(tile.value)}
        ${tile.isNew ? 'animate-tile-appear' : ''}
        ${tile.mergedFrom ? 'animate-tile-merge' : ''}
      `}
      style={{
        left,
        top,
        transition: `all var(--tile-speed) ease-in-out`,
        animationDuration: `var(--tile-speed)`,
      }}
    >
      {tile.value}
    </div>
  );
};

export default Tile;