"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";

type Theme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = "impactpulse-theme";
const DARK_QUERY = "(prefers-color-scheme: dark)";

const listeners = new Set<() => void>();
let currentTheme: Theme | null = null;

function readTheme(): Theme {
  const stored = window.localStorage.getItem(STORAGE_KEY);

  if (stored === "light" || stored === "dark") return stored;

  return window.matchMedia(DARK_QUERY).matches ? "dark" : "light";
}

function getThemeSnapshot(): Theme {
  currentTheme ??= readTheme();
  return currentTheme;
}

function getServerThemeSnapshot(): Theme {
  return "light";
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;
}

function notify() {
  for (const listener of listeners) listener();
}

function setStoredTheme(theme: Theme) {
  currentTheme = theme;
  applyTheme(theme);
  window.localStorage.setItem(STORAGE_KEY, theme);
  notify();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  applyTheme(getThemeSnapshot());

  const media = window.matchMedia(DARK_QUERY);

  const handleExternalChange = () => {
    currentTheme = readTheme();
    applyTheme(currentTheme);
    notify();
  };

  media.addEventListener("change", handleExternalChange);
  window.addEventListener("storage", handleExternalChange);

  return () => {
    listeners.delete(listener);
    media.removeEventListener("change", handleExternalChange);
    window.removeEventListener("storage", handleExternalChange);
  };
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useSyncExternalStore(
    subscribe,
    getThemeSnapshot,
    getServerThemeSnapshot,
  );

  const setTheme = useCallback((nextTheme: Theme) => {
    setStoredTheme(nextTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    setStoredTheme(theme === "dark" ? "light" : "dark");
  }, [theme]);

  const value = useMemo(
    () => ({ theme, toggleTheme, setTheme }),
    [setTheme, theme, toggleTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }

  return context;
}

export const themeInitScript = `(function(){try{var t=localStorage.getItem("${STORAGE_KEY}");if(t!=="light"&&t!=="dark"){t=window.matchMedia("${DARK_QUERY}").matches?"dark":"light";}if(t==="dark"){document.documentElement.classList.add("dark");}document.documentElement.style.colorScheme=t;}catch(e){}})();`;
