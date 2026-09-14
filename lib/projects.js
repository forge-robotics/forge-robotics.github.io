// Research projects, read from the FORGE projects Google Sheet.
//
// Columns: Project | Subtitle | Description | Theme | Topics | Citation IDs | Archieve | Figure Links
//
// Citation IDs holds the publication IDs (J6; C9; W5) from the publications sheet —
// that column is the single join between a project and its papers.
// Archieve = "Yes" moves a project behind the Earlier work filter.
//
// Falls back to data/projects.json if the sheet is unreachable.

import { csvUrl, parseCSV, toObjects, splitList, slug, driveImage } from './sheets.js';

export const SHEET_ID = '1MKjyH02642hGNYE2Aae4Jmr3_qGZAz5r7U7g1ArDDac';

const yes = v => /^(y|yes|true)$/i.test(String(v || '').trim());

// The sheet spells themes in prose; tolerate case and the occasional typo.
const THEME_KEYS = {
  represent: 'represent',
  realize: 'realize',
  react: 'react',
  reason: 'reason',
  reson: 'reason'
};

function fromSheet(r) {
  return {
    key: slug(r.project),
    title: r.project,
    subtitle: r.subtitle || '',
    blurb: r.description || '',
    themes: splitList(r.theme).map(t => THEME_KEYS[t.toLowerCase()] || t.toLowerCase()),
    topics: splitList(r.topics),
    citationIds: splitList(r['citation ids']).map(s => s.toUpperCase()),
    figure: driveImage(r['figure links'] || r['figure link'], 1200),
    era: yes(r.archieve || r.archive) ? 'earlier' : ''
  };
}

function fromLocal(p) {
  return {
    key: p.key || slug(p.title),
    title: p.title,
    subtitle: p.subtitle || '',
    blurb: p.blurb || '',
    themes: (p.themes || []).map(t => String(t).toLowerCase()),
    topics: p.topics || [],
    citationIds: [],
    figure: '',
    era: p.era || ''
  };
}

export function loadProjects() {
  const local = () => fetch('data/projects.json')
    .then(r => r.ok ? r.json() : { projects: [] })
    .then(d => (d.projects || []).map(fromLocal))
    .catch(() => []);

  if (!SHEET_ID) return local();

  return fetch(csvUrl(SHEET_ID))
    .then(r => r.ok ? r.text() : Promise.reject())
    .then(t => {
      const rows = toObjects(parseCSV(t), 'project');
      if (!rows.length) return Promise.reject();
      return rows.map(fromSheet);
    })
    .catch(local);
}
