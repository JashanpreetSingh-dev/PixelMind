"use client";

import { useEffect } from "react";

const THEME_KEY = "pixelmind-theme";

function resolveTheme(preference: string): "light" | "dark" {
  if (preference === "light") return "light";
  if (preference === "dark") return "dark";
  if (typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }
  return "light";
}

export function ThemeSync({ theme }: { theme?: string | null }) {
  const effective = theme === "system" || !theme ? resolveTheme("system") : resolveTheme(theme);

  useEffect(() => {
    document.documentElement.dataset.theme = effective;
    if (theme && theme !== "system") {
      localStorage.setItem(THEME_KEY, theme);
    }
  }, [theme, effective]);

  return null;
}

export function setThemeInDocument(theme: string) {
  const effective = theme === "system" ? resolveTheme("system") : resolveTheme(theme);
  document.documentElement.dataset.theme = effective;
  localStorage.setItem(THEME_KEY, theme);
}
