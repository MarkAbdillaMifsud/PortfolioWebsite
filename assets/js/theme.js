(function () {
  var KEY = 'theme';
  var DOC = document.documentElement;

  function getTheme() {
    var saved = localStorage.getItem(KEY);
    if (saved) return saved; // 'light' | 'dark'
    // Fallback to system
    return (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches)
      ? 'light' : 'dark';
  }

  function applyTheme(t) {
    if (t === 'light') DOC.setAttribute('data-theme', 'light');
    else DOC.removeAttribute('data-theme'); // dark = default tokens
    localStorage.setItem(KEY, t);
  }

  // Initialize (after CSS; pre-init happens inline in <head>)
  document.addEventListener('DOMContentLoaded', function () {
    // Bind toggle
    var btn = document.getElementById('themeToggle');
    if (btn) {
      btn.addEventListener('click', function () {
        var next = DOC.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        applyTheme(next);
      });
    }
  });

  // Expose minimal API for future tasks
  window.Theme = {
    get: getTheme,
    set: applyTheme,
    systemPrefersLight: function () {
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
    }
  };
})();