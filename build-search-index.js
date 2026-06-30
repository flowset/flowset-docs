#!/usr/bin/env node
/*
 * Builds a self-contained full-text search index from the generated site.
 * Run AFTER `antora` (see the "build" script in package.json):
 *   npx antora antora-playbook.yml && node build-search-index.js
 *
 * Output: build/site/_/js/flowset-search-index.js, which sets
 * window.FLOWSET_SEARCH = [{ t: title, u: url-relative-to-site-root, b: body }].
 * It is a plain <script> (not fetched JSON), so it also works over file://.
 */
const fs = require('fs');
const path = require('path');

const SITE_DIR = path.join(__dirname, 'build', 'site');
const OUT_DIR = path.join(SITE_DIR, '_', 'js');
const OUT_FILE = path.join(OUT_DIR, 'flowset-search-index.js');
const MAX_BODY = 4000; // chars of body text kept per page

function walk(dir, acc) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      if (name === '_') continue; // skip UI assets
      walk(full, acc);
    } else if (name.endsWith('.html') && name !== '404.html') {
      acc.push(full);
    }
  }
  return acc;
}

function decode(s) {
  return s
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&#8217;/g, '’')
    .replace(/&nbsp;/g, ' ').replace(/&#\d+;/g, ' ');
}

function strip(html) {
  return decode(html.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
}

function extract(html) {
  var titleM = html.match(/<h1[^>]*class="page"[^>]*>([\s\S]*?)<\/h1>/i) ||
               html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) ||
               html.match(/<title>([\s\S]*?)<\/title>/i);
  var title = titleM ? strip(titleM[1]) : '';
  var artM = html.match(/<article[^>]*class="[^"]*doc[^"]*"[^>]*>([\s\S]*?)<\/article>/i);
  var body = artM ? strip(artM[1]) : '';
  return { title: title, body: body.slice(0, MAX_BODY) };
}

if (!fs.existsSync(SITE_DIR)) {
  console.error('build/site not found — run antora first.');
  process.exit(1);
}

var files = walk(SITE_DIR, []);
var index = [];
for (const file of files) {
  var html = fs.readFileSync(file, 'utf8');
  var info = extract(html);
  if (!info.title) continue;
  var url = path.relative(SITE_DIR, file).split(path.sep).join('/');
  index.push({ t: info.title, u: url, b: info.body });
}

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(OUT_FILE, 'window.FLOWSET_SEARCH=' + JSON.stringify(index) + ';\n');
console.log('Search index: ' + index.length + ' pages -> ' + path.relative(__dirname, OUT_FILE));
