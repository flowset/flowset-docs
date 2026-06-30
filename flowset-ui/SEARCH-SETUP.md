# Search

The docs ship with a **self-contained full-text search** that needs no extra
dependencies and works even over `file://`.

## How it works

- `build-search-index.js` runs after `antora` and scans the generated HTML, building an
  index (title + article text + URL) into `_/js/flowset-search-index.js` as
  `window.FLOWSET_SEARCH`.
- It is loaded as a plain `<script>` (not fetched JSON), so it also works when you open
  the built site from disk over `file://`.
- The ⌘K modal searches both titles and body text: title matches rank first, body
  matches show a highlighted snippet. If the index is missing, it falls back to searching
  navigation titles.

## Build

Always build with the npm script so the index is regenerated:

```bash
npm run build        # = antora antora-playbook.yml && node build-search-index.js
# or, for production:
npm run build:ci     # = antora --fetch antora-playbook.ci.yml && node build-search-index.js
# regenerate the index only:
npm run index
```

If you run `npx antora …` directly, also run `node build-search-index.js` afterwards.

## Optional: full-text search via @antora/lunr-extension

If you prefer the standard Antora lunr search (stemming, ranking) instead of the
built-in indexer:

1. `npm install` (the dependency `@antora/lunr-extension` is already in `package.json`).
2. Uncomment the `antora.extensions` block in both playbooks:

   ```yaml
   antora:
     extensions:
       - require: '@antora/lunr-extension'
         index_latest_only: true
   ```

3. Rebuild. The extension generates `search-index.js` and `js/search-ui.js`. In that case,
   remove the built-in `build-search-index.js` step and the `flowset-search-index.js`
   reference from `footer-scripts.hbs`, and wire the modal to the extension's `search-ui.js`.

## Alternative placement (sidebar search)

If you want the search box at the top of the left sidebar (like the Claude docs example)
instead of a header modal, the `#search-input` can be moved into the `nav.hbs` partial.
The search logic stays the same; only the placement changes.
