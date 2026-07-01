// Language switcher for Flowset docs (dropdown).
//
// To add a language: create the corresponding Antora component (e.g. content-fr
// with `name: flowset-fr`) and add one entry to LANGS below. Nothing else here
// needs to change.
//
// Page file names are mirrored between languages, so switching just swaps the
// component segment in the URL. This works both on a server (site at domain
// root or a subpath) and when opening files locally over file://, because we
// replace the component segment inside the actual pathname rather than assuming
// the site lives at "/".
(function () {
  var LANGS = [
    { code: 'en', label: 'English', short: 'EN', component: 'flowset' },
    { code: 'es', label: 'Español', short: 'ES', component: 'flowset-es' },
    { code: 'de', label: 'Deutsch', short: 'DE', component: 'flowset-de' }
  ];
  // Every component starts on this page (antora.yml: start_page ROOT:intro.adoc),
  // used as the fallback when a page isn't translated yet.
  var START_PAGE = 'intro.html';

  function seg(component) { return '/' + component + '/'; }

  // Detect current language from the URL. Prefer the longest matching component
  // name so "flowset-es" isn't mistaken for "flowset".
  function currentLang() {
    var path = window.location.pathname;
    var found = null;
    LANGS.forEach(function (l) {
      if (path.indexOf(seg(l.component)) !== -1) {
        if (!found || l.component.length > found.component.length) found = l;
      }
    });
    return found || LANGS[0];
  }

  // Returns { full, root } target URLs for the chosen language, or null.
  function targetFor(lang) {
    var cur = currentLang();
    if (cur.component === lang.component) return null;
    var path = window.location.pathname;
    var from = seg(cur.component);
    var to = seg(lang.component);
    var idx = path.lastIndexOf(from);
    if (idx === -1) return null;
    var base = path.slice(0, idx) + to;
    return { full: base + path.slice(idx + from.length), root: base + START_PAGE };
  }

  function go(lang) {
    var t = targetFor(lang);
    if (!t) return;
    // file:// can't do HEAD requests — navigate straight to the mirrored page.
    if (window.location.protocol === 'file:') {
      window.location.href = t.full;
      return;
    }
    fetch(t.full, { method: 'HEAD' })
      .then(function (r) { window.location.href = r.ok ? t.full : t.root; })
      .catch(function () { window.location.href = t.root; });
  }

  function render(container) {
    var cur = currentLang();
    var menu = LANGS.map(function (l) {
      var isCurrent = l.component === cur.component;
      return '<li class="lang-dropdown-item' + (isCurrent ? ' is-current' : '') +
        '"><a href="#" data-code="' + l.code + '">' + l.label + '</a></li>';
    }).join('');
    container.innerHTML =
      '<div class="lang-dropdown">' +
        '<button type="button" class="lang-dropdown-toggle" aria-haspopup="true" aria-expanded="false">' +
          cur.short + '<span class="lang-caret"></span>' +
        '</button>' +
        '<ul class="lang-dropdown-menu">' + menu + '</ul>' +
      '</div>';

    var toggle = container.querySelector('.lang-dropdown-toggle');
    var dropdown = container.querySelector('.lang-dropdown');

    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = dropdown.classList.toggle('opened');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    container.querySelectorAll('.lang-dropdown-item a[data-code]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        var lang = LANGS.filter(function (l) { return l.code === a.dataset.code; })[0];
        if (lang) go(lang);
      });
    });

    // close when clicking elsewhere
    document.addEventListener('click', function () {
      dropdown.classList.remove('opened');
      toggle.setAttribute('aria-expanded', 'false');
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    var container = document.getElementById('lang-switcher');
    if (container) render(container);
  });
})();
