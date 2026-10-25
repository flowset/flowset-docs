'use strict'

const { posix: path } = require('path')

module.exports = (spec, { data: { root } }) => {
  if (!spec) return ''
  const { contentCatalog, page } = root
  const target = contentCatalog.resolvePage(String(spec).trim(), {
    component: page.component.name,
    version: page.version,
    module: page.module,
  })
  if (!target) return ''
  const from = page.url.endsWith('/') ? page.url : path.dirname(page.url)
  const href = path.relative(from, target.pub.url)
  return !href || href === '.' ? './' : href
}
