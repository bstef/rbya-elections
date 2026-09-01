"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

function SunIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  );
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
    </svg>
  );
}

// Renders a blank placeholder until mounted to avoid a hydration mismatch
// -- the server has no way to know the visitor's stored/system theme, so
// the real icon only appears once we can read it client-side. The page's
// actual colors are already correct at first paint via the init script in
// layout.tsx; this only affects which icon this button shows.
export function ThemeToggle() {
  const [state, setState] = useState<{ mounted: boolean; theme: Theme }>({
    mounted: false,
    theme: "light",
  });

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const initial: Theme =
      stored === "light" || stored === "dark"
        ? stored
        : window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";
    // Reading localStorage/matchMedia requires the browser, so this can't
    // be computed during render (would mismatch the server-rendered
    // output) -- this is the one-time mount read the SSR-safe pattern needs.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState({ mounted: true, theme: initial });
  }, []);

  const { mounted, theme } = state;

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setState({ mounted: true, theme: next });
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={mounted ? `Switch to ${theme === "dark" ? "light" : "dark"} mode` : "Toggle theme"}
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-hairline bg-surface text-ink-muted hover:bg-page"
    >
      {mounted ? (
        theme === "dark" ? (
          <SunIcon className="h-4 w-4" />
        ) : (
          <MoonIcon className="h-4 w-4" />
        )
      ) : (
        <span className="h-4 w-4" />
      )}
    </button>
  );
}
