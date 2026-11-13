const KEY = "theme";

function apply(theme, button) {
  document.documentElement.dataset.theme = theme;
  button.textContent = theme === "dark" ? "light mode" : "dark mode";
}

export function initTheme(button) {
  // check if a theme was saved before
  const saved = localStorage.getItem(KEY);
  const osDark = matchMedia("(prefers-color-scheme: dark)").matches;
  apply(saved || (osDark ? "dark" : "light"), button);

  button.addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    apply(next, button);
    localStorage.setItem(KEY, next);
  });
}
