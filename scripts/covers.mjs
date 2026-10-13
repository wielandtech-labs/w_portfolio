// Generates the case-study cover SVGs in src/assets/covers/ (committed).
// Usage: node scripts/covers.mjs src/assets/covers
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

const out = process.argv[2];
const W = 1600, H = 900;
// Same palette as the site: black, off-white, one signal orange. Flat, no gradients.
const A = '#ff4d00', A2 = '#f4f4f0', FG = '#f4f4f0', MU = '#a6a6a0';
const SANS = "'Inter Tight', Inter, 'Arial Black', Arial, sans-serif";

const frame = (title, kicker, art) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
<defs>
<pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse"><path d="M80 0H0V80" fill="none" stroke="#ffffff" stroke-opacity="0.07" stroke-width="1"/></pattern>
</defs>
<rect width="${W}" height="${H}" fill="#0a0a0a"/>
<rect width="${W}" height="${H}" fill="url(#grid)"/>
<rect x="0" y="0" width="${W}" height="14" fill="${A}"/>
${art}
<rect x="96" y="680" width="${W - 192}" height="6" fill="${FG}"/>
<text x="96" y="736" font-family="'JetBrains Mono', Consolas, monospace" font-size="28" font-weight="700" fill="${MU}" letter-spacing="3">${kicker}</text>
<text x="96" y="838" font-family="${SANS}" font-size="104" font-weight="900" fill="${FG}" letter-spacing="-3">${title.toUpperCase()}<tspan fill="${A}">.</tspan></text>
</svg>
`;

// Seeded PRNG so the output is stable between runs.
let seed = 7;
const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);

function bars() {
  let s = '';
  const n = 26, x0 = 760, w = 26, gap = 6, base = 600;
  for (let i = 0; i < n; i++) {
    const h = 60 + Math.round((Math.sin(i / 3) + 1.4) * 90 * rnd() + 40 * rnd());
    const spike = i === 19 ? 180 : 0;
    s += `<rect x="${x0 + i * (w + gap)}" y="${base - h - spike}" width="${w}" height="${h + spike}" fill="${i === 19 ? A : A2}" fill-opacity="${i === 19 ? 1 : 0.35}"/>`;
  }
  s += `<line x1="${x0}" y1="${base + 2}" x2="${x0 + n * (w + gap)}" y2="${base + 2}" stroke="${MU}" stroke-opacity="0.4" stroke-width="2"/>`;
  return s;
}

function qr(x0, y0, cells, size, density) {
  let s = '';
  const finder = (fx, fy) =>
    `<rect x="${fx}" y="${fy}" width="${size * 7}" height="${size * 7}" fill="none" stroke="${A}" stroke-width="${size}"/>` +
    `<rect x="${fx + size * 2}" y="${fy + size * 2}" width="${size * 3}" height="${size * 3}" fill="${A}"/>`;
  for (let r = 0; r < cells; r++)
    for (let c = 0; c < cells; c++) {
      const inFinder = (r < 8 && c < 8) || (r < 8 && c >= cells - 8) || (r >= cells - 8 && c < 8);
      if (inFinder || rnd() > density) continue;
      s += `<rect x="${x0 + c * size + size * 0.1}" y="${y0 + r * size + size * 0.1}" width="${size * 0.8}" height="${size * 0.8}" fill="${A2}" fill-opacity="0.75"/>`;
    }
  s += finder(x0 + size * 0.5, y0 + size * 0.5);
  s += finder(x0 + (cells - 7.5) * size, y0 + size * 0.5);
  s += finder(x0 + size * 0.5, y0 + (cells - 7.5) * size);
  return s;
}

function cluster() {
  const nodes = [
    [1000, 200], [1320, 330], [1180, 560], [880, 470], [1420, 120], [760, 230],
  ];
  const edges = [[0, 1], [1, 2], [2, 3], [3, 0], [0, 2], [1, 4], [0, 5], [3, 5]];
  let s = '';
  for (const [a, b] of edges)
    s += `<line x1="${nodes[a][0]}" y1="${nodes[a][1]}" x2="${nodes[b][0]}" y2="${nodes[b][1]}" stroke="${A2}" stroke-opacity="0.45" stroke-width="3"/>`;
  nodes.forEach(([x, y], i) => {
    const big = i < 4;
    s += `<rect x="${x - (big ? 56 : 36)}" y="${y - (big ? 40 : 26)}" width="${big ? 112 : 72}" height="${big ? 80 : 52}" fill="#0b0f14" stroke="${big ? A : A2}" stroke-width="3"/>`;
    if (big)
      for (let k = 0; k < 3; k++)
        s += `<rect x="${x - 36}" y="${y - 22 + k * 16}" width="72" height="8" fill="${A}" fill-opacity="${0.9 - k * 0.25}"/>`;
  });
  return s;
}

function split() {
  // Revenue split: one pool, proportional slices to venues.
  let s = qr(820, 150, 21, 14, 0.45);
  const shares = [0.42, 0.27, 0.19, 0.12];
  let y = 170;
  shares.forEach((p, i) => {
    s += `<rect x="1180" y="${y}" width="${Math.round(300 * p / 0.42)}" height="44" fill="${A}" fill-opacity="${1 - i * 0.2}"/>`;
    s += `<text x="1180" y="${y + 80}" font-family="'JetBrains Mono', Consolas, monospace" font-size="22" fill="${MU}">venue ${String.fromCharCode(65 + i)} · ${Math.round(p * 100)}%</text>`;
    y += 108;
  });
  return s;
}

function domains() {
  const box = (x, y, label, hi) =>
    `<rect x="${x}" y="${y}" width="420" height="96" fill="#0b0f14" stroke="${hi ? A : A2}" stroke-width="3"/>` +
    `<text x="${x + 32}" y="${y + 60}" font-family="'JetBrains Mono', Consolas, monospace" font-size="30" fill="${FG}">${label}</text>`;
  let s = box(1060, 110, 'wielandtech.com', true) + box(1060, 330, 'raphaelwieland.com', false);
  s += `<rect x="720" y="210" width="220" height="160" fill="#0b0f14" stroke="${A}" stroke-width="3"/>`;
  s += `<text x="830" y="282" text-anchor="middle" font-family="'JetBrains Mono', Consolas, monospace" font-size="28" fill="${A}">django</text>`;
  s += `<text x="830" y="322" text-anchor="middle" font-family="'JetBrains Mono', Consolas, monospace" font-size="22" fill="${MU}">1 image</text>`;
  s += `<path d="M940 270 C1000 270 1000 158 1060 158" fill="none" stroke="${A}" stroke-width="3"/>`;
  s += `<path d="M940 310 C1000 310 1000 378 1060 378" fill="none" stroke="${A2}" stroke-width="3"/>`;
  s += `<rect x="1060" y="520" width="440" height="64" fill="${A}" fill-opacity="0.12" stroke="${A}" stroke-opacity="0.5"/>`;
  s += `<text x="1092" y="562" font-family="'JetBrains Mono', Consolas, monospace" font-size="21" fill="${A}">CI: build → review app → prod</text>`;
  return s;
}

const covers = {
  'warn-index': frame('WARN Index', 'LAYOFF NOTICES · 48 JURISDICTIONS', bars()),
  r12d: frame('r12d', 'QR STICKERS · SHORT LINKS · INVENTORY', qr(900, 110, 25, 22, 0.5)),
  homelab: frame('K3s homelab', 'GITOPS · REVIEW APPS · OBSERVABILITY', cluster()),
  'piss-poor-idea': frame('Piss Poor Idea', 'RESTROOM QR AD NETWORK', split()),
  'w-tech': frame('One app, two domains', 'DJANGO · CI-GATED DEPLOYS', domains()),
  // Site-wide Open Graph image (not a case study).
  default: frame('WielandTech', 'PRODUCTION SYSTEMS, END TO END', bars()),
};

for (const [name, svg] of Object.entries(covers)) writeFileSync(join(out, `${name}.svg`), svg);
console.log('wrote', Object.keys(covers).length, 'covers to', out);
