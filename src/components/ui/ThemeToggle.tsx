"use client";

import { useThemeContext } from "@/components/ui/ThemeProvider";

export function ThemeToggle() {
  const { resolvedTheme, setTheme, theme } = useThemeContext();

  const cycleTheme = () => {
    const order: Array<"light" | "dark" | "system"> = [
      "light",
      "dark",
      "system",
    ];
    const currentIndex = order.indexOf(theme);
    const next = order[(currentIndex + 1) % order.length];
    setTheme(next);
  };

  const label =
    theme === "system" ? "System" : theme === "dark" ? "Dark" : "Light";

  return (
    <button
      id="theme-toggle"
      onClick={cycleTheme}
      className="relative flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium
                 text-sidebar-foreground
                 hover:bg-sidebar-hover"
      aria-label={`Current theme: ${label}. Click to cycle.`}
      title={`Theme: ${label}`}
    >
      {/* Emil: use opacity crossfade, not position-based swap */}
      <span className="relative h-4 w-4">
        {/* Sun */}
        <svg
          className="absolute inset-0 h-4 w-4"
          style={{
            opacity: resolvedTheme === "light" ? 1 : 0,
            transform: resolvedTheme === "light" ? "scale(1) rotate(0deg)" : "scale(0.5) rotate(-90deg)",
            transition: "opacity 200ms cubic-bezier(0.23,1,0.32,1), transform 200ms cubic-bezier(0.23,1,0.32,1)",
          }}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
          />
        </svg>
        {/* Moon */}
        <svg
          className="absolute inset-0 h-4 w-4"
          style={{
            opacity: resolvedTheme === "dark" ? 1 : 0,
            transform: resolvedTheme === "dark" ? "scale(1) rotate(0deg)" : "scale(0.5) rotate(90deg)",
            transition: "opacity 200ms cubic-bezier(0.23,1,0.32,1), transform 200ms cubic-bezier(0.23,1,0.32,1)",
          }}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
          />
        </svg>
      </span>
      <span className="hidden text-xs text-muted sm:inline">{label}</span>
    </button>
  );
}
