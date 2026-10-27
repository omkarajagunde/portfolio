// Renders the intro page for a context from content/<ctx>/strings.json + photos.
// Used by build.js (static export for Firebase Hosting) and serve.js (local preview).
// Strings are trusted, author-written HTML snippets (e.g. <strong>, <br>, <mark>) and are inserted as-is.
//
// Page flow: hero -> story (sticky photo + chapters) -> quotes (optional) -> principles (optional) -> projects (optional)
// -> travel (optional) -> gallery (optional) -> hello.

const fs = require('fs');
const path = require('path');

const CONTENT_DIR = path.join(__dirname, 'content');
const ASSETS_DIR = path.join(__dirname, 'assets');
const CONTEXTS = ['personal', 'professional'];
// Public URL prefix for styles, scripts and photos. Kept off /static, which belongs to the CRA build.
const ASSET_BASE = '/intro-assets';

// Turns a Venn label's line break into a space, or nothing after a hyphen: "Multi-|tasking" -> "Multi-tasking".
const flat = l => l.replace(/-\|/g, '-').replace(/\|/g, ' ');

const attr = s => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

function loadStrings(ctx) {
  return JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, ctx, 'strings.json'), 'utf8'));
}

const SMALL_WORDS = new Set(['a', 'an', 'and', 'at', 'but', 'by', 'for', 'from', 'in', 'not', 'of', 'on', 'or', 'the', 'to', 'with']);

// "when-varkala-sea-meets-the-shore.jpg" -> "When Varkala Sea Meets the Shore"
function captionFromFile(file) {
  return path.basename(file, path.extname(file))
    .replace(/^photography-skills-?/, '')
    .replace(/-?\d+$/, '')
    .split('-')
    .filter(Boolean)
    .map((w, i) => (i && SMALL_WORDS.has(w) ? w : w[0].toUpperCase() + w.slice(1)))
    .join(' ');
}

// Reads width/height from a JPEG's SOF header, so the collage can reserve space before lazy images load.
function jpegSize(file) {
  const b = fs.readFileSync(file);
  for (let i = 2; i < b.length - 9; ) {
    if (b[i] !== 0xff) return { w: 4, h: 3 };
    const marker = b[i + 1];
    if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) return { w: b.readUInt16BE(i + 7), h: b.readUInt16BE(i + 5) };
    i += 2 + b.readUInt16BE(i + 2);
  }
  return { w: 4, h: 3 };
}

const VENN_COLORS = ['#8fd14f', '#ff8a65', '#5fa8f0', '#f0b93a', '#a982f0', '#3fc9a3'];

// A flower Venn: one tinted circle per principle, all overlapping at the core. Each petal carries
// its number; the labels sit outside the flower ("|" in a label breaks the line). On phones the
// script swaps to the compact viewBox and CSS hides the outer labels.
function venn(p) {
  const n = p.items.length, R = 84, d = 64, L = d + R + 18, LINE = 16;
  const pt = (r, a) => [r * Math.cos(a), r * Math.sin(a)];
  const sets = p.items.map((item, i) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / n, color = VENN_COLORS[i % VENN_COLORS.length];
    const [cx, cy] = pt(d, a), [nx, ny] = pt(d + 44, a), [lx, ly] = pt(L, a);
    const lines = item.label.split('|'), h = lines.length * LINE;
    const anchor = Math.cos(a) > 0.3 ? 'start' : Math.cos(a) < -0.3 ? 'end' : 'middle';
    // Above the flower, below it, or vertically centred beside it.
    const y0 = Math.sin(a) < -0.9 ? ly - h + 4 : Math.sin(a) > 0.9 ? ly + 14 : ly - h / 2 + 12;
    const label = lines.map((l, k) => `<tspan x="${lx.toFixed(1)}" y="${(y0 + k * LINE).toFixed(1)}">${l}</tspan>`).join('');
    return `<g class="venn-set${i ? '' : ' active'}" style="--i:${i};--c:${color}" data-story-img>`
      + `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${R}"/>`
      + `<text class="venn-num" x="${nx.toFixed(1)}" y="${(ny + 4).toFixed(1)}" text-anchor="middle">${String(i + 1).padStart(2, '0')}</text>`
      + `<text class="venn-label" text-anchor="${anchor}">${label}</text></g>`;
  }).join('');
  const core = p.core.split('|').map((l, k, all) => `<tspan x="0" y="${((k - (all.length - 1) / 2) * 12 + 3.5).toFixed(1)}">${l}</tspan>`).join('');
  const full = `-${L + 105} -${L + 30} ${2 * (L + 105)} ${2 * L + 40}`, compact = `-${d + R + 6} -${d + R + 6} ${2 * (d + R + 6)} ${2 * (d + R + 6)}`;
  return `<div class="venn reveal"><svg class="venn-svg" viewBox="${full}" data-vb-full="${full}" data-vb-compact="${compact}" role="img" aria-label="${attr(p.items.map(i => flat(i.label)).join(', '))}">`
    + `${sets}<g class="venn-core"><circle r="36"/><text text-anchor="middle">${core}</text></g></svg></div>`;
}

