import {incidents} from '../../src/incident-data.js';
import {incidentAxes,weightedScore} from '../../src/cwri.js';
const headers={'content-type':'application/json; charset=utf-8','cache-control':'no-store'};
const reply=(v,status=200)=>new Response(JSON.stringify(v),{status,headers});
const urlOk=u=>{try{const x=new URL(u);return x.protocol==='https:'&&!['localhost','127.0.0.1'].includes(x.hostname)&&!x.hostname.endsWith('.local')}catch{return false}};
const safeDate=d=>/^\d{4}-\d{2}-\d{2}$/.test(d||'');
const clean=(r)=>({id:r.id,year:r.year,title:r.title,score:r.score,confidence:r.confidence,followupStatus:r.followupStatus});
const pending=()=>incidents.filter(x=>x.score===null);
export async function incidentQueueGet(request,env){
 const u=new URL(request.url),limit=Math.min(120,Math.max(1,Number(u.searchParams.get('limit'))||25));
 let reviews=[];if(env?.CWRI_DB){try{const r=await env.CWRI_DB.prepare('SELECT incident_id,score,confidence,reviewed_at,source_urls,rationale,ratings FROM incident_assessments ORDER BY reviewed_at DESC').all();reviews=r.results||[]}catch(e){return reply({status:'migration_required',message:'incident_assessments migration must be applied',total:incidents.length,pending:pending().length},503)}}
 const byId=new Map(reviews.map(x=>[x.incident_id,x]));
 const resolved=incidents.map(x=>byId.has(x.id)?{...clean(x),score:byId.get(x.id).score,confidence:byId.get(x.id).confidence,followupStatus:'根拠付き査読済み'}:clean(x));
 const remaining=resolved.filter(x=>x.score==null);
 return reply({status:env?.CWRI_DB?'ready':'read_only',total:resolved.length,scored:resolved.length-remaining.length,pending:remaining.length,reviewedStored:reviews.length,queue:remaining.slice(0,limit),message:env?.CWRI_DB?'採点待ちを抽出。一次資料の確認と編集承認が必要です。':'CWRI_DB未接続。採点待ちの抽出のみ可能です。',policy:'推定した事件名・一般的な脆弱性情報だけでは点数を自動生成しません。'});
}
export async function incidentAssessmentPost(request,env){
 if(!env?.CWRI_DB)return reply({error:'CWRI_DB D1 binding required'},503);
 if(!env?.CWRI_REVIEW_TOKEN)return reply({error:'Review API is disabled until CWRI_REVIEW_TOKEN is configured'},503);
 const authorization=request.headers.get('authorization')||'';
 if(authorization!==`Bearer ${env.CWRI_REVIEW_TOKEN}`)return reply({error:'Unauthorized'},401);
 let data;try{data=await request.json()}catch{return reply({error:'Invalid JSON'},400)}
 const incident=incidents.find(x=>x.id===data?.incidentId);
 if(!incident)return reply({error:'Unknown incident ID'},404);
 const ratings=data?.ratings;
 if(!incidentAxes.every(a=>Number.isInteger(ratings?.[a.id])&&ratings[a.id]>=0&&ratings[a.id]<=5))return reply({error:'Six integer ratings from 0 to 5 are required'},400);
 if(!['A','B','C','D'].includes(data.confidence))return reply({error:'Invalid confidence'},400);
 if(!Array.isArray(data.evidence)||data.evidence.length<1||data.evidence.length>12||!data.evidence.every(x=>urlOk(x?.url)&&typeof x?.finding==='string'&&x.finding.trim().length>=15))return reply({error:'Evidence must contain specific HTTPS sources and findings'},400);
 if(typeof data.rationale!=='string'||data.rationale.trim().length<80)return reply({error:'Incident-specific rationale must be at least 80 characters'},400);
 if(typeof data.reviewer!=='string'||data.reviewer.trim().length<3||data.reviewer.length>100)return reply({error:'Reviewer identity is required'},400);
 const score=weightedScore(incidentAxes,ratings),at=new Date().toISOString();
 try{
  await env.CWRI_DB.prepare('INSERT INTO incident_assessments (incident_id,score,ratings,confidence,source_urls,rationale,reviewer,reviewed_at) VALUES (?,?,?,?,?,?,?,?) ON CONFLICT(incident_id) DO UPDATE SET score=excluded.score,ratings=excluded.ratings,confidence=excluded.confidence,source_urls=excluded.source_urls,rationale=excluded.rationale,reviewer=excluded.reviewer,reviewed_at=excluded.reviewed_at').bind(incident.id,score,JSON.stringify(ratings),data.confidence,JSON.stringify(data.evidence),data.rationale,data.reviewer,at).run();
  await env.CWRI_DB.prepare('INSERT INTO incident_assessment_history (incident_id,score,ratings,confidence,source_urls,rationale,reviewer,reviewed_at) VALUES (?,?,?,?,?,?,?,?)').bind(incident.id,score,JSON.stringify(ratings),data.confidence,JSON.stringify(data.evidence),data.rationale,data.reviewer,at).run();
  return reply({status:'saved',incidentId:incident.id,score,confidence:data.confidence,reviewedAt:at});
 }catch{return reply({error:'Database migration required or write failed'},503)}
}
export async function incidentAssessmentsGet(request,env){
 if(!env?.CWRI_DB)return reply({status:'not_configured',assessments:[]});
 try{const r=await env.CWRI_DB.prepare('SELECT incident_id,score,ratings,confidence,source_urls,rationale,reviewed_at FROM incident_assessments').all();return reply({status:'ok',assessments:(r.results||[]).map(x=>({...x,ratings:JSON.parse(x.ratings),evidence:JSON.parse(x.source_urls)}))})}catch{return reply({status:'migration_required',assessments:[]},503)}
}
