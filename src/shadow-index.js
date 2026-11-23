// SHADOW INDEX v1.0 — transparent, rule-based provisional scoring.
// This is an editorial risk indicator, NOT an attack probability or official alert.
export const DIMENSIONS=[
 {key:'cascade',label:'連鎖波及性',weight:25},
 {key:'dependency',label:'共通依存リスク',weight:20},
 {key:'exploitation',label:'攻撃の現実性',weight:20},
 {key:'japan',label:'日本への関連性',weight:15},
 {key:'recovery',label:'復旧の難しさ',weight:10},
 {key:'signals',label:'弱い兆候の収束',weight:10}
];
const RULES={
 cascade:[/電力|停電|通信障害|病院|医療|港湾|鉄道|物流|決済|金融|水道|energy|hospital|port|rail|payment|telecom/i,/サプライチェーン|広域|複数|supply.chain|widespread/i],
 dependency:[/クラウド|cloud|認証|identity|dns|vpn|ソフトウェア更新|update|委託|provider/i,/共通|shared|サプライチェーン|supply.chain/i],
 exploitation:[/悪用を確認|悪用され|攻撃を確認|被害が発生|exploited in the wild|active exploitation|ransomware attack/i,/脆弱性|cve-|malware|ランサムウェア|不正アクセス|vulnerability/i],
 japan:[/日本|国内|japan|jpcert|jvn|日本語/i,/企業|自治体|官公庁|医療|鉄道|金融|通信|港湾/i],
 recovery:[/停止|復旧|業務影響|障害|outage|disruption|recovery/i,/バックアップ|復元|長期|手動|manual/i],
 signals:[/注意喚起|警告|alert|advisory|緊急|critical/i,/継続|拡大|複数|increase|campaign/i]
};
const clamp=n=>Math.max(0,Math.min(5,n));
export function scoreEvents(items=[]){
 const unique=[...new Map(items.filter(x=>x&&x.url&&x.title).map(x=>[x.url,x])).values()];
 const events=unique.map(item=>{
  const text=[item.title,item.description].join(' ');
  const axes={};
  for(const dim of DIMENSIONS){
   const matches=RULES[dim.key].filter(r=>r.test(text)).length;
   axes[dim.key]=clamp(matches?matches===2?3:2:0);
  }
  // A source publishing an advisory does not itself prove exploitation.
  if(item.source?.includes('JVN'))axes.exploitation=Math.min(axes.exploitation,2);
  const value=Math.round(DIMENSIONS.reduce((n,d)=>n+d.weight*axes[d.key]/5,0));
  return {...item,axes,value};
 }).sort((a,b)=>b.value-a.value);
 if(!events.length)return {status:'insufficient_data',score:null,confidence:'D',dimensions:DIMENSIONS,events:[],method:'公開情報が取得できないため採点不能'};
 const lead=events[0],secondary=events.slice(1,6).filter(e=>e.value>=20);
 const breadth=Math.min(8,new Set(secondary.map(e=>e.source)).size*2+Math.min(4,secondary.length));
 const score=Math.min(100,lead.value+breadth);
 const axes=Object.fromEntries(DIMENSIONS.map(d=>[d.key,lead.axes[d.key]]));
 const sources=new Set(events.map(e=>e.source));
 const confidence=sources.size>=3?'B':sources.size===2?'C':'D';
 return {status:'provisional',score,confidence,dimensions:DIMENSIONS,axes,events:events.slice(0,12),leadEvent:lead.title,method:'公開RSS見出し・概要への規則ベース評価。最重要事象の6軸加重点＋独立事象の限定的補正（最大8点）。複数記事の独立性は完全には検証していません。脅威発生確率ではありません。',coverage:'取得できた公開フィードのみ。日本全体の攻撃観測を網羅しません。'};
}
export function makeBrief(result,date){
 if(result.score===null)return {title:'本日の脅威評価は保留',summary:'評価可能な公開情報が不足しています。',paragraphs:[]};
 const lead=result.events[0];
 return {title:'日本のサイバー脅威を読み解く — '+date,summary:'取得できた公開情報から、重要な注意喚起と日本への波及可能性を検討します。',paragraphs:[
 '【確認された情報】'+lead.source+'が「'+lead.title+'」を公開しています。公開フィードの概要は「'+(lead.description||'詳細情報は元記事を参照')+'」です。掲載内容だけで実際の攻撃や国内被害が確認されたとは限りません。',
 '【独自分析】最も注目した事象は6つの評価軸で'+lead.value+'点相当です。関連する技術が広く利用される場合、業界間の依存や復旧手順の複雑さが影響を増幅する可能性があります。ただし個別組織の採用状況は未確認です。',
 '【日本への示唆】製品・サービスの利用有無を確認し、公式の注意喚起と提供元の対策を優先してください。重要業務では代替手段と復旧の優先順位を確認することが有用です。',
 '【不確実性】これは見出しと短い概要に基づく定型の初期分析です。独自取材、記事本文の精査、専門家による検証を経た約5,000字のインテリジェンス記事ではありません。'
 ]};
}
