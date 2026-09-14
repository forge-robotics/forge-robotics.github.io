// Publications, read from the FORGE publications Google Sheet.
//
// Columns: Show | ID | Title | Type | Authors | Venue | Year | Status | DOI | Link | Figure Link
//
// Show = "Yes" publishes the row. ID (J6, C9, W5) is what the projects sheet's
// Citation IDs column points at — see lib/projects.js for the join.
//
// Falls back to data/publications.json if the sheet is unreachable.

import { csvUrl, parseCSV, toObjects, driveImage } from './sheets.js';

export const SHEET_ID = '1nuORPI_7pWj2OMgyuQkFTUfBUvny2me5ylmtanrhj10';

function normalise(p) {
  const doi = String(p.doi || '').trim();
  return {
    id: String(p.id || '').toUpperCase(),
    kind: String(p.type || p.kind || '').toLowerCase(),
    title: p.title || '',
    authors: p.authors || '',
    venue: p.venue || '',
    year: p.year || '',
    status: p.status || '',
    doi,
    link: p.link || (doi ? 'https://doi.org/' + doi.replace(/^https?:\/\/doi\.org\//, '') : ''),
    figure: driveImage(p['figure link'], 1200)
  };
}

const shown = r => {
  const v = String(r.show === undefined ? 'yes' : r.show).trim().toLowerCase();
  return v === '' || v === 'yes' || v === 'y' || v === 'true';
};

export function loadPublications() {
  const local = () => fetch('data/publications.json')
    .then(r => r.ok ? r.json() : { publications: [] })
    .then(d => (Array.isArray(d.publications) ? d.publications : []))
    .catch(() => []);

  const rows = SHEET_ID
    ? fetch(csvUrl(SHEET_ID))
        .then(r => r.ok ? r.text() : Promise.reject())
        .then(t => {
          const out = toObjects(parseCSV(t), 'title');
          if (!out.length) return Promise.reject();
          return out;
        })
        .catch(local)
    : local();

  return rows.then(list => list.filter(shown).map(normalise));
}
