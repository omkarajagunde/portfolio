# portfolio

Omkar Ajagunde's site, hosted on Firebase at https://omkarajagunde.web.app.

| URL          | Page                                         |
|--------------|----------------------------------------------|
| `/`          | Professional (same as `/professional`)       |
| `/personal`  | Personal (not indexed by search engines)     |

The pages are pre-rendered to static HTML by a small zero-dependency Node script, so there is
nothing to install.

## Editing content

- Text: `intro/content/<context>/strings.json`. Values are trusted HTML, so `<br>`, `<strong>`,
  `<em>` and `<mark>` (green highlighter on scroll) work.
- Photos: `intro/content/<context>/photos/`. Items whose file is missing are skipped.
  Travel collage captions default to the file name (`kerala-church-from-the-lighthouse.jpg` →
  "Kerala Church from the Lighthouse").
- Styles and scroll effects: `intro/assets/`.
- Markup: `intro/render.js`.

## Commands

```
npm run dev       # live preview at http://localhost:8080 (re-renders on every refresh)
npm run build     # writes the static site to build/
npm run deploy    # build, then deploy to Firebase Hosting (needs `npx firebase-tools login` once)
```

`.npmrc` pins the public npm registry.
