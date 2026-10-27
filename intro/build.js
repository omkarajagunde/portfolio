// Static export of the site into build/, for Firebase Hosting:
//   build/index.html                       -> /              (professional)
//   build/<ctx>/index.html                 -> /<ctx>
//   build/intro-assets/{styles.css,app.js}
//   build/intro-assets/photos/<ctx>/*

const fs = require('fs');
const path = require('path');
const { render, loadStrings, CONTEXTS, CONTENT_DIR, ASSETS_DIR, ASSET_BASE } = require('./render');

const OUT = path.join(__dirname, '..', 'build');
const HOME = 'professional';

fs.rmSync(OUT, { recursive: true, force: true });
const assetsOut = path.join(OUT, ASSET_BASE);
fs.cpSync(ASSETS_DIR, assetsOut, { recursive: true });

for (const ctx of CONTEXTS) {
  const html = render(ctx, loadStrings(ctx));
  fs.mkdirSync(path.join(OUT, ctx), { recursive: true });
  fs.writeFileSync(path.join(OUT, ctx, 'index.html'), html);
  if (ctx === HOME) fs.writeFileSync(path.join(OUT, 'index.html'), html);

  const photosDir = path.join(CONTENT_DIR, ctx, 'photos');
  if (fs.existsSync(photosDir)) fs.cpSync(photosDir, path.join(assetsOut, 'photos', ctx), { recursive: true });
  console.log(`wrote /${ctx}${ctx === HOME ? ' (and /)' : ''}`);
}
