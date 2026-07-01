'use strict'
/*
 * Antora extension: builds the self-contained full-text search index during the
 * site build, so it works for any `antora` invocation (local and CI) without a
 * separate step. Publishes _/js/flowset-search-index.js which sets
 * window.FLOWSET_SEARCH = [{ t: title, u: url-relative-to-site-root, b: body }].
 *
 * Register in the playbook:
 *   antora:
 *     extensions:
 *       - ./search-index-extension.js
 */
const MAX_BODY = 4000

function decode (s) {
  return s
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&#8217;/g, '’')
    .replace(/&nbsp;/g, ' ').replace(/&#\d+;/g, ' ')
}

function strip (html) {
  return decode(html.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim()
}

module.exports.register = function () {
  this.on('beforePublish', ({ contentCatalog, siteCatalog }) => {
    const index = []
    for (const page of contentCatalog.getPages((p) => p.out)) {
      const html = page.contents.toString()
      const titleMatch =
        html.match(/<h1[^>]*class="page"[^>]*>([\s\S]*?)<\/h1>/i) ||
        html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) ||
        html.match(/<title>([\s\S]*?)<\/title>/i)
      const title = titleMatch ? strip(titleMatch[1]) : ''
      if (!title) continue
      const artMatch = html.match(/<article[^>]*class="[^"]*doc[^"]*"[^>]*>([\s\S]*?)<\/article>/i)
      const body = artMatch ? strip(artMatch[1]).slice(0, MAX_BODY) : ''
      const url = (page.pub && page.pub.url ? page.pub.url : '').replace(/^\//, '')
      if (!url) continue
      index.push({ t: title, u: url, b: body })
    }
    const js = 'window.FLOWSET_SEARCH=' + JSON.stringify(index) + ';\n'
    siteCatalog.addFile({
      mediaType: 'application/javascript',
      contents: Buffer.from(js, 'utf8'),
      out: { path: '_/js/flowset-search-index.js' },
      pub: { url: '/_/js/flowset-search-index.js' },
    })
    this.getLogger('flowset-search-index').info('search index: ' + index.length + ' pages')
  })
}
