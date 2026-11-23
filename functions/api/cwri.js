// Automated evidence pipeline: never infer an actual incident from a vulnerability advisory.
// Public feeds provide candidate signals. Confirmed impacts are required for CWRI incident scores.
const KEV='https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json';
const NVD='https://services.nvd.nist.gov/rest/json/cves/2.0';
const headers={'Content-Type':'application/json; charset=utf-8','Cache-Control':'public, max-age=1800'};
const json=(data,status=200)=>new Response(JSON.stringify(data),{status,headers});
function classify(v){
 const t=(v.vendorProject+' '+v.product+' '+v.vulnerabilityName+' '+v.shortDescription).toLowerCase();
 return /router|firewall|vpn|gateway|network/.test(t)?'ネットワーク境界':/windows|linux|kernel|operating system/.test(t)?'OS・基盤':/cloud|api|container/.test(t)?'クラウド':/server|database|exchange/.test(t)?'サーバー': 'その他';
}
function priority(v){
 // Triage priority is not CWRI incident severity, nor an exploitation probability.
 const ransomware=v.knownRansomwareCampaignUse==='Known';
 const due=Date.parse(v.dueDate);
 const overdue=Number.isFinite(due)&&due<Date.now();
 return {level:ransomware?'高':overdue?'要確認':'監視',ransomwareConfirmed:ransomware,dueDate:v.dueDate||null};
}
export async function collectCWRI(){
 const errors=[];let kev=[],nvdCount=null;
 try{
  const r=await fetch(KEV,{headers:{Accept:'application/json'},cf:{cacheTtl:1800,cacheEverything:true}});
  if(!r.ok)throw Error('CISA KEV HTTP '+r.status);
  const d=await r.json();kev=Array.isArray(d.vulnerabilities)?d.vulnerabilities:[];
 }catch(e){errors.push('CISA KEV: '+String(e.message))}
 try{
  const now=new Date(),from=new Date(now.getTime()-86400000);
  const u=new URL(NVD);u.searchParams.set('pubStartDate',from.toISOString().slice(0,19)+'.000');u.searchParams.set('pubEndDate',now.toISOString().slice(0,19)+'.000');u.searchParams.set('resultsPerPage','1');
  const r=await fetch(u.toString(),{headers:{Accept:'application/json'},cf:{cacheTtl:1800,cacheEverything:true}});
  if(!r.ok)throw Error('NVD HTTP '+r.status);
  const d=await r.json();nvdCount=Number.isFinite(d.totalResults)?d.totalResults:null;
 }catch(e){errors.push('NVD: '+String(e.message))}
 const latest=[...kev].sort((a,b)=>(b.dateAdded||'').localeCompare(a.dateAdded||'')).slice(0,30);
 const signals=latest.map(v=>({id:v.cveID,title:v.vulnerabilityName||v.cveID,category:classify(v),date:v.dateAdded,description:v.shortDescription,source:'CISA KEV',sourceUrl:'https://www.cisa.gov/known-exploited-vulnerabilities-catalog',...priority(v),cwriScore:null,jri:null,confidence:'B',status:'悪用確認済み脆弱性・個別事件の被害未確認'}));
 return {version:'1.0',updatedAt:new Date().toISOString(),status:kev.length?'ok':'unavailable',signals,metrics:{kevCatalogTotal:kev.length,nvdPublishedLast24h:nvdCount},errors,method:'CISA KEVの悪用確認情報を収集。優先度はランサムウェア利用の明示情報とKEV期限を参考に分類。被害規模・重要インフラへの実影響が未確認のためCWRI事件重大度は算定しない。',review:{afterDays:[7,30],policy:'新しい根拠が見つかれば再取得し、評価変更は出典付きで記録する。履歴の永続化にはD1設定が必要。'}};
}
export async function cwriGet(){try{const d=await collectCWRI();return json(d,d.status==='ok'?200:503)}catch(e){return json({status:'unavailable',errors:[String(e.message)],signals:[]},503)}}
export async function persistCWRI(env){
 const snapshot=await collectCWRI();
 if(!env.CWRI_DB)return {status:'not_configured',reason:'CWRI_DB D1 binding is required for persistent review history'};
 await env.CWRI_DB.prepare('INSERT OR REPLACE INTO cwri_snapshots (day, payload, recorded_at) VALUES (?, ?, ?)').bind(snapshot.updatedAt.slice(0,10),JSON.stringify(snapshot),snapshot.updatedAt).run();
 return {status:'stored',day:snapshot.updatedAt.slice(0,10)};
}
// Review previously observed signals against today's source snapshot.
// Changes in KEV metadata are recorded; they are not proof of incident resolution.
export async function reviewCWRI(env){
 if(!env.CWRI_DB)return {status:'not_configured'};
 const current=await collectCWRI();
 const today=current.updatedAt.slice(0,10);
 const previous=await env.CWRI_DB.prepare('SELECT day,payload FROM cwri_snapshots WHERE day <= ? ORDER BY day DESC LIMIT 1').bind(new Date(Date.now()-7*86400000).toISOString().slice(0,10)).first();
 const month=await env.CWRI_DB.prepare('SELECT day,payload FROM cwri_snapshots WHERE day <= ? ORDER BY day DESC LIMIT 1').bind(new Date(Date.now()-30*86400000).toISOString().slice(0,10)).first();
 const results=[];
 for(const [windowDays,old] of [[7,previous],[30,month]]){
  if(!old)continue;
  const past=JSON.parse(old.payload),oldMap=new Map((past.signals||[]).map(x=>[x.id,x]));
  for(const now of current.signals){
   const before=oldMap.get(now.id);if(!before)continue;
   const changed=before.level!==now.level||before.ransomwareConfirmed!==now.ransomwareConfirmed;
   results.push({day:today,windowDays,cve:now.id,baselineDay:old.day,previousLevel:before.level,currentLevel:now.level,changed,reason:changed?'KEVメタデータに変化':'取得できた公開情報に変化なし',sourceUrl:now.sourceUrl});
  }
 }
 const stmt=env.CWRI_DB.prepare('INSERT OR REPLACE INTO cwri_reviews (day,window_days,cve,baseline_day,previous_level,current_level,changed,reason,source_url) VALUES (?,?,?,?,?,?,?,?,?)');
 for(const x of results)await stmt.bind(x.day,x.windowDays,x.cve,x.baselineDay,x.previousLevel,x.currentLevel,x.changed?1:0,x.reason,x.sourceUrl).run();
 return {status:'ok',reviewed:results.length,changed:results.filter(x=>x.changed).length};
}
export async function reviewsGet(request,env){
 if(!env.CWRI_DB)return json({status:'not_configured',reviews:[]});
 try{
 const rows=await env.CWRI_DB.prepare('SELECT * FROM cwri_reviews ORDER BY day DESC LIMIT 100').all();
 return json({status:'ok',reviews:rows.results||[]});
 }catch{return json({status:'error',reviews:[]},503)}
}
export async function historyGet(request,env){
 if(!env.CWRI_DB)return json({status:'not_configured',snapshots:[],message:'D1 database is not configured'});
 const days=Math.min(60,Math.max(1,Number(new URL(request.url).searchParams.get('days'))||30));
 try{
  const rows=await env.CWRI_DB.prepare('SELECT day,payload,recorded_at FROM cwri_snapshots ORDER BY day DESC LIMIT ?').bind(days).all();
  return json({status:'ok',snapshots:(rows.results||[]).map(x=>({day:x.day,recordedAt:x.recorded_at,metrics:JSON.parse(x.payload).metrics}))});
 }catch(e){return json({status:'error',message:'履歴データを取得できません'},503)}
}
