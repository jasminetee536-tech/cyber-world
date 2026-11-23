import React from 'react';
import {CWRI_VERSION,incidentAxes,weightedScore,referenceStandards} from './cwri.js';
import './research.css';
const models=[
 {code:'01',title:'事件重大度',en:'INCIDENT SEVERITY',status:'既存モデル',desc:'実際に発生した事象の影響を、6つの軸で評価する。'},
 {code:'02',title:'脅威水準',en:'THREAT INTELLIGENCE',status:'研究予定',desc:'攻撃活動、悪用状況、脅威の変化を評価する。'},
 {code:'03',title:'国家・インフラリスク',en:'NATIONAL & INFRASTRUCTURE',status:'研究予定',desc:'重要機能への依存と連鎖障害の影響を研究する。'},
 {code:'04',title:'将来リスク',en:'FUTURE RISK',status:'研究予定',desc:'シナリオの発生可能性と影響を分けて検証する。'},
 {code:'05',title:'保険リスク',en:'INSURANCE RISK',status:'長期研究',desc:'事故頻度、損失額、集積リスクの推計を目指す。'}
];
export default function Research(){
 const [ratings,setRatings]=React.useState(Object.fromEntries(incidentAxes.map(a=>[a.id,0])));
 const score=weightedScore(incidentAxes,ratings);
 return <div className="cw-research">
 <section className="cw-research-hero"><div className="cw-kicker">CYBER WORLD / RESEARCH DIVISION</div><h1>サイバーリスクを、<br/><em>測定可能な科学へ。</em></h1><p>評価指標の選定、定義、計算式、精度検証。政府の意思決定と保険リスク分析にも応用できる、説明可能な評価モデルを研究します。</p><div className="cw-research-flags"><span>CWRI v{CWRI_VERSION}</span><span>RESEARCH / DRAFT</span><span>研究開発段階</span></div></section>
 <section className="cw-research-section"><div className="cw-research-heading"><div><small>01 / MODEL LIBRARY</small><h2>スコアリング研究領域</h2></div><p>完成済みのモデルと研究予定を明確に区別します。</p></div><div className="cw-research-grid">{models.map(m=><article className="cw-research-card" key={m.code}><small>{m.code} / {m.en}</small><h3>{m.title}</h3><p>{m.desc}</p><span>{m.status}</span></article>)}</div></section>
 <section className="cw-research-section"><div className="cw-research-heading"><div><small>02 / METHODOLOGY</small><h2>指標と計算式</h2></div><p>現在の事件重大度モデルの定義を公開します。</p></div><div className="cw-research-panel"><div className="cw-research-formula">S = Σ (wᵢ × rᵢ / 5)</div><p>各評価軸の評点 rᵢ は0〜5、重み wᵢ の合計は100。最終スコアは0〜100に丸めます。これは事件の重大度を表す編集評価であり、事故発生確率や保険料ではありません。</p><div className="cw-research-axes">{incidentAxes.map(a=><div key={a.id}><strong>{a.label}</strong><span>{a.weight}%</span><small>{a.guide}</small></div>)}</div></div></section>
 <section className="cw-research-section"><div className="cw-research-heading"><div><small>03 / SCORING SANDBOX</small><h2>計算式ラボ</h2></div><p>架空の入力値でスコアの感度を試す実験環境です。</p></div><div className="cw-research-panel"><div className="cw-research-score"><div><small>SIMULATION / NOT AN INCIDENT ASSESSMENT</small><h3>事件重大度シミュレーター</h3></div><strong>{score}<small> / 100</small></strong></div>{incidentAxes.map(a=><label className="cw-research-slider" key={a.id}><span>{a.label} <b>{ratings[a.id]} / 5</b></span><input type="range" min="0" max="5" step="1" value={ratings[a.id]} onChange={e=>setRatings(v=>({...v,[a.id]:Number(e.target.value)}))}/></label>)}<button className="cw-research-reset" onClick={()=>setRatings(Object.fromEntries(incidentAxes.map(a=>[a.id,0])))}>入力をリセット</button></div></section>
 <section className="cw-research-section"><div className="cw-research-heading"><div><small>04 / VALIDATION & RESEARCH</small><h2>検証・研究ノート</h2></div></div><div className="cw-research-grid cw-research-grid-two"><article className="cw-research-card"><small>VALIDATION LAB</small><h3>モデル比較・精度検証</h3><p>旧モデルと新モデルの採点差、評価者間の一致、予測誤差などを検証する予定です。</p><span>未実施 / 研究予定</span></article><article className="cw-research-card"><small>RESEARCH LOG</small><h3>研究履歴・バージョン管理</h3><p>指標の採用理由、計算式の変更、検証結果を記録していく予定です。</p><span>準備中</span></article></div></section>
 <section className="cw-research-section"><div className="cw-research-heading"><div><small>05 / REFERENCES</small><h2>参考基準と研究資料</h2></div></div><div className="cw-research-references">{referenceStandards.map(r=><a href={r.url} key={r.name} target="_blank" rel="noopener noreferrer"><strong>{r.name}</strong><span>{r.note}</span><b>↗</b></a>)}</div><p className="cw-research-note">本ページは研究構想のたたき台です。政府機関・保険会社による承認や、実運用に耐える予測精度を示すものではありません。研究機能の本格的な開発は、サイト全体の整備後に進めます。</p></section>
 </div>;
}
