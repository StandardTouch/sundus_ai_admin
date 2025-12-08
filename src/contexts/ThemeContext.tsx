import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    // Check localStorage first, then system preference
    const savedTheme = localStorage.getItem("theme") as Theme;
    if (savedTheme) {
      return savedTheme;
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  useEffect(() => {
    // Apply theme to document
    const root = document.documentElement;
    console.log("Theme changed to:", theme);
    console.log("Root element:", root);
    console.log("Root classes before:", root.className);
    
    if (theme === "dark") {
      root.classList.add("dark");
      console.log("Added 'dark' class to root");
    } else {
      root.classList.remove("dark");
      console.log("Removed 'dark' class from root");
    }
    
    console.log("Root classes after:", root.className);
    console.log("Has dark class?", root.classList.contains("dark"));
    
    // Check CSS variables
    const computedBg = getComputedStyle(root).getPropertyValue("--admin-bg");
    const computedText = getComputedStyle(root).getPropertyValue("--admin-text");
    console.log("--admin-bg value:", computedBg);
    console.log("--admin-text value:", computedText);
    
    // Save to localStorage
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === "light" ? "dark" : "light"));
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

