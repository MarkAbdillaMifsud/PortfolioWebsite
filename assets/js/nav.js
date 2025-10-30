(function () {
  var dropdowns = document.querySelectorAll('.nav-item.dropdown');
  if (!dropdowns.length) return;

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

  function toggle(e) {
    var btn = e.currentTarget;
    var menu = document.getElementById(btn.getAttribute('aria-controls'));
    var expanded = btn.getAttribute('aria-expanded') === 'true';
    if (expanded) {
      btn.setAttribute('aria-expanded', 'false');
      menu.removeAttribute('data-open');
    } else {
      openMenu(btn, menu);
      // move focus to first item for keyboard users
      var first = menu.querySelector('a');
      if (first) first.focus();
    }
  }

  dropdowns.forEach(function (dd) {
    var btn = dd.querySelector('.nav-trigger');
    var menu = dd.querySelector('.menu');
    if (!btn || !menu) return;

    // Click/tap
    btn.addEventListener('click', toggle);

    // Keyboard on trigger
    btn.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        openMenu(btn, menu);
        var first = menu.querySelector('a');
        if (first) first.focus();
      }
    });

    // Keyboard within menu
    menu.addEventListener('keydown', function (e) {
      var items = Array.from(menu.querySelectorAll('a'));
      var i = items.indexOf(document.activeElement);
      if (e.key === 'Escape') {
        e.preventDefault();
        closeAll();
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

  // Close on outside click
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.nav-item.dropdown')) closeAll();
  });

  // Close on focus leaving nav (Tab past it)
  document.addEventListener('focusin', function (e) {
    var within = e.target.closest('.nav-item.dropdown');
    if (!within) {
      // Defer to allow focus to land before closing to avoid flicker
      setTimeout(function(){ closeAll(); }, 0);
    }
  });
})();