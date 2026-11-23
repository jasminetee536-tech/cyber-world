import {onRequestGet as feedGet} from './feed.js';
import {scoreEvents,makeBrief} from '../../src/shadow-index.js';
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
  return json({today:row?JSON.parse(row.payload):null,history:points,historyAvailable:true,scheduled:true,timezone:'Asia/Tokyo',days:range,notice:row?null:'本日の保存済み評価はまだありません。'});
 }
 // Without D1 we can show a live preview, but must not fabricate historical points.
 const preview=await buildDaily(null,date);
 return json({today:preview,history:[],historyAvailable:false,scheduled:false,timezone:'Asia/Tokyo',days:range,notice:'D1未接続のため、これは閲覧時の暫定評価です。9時の定時保存・過去履歴・約5,000字のAI記事は未稼働です。'});
}
