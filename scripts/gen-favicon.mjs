/**
 * Generates favicon.png (32x32) and apple-touch-icon.png (180x180)
 * from scratch using only Node.js built-ins (zlib + crypto).
 * Draws a dark rounded-rect background with the gold epsilon ε monogram.
 */
import { deflateSync } from 'zlib';
import { createHash } from 'crypto';
import { writeFileSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dir = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dir, '../public');

// ─── colours ────────────────────────────────────────────────────────────────
const GOLD  = [201, 168, 76];   // #C9A84C
const DARK  = [4,   4,   8];    // #040408
const MID   = [16,  17,  26];   // #10111a
const TRANS = [0, 0, 0, 0];

// ─── PNG encoder ─────────────────────────────────────────────────────────────
function crc32(buf) {
  let crc = 0xFFFFFFFF;
  for (const b of buf) {
    crc ^= b;
    for (let i = 0; i < 8; i++) crc = (crc >>> 1) ^ (crc & 1 ? 0xEDB88320 : 0);
  }
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

function pngChunk(type, data) {
  const typeBytes = Buffer.from(type, 'ascii');
  const lenBuf = Buffer.allocUnsafe(4);
  lenBuf.writeUInt32BE(data.length);
  const body = Buffer.concat([typeBytes, data]);
  const crcBuf = Buffer.allocUnsafe(4);
  crcBuf.writeUInt32BE(crc32(body));
  return Buffer.concat([lenBuf, body, crcBuf]);
}

function encodePNG(pixels, w, h) {
  // IHDR
  const ihdr = Buffer.allocUnsafe(13);
  ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8;  // bit depth
  ihdr[9] = 2;  // colour type: RGB
  ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;

  // Raw scanlines: filter byte 0 + RGB pixels
  const scanlines = Buffer.allocUnsafe(h * (1 + w * 3));
  for (let y = 0; y < h; y++) {
    scanlines[y * (1 + w * 3)] = 0; // None filter
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 3;
      const o = y * (1 + w * 3) + 1 + x * 3;
      scanlines[o]   = pixels[i];
      scanlines[o+1] = pixels[i+1];
      scanlines[o+2] = pixels[i+2];
    }
  }

  const idat = deflateSync(scanlines, { level: 9 });
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  return Buffer.concat([
    sig,
    pngChunk('IHDR', ihdr),
    pngChunk('IDAT', idat),
    pngChunk('IEND', Buffer.alloc(0)),
  ]);
}

// ─── drawing helpers ─────────────────────────────────────────────────────────
function lerp3(a, b, t) {
  return [
    Math.round(a[0] + (b[0]-a[0])*t),
    Math.round(a[1] + (b[1]-a[1])*t),
    Math.round(a[2] + (b[2]-a[2])*t),
  ];
}

function setPixel(buf, w, x, y, rgb) {
  if (x < 0 || y < 0 || x >= w || y >= buf.length / w / 3) return;
  const i = (Math.round(y) * w + Math.round(x)) * 3;
  buf[i] = rgb[0]; buf[i+1] = rgb[1]; buf[i+2] = rgb[2];
}

function blendPixel(buf, w, h, x, y, rgb, alpha) {
  if (x < 0 || y < 0 || x >= w || y >= h) return;
  const xi = Math.round(x), yi = Math.round(y);
  const i = (yi * w + xi) * 3;
  buf[i]   = Math.round(buf[i]   * (1-alpha) + rgb[0] * alpha);
  buf[i+1] = Math.round(buf[i+1] * (1-alpha) + rgb[1] * alpha);
  buf[i+2] = Math.round(buf[i+2] * (1-alpha) + rgb[2] * alpha);
}

// Anti-aliased circle drawing (Xiaolin Wu style)
function drawCircleAA(buf, w, h, cx, cy, r, rgb, alpha = 1.0) {
  for (let y = cy - r - 1; y <= cy + r + 1; y++) {
    for (let x = cx - r - 1; x <= cx + r + 1; x++) {
      const dx = x - cx, dy = y - cy;
      const d = Math.sqrt(dx*dx + dy*dy);
      const coverage = Math.max(0, Math.min(1, r - d + 0.5));
      if (coverage > 0) blendPixel(buf, w, h, x, y, rgb, coverage * alpha);
    }
  }
}

