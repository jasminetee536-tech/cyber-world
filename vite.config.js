import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const contentFiles = {
  threat: ['src/threat-watch-articles.js'],
  future: ['src/future-research.js', 'src/future-longform.js'],
  encyclopedia: ['src/encyclopedia.js', 'src/editorial.js', 'src/domain-originals.js', 'src/additional-analysis.js', 'src/future-technologies.js', 'src/infrastructure.js'],
  infrastructure: ['src/infrastructure-expansion.js', 'src/infrastructure-intelligence.js'],
  incidents: ['src/incident-data.js', 'src/incident-expansion.js', 'src/incident-weekly.js', 'src/incident-followups.js'],
  analysis: ['src/domain-originals.js', 'src/additional-analysis.js'],
  research: ['src/japan-index-model.js', 'src/jcti.js', 'src/cwri.js'],
};
const root = fileURLToPath(new URL('.', import.meta.url));
const japanDate = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Tokyo' });

function lastContentChange(paths) {
  try {
    const timestamp = execFileSync('git', ['log', '-1', '--format=%cI', '--no-root', '--', ...paths], {
      cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    return timestamp ? japanDate.format(new Date(timestamp)) : null;
  } catch {
    return null;
  }
}

export default defineConfig(() => ({
  define: {
    __CONTENT_CHANGE_DATES__: JSON.stringify(Object.fromEntries(
      Object.entries(contentFiles).map(([section, paths]) => [section, lastContentChange(paths)]),
    )),
  },
}));
