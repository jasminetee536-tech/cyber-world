# Incident research and CWRI assessment operations

## Implemented
- `GET /api/incidents/queue?limit=120`: all unscored incidents and counts.
- `GET /api/incidents/research`: daily KEV evidence candidates, when CVE IDs explicitly appear in incident title/summary.
- `GET /api/incidents/assessments`: saved incident-specific scores and rationale.
- `POST /api/incidents/assessments`: authenticated editorial approval and six-axis CWRI score. Bearer token from secret `CWRI_REVIEW_TOKEN`.
- Daily scheduled job discovers CISA KEV matches; it does not infer impact or assign a score from vulnerability metadata alone.
- Frontend displays persisted scores, evidence, and counts.

## Required deployment steps (NOT performed by code commits)
1. Create/bind Cloudflare D1 database as `CWRI_DB` in `wrangler.toml` (use actual database ID; do not invent one).
2. Apply existing CWRI migrations and `migrations/0004_incident_assessments.sql` plus `migrations/0005_incident_research.sql`.
3. Set secret `CWRI_REVIEW_TOKEN` through Cloudflare secret management, never commit its value.
4. Deploy the Worker and confirm scheduled trigger and API endpoints work.

## Approval payload
```json
{
 "incidentId":"cwri-extra-2021-000",
 "ratings":{"society":3,"infrastructure":2,"technical":4,"security":3,"international":3,"structural":4},
 "confidence":"C",
 "evidence":[{"url":"https://example.org/official-incident-report","finding":"A verified source-specific observation of at least 15 characters"}],
 "rationale":"A source-specific assessment of at least 80 characters, explaining all six axes and uncertainties.",
 "reviewer":"Editorial reviewer ID"
}
```
The example is only a schema illustration. Do not submit fabricated evidence, scores, or reviewer identities.

## Integrity and limitations
- An authenticated review is required to publish new scores; there is no unattended scoring based solely on generic articles or headlines.
- All edits append to `incident_assessment_history`; the latest assessment is stored in `incident_assessments`.
- Research matching only works for explicit CVE IDs; many historical incidents lack CVEs and require dedicated incident-specific investigation.
- HTTPS URL format and text length are validated, but the server does not independently fetch or verify the cited pages. Human verification is essential.
- D1 and deployment have not been verified. Without D1, the queue operates read-only and the UI continues to show the 15 previously scored incidents.
