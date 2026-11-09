(function () {
  const menus = document.querySelectorAll(".project-menu");

  for (const menu of menus) {
    const summary = menu.querySelector("summary");

    menu.addEventListener("keydown", event => {
      if (event.key === "Escape" && menu.open) {
        event.preventDefault();
        menu.open = false;
        summary.focus();
      } else if (event.key === "ArrowDown" && event.target === summary) {
        event.preventDefault();
        menu.open = true;
        menu.querySelector("a").focus();
      }
    });
  }

  function closeOtherMenus(event) {
    for (const menu of menus) {
      if (menu.open && !menu.contains(event.target)) menu.open = false;
    }
  }

  document.addEventListener("focusin", closeOtherMenus);
  document.addEventListener("click", closeOtherMenus);
})();
