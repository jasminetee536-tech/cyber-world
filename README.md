# CYBER WORLD — Prototype

Cyber intelligence dashboard with switchable 2D and 3D world maps, searchable demonstration incidents, detail timelines and official security advisories.

## Development

```bash
npm install
npm run dev
```

## Deployment — Cloudflare Pages

Connect this repository to Cloudflare Pages. Framework: Vite; build command: `npm run build`; output directory: `dist`. The `functions/api/feed.js` endpoint fetches CISA KEV and JPCERT/CC feeds. It runs on Cloudflare Pages, not on GitHub Pages.

## Data integrity

Map markers are clearly labelled fictional demonstrations, not live attack locations. CISA KEV is a list of exploited vulnerabilities; JPCERT/CC publishes advisories. Neither provides verified geolocated incidents. Live feeds must never be represented as geolocated attacks.

This prototype has not yet completed production browser verification.
