// Loaded render-blocking in <head> (as a file, not inline, so the CSP can
// stay script-src 'self'): applies a saved theme before first paint, then
// wires the toggle button once the DOM is ready.
(function () {
  var root = document.documentElement;
  try {
    var saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') root.dataset.theme = saved;
  } catch (e) {}

  function current() {
    if (root.dataset.theme) return root.dataset.theme;
    return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  document.addEventListener('DOMContentLoaded', function () {
    var btn = document.getElementById('theme-toggle');
    if (!btn) return;
    function sync() {
      var dark = current() === 'dark';
      btn.setAttribute('aria-pressed', String(dark));
      btn.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
    }
    sync();
    // With no saved choice the page follows the OS live; keep the button honest.
    matchMedia('(prefers-color-scheme: dark)').addEventListener('change', sync);
    btn.classList.remove('invisible');
    btn.addEventListener('click', function () {
      var next = current() === 'dark' ? 'light' : 'dark';
      root.dataset.theme = next;
      try {
        localStorage.setItem('theme', next);
      } catch (e) {}
      sync();
    });
  });
})();
