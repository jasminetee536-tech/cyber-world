import assert from 'node:assert/strict';
import {incidents,incidentFollowupSummary} from '../src/incident-data.js';
import {incidentAxes,weightedScore} from '../src/cwri.js';
const ids=new Set();
assert(incidents.length>=120,'Incident count must be at least 120');
for(const incident of incidents){
 assert(!ids.has(incident.id),'Duplicate incident ID '+incident.id);ids.add(incident.id);
 assert(incident.year>=2010&&incident.year<=2026,'Invalid year '+incident.id);
 assert(incident.title&&incident.summary&&incident.detail,'Incomplete incident '+incident.id);
 if(incident.score===null)continue;
 assert.equal(incident.score,weightedScore(incidentAxes,incident.ratings),'Score mismatch '+incident.id);
 assert(Array.isArray(incident.sourceUrls)&&incident.sourceUrls.length,'Missing sources '+incident.id);
}
const scored=incidents.filter(x=>x.score!==null).length;
assert.equal(scored,incidentFollowupSummary.scored);
assert.equal(incidents.length-scored,incidentFollowupSummary.pending);
console.log(JSON.stringify({total:incidents.length,scored,pending:incidents.length-scored}));
