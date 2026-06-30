// ⌘K command-palette search for Flowset docs — self-contained full-text.
//
// Uses window.FLOWSET_SEARCH (built by build-search-index.js into
// _/js/flowset-search-index.js) to search page titles AND body text, with
// snippets. Loaded as a <script>, so it also works over file://. If the index
// isn't present, it falls back to searching nav titles (always available).
(function () {
  var modal, input, openBtn, results;
  var items = [];
  var selected = -1;

  function isOpen() { return modal && !modal.hidden; }

  function resolveUrl(u) {
    if (/^(https?:)?\/\//.test(u) || u.charAt(0) === '/') return u;
    var base = (window.uiRootPath || '').replace(/_+\/*$/, '');
    return base + u;
  }

  function build() {
    items = [];
    if (window.FLOWSET_SEARCH && window.FLOWSET_SEARCH.length) {
      window.FLOWSET_SEARCH.forEach(function (p) {
        items.push({ title: p.t, href: resolveUrl(p.u), body: p.b || '' });
      });
      return;
    }
    // fallback: nav titles only
    var seen = {};
    document.querySelectorAll('.nav-menu a').forEach(function (a) {
      var text = (a.textContent || '').replace(/\s+/g, ' ').trim();
      var href = a.getAttribute('href');
      if (!text || !href || seen[href]) return;
      seen[href] = true;
      items.push({ title: text, href: a.href, body: '' });
    });
  }

  function escapeHtml(s) {
    return s.replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  function highlight(text, q) {
    var idx = text.toLowerCase().indexOf(q);
    if (idx < 0) return escapeHtml(text);
    return escapeHtml(text.slice(0, idx)) +
      '<mark>' + escapeHtml(text.slice(idx, idx + q.length)) + '</mark>' +
      escapeHtml(text.slice(idx + q.length));
  }

  function snippet(body, q) {
    var lc = body.toLowerCase();
    var idx = lc.indexOf(q);
    if (idx < 0) return '';
    var start = Math.max(0, idx - 50);
    var end = Math.min(body.length, idx + q.length + 90);
    var text = (start > 0 ? '… ' : '') + body.slice(start, end) + (end < body.length ? ' …' : '');
    return highlight(text, q);
  }

  function render() {
    var q = (input.value || '').trim().toLowerCase();
    selected = -1;
    if (!q) { results.innerHTML = ''; return; }

    var matches = [];
    for (var i = 0; i < items.length && matches.length < 30; i++) {
      var it = items[i];
      var inTitle = it.title.toLowerCase().indexOf(q) !== -1;
      var inBody = !inTitle && it.body && it.body.toLowerCase().indexOf(q) !== -1;
      if (inTitle || inBody) matches.push({ it: it, rank: inTitle ? 0 : 1 });
    }
    matches.sort(function (a, b) { return a.rank - b.rank; });

    if (!matches.length) {
      results.innerHTML = '<div class="search-modal__empty">Nothing found for “' + escapeHtml(q) + '”</div>';
      return;
    }
    results.innerHTML = matches.map(function (m, i) {
      var snip = m.rank === 1 ? snippet(m.it.body, q) : '';
      return '<a class="search-modal__result" href="' + m.it.href + '" data-i="' + i + '">' +
        '<span class="search-modal__result-title">' + highlight(m.it.title, q) + '</span>' +
        (snip ? '<span class="search-modal__result-snippet">' + snip + '</span>' : '') +
        '</a>';
    }).join('');
  }

  function resultEls() {
    return Array.prototype.slice.call(results.querySelectorAll('.search-modal__result'));
  }

  function setSelected(i) {
    var els = resultEls();
    if (!els.length) return;
    selected = (i + els.length) % els.length;
    els.forEach(function (el, n) { el.classList.toggle('is-selected', n === selected); });
    els[selected].scrollIntoView({ block: 'nearest' });
  }

  function open() {
    if (!modal) return;
    if (!items.length) build();
    modal.hidden = false;
    document.documentElement.classList.add('search-modal-open');
    requestAnimationFrame(function () { input.focus(); });
  }

  function close() {
    if (!modal) return;
    modal.hidden = true;
    document.documentElement.classList.remove('search-modal-open');
    input.value = '';
    results.innerHTML = '';
    selected = -1;
  }

  function isTypingTarget(el) {
    return el && /^(input|textarea|select)$/i.test(el.tagName);
  }

  document.addEventListener('DOMContentLoaded', function () {
    modal = document.getElementById('search-modal');
    input = document.getElementById('search-input');
    openBtn = document.getElementById('search-open');
    results = document.getElementById('search-results');
    if (!modal || !input || !results) return;

    if (openBtn) {
      openBtn.addEventListener('click', open);
      var kbd = openBtn.querySelector('.search-trigger__kbd');
      var isMac = /Mac|iPhone|iPad|iPod/.test(navigator.platform || navigator.userAgent);
      if (kbd && !isMac) kbd.textContent = 'Ctrl K';
    }

    modal.querySelectorAll('[data-close]').forEach(function (el) {
      el.addEventListener('click', close);
    });

    input.addEventListener('input', render);

    input.addEventListener('keydown', function (e) {
      var els = resultEls();
      if (e.key === 'ArrowDown') { e.preventDefault(); setSelected(selected + 1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); setSelected(selected - 1); }
      else if (e.key === 'Enter') {
        e.preventDefault();
        var target = selected >= 0 ? els[selected] : els[0];
        if (target) window.location.href = target.href;
      }
    });

    document.addEventListener('keydown', function (e) {
      var k = (e.key || '').toLowerCase();
      if ((e.metaKey || e.ctrlKey) && k === 'k') {
        e.preventDefault();
        isOpen() ? close() : open();
      } else if (k === '/' && !isOpen() && !isTypingTarget(e.target)) {
        e.preventDefault();
        open();
      } else if (k === 'escape' && isOpen()) {
        close();
      }
    });
  });
})();
