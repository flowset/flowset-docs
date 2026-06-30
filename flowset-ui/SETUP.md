# Flowset UI — Phase 1: build your own UI bundle

Goal: create a `flowset-ui` repository (a fork of `antora-ui-default`), move our
customization layer into it, and build `ui-bundle.zip` in CI. After that the docs
playbook switches to this bundle, and styling no longer depends on the remote
`antora-ui-default` or on `supplemental`.

> This folder (`flowset-ui/`) could not be built inside the assistant environment —
> network access to the `antora-ui-default` sources is blocked. It contains the
> ready-to-use customization layer and configuration; the steps below are run where
> you have network access (your machine / CI).

---

## 0. What is already prepared here

```
flowset-ui/
  ui.yml                         # bundle descriptor (output_dir: _)
  .github/workflows/bundle.yml   # CI: gulp bundle + publish ui-bundle.zip to the "latest" release
  src/css/_tokens.css            # design tokens (light/dark) — import FIRST
  src/css/flowset.css            # typography, dark surfaces, components, toggle
  src/js/theme-toggle.js         # theme toggle
  src/js/search-modal.js         # ⌘K search modal
  src/partials/                  # our partials (header-content with theme toggle, head-*, footer-scripts, nav-tree, article)
  build-search-index.js          # full-text search index generator (run after antora)
```

---

## 1. Create the repository from the fork

Where you have internet access:

```bash
git clone https://gitlab.com/antora/antora-ui-default.git flowset-ui
cd flowset-ui
rm -rf .git && git init           # start your own history
npm install
npx gulp bundle                   # confirm the base bundle builds -> build/ui-bundle.zip
```

Create an empty `flowset/flowset-ui` repository on GitHub and push.

---

## 2. Apply the customization layer

Copy from this folder into the fork:

```bash
cp <this-repo>/flowset-ui/ui.yml                       ./ui.yml
cp -r <this-repo>/flowset-ui/.github                   ./
cp <this-repo>/flowset-ui/src/css/_tokens.css          ./src/css/
cp <this-repo>/flowset-ui/src/css/flowset.css          ./src/css/
cp <this-repo>/flowset-ui/src/js/*.js                  ./src/js/
cp <this-repo>/flowset-ui/src/partials/*.hbs           ./src/partials/
```

---

## 3. Wire the CSS into the build

In `antora-ui-default` all styles are compiled from `src/css/site.css` via `@import`.
Add our imports — tokens first, theme last:

```css
/* first line of site.css */
@import 'tokens.css';      /* postcss-import resolves the file named _tokens.css */

/* ...the existing antora-default @import rules... */

/* last line of site.css */
@import 'flowset.css';
```

> Important: in the bundle, CSS is compiled into a single `site.css`, so individual
> `<link>` tags to css files are **not** used. Move the current
> `content/supplemental/css/*.css` files (search, overrides, block, button, menu,
> feedback-form, image-lightbox) into `src/css/` and `@import` them in `site.css`,
> and remove the corresponding `<link>` tags from the `head-meta.hbs` partial.

---

## 4. Partials and font

- `src/partials/header-content.hbs` — already contains the theme toggle button.
- `src/partials/head-scripts.hbs` — early anti-flash script (sets `data-theme` before paint).
- `src/partials/head-styles.hbs` — loads the Inter font and the code highlight themes
  (`github` / `github-dark`). Remove the `theme.css` link — styles now live in `site.css`.
- `src/partials/footer-scripts.hbs` — loads `theme-toggle.js`, the search index and `search-modal.js`.

Make sure the fork's `head.hbs` actually includes the `head-meta`, `head-styles`,
`head-scripts` partials (in `antora-ui-default` it does). Run `npx gulp bundle` and
`npx gulp preview` for a local preview.

---

## 5. CI (already in `.github/workflows/bundle.yml`)

On push to `main` the workflow builds the bundle and publishes it to the `latest`
release, from which the playbook takes a stable URL:

```
https://github.com/flowset/flowset-ui/releases/latest/download/ui-bundle.zip
```

---

## 6. Point the docs at the new bundle

In `flowset-docs/antora-playbook.yml` and `antora-playbook.ci.yml`, uncomment the line
with the `flowset-ui` bundle URL (the placeholder is already there) and remove the old
`gitlab` URL. For local UI development you can point at the freshly built file:

```yaml
ui:
  bundle:
    url: ../flowset-ui/build/ui-bundle.zip
    snapshot: true
```

Build the docs and check:

```bash
cd flowset-docs
npm run build      # antora + search index
open build/site/index.html
```

---

## 7. After the move — clean up supplemental

Once everything has moved into the bundle, keep only what is genuinely
content-specific in `flowset-docs/content/supplemental` (if anything). Delete the
partials/JS/CSS that are now duplicated in the bundle so there is a single source of truth.

---

## Acceptance checklist

- [ ] `npx gulp bundle` builds in `flowset-ui` without errors.
- [ ] A local docs build with `url: ../flowset-ui/build/ui-bundle.zip` renders.
- [ ] Light/dark themes toggle, the theme persists across reloads, no flash.
- [ ] Admonitions, cards, code blocks and search look like Phase 0 in both themes.
- [ ] CI publishes `ui-bundle.zip` to the `latest` release.
- [ ] Both playbooks point at `flowset-ui`, duplicates in `supplemental` are removed.
