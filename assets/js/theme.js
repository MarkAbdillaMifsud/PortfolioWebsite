(function () {
  const root = document.documentElement;
  const btn  = document.getElementById("themeToggle");
  const mqLight = window.matchMedia("(prefers-color-scheme: light)");

  function updateThemedIcons() {
    const isLight = root.getAttribute("data-theme") === "light";
    document.querySelectorAll("img[data-light][data-dark]").forEach(img => {
      const target = isLight ? img.getAttribute("data-light")
                             : img.getAttribute("data-dark");
      if (img.getAttribute("src") !== target) img.setAttribute("src", target);
    });
  }

  function setTheme(mode) {
    if (mode === "light") {
      root.setAttribute("data-theme", "light");
      localStorage.setItem("theme", "light");
    } else {
      root.removeAttribute("data-theme"); // dark is default
      localStorage.setItem("theme", "dark");
    }
    updateThemedIcons();
    if (btn) btn.setAttribute("aria-pressed", mode === "light" ? "true" : "false");
  }

  function getTheme() {
    const stored = localStorage.getItem("theme");
    if (stored) return stored;
    return mqLight.matches ? "light" : "dark";
  }

  document.addEventListener("DOMContentLoaded", () => {
    setTheme(getTheme());
    if (btn) {
      btn.addEventListener("click", () => {
        setTheme(getTheme() === "light" ? "dark" : "light");
      });
    }
    // If user hasn’t explicitly chosen, follow OS changes live
    mqLight.addEventListener?.("change", (e) => {
      if (!localStorage.getItem("theme")) setTheme(e.matches ? "light" : "dark");
    });
  });
})();