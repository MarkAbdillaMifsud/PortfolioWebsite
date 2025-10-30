(function () {
  var dropdowns = document.querySelectorAll('.nav-item.dropdown');
  if (!dropdowns.length) return;

  var isPointerHover = window.matchMedia && window.matchMedia('(hover: hover)').matches;
  var closeDelayMs = 160;
  var timers = new Map(); // menuId -> timeoutId

  function closeAll(exceptId) {
    dropdowns.forEach(function (dd) {
      var btn = dd.querySelector('.nav-trigger');
      var menu = dd.querySelector('.menu');
      if (!menu) return;
      if (exceptId && menu.id === exceptId) return;
      btn.setAttribute('aria-expanded', 'false');
      menu.removeAttribute('data-open');
    });
  }

  function openMenu(btn, menu) {
    closeAll(menu.id);
    btn.setAttribute('aria-expanded', 'true');
    menu.setAttribute('data-open', 'true');
  }

  function scheduleClose(menu, btn) {
    clearTimeout(timers.get(menu.id));
    var id = setTimeout(function () {
      btn.setAttribute('aria-expanded', 'false');
      menu.removeAttribute('data-open');
    }, closeDelayMs);
    timers.set(menu.id, id);
  }

  dropdowns.forEach(function (dd) {
    var btn = dd.querySelector('.nav-trigger');
    var menu = dd.querySelector('.menu');
    if (!btn || !menu) return;

    // Desktop (pointer hover): open on hover, close on delayed mouseleave
    if (isPointerHover) {
      dd.addEventListener('mouseenter', function () {
        clearTimeout(timers.get(menu.id));
        openMenu(btn, menu);
      });
      dd.addEventListener('mouseleave', function () {
        scheduleClose(menu, btn);
      });
    }

    // Click/tap toggle (mobile and also allowed on desktop)
    btn.addEventListener('click', function (e) {
      var expanded = btn.getAttribute('aria-expanded') === 'true';
      if (expanded) {
        btn.setAttribute('aria-expanded', 'false');
        menu.removeAttribute('data-open');
      } else {
        openMenu(btn, menu);
        var first = menu.querySelector('a');
        if (first) first.focus();
      }
    });

    // Keyboard on trigger
    btn.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        openMenu(btn, menu);
        var first = menu.querySelector('a');
        if (first) first.focus();
      }
    });

    // Keyboard inside menu
    menu.addEventListener('keydown', function (e) {
      var items = Array.from(menu.querySelectorAll('a'));
      var i = items.indexOf(document.activeElement);
      if (e.key === 'Escape') {
        e.preventDefault();
        btn.setAttribute('aria-expanded', 'false');
        menu.removeAttribute('data-open');
        btn.focus();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        var next = items[i + 1] || items[0];
        if (next) next.focus();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        var prev = items[i - 1] || items[items.length - 1];
        if (prev) prev.focus();
      } else if (e.key === 'Home') {
        e.preventDefault(); if (items[0]) items[0].focus();
      } else if (e.key === 'End') {
        e.preventDefault(); if (items[items.length - 1]) items[items.length - 1].focus();
      }
    });
  });

  // Close on outside click (all devices)
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.nav-item.dropdown')) closeAll();
  });

  // Close on focus leaving nav — MOBILE/KEYBOARD ONLY.
  // Avoid fighting desktop hover. Gate by !isPointerHover.
  if (!isPointerHover) {
    document.addEventListener('focusin', function (e) {
      if (!e.target.closest('.nav-item.dropdown')) closeAll();
    });
  }
})();
