// Shared CSV helpers for the Google-Sheet-backed data sources.

export function parseCSV(text) {
  const rows = [];
  let row = [], cell = '', quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"') { if (text[i + 1] === '"') { cell += '"'; i++; } else quoted = false; }
      else cell += c;
    } else if (c === '"') quoted = true;
    else if (c === ',') { row.push(cell); cell = ''; }
    else if (c === '\n') { row.push(cell); rows.push(row); row = []; cell = ''; }
    else if (c !== '\r') cell += c;
  }
  if (cell.length || row.length) { row.push(cell); rows.push(row); }
  return rows;
}

// headers=1 is required: every column is text, so gviz would otherwise fold the
// first data row into the header.
export const csvUrl = id =>
  'https://docs.google.com/spreadsheets/d/' + id + '/gviz/tq?tqx=out:csv&headers=1';

export function toObjects(rows, required) {
  if (!rows.length) return [];
  const head = rows[0].map(h => h.trim().toLowerCase());
  return rows.slice(1).map(r => {
    const o = {};
    head.forEach((h, i) => { if (h) o[h] = (r[i] || '').trim(); });
    return o;
  }).filter(o => o[required]);
}

export const splitList = s =>
  String(s || '').split(/[;,]/).map(x => x.trim()).filter(Boolean);

export const slug = s =>
  String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export function driveImage(url, width) {
  if (!url) return '';
  const m = /\/file\/d\/([^/]+)/.exec(url) || /[?&]id=([^&]+)/.exec(url);
  return m ? 'https://drive.google.com/thumbnail?id=' + m[1] + '&sz=w' + (width || 800) : url;
}
