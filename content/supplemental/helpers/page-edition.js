'use strict'

const cache = new WeakMap()

module.exports = (url, { data: { root } }) => {
  const catalog = root.contentCatalog
  if (!url || !catalog) return undefined
  let editions = cache.get(catalog)
  if (!editions) {
    editions = new Map()
    catalog.getPages((page) => page.pub && page.asciidoc).forEach((page) => {
      const edition = page.asciidoc.attributes['page-edition']
      if (edition) editions.set(page.pub.url, edition)
    })
    cache.set(catalog, editions)
  }
  return editions.get(url)
}
