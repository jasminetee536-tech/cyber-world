const SOURCES=[
{key:'jpcert',name:'JPCERT/CC',url:'https://www.jpcert.or.jp/rss/jpcert.rdf',host:'www.jpcert.or.jp'},
{key:'jvn',name:'JVN（脆弱性対策情報）',url:'https://jvn.jp/rss/jvn.rdf',host:'jvn.jp'}
];
const decode=(s='')=>s.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g,'$1').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;|&apos;/g,"'").replace(/&#(\d+);/g,(_,n)=>String.fromCodePoint(Number(n))).replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim();
const tag=(s,n)=>(s.match(new RegExp('<(?:[\\w-]+:)?'+n+'(?:\\s[^>]*)?>([\\s\\S]*?)<\\/(?:[\\w-]+:)?'+n+'>','i'))||[])[1]||'';
function summarize(title,description){const d=description.replace(/https?:\/\/\S+/g,'').trim();if(d)return d.length>170?d.slice(0,167)+'…':d;return title+'に関する国内のセキュリティ情報です。詳細と対策は公式発表をご確認ください。'}
export async function onRequestGet(){
const items=[],errors=[];
await Promise.all(SOURCES.map(async source=>{try{
const r=await fetch(source.url,{headers:{'Accept':'application/rss+xml, application/rdf+xml, application/xml, text/xml'},cf:{cacheTtl:900,cacheEverything:true}});
if(!r.ok)throw Error('HTTP '+r.status);
const xml=await r.text();const blocks=xml.match(/<item\b[^>]*>[\s\S]*?<\/item>/gi)||[];
if(!blocks.length)throw Error('RSSの記事が見つかりません');
for(const [i,b] of blocks.entries()){
if(i>=30)break;
const title=decode(tag(b,'title'));const rawUrl=decode(tag(b,'link'));const description=decode(tag(b,'description'));const rawDate=decode(tag(b,'date')||tag(b,'pubDate'));
let url;try{const u=new URL(rawUrl);if(u.protocol!=='https:'||u.hostname!==source.host)continue;url=u.href}catch{continue}
if(!title)continue;
const date=rawDate?rawDate.slice(0,10):'';
items.push({id:source.key+'-'+i+'-'+url,type:'advisory',source:source.name,title,date,description:summarize(title,description),url,language:'ja',summaryType:'公式RSSの説明文を短く整理（AI要約ではありません）'});
}
}catch(e){errors.push(source.name+': '+String(e.message))}}));
const unique=[...new Map(items.map(item=>[item.url,item])).values()].sort((a,b)=>(b.date||'').localeCompare(a.date||'')).slice(0,40);
return new Response(JSON.stringify({items:unique,errors,fetchedAt:new Date().toISOString(),scope:'jp-only'}),{status:unique.length?200:503,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'public, max-age=300'}});
}