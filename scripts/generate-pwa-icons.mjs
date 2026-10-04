/**
 * Generate PWA icons from public/susi-air-logo.png (zero dependencies).
 *
 * The logo asset is 738x186, palette PNG with a solid white background,
 * so icons are composed on a solid white canvas (seamless with the logo).
 *
 * Usage: node scripts/generate-pwa-icons.mjs
 * Output: public/pwa-192x192.png, public/pwa-512x512.png,
 *         public/maskable-icon-512x512.png, public/apple-touch-icon-180x180.png
 */
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const SRC = 'public/susi-air-logo.png';
const OUT_DIR = 'public';

/* ---------------------------------------------------------------- *
 * PNG decode (bit depth 8, colour types 2/6/3, no interlace)
 * ---------------------------------------------------------------- */
function decodePng(buf) {
  if (buf.readUInt32BE(0) !== 0x89504e47) throw new Error('not a PNG');
  let pos = 8;
  let ihdr = null;
  let plte = null;
  let trns = null;
  const idat = [];
  while (pos < buf.length) {
    const len = buf.readUInt32BE(pos);
    const type = buf.toString('ascii', pos + 4, pos + 8);
    const data = buf.subarray(pos + 8, pos + 8 + len);
    if (type === 'IHDR') {
      ihdr = {
        w: data.readUInt32BE(0),
        h: data.readUInt32BE(4),
        depth: data[8],
        color: data[9],
        interlace: data[12],
      };
    } else if (type === 'IDAT') idat.push(data);
    else if (type === 'PLTE') plte = data;
    else if (type === 'tRNS') trns = data;
    pos += 12 + len;
  }
  if (!ihdr || ihdr.depth !== 8) throw new Error('unsupported PNG (depth)');
  if (ihdr.interlace) throw new Error('unsupported PNG (interlaced)');
  const channels = { 0: 1, 2: 3, 3: 1, 4: 2, 6: 4 }[ihdr.color];
  if (!channels) throw new Error('unsupported PNG (colour type)');

  const raw = zlib.inflateSync(Buffer.concat(idat));
  const stride = ihdr.w * channels;
  const out = Buffer.alloc(ihdr.h * stride);
  let prev = Buffer.alloc(stride);
  let p = 0;
  for (let y = 0; y < ihdr.h; y++) {
    const filter = raw[p++];
    const line = raw.subarray(p, p + stride);
    p += stride;
    const cur = Buffer.alloc(stride);
    for (let i = 0; i < stride; i++) {
      const a = i >= channels ? cur[i - channels] : 0;
      const b = prev[i];
      const c = i >= channels ? prev[i - channels] : 0;
      let v = line[i];
      switch (filter) {
        case 0: break;
        case 1: v = (v + a) & 255; break;
        case 2: v = (v + b) & 255; break;
        case 3: v = (v + ((a + b) >> 1)) & 255; break;
        case 4: {
          const pp = a + b - c;
          const pa = Math.abs(pp - a);
          const pb = Math.abs(pp - b);
          const pc = Math.abs(pp - c);
          v = (v + (pa <= pb && pa <= pc ? a : pb <= pc ? b : c)) & 255;
          break;
        }
        default: throw new Error('unsupported PNG filter');
      }
      cur[i] = v;
    }
    cur.copy(out, y * stride);
    prev = cur;
  }

  // Normalize to RGBA
  const rgba = Buffer.alloc(ihdr.w * ihdr.h * 4);
  for (let i = 0; i < ihdr.w * ihdr.h; i++) {
    if (ihdr.color === 6) {
      out.copy(rgba, i * 4, i * 4, i * 4 + 4);
    } else if (ihdr.color === 2) {
      rgba[i * 4] = out[i * 3];
      rgba[i * 4 + 1] = out[i * 3 + 1];
      rgba[i * 4 + 2] = out[i * 3 + 2];
      rgba[i * 4 + 3] = 255;
    } else if (ihdr.color === 3) {
      const idx = out[i];
      rgba[i * 4] = plte[idx * 3];
      rgba[i * 4 + 1] = plte[idx * 3 + 1];
      rgba[i * 4 + 2] = plte[idx * 3 + 2];
      rgba[i * 4 + 3] = trns && idx < trns.length ? trns[idx] : 255;
    } else if (ihdr.color === 4) {
      rgba[i * 4] = out[i * 2];
      rgba[i * 4 + 1] = out[i * 2];
      rgba[i * 4 + 2] = out[i * 2];
      rgba[i * 4 + 3] = out[i * 2 + 1];
    }
  }
  return { w: ihdr.w, h: ihdr.h, data: rgba };
}

