import React,{useState} from 'react';
import {MODEL,score,levelFor,LEVELS,AXIS_ANCHORS,scenarioBlueprints,newsEvidence} from './future-research.js';
import {futureLongform} from './future-longform.js';
import PageUpdate from './PageUpdate.jsx';
import './future-intelligence.css';
import './threat-monitor.css';
const essayMap=new Map(futureLongform.map(x=>[x.id,x]));
const axisReasons={
  "fi-20261125-control-plane": [
    "共通管理基盤が複数業務を結ぶ構造と管理製品の脆弱性情報が整合する。国内の依存規模は不明。",
    "復元時にも同じ管理権限が必要なら復旧操作が制約される。実際の復旧失敗は未確認。",
    "サーバー復元後も業務記録の確認が必要になり得る。停止期間の実測はない。",
    "自律判断による連鎖実行を示す観測はない。",
    "独立復旧の可否は通常の稼働監視だけでは分からないが、試験で確認可能。",
    "独立管理が調達条件になる可能性はあるが、制度化の証拠はない。"
  ],
  "fi-20261125-web-maintenance": [
    "公開窓口と実行環境の異なる保守責任が二つの告知と整合する。同一攻撃ではない。",
    "片方の更新だけでは安全性を確認できない可能性があるが、更新起因の障害は未確認。",
    "更新後の予約・認証確認が必要になり得るが、長期停止の実測はない。",
    "自律的な判断連鎖の根拠はない。",
    "資産と保守責任の対応が不明なら対象判定が遅れる構造が明確。ただし国内割合は不明。",
    "契約への修正期限導入は仮説であり、普及の証拠はない。"
  ],
  "fi-20261125-ot-maintenance": [
    "監視・制御と生産工程の依存関係が製品告知と整合する。国内の設備構成は不明。",
    "更新には停止と安全確認が必要な場合があり、保守と操業の両立が課題。事故実績は未確認。",
    "設備復元後も安全確認や出荷判定が残る構造がある。所要時間は未測定。",
    "機械の自律判断による影響拡大は今回の資料から確認できない。",
    "保守枠不足は稼働率だけでは把握しにくいが、保守記録で確認可能。",
    "安全な再稼働能力が供給条件になる可能性はあるが、契約実態は不明。"
  ],
  "fi-20261125-managed-edge": [
    "端末と提供元の配信基盤への依存は確認できるが、複数事業者への波及は不明。",
    "自動更新は負担を減らす一方、未接続端末では到達が遅れ得る。更新障害は未確認。",
    "通信回復後に決済などの再確認が必要な可能性はあるが、被害実績はない。",
    "自動配信は確認されるが、自律判断による障害増幅は確認されていない。",
    "利用者から更新到達状況が見えにくい可能性があるが、実測はない。",
    "更新保証が契約選択に影響する仮説はあるが、制度化は未確認。"
  ],
  "fi-jp-1": [
    "取引先と操業の依存を想定した評価。独立した複数の波及事例は提示されておらず4点の裏付けは不足。",
    "復旧と顧客対応が重なる構造を評価。復旧操作自体による拡大の実測はない。",
    "取引再開までの遅延を重視した評価だが、複数の独立した期間データがなく4点の裏付けは不足。",
    "自律判断の関与は確認されていない。",
    "端末復旧率だけでは取引再開を測れない。国内の測定状況は不明。",
    "共同復旧が取引条件になる可能性を評価。制度変化は未確認。"
  ],
  "fi-jp-2": [
    "共通委託先への依存を重視した評価。独立した波及事例が不足し4点の裏付けは不足。",
    "委託先の復旧と顧客側の復旧が相互に制約される仮説。実測はない。",
    "委託先復旧後も顧客側の確認が残る可能性。期間は未測定。",
    "自律判断の根拠はない。",
    "委託先の復旧能力は顧客側から把握しにくい。監査実態は不明。",
    "復旧能力が取引条件になる仮説。契約の普及率は不明。"
  ],
  "fi-jp-3": [
    "生成物と業務権限の結合を評価。具体的な国内連鎖事例は不足。",
    "誤った生成物が正規業務に取り込まれる可能性。実際の拡大は未確認。",
    "判断取消後も訂正が必要な場合があるが、期間は不明。",
    "AIの判断と実行権限の結合を重視した評価。独立した実証が不足し4点の裏付けは不足。",
    "判断根拠や取消可能性の監視が課題。国内の実態は不明。",
    "AI導入による業務前提の変化を重視した評価。複数の独立した転換証拠がなく4点の裏付けは不足。"
  ],
  "fi-jp-4": [
    "遠隔接続と業務継続の依存を評価。個別構成は不明。",
    "更新の遅れと保守負担を評価。更新操作による拡大は未確認。",
    "侵害後の業務確認が残る可能性。復旧期間の実測はない。",
    "自律判断の根拠はない。",
    "未修正資産の把握が課題。調査対象外の実態は不明。",
    "更新能力が取引条件になる仮説。制度化は未確認。"
  ],
  "fi-jp-5": [
    "機密情報と産業活動の依存を評価。具体的な波及範囲は不明。",
    "正規の情報共有が漏えい経路になる可能性。観測は限定的。",
    "窃取後は情報の秘密性を完全に戻せない可能性。損失規模は不明。",
    "自律判断の根拠はない。",
    "窃取と帰属の把握困難を重視した評価。独立した観測が不足し4点の裏付けは不足。",
    "継続的保護が競争条件になる仮説。転換の実測はない。"
  ],
  "fi-jp-6": [
    "重要サービスへの依存を重視した評価。独立した広域波及の証拠が不足し4点の裏付けは不足。",
    "代替経路への集中が負荷を増やす可能性。実測はない。",
    "再開後も滞留業務が残る可能性。期間は不明。",
    "自律判断の根拠はない。",
    "停止は観測できても代替経路の余力は把握しにくい。",
    "代替経路の標準化は仮説であり普及率は不明。"
  ],
  "fi-jp-7": [
    "認証情報の再利用による複数サービスへの依存を評価。国内規模は不明。",
    "本人確認の手続が救済を遅らせる可能性。実測はない。",
    "本人確認と生活再建の遅れを重視した評価。独立した期間データが不足し4点の裏付けは不足。",
    "自律判断の根拠はない。",
    "サービス横断の被害把握が難しい可能性。実測はない。",
    "本人確認の回復が生活支援の条件になる仮説。制度化は不明。"
  ],
  "fi-jp-8": [
    "情報流通と社会参加の依存を評価。国内波及規模は不明。",
    "正規の情報共有が誤情報の拡散につながる可能性。個別実績は不足。",
    "訂正後も信頼回復に時間がかかる可能性。期間は不明。",
    "AIによる生成・拡散の増幅を評価。国内の連鎖実測は不足。",
    "真正性の判定困難を重視した評価。独立した測定が不足し4点の裏付けは不足。",
    "出所確認の標準化は仮説。普及率は不明。"
  ],
  "fi-jp-9": [
    "決済・本人確認と生活の依存を評価。国内波及規模は不明。",
    "正規の本人確認が救済を遅らせる可能性。実測はない。",
    "資金回復までの負担を重視した評価。独立した期間データが不足し4点の裏付けは不足。",
    "自動判定が救済に関わる可能性はあるが、増幅の実測はない。",
    "被害額だけでは救済負担を把握できない。実測はない。",
    "救済速度が安全評価の条件になる仮説。制度化は不明。"
  ],
  "fi-jp-10": [
    "保守人材と事業継続の依存を評価。企業別の構成は不明。",
    "安全対策の運用負担が対応遅延につながる仮説。実測は不足。",
    "復旧後も人員・資金負担が残る可能性。期間は不明。",
    "自律判断の根拠はない。",
    "対策導入率だけでは運用負担を測れない点を重視。独立した測定が不足し4点の裏付けは不足。",
    "企業間格差の拡大は仮説。長期の比較データは不足。"
  ]
};
function AxisReview({item}){return <section className="cw-fi-axis-review"><h3>6つの評価軸と採点理由</h3><p>SFIは将来の構造変化を調べる優先度です。各項目を0〜5点で評価し、配点を掛けて合計します。以下は既存採点の編集上の説明であり、独立した実証による再採点ではありません。</p>{MODEL.axes.map((a,i)=>{const v=item.ratings[a.id],anchor=AXIS_ANCHORS.find(x=>x.value===v);return <section key={a.id} className="cw-fi-essay-section"><h3>{i+1} / {a.label}</h3><p><b>何を測るか：</b>{a.description}。</p><p><b>評価：{v}/5（{anchor?.label}）</b> · 配点 {a.weight}% · 加重点 {Math.round(v*a.weight/5*10)/10}点</p><p><b>基準：</b>{anchor?.rule}。</p><p><b>この記事の採点理由と限界：</b>{axisReasons[item.id]?.[i]||'個別の採点根拠は未登録です。根拠の確認が必要です。'}</p></section>})}<p><b>合計：{score(item.ratings)} / 100 · {levelFor(score(item.ratings)).name}</b>（加重点の合計を整数に丸めた値）</p><p>{levelFor(score(item.ratings)).meaning}。根拠不足の項目は暫定値として扱い、発生確率とは区別します。</p></section>}
export default function FutureIntelligence(){
 const [opened,setOpened]=useState(null);
 const [scoreOpen,setScoreOpen]=useState(null);
 const [weeklyOpen,setWeeklyOpen]=useState(false);
 const weeklyItems=scenarioBlueprints;
 const weeklyScore=weeklyItems.length?Math.round(weeklyItems.reduce((sum,a)=>sum+score(a.ratings),0)/weeklyItems.length):null;
 const tone=n=>n>=70?'red':n>=55?'yellow':'green';
 const [category,setCategory]=useState('すべて');
 const categories=['すべて',...new Set(scenarioBlueprints.map(x=>x.category))];
 const shown=scenarioBlueprints.filter(x=>category==='すべて'||x.category===category);
 const latestDate=newsEvidence.map(x=>x.date?.match(/\d{4}-\d{2}-\d{2}/)?.[0]).filter(Boolean).sort().at(-1);
 const weekStart=latestDate?new Date(latestDate+'T00:00:00Z'):null;
 if(weekStart)weekStart.setUTCDate(weekStart.getUTCDate()-(weekStart.getUTCDay()+6)%7);
 const weekKey=weekStart?.toISOString().slice(0,10);
 const keywords=[...new Set(weeklyItems.filter(a=>a.news?.some(i=>{const d=newsEvidence[i]?.date?.match(/\d{4}-\d{2}-\d{2}/)?.[0];return d&&weekKey&&d>=weekKey&&d<=latestDate})).sort((a,b)=>score(b.ratings)-score(a.ratings)).map(a=>a.category))].slice(0,3);
 return <div className="cw-fi tm-page cw-fi-monitor">
 <header className="tm-heading"><div><small>JAPAN CYBER FORESIGHT INTELLIGENCE</small><h1>未来予測</h1></div><PageUpdate page="未来予測" badge="SFI"/></header>
 <section className="tm-weekly-panel"><div className="tm-weekly-left"><small>JAPAN STRATEGIC FORESIGHT</small><h2>FUTURE INDEX</h2><div style={{display:'grid',gap:6}}><small style={{color:'#8bd9ef',fontSize:11}}>今週のキーワード</small><div style={{display:'flex',flexWrap:'wrap',gap:5}}>{keywords.length?keywords.map(k=><span key={k} style={{fontSize:12,color:'#d6edf7',border:'1px solid #345c73',borderRadius:5,padding:'4px 7px'}}>{k}</span>):<small>観測データ収集中</small>}</div></div></div><button type="button" className={'tm-weekly-gauge tm-text-'+(weeklyScore===null?'unknown':weeklyScore>=85?'critical':weeklyScore>=70?'high':weeklyScore>=55?'medium':'low')} onClick={()=>setWeeklyOpen(true)} aria-label="フューチャースコアの算出詳細"><svg viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="55" fill="#091827" stroke="#38566a" strokeDasharray="1 4"/><circle cx="60" cy="60" r="57" className="cw-score-orbit" fill="none" stroke="#58dfff" strokeWidth="3" pathLength="100" strokeDasharray="12 88" opacity=".45" style={{filter:"blur(2px)"}}/><circle cx="60" cy="60" r="57" className="cw-score-orbit" fill="none" stroke="#79e8ff" strokeWidth="1.8" pathLength="100" strokeDasharray="12 88"/><circle cx="60" cy="60" r="51" fill="none" stroke="#39768f" strokeWidth=".7" strokeDasharray="1 4"/><circle cx="60" cy="60" r="46" fill="none" stroke="#263a4b" strokeWidth="3.5"/><circle cx="60" cy="60" r="46" fill="none" stroke="currentColor" strokeWidth="3.5" pathLength="100" strokeDasharray={`${weeklyScore??0} 100`} transform="rotate(-90 60 60)" strokeLinecap="round"/><text x="60" y="41" textAnchor="middle" fontSize="7" fill="#d3e5ee">FUTURE SCORE</text><text x="60" y="71" textAnchor="middle" fontSize="29" fontWeight="bold" fill="currentColor">{weeklyScore??'—'}</text><text x="60" y="84" textAnchor="middle" fontSize="8" fill="#b3c9d8">/ 100</text></svg><span>{weeklyScore===null?'未評価':levelFor(weeklyScore).name.split(' / ')[0]} · 採点詳細 ↗</span></button></section>
 <div className="tm-mission"><strong>日本の未来を読み解く。</strong><p>脅威情報と蓄積された観測をもとに、社会・技術・産業の構造変化を分析します。SFIは分析優先度であり、発生確率ではありません。</p></div>
 <div className="tm-category-toolbar"><div className="tm-category-field"><label htmlFor="fi-category">カテゴリー</label><select id="fi-category" value={category} onChange={e=>setCategory(e.target.value)}>{categories.map(x=><option key={x} value={x}>{x==='すべて'?'すべてのカテゴリー':x}</option>)}</select></div></div>
 
 <section className="cw-fi-section" style={{margin:"20px 0 34px"}}><div className="cw-fi-section-head"><div><small>01 / ORIGINAL STRATEGIC FORECASTS</small><h2>予測アーカイブ</h2></div><span>独自分析 / 基準版</span></div><div className="cw-fi-grid">{shown.map(a=><article className="cw-fi-card cw-fi-compact" key={a.id}><div className="tm-editorial-meta cw-fi-publication"><span>FORECAST REPORT</span>{a.date?<time dateTime={a.date}>{a.date}</time>:<span>公開日未記録</span>}</div><div className="cw-fi-card-top"><small>{a.category}</small><button type="button" className={'cw-fi-score cw-fi-tone-'+tone(score(a.ratings))} aria-label={a.title+'の採点詳細'} onClick={()=>setScoreOpen(a)}><strong>{score(a.ratings)}</strong><span>/100 ⓘ</span></button></div><button type="button" className="cw-fi-read-title" onClick={()=>setOpened(a)}><h3>{a.title}</h3><span>予測を読む ↗</span></button><div className="cw-fi-card-bottom"><span>{levelFor(score(a.ratings)).name}</span></div></article>)}</div></section>
 <section className="cw-fi-section"><div className="cw-fi-section-head"><div><small>02 / OBSERVED SIGNALS</small><h2>未来仮説の起点となったニュース</h2></div></div><p className="cw-fi-subtext">ニュース本文を転載せず、確認可能な出来事と独自の推論を分離しています。別々の障害を一つの攻撃と断定しません。</p><div className="cw-fi-stream">{newsEvidence.map((x,i)=><a href={x.url} target="_blank" rel="noopener noreferrer" key={x.url}><small>{x.date} / {x.source}</small><strong>{x.title}</strong><span>原文 ↗</span></a>)}</div></section>
 <details className="cw-fi-method-fold"><summary>評価基準・分析方法論 / SFI</summary> <section className="cw-fi-method"><div><small>ORIGINAL FORECASTING METHODOLOGY</small><h2>STRUCTURAL FORESIGHT INDEX <em>SFI</em></h2><p>「重大そうか」ではなく、既存の監視で見落とされる構造変化を分析する優先度を測ります。各軸0〜5点、重み付き合計0〜100点。<b>発生確率、実際の国内脆弱性、モデルの予測精度を示す数字ではありません。</b>重みは仮説段階で、校正・検証は未実施です。85点以上は例外的な場合のみ付与します。</p></div><div className="cw-fi-method-axes">{MODEL.axes.map(a=><div key={a.id} title={a.description}><span>{a.label}</span><strong>{a.weight}%</strong></div>)}</div></section>
 <section className="cw-fi-section cw-fi-levels"><div className="cw-fi-section-head"><div><small>SFI / LEVEL DEFINITIONS</small><h2>スコアの意味と警戒レベル</h2></div></div><div className="cw-fi-level-grid">{LEVELS.map(x=><div key={x.min}><strong>{x.min}–{x.max}</strong><b>{x.name}</b><span>{x.meaning}</span></div>)}</div><details className="cw-fi-anchors"><summary>各評価軸の0〜5点の採点基準を見る</summary>{AXIS_ANCHORS.map(x=><p key={x.value}><b>{x.value}点 / {x.label}</b> — {x.rule}</p>)}</details></section>
</details>
 {weeklyOpen&&<div className="cw-fi-overlay" onClick={()=>setWeeklyOpen(false)} onKeyDown={e=>{if(e.key==='Escape')setWeeklyOpen(false)}}><article className="cw-fi-drawer" role="dialog" aria-modal="true" aria-label="総合予測指数" onClick={e=>e.stopPropagation()}><div className="cw-article-controls"><button type="button" className="cw-article-back" autoFocus onClick={()=>setWeeklyOpen(false)}>← 戻る</button></div><div className="cw-kicker">FUTURE WEEKLY / COMPOSITE INDEX</div><h2>総合予測指数</h2><div className={'cw-fi-score cw-fi-tone-'+tone(weeklyScore)}><strong>{weeklyScore??'—'}</strong><span>/100</span></div><p>暫定方式：収録予測の個別SFIを等重みで平均し、整数に丸めます。現在は週別データが未整備のため全収録記事を対象とします。発生確率や世界全体の危険度ではありません。</p><details className="cw-fi-method-fold"><summary>予測メカニズム / THREAT-DRIVEN FORESIGHT</summary><section className="cw-fi-section"><div className="cw-fi-section-head"><div><small>CYBER WORLD / CONTINUOUS INTELLIGENCE</small><h2>脅威情報から未来を読み解く</h2></div></div><p className="cw-fi-subtext">未来予測は脅威モニターの観測情報を起点とし、情報基盤に蓄積した事実・過去の分析・反証を統合して構造変化を分析する。個々のニュースを単純に将来へ延長するものではない。</p><div className="cw-fi-method-axes">{[
['01 / OBSERVE','脅威モニター','新規記事と全履歴、公開記事以外の構造化観測を参照。事象ID・出典・観測日・検証状態を区別する。'],
['02 / ACCUMULATE','情報基盤','同一事象の続報を統合し、過去の予測・採点・反証を知識として保持する。'],
['03 / CORRELATE','構造変化の抽出','複数事象の共通機序、依存関係、攻防能力の変化を検討。7・30・90日および長期比較は観測範囲と母数が揃う場合に行う。相関は因果の証明ではない。'],
['04 / FORECAST','未来予測','既存分析を発展させ、短期1年以内・中期1〜5年・長期5〜10年の条件付き仮説を形成。新たな知見があれば同じテーマも分析する。'],
['05 / SCORE','評価','個別SFIは分析優先度であり発生確率ではない。同一証拠を二重加点しない。総合未来リスクの独立評価は今後整備する。'],
['06 / REVIEW','検証と還流','支持・反証・不明を区別し、維持・強化・弱化・修正・撤回を判断。過去の予測を消さず次回の分析に活用する。']
].map(([en,t,d])=><div key={en} style={{display:'block',padding:'14px',minWidth:0}}><small>{en}</small><h3>{t}</h3><p style={{whiteSpace:'normal',lineHeight:1.8}}>{d}</p></div>)}</div><h3>連動状況と今後の拡張</h3><p>現段階では脅威記事IDを分析に紐付け、保存済み観測と既存分析を日次タスクで再評価する運用を開始している。全記事の紐付け、統計的相関分析、予測検証の自動化は未完成。AI分析との連動は今後の拡張であり、AIの攻撃・防御能力、自律性、技術普及、監督能力の観測を情報基盤に蓄積し、将来の攻防格差を評価する計画である。</p><p><a className="cw-fi-source" href="#脅威モニター" onClick={e=>{e.preventDefault();window.location.hash=encodeURIComponent('脅威モニター');window.location.reload()}}>脅威モニター ↗</a>　<a className="cw-fi-source" href="#情報基盤" onClick={e=>{e.preventDefault();window.location.hash=encodeURIComponent('情報基盤');window.location.reload()}}>情報基盤 ↗</a></p></section></details><h3>対象予測と算出式</h3>{weeklyItems.map(a=><div className="cw-fi-breakdown" key={a.id}><div><span>{a.title}</span><strong>{score(a.ratings)}</strong></div></div>)}<p>{weeklyItems.length?'('+weeklyItems.map(a=>score(a.ratings)).join(' + ')+') ÷ '+weeklyItems.length+' ≈ '+weeklyScore:'対象なし'}</p><h3>評価軸別の平均</h3>{MODEL.axes.map(a=><div className="cw-fi-breakdown" key={a.id}><div><span>{a.label} / {a.weight}%</span><strong>{weeklyItems.length?(weeklyItems.reduce((s,x)=>s+x.ratings[a.id],0)/weeklyItems.length).toFixed(2):'—'}/5</strong></div></div>)}<p>共通の根拠を持つ記事が含まれるため、独立した証拠の数を示す指標ではありません。</p></article></div>}
 {scoreOpen&&<div className="cw-fi-overlay" onClick={()=>setScoreOpen(null)} onKeyDown={e=>{if(e.key==='Escape')setScoreOpen(null)}}><article role="dialog" aria-modal="true" aria-label="分析スコア詳細" className="cw-fi-drawer" onClick={e=>e.stopPropagation()}><div className="cw-article-controls"><button type="button" className="cw-article-back" autoFocus onClick={()=>setScoreOpen(null)}>← 戻る</button></div><div className="cw-kicker">SFI / SCORE BREAKDOWN</div><h2>{scoreOpen.title}</h2><div className={'cw-fi-score cw-fi-tone-'+tone(score(scoreOpen.ratings))}><strong>{score(scoreOpen.ratings)}</strong><span>/100</span></div><p>{levelFor(score(scoreOpen.ratings)).name} / {levelFor(score(scoreOpen.ratings)).meaning}</p><p>確信度：{scoreOpen.confidence}。分析優先度であり発生確率ではありません。</p><AxisReview item={scoreOpen}/><h3>分析仮説と留保</h3><p>{scoreOpen.claim}</p><p>{scoreOpen.counter}</p><button className="cw-fi-read-title" onClick={()=>{setOpened(scoreOpen);setScoreOpen(null)}}>分析全文・評価根拠を読む ↗</button></article></div>}
 {opened&&<div className="cw-fi-overlay cw-fi-reader-overlay" onClick={()=>setOpened(null)}><article className="cw-fi-drawer cw-fi-reader-drawer" onClick={e=>e.stopPropagation()}><div className="cw-article-controls"><button type="button" className="cw-article-back" autoFocus onClick={()=>setOpened(null)}>← 戻る</button></div><div className="cw-kicker">CYBER WORLD / ORIGINAL LONGFORM INTELLIGENCE</div><h2>{opened.title}</h2><p className="cw-fi-lead">{opened.claim}</p><div className="cw-fi-drawer-score"><strong>{score(opened.ratings)}<small> / 100</small></strong><span>STRUCTURAL FORESIGHT INDEX<br/>{levelFor(score(opened.ratings)).name}<br/>確信度：{opened.confidence} / 未校正</span></div><p className="cw-fi-caveat">スコアは仮説の分析優先度であり、事象の発生確率ではありません。日本の特定施設の脆弱性を示すものではありません。</p>{(essayMap.get(opened.id)?.sections||[]).filter(sec=>sec.heading!=="SFI評価の留保").map((sec,i)=><section key={i} className="cw-fi-essay-section"><h3>{String(i+1).padStart(2,'0')} / {sec.heading}</h3>{sec.body.split('\n\n').map((p,j)=><p key={j}>{p}</p>)}</section>)}<AxisReview item={opened}/><h3>関連する脅威モニター記事</h3>{opened.threatIds?.length?<p>{opened.threatIds.join(" / ")} — 分析との関連を示す識別子。原資料の検証状態は本文を参照。</p>:<p>関連事象IDは未登録。</p>}<h3>根拠となった直近の報道・調査</h3>{opened.news.map(i=><a className="cw-fi-source" key={i} href={newsEvidence[i].url} target="_blank" rel="noopener noreferrer">{newsEvidence[i].source} / {newsEvidence[i].date} ↗</a>)}<h3>予測を見直す条件</h3><p>{opened.counter}</p><h3>今後の観測指標</h3><ul>{opened.watch.map(x=><li key={x}>{x}</li>)}</ul><p className="cw-fi-caveat">この長編分析は公開報道を出発点にCYBER WORLDが独自に構成した将来仮説です。取材に基づく独自の事実認定ではなく、将来の発生を保証しません。参考リンクは事実の出発点であり、推論の全てを裏付けるものではありません。</p></article></div>}
 </div>;
}
