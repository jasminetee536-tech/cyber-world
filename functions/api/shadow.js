import {onRequestGet as feedGet} from './feed.js';
import {scoreEvents,makeBrief} from '../../src/shadow-index.js';
import {buildReviewRecords,evaluateReview} from '../../src/shadow-review.js';
const headers={'content-type':'application/json; charset=utf-8','cache-control':'no-store'};
const json=(data,status=200)=>new Response(JSON.stringify(data),{status,headers});
const tokyoDate=(date=new Date())=>new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Tokyo',year:'numeric',month:'2-digit',day:'2-digit'}).format(date);
const dateIsValid=s=>/^\d{4}-\d{2}-\d{2}$/.test(s||'');
export async function buildDaily(env,date=tokyoDate()){
 const response=await feedGet();const feed=await response.json();
 const cutoff=Date.parse(date+'T00:00:00+09:00')-7*86400000;
 const recent=(feed.items||[]).filter(x=>x.date&&Number.isFinite(Date.parse(x.date))&&Date.parse(x.date)>=cutoff&&Date.parse(x.date)<=Date.now()+86400000);
 const scored=scoreEvents(recent);
 const report=makeBrief(scored,date);
 const data={date,generatedAt:new Date().toISOString(),...scored,report,sourceErrors:feed.errors||[],sourceWindow:'直近7日間の公開情報（取得可能なRSSのみ）',editorialStatus:'automated_provisional'};
 if(env?.SHADOW_DB){
  await env.SHADOW_DB.prepare('INSERT INTO shadow_daily (day, payload, created_at) VALUES (?1,?2,?3) ON CONFLICT(day) DO UPDATE SET payload=excluded.payload, created_at=excluded.created_at').bind(date,JSON.stringify(data),data.generatedAt).run();
 }
 return data;
}
export async function shadowGet(request,env){
 const url=new URL(request.url);
 const range=Math.min(365,Math.max(7,Number(url.searchParams.get('days'))||30));
 const date=url.searchParams.get('date')||tokyoDate();
 if(!dateIsValid(date))return json({error:'Invalid date'},400);
 if(env?.SHADOW_DB){
  const row=await env.SHADOW_DB.prepare('SELECT payload FROM shadow_daily WHERE day=?1').bind(date).first();
  const history=await env.SHADOW_DB.prepare('SELECT day,payload FROM shadow_daily WHERE day>=?1 AND day<=?2 ORDER BY day ASC').bind(new Date(Date.parse(date+'T00:00:00Z')-(range-1)*86400000).toISOString().slice(0,10),date).all();
  const points=(history.results||[]).map(x=>{const d=JSON.parse(x.payload);return {date:x.day,score:d.score,confidence:d.confidence,status:d.status}});
  const reviewRows=await env.SHADOW_DB.prepare('SELECT day,payload FROM shadow_daily WHERE day>=?1 AND day<=?2 ORDER BY day ASC').bind(new Date(Date.parse(date+'T00:00:00Z')-380*86400000).toISOString().slice(0,10),date).all();
  const snapshots=(reviewRows.results||[]).map(x=>JSON.parse(x.payload));
  const weekly=buildReviewRecords(snapshots,new Date(date+'T23:59:59Z'));
  const resolvedRows=await env.SHADOW_DB.prepare('SELECT initial_day,reviewed_at,evidence_urls,note FROM shadow_resolutions ORDER BY reviewed_at DESC LIMIT 30').all();
  const resolved=(resolvedRows.results||[]).map(r=>{const initial=snapshots.find(x=>x.date===r.initial_day);const evidence=JSON.parse(r.evidence_urls||'[]');return {id:r.initial_day+'-resolved',type:'resolved',initialDate:r.initial_day,reviewDate:r.reviewed_at,leadEvent:initial?.leadEvent||null,note:r.note,...evaluateReview(initial,null,{resolutionEvidence:true,evidenceUrls:evidence})}});
  const reviews=[...resolved,...weekly].sort((a,b)=>String(b.reviewDate||b.dueDate).localeCompare(String(a.reviewDate||a.dueDate)));
  return json({today:row?JSON.parse(row.payload):null,history:points,reviews,reviewMethod:'7日後の保存済み全体スコアとの比較。解決レビューは別途確認された根拠URLを登録した場合のみ表示。',historyAvailable:true,scheduled:true,timezone:'Asia/Tokyo',days:range,notice:row?null:'本日の保存済み評価はまだありません。'});
 }
 // Without D1 we can show a live preview, but must not fabricate historical points.
 const preview=await buildDaily(null,date);
 return json({today:preview,history:[],reviews:[],reviewMethod:'D1未接続のため過去評価を検証できません。',historyAvailable:false,scheduled:false,timezone:'Asia/Tokyo',days:range,notice:'D1未接続のため、これは閲覧時の暫定評価です。9時の定時保存・過去履歴・約5,000字のAI記事は未稼働です。'});
}
