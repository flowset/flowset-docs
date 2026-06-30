# Enabling tabs (`@asciidoctor/tabs`)

Phase 4 prepared everything except the step that requires `npm install`. To enable tabs:

1. Install the dependency (already added to `package.json`):

   ```bash
   npm install
   ```

2. Uncomment the extension in both playbooks
   (`antora-playbook.yml`, `antora-playbook.ci.yml`):

   ```yaml
   asciidoc:
     extensions:
       - asciidoctor-kroki
       - '@asciidoctor/tabs'
   ```

3. Add the official tabs stylesheet and script from the package to the UI.
   Copy them into supplemental (or, in Phase 1, into the `flowset-ui/src` bundle):

   ```bash
   cp node_modules/@asciidoctor/tabs/dist/css/tabs.css   content/supplemental/css/
   cp node_modules/@asciidoctor/tabs/dist/js/tabs.js     content/supplemental/js/
   ```

   and add the references:
   - in `partials/head-meta.hbs`:  `<link rel="stylesheet" href="{{uiRootPath}}/css/tabs.css">`
   - in `partials/footer-scripts.hbs`:  `<script src="{{uiRootPath}}/js/tabs.js"></script>`

   Our token styles (`theme.css`, section 11) override the tab appearance to match the
   Flowset theme — leave them as is.

4. Usage in `.adoc`:

   ```asciidoc
   [tabs]
   ======
   Camunda::
   +
   [source,xml]
   ----
   <dependency>...camunda...</dependency>
   ----

   Operaton::
   +
   [source,xml]
   ----
   <dependency>...operaton...</dependency>
   ----
   ======
   ```

Without steps 1–2 the extension is inactive, and the CSS from section 11 of `theme.css`
is inert (no tabs are generated), so the build does not break.