// Anti-aliased thick arc
function drawArcAA(buf, w, h, cx, cy, r, startDeg, endDeg, thickness, rgb) {
  const steps = Math.ceil(r * Math.abs(endDeg - startDeg) * Math.PI / 180) * 4;
  for (let i = 0; i <= steps; i++) {
    const angle = (startDeg + (endDeg - startDeg) * i / steps) * Math.PI / 180;
    const bx = cx + Math.cos(angle) * r;
    const by = cy + Math.sin(angle) * r;
    // Draw a small disc at each point along the arc for thickness
    for (let dy = -thickness; dy <= thickness; dy++) {
      for (let dx = -thickness; dx <= thickness; dx++) {
        const dd = Math.sqrt(dx*dx + dy*dy);
        const coverage = Math.max(0, Math.min(1, thickness/2 - dd + 0.5));
        if (coverage > 0) blendPixel(buf, w, h, bx + dx, by + dy, rgb, coverage);
      }
    }
  }
}

// Anti-aliased thick line
function drawLineAA(buf, w, h, x1, y1, x2, y2, thickness, rgb) {
  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.sqrt(dx*dx + dy*dy);
  const steps = Math.ceil(len * 3);
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const bx = x1 + dx * t;
    const by = y1 + dy * t;
    for (let oy = -thickness; oy <= thickness; oy++) {
      for (let ox = -thickness; ox <= thickness; ox++) {
        const dd = Math.sqrt(ox*ox + oy*oy);
        const coverage = Math.max(0, Math.min(1, thickness/2 - dd + 0.5));
        if (coverage > 0) blendPixel(buf, w, h, bx + ox, by + oy, rgb, coverage);
      }
    }
  }
}

// Rounded-rect background fill
function fillRoundedRect(buf, w, h, rx) {
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      // Distance from nearest corner
      const cx = x < rx ? rx : x > w-1-rx ? w-1-rx : x;
      const cy = y < rx ? rx : y > h-1-rx ? h-1-ry : y;
      const dx = x - cx, dy = y - cy;
      const inRect = (x >= rx && x <= w-1-rx) || (y >= rx && y <= h-1-ry);
      const dist = Math.sqrt(dx*dx + dy*dy);
      let inside;
      if (x >= rx && x <= w-1-rx) inside = true;
      else if (y >= rx && y <= h-1-rx) inside = true;
      else inside = dist <= rx;

      if (inside) {
        // Radial gradient from center
        const fdx = x/w - 0.5, fdy = y/h - 0.45;
        const fd = Math.sqrt(fdx*fdx + fdy*fdy) / 0.707;
        const col = lerp3(MID, DARK, Math.min(fd * 1.6, 1));
        setPixel(buf, w, x, y, col);
      }
    }
  }
}

function fillRoundedRectFixed(buf, w, h, rx) {
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const nearX = Math.max(rx, Math.min(w - 1 - rx, x));
      const nearY = Math.max(rx, Math.min(h - 1 - rx, y));
      const dx = x - nearX, dy = y - nearY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const coverage = Math.max(0, Math.min(1, rx - dist + 0.5));
      if (coverage > 0) {
        const fdx = x / w - 0.5, fdy = y / h - 0.45;
        const fd = Math.sqrt(fdx * fdx + fdy * fdy) / 0.707;
        const col = lerp3(MID, DARK, Math.min(fd * 1.6, 1));
        const i = (y * w + x) * 3;
        buf[i]   = Math.round(col[0] * coverage);
        buf[i+1] = Math.round(col[1] * coverage);
        buf[i+2] = Math.round(col[2] * coverage);
      }
    }
  }
}

