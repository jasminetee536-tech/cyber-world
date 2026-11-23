# Weekly incident publishing

- Schedule: every Monday at 08:00 JST, using GitHub Actions `timezone: Asia/Tokyo`. GitHub may delay or skip scheduled jobs under load.
- The job fetches RSS feeds from BleepingComputer, The Record, SecurityWeek, and JPCERT/CC, filters incident-related reports from the last 21 days, and selects five distinct source-linked items.
- It checks canonical source URLs and normalized titles against all previous incident articles, including the weekly archive. It never republishes an identical URL.
- A report that closely matches an older incident but has a new source URL is published as a **separate update article**. The original stays unchanged and the new record links to its original incident ID.
- All new articles explicitly say `証拠不十分・報道ベース・一次資料未照合` and have `score:null`, `confidence:'D'`. They do not invent incident severity or affected organizations.
- If fewer than five distinct qualifying articles can be found, the workflow **fails without committing anything** rather than inventing articles or silently violating the five-article rule. GitHub Actions failure notifications should be enabled.
- Publication uses GitHub Actions `GITHUB_TOKEN` with `contents: write`; repository Actions permissions must permit it. The workflow updates `src/incident-weekly.js`. Deployment to Cloudflare depends on an existing GitHub-to-Cloudflare deployment integration; this workflow does not configure it.
- Manual test: GitHub Actions -> Publish five weekly incident reports -> Run workflow. CI runs `node scripts/check-incidents.mjs` after generation.
- The publication is source-linked reporting summaries, not 1000-character independently researched incident dossiers. Adding five detailed researched articles weekly requires an additional source-verification and writing pipeline.
