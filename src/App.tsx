import { GameProvider } from './context/GameContext';
import { useGame } from './context/GameContext';
import { useGameControls } from './hooks/useGameControls';
import Grid from './components/Grid';
import Header from './components/Header';
import GameOverlay from './components/GameOverlay';
import { ThemeProvider, useTheme } from './context/ThemeController';
import ThemeSwitcher from './components/ThemeSwitcher';
import StatsDashboard from './components/StatsDashboard';


/**
 * Game component - Main game interface
 * Handles user input and renders the game board
 */
function Game() {
  const { move } = useGame();
  useGameControls(move);

  return (
    <div className="flex flex-col items-center">
      <Header />
      <div className="relative">
        <Grid />
        <GameOverlay />
      </div>

      {/* Add this right below the grid */}
      <StatsDashboard />

      <div className="mt-6 text-center text-[#776e65] max-w-[400px]">
        <p className="text-sm mb-2">
          <strong>How to play:</strong> Use arrow keys or swipe to move tiles.
          When two tiles with the same number touch, they merge into one!
        </p>
        {/* TODO: Add keyboard shortcut hints (e.g., R for restart, U for undo) */}
        {/* TODO: Add sound effects toggle */}
        {/* TODO: Add animation speed settings */}
      </div>
    </div>
  );
}

/**
 * App component - Root component with providers
 */

function AppContent() {
  const { theme } = useTheme();

  return (
    <div
      className={`min-h-screen w-full flex flex-col items-center justify-center transition-all duration-300 ${
        theme === "dark"
          ? "bg-gray-900 text-white"
          : "bg-[#faf8ef] text-[#776e65]"
      }`}
    >
      <Game />
      <ThemeSwitcher />
    </div>
  );
}


function App() { 
  return (
    <ThemeProvider>
    <GameProvider>
      <AppContent/>
      {/* TODO: Add theme switcher (dark mode, colorblind mode) */}
      {/* TODO: Add AI auto-player mode */}
      {/* TODO: Add leaderboard integration with Supabase */}
      {/* TODO: Add game statistics (moves count, time played, win rate) */}
      {/* TODO: Add different board sizes (3x3, 5x5, 6x6) */}
      {/* TODO: Add achievements system */}
    </GameProvider>
    </ThemeProvider>
  );
}

export default App;
