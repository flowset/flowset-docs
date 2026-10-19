'use strict'

const { posix: path } = require('path')

module.exports = (value, cls, { data: { root } }) => {
  if (!value) return ''
  const [spec, label] = String(value).split('|').map((s) => s.trim())
  const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;')
  if (/^https?:\/\//.test(spec)) {
    return `<a class="btn ${esc(cls)}" href="${esc(spec)}" target="_blank" rel="noopener">${esc(label || spec)}</a>`
  }
  const { contentCatalog, page } = root
  const target = contentCatalog.resolvePage(spec, {
    component: page.component.name,
    version: page.version,
    module: page.module,
  })
  if (!target) return ''
  const from = page.url.endsWith('/') ? page.url : path.dirname(page.url)
  let href = path.relative(from, target.pub.url)
  if (!href || href === '.') href = './'
  return `<a class="btn ${esc(cls)}" href="${esc(href)}">${esc(label || target.asciidoc.doctitle)}</a>`
}
