import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {incidents} from '../src/incident-data.js';
import {weeklyIncidents} from '../src/incident-weekly.js';

const SOURCES=[
 {name:'BleepingComputer',url:'https://www.bleepingcomputer.com/feed/'},
 {name:'The Record',url:'https://therecord.media/feed'},
 {name:'SecurityWeek',url:'https://www.securityweek.com/feed/'},
 {name:'JPCERT/CC',url:'https://www.jpcert.or.jp/rss/jpcert.rdf'}
];
const LIMIT=5;
const now=new Date();
const weekStart=new Date(now.getTime()-21*86400000);
const hash=s=>createHash('sha256').update(s).digest('hex').slice(0,14);
const strip=s=>String(s||'').replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g,'$1').replace(/<[^>]+>/g,' ').replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;|&apos;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/\s+/g,' ').trim();
const tag=(s,k)=>{const m=s.match(new RegExp('<(?:[\\w-]+:)?'+k+'(?:\\s[^>]*)?>([\\s\\S]*?)<\\/(?:[\\w-]+:)?'+k+'>','i'));return m?strip(m[1]):''};
const canonical=url=>{try{const u=new URL(url);if(!['http:','https:'].includes(u.protocol))return '';u.hash='';u.search='';u.pathname=u.pathname.replace(/\/+$/,'')||'/';return u.toString().toLowerCase()}catch{return ''}};
const normalized=s=>strip(s).normalize('NFKC').toLowerCase().replace(/(?:updated|update|breaking|new|report|latest|exclusive|速報|続報|更新版)/gi,'').replace(/[^\p{L}\p{N}]+/gu,' ').trim();
const words=s=>new Set(normalized(s).split(/\s+/).filter(w=>w.length>=4));
function similar(a,b){
 const x=normalized(a),y=normalized(b);
 if(x===y&&x.length>=12)return true;
 const aa=words(a),bb=words(b),overlap=[...aa].filter(w=>bb.has(w)).length;
 return overlap>=3&&overlap/Math.max(aa.size,bb.size)>=0.72;
}
const incidentWords=/ransomware|cyberattack|cyber attack|hacked|hackers|breach|stolen|data theft|compromised|intrusion|outage|disruption|attackers|malware|サイバー攻撃|ランサム|侵害|情報漏えい|不正アクセス|流出|攻撃|障害/i;
const notIncident=/how to|tutorial|opinion|review:|patch tuesday|best vpn|discount|buy now|guide to|top \d+|脆弱性情報だけ/i;
function parseFeed(xml,source){
 const items=[...xml.matchAll(/<item(?:\s[^>]*)?>([\s\S]*?)<\/item>/gi)].map(x=>x[1]);
 return items.map(item=>{
  const title=tag(item,'title'),url=canonical(tag(item,'link')||tag(item,'guid'));
  const date=tag(item,'pubDate')||tag(item,'date');
  const description=tag(item,'description')||tag(item,'encoded');
  return {title,url,date,description,source};
 }).filter(x=>x.title&&x.url&&incidentWords.test(x.title)&&!notIncident.test(x.title)&&Number.isFinite(Date.parse(x.date))&&Date.parse(x.date)>=weekStart.getTime()&&Date.parse(x.date)<=now.getTime()+86400000);
}
async function fetchFeed(source){
 const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),12000);
 try{const r=await fetch(source.url,{headers:{'user-agent':'CyberWorldEditorialBot/1.0 (+https://github.com/jasminetee536-tech/cyber-world)','accept':'application/rss+xml, application/xml, text/xml'},signal:controller.signal});if(!r.ok)throw Error('HTTP '+r.status);return parseFeed(await r.text(),source.name)}finally{clearTimeout(timer)}
}
const results=await Promise.allSettled(SOURCES.map(fetchFeed));
const errors=results.flatMap((r,i)=>r.status==='rejected'?[SOURCES[i].name+': '+r.reason]:[]);
const candidates=results.flatMap(r=>r.status==='fulfilled'?r.value:[]).sort((a,b)=>Date.parse(b.date)-Date.parse(a.date));
const existing=[...incidents,...weeklyIncidents];
const taken=new Set(),selected=[];
for(const candidate of candidates){
 if(taken.has(candidate.url)||selected.some(x=>similar(x.title,candidate.title)))continue;
 taken.add(candidate.url);
 const old=existing.find(x=>(x.sourceUrls||[]).some(u=>canonical(u)===candidate.url)||similar(x.title,candidate.title));
 const prior=old&&weeklyIncidents.find(x=>x.id===old.id);
 // Existing identical URLs are never republished.
 if(old&&(old.sourceUrls||[]).some(u=>canonical(u)===candidate.url))continue;
 // Only a previous weekly item may receive an update version. Older curated events
 // are cross-referenced, not silently overwritten.
 const isUpdate=Boolean(old);
 const date=now.toISOString().slice(0,10);
 const id='cwri-weekly-'+date+'-'+hash(candidate.url);
 const summary=candidate.description?candidate.description.slice(0,500):'提供元の記事タイトルと公開日時を確認しました。事件の詳細は出典先で確認してください。';
 const note='【出典と確認範囲】'+candidate.source+'の公開記事（'+candidate.date+'）を参照。タイトルと配信概要は取得しましたが、被害件数・攻撃者・帰属・原因について独立した一次資料照合は未完了です。\n\n【報道概要】'+candidate.title+'。'+summary+'\n\n【証拠の限界】このページは公開情報の紹介・追跡記録です。報道された内容が独立検証済みであることを意味しません。証拠不十分のためCWRI重大度は未採点です。\n\n【今後の確認事項】被害組織の公式発表、当局の勧告、被害範囲、復旧状況などを照合します。';
 selected.push({id,year:Number(date.slice(0,4)),title:(isUpdate?'【更新版】':'')+candidate.title,type:isUpdate?'事件続報・更新版':'新規事件・報道',summary,lesson:'出典の一次資料・被害範囲・復旧状況を追加確認する。',detail:note,sourceUrls:[candidate.url],confidence:'D',status:'証拠不十分・報道ベース・一次資料未照合',score:null,ratings:{},reviewHistory:[],version:isUpdate?'2.0':'1.0',jri:null,assessedAt:null,publishedAt:now.toISOString(),originalIncidentId:isUpdate?old.id:null,updateOf:isUpdate?old.title:null,sourceName:candidate.source});
 if(selected.length===LIMIT)break;
}
if(selected.length!==LIMIT){
 console.error(JSON.stringify({error:'Insufficient unique incident articles. Nothing published.',found:selected.length,feeds:candidates.length,errors}));
 process.exit(1);
}
const next=[...selected,...weeklyIncidents];
const output='// Weekly source-linked incident reports. Updated by GitHub Actions only.\nexport const weeklyIncidents='+JSON.stringify(next,null,2)+';\n';
if(process.env.DRY_RUN==='1')console.log(JSON.stringify({dryRun:true,selected:selected.map(x=>({title:x.title,source:x.sourceName,updateOf:x.updateOf})),errors},null,2));
else {await fs.writeFile('src/incident-weekly.js',output);console.log(JSON.stringify({added:selected.length,updates:selected.filter(x=>x.originalIncidentId).length,errors}));}
