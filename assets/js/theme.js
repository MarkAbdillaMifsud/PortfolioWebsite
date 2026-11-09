(function () {
  const root = document.documentElement;
  const systemTheme = window.matchMedia("(prefers-color-scheme: light)");
  let preference;

  try {
    const stored = localStorage.getItem("theme");
    if (stored === "light" || stored === "dark") preference = stored;
  } catch {
    // Storage may be unavailable. Follow the system theme until the user toggles it.
  }

  function currentTheme() {
    return preference ?? (systemTheme.matches ? "light" : "dark");
  }

  root.dataset.theme = currentTheme();

  document.addEventListener("DOMContentLoaded", () => {
    const button = document.getElementById("themeToggle");
    const icons = document.querySelectorAll("img[data-light][data-dark]");

    function renderTheme() {
      const theme = currentTheme();
      root.dataset.theme = theme;
      button?.setAttribute("aria-pressed", String(theme === "light"));
      for (const icon of icons) {
        const source = icon.dataset[theme];
        if (icon.getAttribute("src") !== source) icon.setAttribute("src", source);
      }
    }

    renderTheme();

    button?.addEventListener("click", () => {
      preference = currentTheme() === "light" ? "dark" : "light";
      renderTheme();

      try {
        localStorage.setItem("theme", preference);
      } catch {
        // The selected theme still applies for this page.
      }
    });

    systemTheme.addEventListener("change", () => {
      if (!preference) renderTheme();
    });
  });
})();
