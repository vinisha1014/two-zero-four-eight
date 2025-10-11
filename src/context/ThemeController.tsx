"use client";
import  {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

type ThemeContextType = {
  theme: "light" | "dark";
  highContrast: boolean;
  largeButtons: boolean;
  toggleTheme: () => void;
  toggleContrast: () => void;
  toggleLargeButtons: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [highContrast, setHighContrast] = useState(false);
  const [largeButtons, setLargeButtons] = useState(false);

  // Default system theme detection
  const getSystemTheme = (): "light" | "dark" => {
    if (typeof window === "undefined") return "light";
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  };

  // Load saved preferences
  useEffect(() => {
    const savedTheme =
      (localStorage.getItem("theme") as "light" | "dark") || getSystemTheme();
    const savedContrast = localStorage.getItem("highContrast") === "true";
    const savedLargeButtons = localStorage.getItem("largeButtons") === "true";

    setTheme(savedTheme);
    setHighContrast(savedContrast);
    setLargeButtons(savedLargeButtons);
  }, []);

  // Save preferences
  useEffect(() => {
    localStorage.setItem("theme", theme);
    localStorage.setItem("highContrast", String(highContrast));
    localStorage.setItem("largeButtons", String(largeButtons));
  }, [theme, highContrast, largeButtons]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  const toggleContrast = () => setHighContrast((prev) => !prev);
  const toggleLargeButtons = () => setLargeButtons((prev) => !prev);

  const value: ThemeContextType = {
    theme,
    highContrast,
    largeButtons,
    toggleTheme,
    toggleContrast,
    toggleLargeButtons,
  };

  return (
    <ThemeContext.Provider value={value}>
      <div
        className={`${theme} ${
          highContrast ? "contrast-[1.5]" : ""
        } ${largeButtons ? "large-buttons" : ""}`}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
