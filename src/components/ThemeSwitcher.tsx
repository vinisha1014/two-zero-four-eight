"use client"; 
import { useTheme } from "../context/ThemeController";
import { Sun, Moon, Contrast } from "lucide-react";

export default function ThemeSwitcher() {
  const {
    theme,
    highContrast,
    largeButtons,
    toggleTheme,
    toggleContrast,
    toggleLargeButtons,
  } = useTheme();

  return (
    <div
      className="flex gap-3 mt-6 justify-center items-center mb-10"
      role="group"
      aria-label="Accessibility and Theme Controls"
    >
      <button
        onClick={toggleTheme}
        className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center gap-2"
        aria-pressed={theme === "dark"}
      >
        {theme === "light" ? (
          <>
            <Sun size={18} /> Light Mode
          </>
        ) : (
          <>
            <Moon size={18} /> Dark Mode
          </>
        )}
      </button>

      <button
        onClick={toggleContrast}
        className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center gap-2"
        aria-pressed={highContrast}
      >
        <Contrast size={18} />
        {highContrast ? "High Contrast: ON" : "High Contrast: OFF"}
      </button>

      <button
        onClick={toggleLargeButtons}
        className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center gap-2"
        aria-pressed={largeButtons}
      >
        <Contrast size={18} />
        {largeButtons ? "Large Buttons: ON" : "Large Buttons: OFF"}
      </button>
    </div>
  );
}
