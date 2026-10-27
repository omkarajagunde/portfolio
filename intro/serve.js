// Local preview for the intro pages. Re-renders on every request (reloading render.js too), so edits to
// render.js, strings.json, photos and assets show up on refresh.
//   node intro/serve.js  ->  http://localhost:8080/personal, /professional

const http = require('http');
const fs = require('fs');
const path = require('path');
const { CONTEXTS, CONTENT_DIR, ASSETS_DIR, ASSET_BASE } = require('./render');

function freshRender(ctx) {
  delete require.cache[require.resolve('./render')];
  const { render, loadStrings } = require('./render');
  return render(ctx, loadStrings(ctx));
}

const PORT = process.env.PORT || 8080;
const MIME = {
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
};

// Resolve a file inside baseDir, refusing anything that escapes it.
function sendFile(res, baseDir, rel) {
  const file = path.resolve(baseDir, rel);
  if (!file.startsWith(baseDir + path.sep)) return notFound(res);
  fs.readFile(file, (err, data) => {
    if (err) return notFound(res);
    res.writeHead(200, { 'Content-Type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream' });
    res.end(data);
  });
}

function notFound(res) {
  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('Not found');
}

http.createServer((req, res) => {
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  } catch {
    return notFound(res);
  }

  const page = pathname === '/' ? 'professional' : pathname.replace(/^\/|\/$/g, '');
  if (CONTEXTS.includes(page)) {
    try {
      const html = freshRender(page);
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      return res.end(html);
    } catch (err) {
      console.error(`Failed to render ${page}:`, err);
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      return res.end('Server error');
    }
  }

  const photoMatch = pathname.match(new RegExp(`^${ASSET_BASE}/photos/([^/]+)/(.+)$`));
  if (photoMatch && CONTEXTS.includes(photoMatch[1])) {
    return sendFile(res, path.join(CONTENT_DIR, photoMatch[1], 'photos'), photoMatch[2]);
  }
  if (pathname.startsWith(`${ASSET_BASE}/`)) {
    return sendFile(res, ASSETS_DIR, pathname.slice(ASSET_BASE.length + 1));
  }

  notFound(res);
}).listen(PORT, () => console.log(`Intro preview: http://localhost:${PORT}/personal  http://localhost:${PORT}/professional`));
