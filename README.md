# forge-robotics.github.io

Static site for the FORGE Lab at NC State University. No build step — commit these files to the repository root and GitHub Pages serves them.

## Pages
- `index.html` — landing page
- `people.html`, `research.html`, `publications.html`, `news.html`, `join-us.html`, `lab-members.html`

## Editing content
Text and layout live in the HTML files. Lists are loaded from JSON at runtime, so these can be edited without touching markup:

- `data/people.json` — lab roster
- `data/projects.json` — research threads
- `data/publications.json` — publication list
- `data/news.json` — news items
- `data/lab-resources.json` — internal links

## Images
Project, news, and portrait images are drop targets. Replace them by adding files to `assets/` and pointing the corresponding `<image-slot>` at them, or ask for the slots to be swapped for plain `<img>` tags.

## Notes
- `.nojekyll` is required: GitHub Pages otherwise ignores the `_ds/` directory because of the leading underscore.
- To use a custom domain, add a `CNAME` file containing the domain.
