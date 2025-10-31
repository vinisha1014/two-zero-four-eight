import { useGame } from '../context/GameContext';
import Tile from './Tile';

const GRID_SIZE = 4;
const CELL_COUNT = GRID_SIZE * GRID_SIZE;

/**
 * Grid component renders the 4x4 game board using CSS Grid
 * Displays all tiles with their current positions and values
 */
const Grid = () => {
  const { grid } = useGame();

  return (
    <div className="relative">
      {/* Grid background cells */}
      <div className="grid grid-cols-4 gap-3 bg-[#bbada0] p-3 rounded-lg">
        {Array.from({ length: CELL_COUNT }).map((_, index) => (
          <div
            key={`cell-${index}`}
            className="w-20 h-20 bg-[#cdc1b4] rounded-md"
            aria-hidden="true"
          />
        ))}
      </div>

      {/* Tile container - positioned absolutely over the grid */}
      <div className="absolute inset-0 p-3">
        <div className="relative w-full h-full" role="grid" aria-label="Game grid">
          {grid.flat().map((tile) =>
            tile ? <Tile key={tile.id} tile={tile} /> : null
          )}
        </div>
      </div>
    </div>
  );
};

export default Grid;
