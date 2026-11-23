# CWRI automation deployment checklist

The GitHub code contains a read-only public feed, daily scheduled snapshots, and 7/30-day metadata reviews. No unverified incident is assigned a final CWRI score.

## Cloudflare Workers deployment
1. Create a Cloudflare D1 database named `cwri-db`.
2. Add this binding to `wrangler.toml` using the actual database UUID:

```toml
[[d1_databases]]
binding = "CWRI_DB"
database_name = "cwri-db"
database_id = "REPLACE_WITH_REAL_DATABASE_UUID"
```

3. Run `npx wrangler d1 migrations apply cwri-db --remote` (migrations 0002 and 0003; migration 0001 is for a separate SHADOW_DB and may need separate handling). If using the shared migrations folder, apply 0002 and 0003 explicitly via `npx wrangler d1 execute cwri-db --remote --file=migrations/0002_cwri_snapshots.sql` and similarly for 0003.
4. Run `npm ci && npm run build && npx wrangler deploy`.
5. Verify `/api/cwri`, `/api/cwri/history`, `/api/cwri/reviews` and the daily cron logs.

## Integrity limits
- CISA KEV documents vulnerabilities with known exploitation; it does not prove a specific organization's incident.
- NVD publication counts do not measure incident counts.
- The current automated priority labels are triage signals, not CWRI incident severity or annual scores.
- Incident CWRI finalization requires independent impact evidence and editorial validation.
- Snapshot history begins only after D1 is configured and the scheduled job has run.
- Review comparisons check changes in the *retrieved latest 30* KEV signals, not the entire historical catalog. Absence from the latest 30 is not remediation.
- 7/30-day reviews require corresponding historical snapshots; no backfilled or fabricated reviews.
