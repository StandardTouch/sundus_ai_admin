import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 bg-[var(--admin-bg-secondary)] border border-[var(--admin-border-light)] rounded-lg hover:bg-[var(--admin-border)] transition-colors cursor-pointer"
      aria-label="Toggle theme"
    >
      {theme === "light" ? (
        <Moon className="w-5 h-5 text-[var(--admin-text-muted)]" />
      ) : (
        <Sun className="w-5 h-5 text-[var(--admin-text-muted)]" />
      )}
    </button>
  );
}

