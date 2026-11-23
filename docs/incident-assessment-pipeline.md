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

## AI provisional proposal pipeline (2026-11-23)
- `functions/api/incident-ai.js` optionally runs Workers AI daily (maximum five candidate incidents per run), only where an incident has a directly linked official-source HTTPS URL. Generic CSIS timeline links do not qualify.
- `GET /api/incidents/proposals` lists proposals. Proposals have `status: AI暫定提案・未検証` and confidence D and **do not change public CWRI scores**.
- Requires Cloudflare Workers AI binding `AI`, D1 `CWRI_DB`, and `migrations/0006_incident_proposals.sql`. Bindings and migrations are NOT configured by GitHub commits.
- Automated evidence checking is limited: fetched page text and model output may be misleading, and URL format does not establish source credibility. Editors must verify evidence and approve through authenticated assessment API.
- Most of the 105 draft incidents have only a generic CSIS timeline URL, so this implementation cannot automatically score them. Dedicated official source mapping and fact-checking remain necessary.
- No Workers AI execution, build, CI success, database migration, or production deployment has been verified.