/* ---------------------------------------------------------------- *
 * PNG encode (RGBA, 8 bit, no interlace, filter 0)
 * ---------------------------------------------------------------- */
function crc32(buf) {
  let c;
  const table = crc32.table || (crc32.table = (() => {
    const t = new Int32Array(256);
    for (let n = 0; n < 256; n++) {
      c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      t[n] = c;
    }
    return t;
  })());
  let crc = -1;
  for (let i = 0; i < buf.length; i++) crc = table[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  return (crc ^ -1) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

function encodePng(width, height, rgba) {
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // RGBA
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;
  const stride = width * 4;
  const raw = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (stride + 1)] = 0; // filter: none
    rgba.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride);
  }
  return Buffer.concat([
    sig,
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

/* ---------------------------------------------------------------- *
 * Resize (box/area average) + compose icon
 * ---------------------------------------------------------------- */
function resize(src, tw, th) {
  const dst = Buffer.alloc(tw * th * 4);
  const xr = src.w / tw;
  const yr = src.h / th;
  for (let y = 0; y < th; y++) {
    const y0 = Math.floor(y * yr);
    const y1 = Math.max(y0 + 1, Math.floor((y + 1) * yr));
    for (let x = 0; x < tw; x++) {
      const x0 = Math.floor(x * xr);
      const x1 = Math.max(x0 + 1, Math.floor((x + 1) * xr));
      let r = 0, g = 0, b = 0, a = 0, n = 0;
      for (let sy = y0; sy < y1; sy++) {
        for (let sx = x0; sx < x1; sx++) {
          const i = (sy * src.w + sx) * 4;
          const w = src.data[i + 3];
          r += src.data[i] * w;
          g += src.data[i + 1] * w;
          b += src.data[i + 2] * w;
          a += w;
          n++;
        }
      }
      const d = (y * tw + x) * 4;
      if (a === 0) {
        dst[d] = dst[d + 1] = dst[d + 2] = 0;
        dst[d + 3] = 0;
      } else {
        dst[d] = Math.round(r / a);
        dst[d + 1] = Math.round(g / a);
        dst[d + 2] = Math.round(b / a);
        dst[d + 3] = Math.round(a / n);
      }
    }
  }
  return { w: tw, h: th, data: dst };
}

function makeIcon(canvasSize, logoWidthRatio) {
  const logo = decodePng(fs.readFileSync(SRC));
  const tw = Math.round(canvasSize * logoWidthRatio);
  const th = Math.max(1, Math.round((tw * logo.h) / logo.w));
  const scaled = resize(logo, tw, th);

  const canvas = Buffer.alloc(canvasSize * canvasSize * 4, 255); // opaque white
  const ox = Math.round((canvasSize - tw) / 2);
  const oy = Math.round((canvasSize - th) / 2);
  for (let y = 0; y < th; y++) {
    const srcRow = y * tw * 4;
    const dstRow = ((oy + y) * canvasSize + ox) * 4;
    // alpha-composite logo over white (logo bg is white, but stay correct)
    for (let x = 0; x < tw; x++) {
      const s = srcRow + x * 4;
      const d = dstRow + x * 4;
      const a = scaled.data[s + 3];
      if (a === 255) {
        canvas[d] = scaled.data[s];
        canvas[d + 1] = scaled.data[s + 1];
        canvas[d + 2] = scaled.data[s + 2];
      } else if (a > 0) {
        const inv = 1 - a / 255;
        canvas[d] = Math.round(scaled.data[s] * (a / 255) + canvas[d] * inv);
        canvas[d + 1] = Math.round(scaled.data[s + 1] * (a / 255) + canvas[d + 1] * inv);
        canvas[d + 2] = Math.round(scaled.data[s + 2] * (a / 255) + canvas[d + 2] * inv);
      }
    }
  }
  return encodePng(canvasSize, canvasSize, canvas);
}

const targets = [
  { file: 'pwa-192x192.png', size: 192, ratio: 0.8 },
  { file: 'pwa-512x512.png', size: 512, ratio: 0.8 },
  // Maskable: content must stay inside the inner 80% circle
  { file: 'maskable-icon-512x512.png', size: 512, ratio: 0.64 },
  { file: 'apple-touch-icon-180x180.png', size: 180, ratio: 0.78 },
];

for (const t of targets) {
  const png = makeIcon(t.size, t.ratio);
  const out = path.join(OUT_DIR, t.file);
  fs.writeFileSync(out, png);
  console.log(`✓ ${out} (${t.size}x${t.size}, ${png.length} bytes)`);
}
