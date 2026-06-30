// Light/dark theme toggle for Flowset docs (Phase 0).
// The initial theme is set in head-scripts.hbs (before paint) to avoid a flash.
// This file wires the toggle button and keeps the code-highlight theme in sync.
(function () {
  function current() {
    return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  }

  // Enable the matching highlight.js stylesheet, disable the other.
  function syncHljs() {
    var dark = current() === 'dark';
    var light = document.getElementById('hljs-light');
    var darkEl = document.getElementById('hljs-dark');
    if (light) light.disabled = dark;
    if (darkEl) darkEl.disabled = !dark;
  }

  function apply(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem('fl-theme', theme); } catch (e) {}
    syncHljs();
  }

  document.addEventListener('DOMContentLoaded', function () {
    syncHljs();
    var btn = document.getElementById('theme-toggle');
    if (!btn) return;
    btn.addEventListener('click', function () {
      apply(current() === 'dark' ? 'light' : 'dark');
    });
  });
})();
