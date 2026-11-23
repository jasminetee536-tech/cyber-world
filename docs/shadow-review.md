# SHADOW INDEX Review operations (v1.0)

## Purpose
Keep the original daily score immutable and show follow-up observations separately. This is an accountability feature, not a claim that daily score changes prove an individual incident was predicted or resolved.

## Automated 7-day reviews
- After D1 is bound and migrations applied, the /api/shadow response includes `reviews`.
- When an initial daily snapshot is at least 7 days old, compare it with the earliest available snapshot on or after day 7.
- Missing follow-up snapshots produce **not assessable**, never an invented score.
- A difference within 10 points is labeled 'limited change'; larger positive/negative changes are described as observed changes, NOT forecast accuracy.
- The original score is preserved in `shadow_daily`.
- The review view appears under 'スコアの詳細・推移を見る' in the threat monitor.

## Resolution reviews (editor-curated)
The `shadow_resolutions` table is intentionally NOT populated by an automatic RSS keyword match. An authorized editor must independently verify a documented resolution before recording it. Only HTTPS evidence URLs are accepted by the review evaluator. Example SQL for a verified case (replace values with real verified facts):

```sql
INSERT INTO shadow_resolutions (initial_day,reviewed_at,evidence_urls,note)
VALUES ('YYYY-MM-DD','YYYY-MM-DD','["https://official.example/incident-update"]','Confirmed by official update; scope and remaining risks reviewed');
```

**Do not run the example as-is.** In v1, a resolution record is linked to a daily snapshot, not a uniquely identified incident. A future version should assign stable incident IDs, require independent evidence for each affected entity, compare forecast statements against actual outcomes, and record analyst sign-off. Until then, do not present this as an independently validated prediction accuracy metric.

## Setup
1. Create Cloudflare D1 database and bind it as `SHADOW_DB` in wrangler configuration.
2. Apply `migrations/0001_shadow_daily.sql` and `migrations/0002_shadow_resolutions.sql` to that database.
3. Deploy Worker with the scheduled trigger. At least 7 days of persisted observations are needed for the first 7-day review.
4. Verify /api/shadow response and UI in production. Without D1 the API intentionally returns no historical reviews.

No government or official endorsement is implied.
