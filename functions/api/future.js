// CYBER FUTURE: evidence-led, automatically refreshed scenario briefs.
// These are template-based editorial analyses, not AI-written forecasts or predictions of incidents.
const json=(value,status=200)=>new Response(JSON.stringify(value),{status,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'public, max-age=3600'}});
const themes=[
 {id:'identity',name:'認証・ID',pattern:/authentication|authorization|credential|session|identity|oauth|saml|login|password/i,signal:'認証基盤への依存',future:'認証の入口だけでなく、ログイン後のセッションや権限管理を継続的に確認する必要性が高まる可能性があります。',action:'重要アカウントの多要素認証、セッション失効手順、権限棚卸しを確認する。'},
 {id:'edge',name:'ネットワーク境界',pattern:/vpn|firewall|router|gateway|network appliance|remote access/i,signal:'境界機器の更新と監視',future:'社内外を接続する機器の更新遅延が、組織全体のリスクを左右する可能性があります。',action:'外部公開機器の資産台帳、更新履歴、管理画面の公開範囲を点検する。'},
 {id:'cloud',name:'クラウド・API',pattern:/cloud|api|kubernetes|container|serverless|storage bucket/i,signal:'クラウド権限とAPIの安全性',future:'クラウドの複雑な権限関係やAPIの連携が、監視すべき範囲を広げる可能性があります。',action:'API認可、シークレット管理、公開設定の継続検査を行う。'},
 {id:'software',name:'ソフトウェア供給網',pattern:/package|dependency|library|plugin|repository|build pipeline|supply chain/i,signal:'依存コンポーネントの可視化',future:'製品本体だけでなく依存ライブラリや更新経路の把握が、脆弱性対応の速度を左右する可能性があります。',action:'依存部品の把握と更新元の検証を進める。'},
 {id:'ai',name:'AIシステム',pattern:/artificial intelligence|machine learning|llm|prompt injection|ai agent/i,signal:'AI利用の安全な権限設計',future:'AIエージェントが外部ツールを操作する環境では、入力データと実行権限の境界がより重要になると考えられます。',action:'AIのツール権限、外部データの扱い、人の承認を点検する。'},
 {id:'general',name:'脆弱性管理',pattern:/.*/,signal:'公開脆弱性の優先順位付け',future:'公開される弱点の数だけでなく、影響する資産と悪用状況を組み合わせた対処が重要になると考えられます。',action:'利用製品、悪用確認、公開範囲を踏まえて更新を優先する。'}
];
function english(c){return c.descriptions?.find(x=>x.lang==='en')?.value||''}
function score(c){const m=c.metrics||{};return m.cvssMetricV40?.[0]?.cvssData?.baseScore??m.cvssMetricV31?.[0]?.cvssData?.baseScore??m.cvssMetricV30?.[0]?.cvssData?.baseScore??null}
export async function onRequestGet(){
 try{
 const now=new Date(),start=new Date(now.getTime()-7*86400000);
 const url=new URL('https://services.nvd.nist.gov/rest/json/cves/2.0');
 url.searchParams.set('pubStartDate',start.toISOString().slice(0,19)+'.000');
 url.searchParams.set('pubEndDate',now.toISOString().slice(0,19)+'.000');
 url.searchParams.set('resultsPerPage','200');
 url.searchParams.set('startIndex','0');
 const r=await fetch(url.toString(),{headers:{'User-Agent':'CyberWorldResearch/1.0 (public vulnerability trend briefs)','Accept':'application/json'},cf:{cacheTtl:3600,cacheEverything:true}});
 if(!r.ok)throw Error('NVD API HTTP '+r.status);
 const payload=await r.json(),records=(payload.vulnerabilities||[]).map(x=>x.cve).filter(x=>x?.id&&!/Rejected/i.test(x.vulnStatus||''));
 if(!records.length)throw Error('NVDの対象データがありません');
 const total=Number(payload.totalResults||records.length),sampled=total>records.length;
 const articles=themes.map(t=>{
 const matches=records.filter(c=>t.pattern.test(english(c))),high=matches.filter(c=>score(c)!==null&&score(c)>=7),examples=matches.slice(0,5).map(c=>({id:c.id,url:'https://nvd.nist.gov/vuln/detail/'+encodeURIComponent(c.id),score:score(c),published:c.published?.slice(0,10)||''}));
 return {id:t.id,title:t.name+'：次に備えるべきリスクとは',category:'CYBER FUTURE',date:now.toISOString().slice(0,10),period:{from:start.toISOString().slice(0,10),to:now.toISOString().slice(0,10)},count:matches.length,highCount:high.length,sampled,totalRetrieved:records.length,totalAvailable:total,source:'NVD（米国NIST）',sourceUrl:'https://nvd.nist.gov/',summary:'直近7日間にNVDで公開された脆弱性情報を手がかりに、「'+t.signal+'」という観点から将来の備えを考えます。',evidence:'取得した'+records.length+'件'+(sampled?'（NVD全体の一部サンプル）':'')+'のうち、関連キーワードに一致した情報は'+matches.length+'件、CVSS 7.0以上と判定できたものは'+high.length+'件でした。キーワードによる機械分類であり、実際の攻撃件数や日本国内の発生件数ではありません。',outlook:t.future,action:t.action,examples,method:'NVD CVE APIの公開日で直近7日間を取得し、英語説明文をキーワード分類。最大200件の取得上限があり、分類には漏れや誤分類があります。未来の文章は定型シナリオであり、AIによる独立した予測ではありません。'};
 }).filter(x=>x.count>0);
 return json({articles,updatedAt:now.toISOString(),status:'ok',scope:'global-nvd',notice:'NVDは世界の脆弱性データであり日本国内の攻撃観測やNIST公式予測ではありません。'});
 }catch(e){return json({articles:[],status:'unavailable',error:String(e.message),notice:'外部データを取得できないため、未来予測記事を生成していません。'},503)}
}
