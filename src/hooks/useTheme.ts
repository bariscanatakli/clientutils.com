"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>("system");
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const stored = localStorage.getItem("theme") as Theme | null;
    if (stored) {
      const timer = window.setTimeout(() => setThemeState(stored), 0);
      return () => window.clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    function applyTheme(t: Theme) {
      let resolved: "light" | "dark";
      if (t === "system") {
        resolved = mediaQuery.matches ? "dark" : "light";
      } else {
        resolved = t;
      }
      setResolvedTheme(resolved);
      root.classList.toggle("dark", resolved === "dark");
    }

    applyTheme(theme);

    const handler = () => {
      if (theme === "system") applyTheme("system");
    };
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, [theme]);

  const setTheme = (t: Theme) => {
    setThemeState(t);
    localStorage.setItem("theme", t);
  };

  return { theme, resolvedTheme, setTheme };
}
