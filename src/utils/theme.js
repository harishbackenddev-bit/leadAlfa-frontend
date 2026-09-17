const KEY = "theme";
const media = window.matchMedia?.("(prefers-color-scheme: dark)");

export const getTheme = () => localStorage.getItem(KEY) || "light";

export function applyTheme(theme) {
  const dark = theme === "dark" || (theme === "auto" && media?.matches);
  document.documentElement.classList.toggle("dark", dark);
}

export function setTheme(theme) {
  localStorage.setItem(KEY, theme);
  applyTheme(theme);
}

media?.addEventListener("change", () => applyTheme(getTheme()));
applyTheme(getTheme());
