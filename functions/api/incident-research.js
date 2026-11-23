import {incidents} from '../../src/incident-data.js';
const KEV='https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json';
const cveIds=s=>[...new Set(String(s||'').match(/CVE-\d{4}-\d{4,}/gi)||[])].map(s=>s.toUpperCase());
export async function refreshIncidentResearch(env){
 if(!env?.CWRI_DB)return {status:'not_configured',reason:'CWRI_DB required'};
 let response;try{response=await fetch(KEV,{headers:{accept:'application/json'}});if(!response.ok)throw Error('KEV HTTP '+response.status)}catch(e){return {status:'source_error',message:String(e)}}
 const body=await response.json(),entries=Array.isArray(body.vulnerabilities)?body.vulnerabilities:[];
 const map=new Map(entries.map(v=>[v.cveID,v]));
 let matched=0;
 for(const incident of incidents.filter(x=>x.score==null)){
  for(const cve of cveIds(incident.title+' '+incident.summary)){
   const item=map.get(cve);if(!item)continue;
   const evidence={source:'CISA KEV',url:'https://www.cisa.gov/known-exploited-vulnerabilities-catalog',cve,description:item.shortDescription||'',dateAdded:item.dateAdded||null,observation:'悪用が確認された脆弱性。個別事件の被害規模は未検証'};
   await env.CWRI_DB.prepare('INSERT INTO incident_research_candidates (incident_id,evidence_key,evidence_json,observed_at) VALUES (?,?,?,?) ON CONFLICT(incident_id,evidence_key) DO UPDATE SET evidence_json=excluded.evidence_json,observed_at=excluded.observed_at').bind(incident.id,'KEV:'+cve,JSON.stringify(evidence),new Date().toISOString()).run();
   matched++;
  }
 }
 return {status:'ok',source:'CISA KEV',matched,unscored:incidents.filter(x=>x.score==null).length,note:'候補収集のみ。事件ごとの実被害を確認できるまでCWRI点数は付けません。'};
}
export async function incidentResearchGet(request,env){
 if(!env?.CWRI_DB)return new Response(JSON.stringify({status:'not_configured',candidates:[]}),{headers:{'content-type':'application/json'}});
 try{const r=await env.CWRI_DB.prepare('SELECT incident_id,evidence_json,observed_at FROM incident_research_candidates ORDER BY observed_at DESC LIMIT 120').all();return new Response(JSON.stringify({status:'ok',candidates:(r.results||[]).map(x=>({incidentId:x.incident_id,...JSON.parse(x.evidence_json),observedAt:x.observed_at}))}),{headers:{'content-type':'application/json','cache-control':'no-store'}})}catch{return new Response(JSON.stringify({status:'migration_required',candidates:[]}),{status:503,headers:{'content-type':'application/json'}})}
}