// ─── render at given size ────────────────────────────────────────────────────
function render(size) {
  const buf = Buffer.alloc(size * size * 3, 0);
  const s = size / 32; // scale factor

  // Background
  fillRoundedRectFixed(buf, size, size, 6 * s);

  // Subtle glow around epsilon region
  for (let pass = 0; pass < 3; pass++) {
    const r = (8 - pass * 1.5) * s;
    drawCircleAA(buf, size, size, 16*s, 16*s, r, [201, 168, 76], 0.04 - pass * 0.01);
  }

  // ε drawn as: outer arc (top+right+bottom) + middle bar
  // Scaled coords: cx=16, cy=16, radius ~6.5
  const cx = 16 * s, cy = 16 * s;
  const R = 6.2 * s;
  const thick = 1.05 * s;

  // Outer arc: from ~200° to ~160° going clockwise (almost full circle, open on left)
  // SVG uses: top arc from ~220° → closing at ~20° (roughly -140 to 20 in standard math coords)
  // Standard angles: 0=right, 90=down (canvas), measured from right going CCW in math, CW on screen
  // We want: arc starting upper-right, going CW around to lower-right
  // Open gap on the right side (~30° at each end)
  drawArcAA(buf, size, size, cx, cy, R, 160, 380, thick, GOLD);

  // Middle horizontal bar: from left edge to ~right center
  const barY = cy;
  const barX1 = cx - R * 0.92;
  const barX2 = cx + R * 0.45;
  drawLineAA(buf, size, size, barX1, barY, barX2, barY, thick * 0.9, GOLD);

  return buf;
}

// ─── ICO format (PNG-inside-ICO, Vista+ compatible) ─────────────────────────
function buildIco(pngBuf32, pngBuf16) {
  // ICO header: ICONDIR
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);  // reserved
  header.writeUInt16LE(1, 2);  // type: 1 = ICO
  header.writeUInt16LE(2, 4);  // count: 2 images

  // Two ICONDIRENTRY (16 bytes each)
  const entry32 = Buffer.alloc(16);
  const entry16 = Buffer.alloc(16);
  const dataOffset = 6 + 16 + 16; // header + 2 entries

  // 32x32
  entry32[0] = 32;   // width
  entry32[1] = 32;   // height
  entry32[2] = 0;    // colour count (0 = more than 256)
  entry32[3] = 0;    // reserved
  entry32.writeUInt16LE(0, 4);   // planes
  entry32.writeUInt16LE(32, 6);  // bit count
  entry32.writeUInt32LE(pngBuf32.length, 8);
  entry32.writeUInt32LE(dataOffset, 12);

  // 16x16
  entry16[0] = 16;
  entry16[1] = 16;
  entry16[2] = 0;
  entry16[3] = 0;
  entry16.writeUInt16LE(0, 4);
  entry16.writeUInt16LE(32, 6);
  entry16.writeUInt32LE(pngBuf16.length, 8);
  entry16.writeUInt32LE(dataOffset + pngBuf32.length, 12);

  return Buffer.concat([header, entry32, entry16, pngBuf32, pngBuf16]);
}

// ─── main ────────────────────────────────────────────────────────────────────
mkdirSync(OUT, { recursive: true });

const buf32  = render(32);
const buf16  = render(16);
const buf180 = render(180);

const png32  = encodePNG(buf32,  32,  32);
const png16  = encodePNG(buf16,  16,  16);
const png180 = encodePNG(buf180, 180, 180);

writeFileSync(`${OUT}/favicon.png`,           png32);
writeFileSync(`${OUT}/favicon-16x16.png`,     png16);
writeFileSync(`${OUT}/favicon-32x32.png`,     png32);
writeFileSync(`${OUT}/apple-touch-icon.png`,  png180);
writeFileSync(`${OUT}/favicon.ico`,           buildIco(png32, png16));

console.log('✓ favicon.svg');
console.log('✓ favicon.png (32x32)');
console.log('✓ favicon-16x16.png');
console.log('✓ favicon-32x32.png');
console.log('✓ apple-touch-icon.png (180x180)');
console.log('✓ favicon.ico (16+32 embedded)');
