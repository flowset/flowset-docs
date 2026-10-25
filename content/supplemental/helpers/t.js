'use strict'

// Theme UI strings in the page language (`locale` in antora.yml). Kept in one file because
// Antora loads each helper separately.
//   {{t 'key'}}, {{t 'since' version}}  string, {0}... replaced by the extra arguments
//   {{t '@locale'}}                     page language code
//   {{t '@json'}}                       strings for the theme scripts (window.FL_I18N)

const STRINGS = {
  en: {
    skip: 'Skip to content',
    home: 'Flowset Docs: home',
    menu: 'Menu',
    search: 'Search docs',
    searchHint: 'Press / or ⌘K to search',
    noResults: 'Nothing found for',
    theme: 'Theme',
    system: 'System',
    light: 'Light',
    dark: 'Dark',
    language: 'Language',
    github: 'Flowset on GitHub',
    slack: 'Flowset on Slack',
    website: 'Flowset website',
    copy: 'Copy',
    copied: 'Copied',
    prev: 'Previous',
    next: 'Next',
    toc: 'On this page',
    edit: 'Edit this page',
    enterprise: 'Enterprise',
    enterpriseOnly: 'Available in the Enterprise edition only',
    since: 'Since {0}',
    eeFeature: 'Enterprise feature',
    sinceEe: 'Since Enterprise {0}',
    eeBannerTitle: 'Enterprise feature.',
    eeBannerCommunity: 'It is not available in the Community edition.',
    eeBannerLicense: 'In Enterprise without an installed license, its menu items are marked with a lock icon, and its buttons and tabs are disabled or hidden.',
    eeBannerCompare: 'Compare editions',
    eeBannerInstall: 'Install a license',
    documentation: 'Documentation',
    close: 'Close',
    closePreview: 'Close image preview',
    footerBuilt: 'Site built with <a href="https://antora.org" target="_blank" rel="noopener">Antora</a>. The interface is based on the <a href="https://gitlab.com/antora/antora-ui-default" target="_blank" rel="noopener">Antora default UI</a>.',
    footerLicense: 'The interface source code is licensed under <a href="https://www.mozilla.org/MPL/2.0/" target="_blank" rel="noopener">MPL-2.0</a>.',
  },
  es: {
    skip: 'Saltar al contenido',
    home: 'Flowset Docs: inicio',
    menu: 'Menú',
    search: 'Buscar en la documentación',
    searchHint: 'Pulsa / o ⌘K para buscar',
    noResults: 'No se encontró nada para',
    theme: 'Tema',
    system: 'Sistema',
    light: 'Claro',
    dark: 'Oscuro',
    language: 'Idioma',
    github: 'Flowset en GitHub',
    slack: 'Flowset en Slack',
    website: 'Sitio web de Flowset',
    copy: 'Copiar',
    copied: 'Copiado',
    prev: 'Anterior',
    next: 'Siguiente',
    toc: 'En esta página',
    edit: 'Editar esta página',
    enterprise: 'Enterprise',
    enterpriseOnly: 'Disponible solo en la edición Enterprise',
    since: 'Desde {0}',
    eeFeature: 'Función Enterprise',
    sinceEe: 'Desde Enterprise {0}',
    eeBannerTitle: 'Función Enterprise.',
    eeBannerCommunity: 'No está disponible en la edición Community.',
    eeBannerLicense: 'En Enterprise sin una licencia instalada, sus elementos de menú se marcan con un icono de candado y sus botones y pestañas están desactivados u ocultos.',
    eeBannerCompare: 'Comparar ediciones',
    eeBannerInstall: 'Instalar una licencia',
    documentation: 'Documentación',
    close: 'Cerrar',
    closePreview: 'Cerrar la vista previa',
    footerBuilt: 'Sitio creado con <a href="https://antora.org" target="_blank" rel="noopener">Antora</a>. La interfaz se basa en la <a href="https://gitlab.com/antora/antora-ui-default" target="_blank" rel="noopener">interfaz predeterminada de Antora</a>.',
    footerLicense: 'El código fuente de la interfaz se distribuye bajo la licencia <a href="https://www.mozilla.org/MPL/2.0/" target="_blank" rel="noopener">MPL-2.0</a>.',
  },
  de: {
    skip: 'Zum Inhalt springen',
    home: 'Flowset Docs: Startseite',
    menu: 'Menü',
    search: 'Doku durchsuchen',
    searchHint: 'Drücken Sie / oder ⌘K zum Suchen',
    noResults: 'Keine Treffer für',
    theme: 'Design',
    system: 'System',
    light: 'Hell',
    dark: 'Dunkel',
    language: 'Sprache',
    github: 'Flowset auf GitHub',
    slack: 'Flowset auf Slack',
    website: 'Flowset-Website',
    copy: 'Kopieren',
    copied: 'Kopiert',
    prev: 'Zurück',
    next: 'Weiter',
    toc: 'Auf dieser Seite',
    edit: 'Seite bearbeiten',
    enterprise: 'Enterprise',
    enterpriseOnly: 'Nur in der Enterprise-Edition verfügbar',
    since: 'Seit {0}',
    eeFeature: 'Enterprise-Funktion',
    sinceEe: 'Seit Enterprise {0}',
    eeBannerTitle: 'Enterprise-Funktion.',
    eeBannerCommunity: 'In der Community-Edition ist sie nicht verfügbar.',
    eeBannerLicense: 'In Enterprise ohne installierte Lizenz sind ihre Menüpunkte mit einem Schloss-Symbol markiert, und ihre Schaltflächen und Tabs sind deaktiviert oder ausgeblendet.',
    eeBannerCompare: 'Editionen vergleichen',
    eeBannerInstall: 'Lizenz installieren',
    documentation: 'Dokumentation',
    close: 'Schließen',
    closePreview: 'Bildvorschau schließen',
    footerBuilt: 'Website erstellt mit <a href="https://antora.org" target="_blank" rel="noopener">Antora</a>. Die Oberfläche basiert auf der <a href="https://gitlab.com/antora/antora-ui-default" target="_blank" rel="noopener">Standardoberfläche von Antora</a>.',
    footerLicense: 'Der Quellcode der Oberfläche steht unter der Lizenz <a href="https://www.mozilla.org/MPL/2.0/" target="_blank" rel="noopener">MPL-2.0</a>.',
  },
}

const SCRIPT_KEYS = ['copy', 'copied', 'noResults', 'language', 'close', 'closePreview']

function pageLocale (root) {
  const page = (root && root.page) || {}
  const cv = page.componentVersion || {}
  const attrs = (cv.asciidoc && cv.asciidoc.attributes) || {}
  let locale = attrs.locale
  if (!locale && page.component && page.component.name) {
    const m = /-([a-z]{2})$/.exec(page.component.name)
    locale = m ? m[1] : 'en'
  }
  return STRINGS[locale] ? locale : 'en'
}

module.exports = (key, ...rest) => {
  const { data: { root } } = rest.pop()
  const locale = pageLocale(root)
  const lookup = (k) => STRINGS[locale][k] || STRINGS.en[k] || k
  if (key === '@locale') return locale
  if (key === '@json') {
    const out = {}
    SCRIPT_KEYS.forEach((k) => { out[k] = lookup(k) })
    return JSON.stringify(out).replace(/</g, '\\u003c')
  }
  return lookup(key).replace(/\{(\d+)\}/g, (m, i) => (rest[i] !== undefined ? String(rest[i]) : m))
}