function render(ctx, s) {
  const photo = f => `${ASSET_BASE}/photos/${ctx}/${encodeURIComponent(f)}`;
  // Skip photos listed in strings.json that haven't been added to the folder yet.
  const exists = f => fs.existsSync(path.join(CONTENT_DIR, ctx, 'photos', path.basename(f)));
  const head = h => `<div class="section-head reveal"><div><div class="kicker">${h.kicker}</div><h2>${h.title}</h2></div>${h.blurb ? `<p>${h.blurb}</p>` : ''}</div>`;

  const chapters = s.story.chapters.filter(c => exists(c.photo));
  const travel = s.travel;
  // Collage captions default to the file name, e.g. "kerala-church-from-the-lighthouse.jpg".
  const withCaption = i => (typeof i === 'string' ? { file: i } : i);
  const scenes = travel ? travel.scenes.filter(i => exists(i.file)) : [];
  const collage = travel && travel.collage
    ? travel.collage.photos.map(withCaption).filter(i => exists(i.file))
        .map(i => ({ ...i, caption: i.caption || captionFromFile(i.file), ...jpegSize(path.join(CONTENT_DIR, ctx, 'photos', i.file)) }))
    : [];
  // A project shows its YouTube demo, else a local preview image (linked to the live site if any),
  // else a plain title card.
  const projectMedia = (p, cls) => {
    const href = p.video ? `https://www.youtube.com/watch?v=${p.video}` : p.link;
    const inner = p.video ? `<img src="https://i.ytimg.com/vi/${attr(p.video)}/hqdefault.jpg" alt="${attr(p.title)} demo preview" loading="lazy">`
      : p.image && exists(p.image) ? `<img src="${photo(p.image)}" alt="${attr(p.title)} preview" loading="lazy">`
      : `<span class="title-card">${p.title}</span>`;
    const kind = p.video ? ' data-play' : '';
    return href
      ? `   <a href="${attr(href)}" target="_blank" rel="noopener" aria-label="Open ${attr(p.title)}" data-story-img${kind}${cls}>${inner}</a>`
      : `   <div data-story-img${cls}>${inner}</div>`;
  };
  // Three columns, each drifting at its own parallax speed.
  const columns = [[], [], []];
  collage.forEach((i, n) => columns[n % 3].push(i));
  const principles = s.principles;
  const projects = s.projects;
  const gallery = s.photos ? s.photos.items.filter(i => exists(i.file)) : [];

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="theme-color" content="#f7f4ed">
${s.meta.noindex ? '<meta name="robots" content="noindex,nofollow">\n' : ''}<title>${s.meta.title}</title>
<link rel="stylesheet" href="${ASSET_BASE}/styles.css">
</head>
<body>
<div class="grain"></div><div class="cursor-dot" id="cursor"></div>
<nav><a href="#top" class="brand" style="text-decoration:none">OMKAR<span>✳</span></a><div class="navlinks">${s.nav.links.map(l => `<a href="${attr(l.href)}">${l.label}</a>`).join('')}</div><a href="#hello" class="pill">${s.nav.cta}</a></nav>
<main id="top">
<section class="hero">
 <div class="hero-copy" data-parallax="-0.35" data-hero-fade>
  <div class="eyebrow"><i class="pulse"></i> ${s.hero.eyebrow}</div>
  <h1>${s.hero.greeting}<br>I'm <span class="highlight">${s.hero.name}</span><span class="serif">.</span></h1>
  <p class="intro">${s.hero.intro}</p>
  <div class="hero-actions"><a class="pill" href="#story">${s.hero.primaryCta}</a>${s.hero.secondaryCta ? `<a class="textlink" href="${attr(s.hero.secondaryHref || '#hello')}">${s.hero.secondaryCta}</a>` : ''}</div>
 </div>
 <div class="hero-art">
  <div class="orbit" data-parallax="0.08"></div>
  <div class="photo-main" data-parallax="0.15" data-hero-zoom><img src="${photo(s.hero.photo)}" alt="${attr(s.hero.photoAlt)}"></div>
  <div class="sticker star" data-parallax="-0.3">${s.hero.stickerStar}</div><div class="sticker note" data-parallax="0.35">${s.hero.stickerNote}</div>
  <div class="scribble" data-parallax="-0.15">${s.hero.scribble}</div>
 </div>
 <div class="scrollhint">Keep scrolling <span>↓</span></div>
</section>

<section id="story" class="story-wrap">
 ${head(s.story)}
 <div class="story" data-highlight>
  <div class="story-media"><figure class="story-frame">
${chapters.map((c, n) => `   <img src="${photo(c.photo)}" alt="${attr(c.alt)}"${n ? ' loading="lazy"' : ''} data-story-img="${n}"${n ? '' : ' class="active"'}>`).join('\n')}
   <figcaption class="story-count"><span data-story-num>01</span> / ${String(chapters.length).padStart(2, '0')}</figcaption>
  </figure></div>
  <div class="story-steps">
${chapters.map((c, n) => `   <article class="step${n ? '' : ' active'}" data-step><div class="kicker">${c.kicker}</div><h3>${c.title}</h3><p>${c.body}</p></article>`).join('\n')}
  </div>
 </div>
</section>
${s.quotes ? `
<section id="quotes" class="quotes">
 ${head(s.quotes)}
${s.quotes.items.map(q => ` <figure class="belief"><blockquote data-scrub-words>${q.text}</blockquote>${q.by ? `<figcaption class="reveal">— ${q.by}</figcaption>` : ''}</figure>`).join('\n')}
</section>` : ''}
${principles ? `
<section id="how">
 ${head(principles)}
 <div class="split" data-highlight>
  ${principles.core ? venn(principles) : `<p class="quote" data-scrub-words>${principles.quote}</p>`}
  <div class="principles">
${principles.items.map((p, n) => `   <article class="principle${n ? '' : ' active'}" data-step>${p.label ? `<div class="kicker">${String(n + 1).padStart(2, '0')} — ${flat(p.label)}</div>` : ''}<h3>${p.title}</h3><p>${p.body}</p></article>`).join('\n')}
  </div>
 </div>
</section>` : ''}
${projects ? `
<section id="projects" class="story-wrap">
 ${head(projects)}
 <div class="story projects" data-highlight>
  <div class="story-media"><figure class="story-frame wide">
${projects.items.map((p, n) => projectMedia(p, n ? '' : ' class="active"')).join('\n')}
   <figcaption class="story-count"><span data-story-num>01</span> / ${String(projects.items.length).padStart(2, '0')}</figcaption>
  </figure></div>
  <div class="story-steps">
${projects.items.map((p, n) => `   <article class="step${n ? '' : ' active'}" data-step><div class="kicker">${p.kind} · ${p.when}</div><h3>${p.title}</h3><p>${p.body}</p>${(p.stats || []).map(st => `<div class="stat"><strong>${st.value}</strong><span>${st.label}</span></div>`).join('')}<ul class="tags">${p.tech.map(t => `<li>${t}</li>`).join('')}</ul></article>`).join('\n')}
  </div>
 </div>
</section>` : ''}
</main>
${travel ? `
<section id="travel" class="travel">
 <div class="interlude">
  <div class="kicker reveal">${travel.kicker}</div>
  <p class="statement" data-scrub-words>${travel.statement}</p>
  <p class="interlude-sub reveal">${travel.sub}</p>
 </div>
${scenes.length ? ` <div class="scenes" data-scenes>
${scenes.map((i, n) => `  <div class="scene" data-scene="${n}"><img src="${photo(i.file)}" alt="${attr(i.alt)}" loading="lazy"><div class="scene-copy"><div class="kicker">${i.kicker}</div><h3>${i.title}</h3><p>${i.caption}</p></div></div>`).join('\n')}
 </div>` : ''}
${collage.length ? ` <div class="collage-wrap">
  ${head(travel.collage)}
  <div class="collage">
${columns.map((col, c) => `   <div class="collage-col" data-parallax="${[-0.05, 0.12, 0.02][c]}">
${col.map(i => `    <figure class="collage-item reveal" data-photo="${photo(i.file)}"><div class="collage-img" style="aspect-ratio:${i.w}/${i.h}"><img src="${photo(i.file)}" alt="${attr(i.caption)}" loading="lazy" data-zoom-out></div><figcaption>${i.caption}</figcaption></figure>`).join('\n')}
   </div>`).join('\n')}
  </div>
 </div>` : ''}
</section>` : ''}
<main>
${gallery.length ? `<section id="photos" class="fan-wrap" style="--n:${gallery.length}" data-fan>
 <div class="fan-sticky">
  ${head(s.photos)}
  <div class="fan-stage">
${gallery.map(i => `   <figure class="polaroid" data-photo="${photo(i.file)}" data-fan-card><img src="${photo(i.file)}" alt="${attr(i.alt)}" loading="lazy"><figcaption>${i.caption}${i.sub ? ` <small>${i.sub}</small>` : ''}</figcaption></figure>`).join('\n')}
  </div>
  ${s.photos.note ? `<div class="gallery-note">${s.photos.note}</div>` : ''}
 </div>
</section>` : ''}
<section id="hello" style="padding-top:35px">
 <div class="looking reveal" data-scale-in><div class="looking-inner"><div class="kicker" style="color:#b7f36b">${s.hello.kicker}</div><h2>${s.hello.title}</h2>${s.hello.paragraphs.map(p => `<p>${p}</p>`).join('')}<a class="pill" href="${attr(s.hello.ctaHref)}">${s.hello.cta}</a></div></div>
</section>
<footer><div><strong>${s.footer.name}</strong><br><span>${s.footer.tagline}</span></div><div class="footer-note">${s.footer.note}</div><a class="backtop" href="#top" aria-label="Back to top">↑</a></footer>
</main>
<div id="lightbox" style="position:fixed;inset:0;z-index:50;background:#101710eF;display:none;align-items:center;justify-content:center;padding:24px;cursor:zoom-out"><button id="close" aria-label="Close photo" style="position:absolute;top:22px;right:25px;background:none;border:1px solid #ffffff66;color:white;border-radius:50%;width:42px;height:42px;font-size:24px;cursor:pointer">×</button><img id="lightbox-img" alt="Expanded photo" style="max-width:min(92vw,1100px);max-height:88vh;object-fit:contain;border-radius:12px;box-shadow:0 20px 80px #0008"></div>
<script src="${ASSET_BASE}/app.js"></script>
</body></html>`;
}

module.exports = { render, loadStrings, CONTEXTS, CONTENT_DIR, ASSETS_DIR, ASSET_BASE };
