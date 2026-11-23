import React,{useState} from 'react';
import {CWRI_VERSION,incidentAxes,annualAxes,rubric,weightedScore,severity,referenceStandards} from './cwri.js';
export default function CWRIPanel({compact=false}){
 const [mode,setMode]=useState('incident');
 const [ratings,setRatings]=useState({});
 const axes=mode==='incident'?incidentAxes:annualAxes;
 const score=weightedScore(axes,ratings);
 const update=(id,value)=>setRatings(old=>({...old,[id]:value===''?undefined:Number(value)}));
 return <section className="cw-section cw-cwri-panel" style={{border:'1px solid #1b5268',borderRadius:18,padding:'24px',margin:'24px 0',background:'linear-gradient(145deg,#0b293e,#071c30)'}}>
  <span className="cw-kicker">CYBER WORLD ORIGINAL / CWRI v{CWRI_VERSION}</span>
  <h2>CYBER WORLD RISK INDEX</h2>
  <p>世界の評価方式を参考にした独自の試算モデルです。事件の重大性と年間の情勢を分けて評価します。これは政府の警戒レベルではありません。</p>
  <div style={{display:'flex',gap:10,flexWrap:'wrap',margin:'18px 0'}}>
   <button className="cw-pill" onClick={()=>{setMode('incident');setRatings({})}} aria-pressed={mode==='incident'}>事件重大度</button>
   <button className="cw-pill" onClick={()=>{setMode('annual');setRatings({})}} aria-pressed={mode==='annual'}>年間スコア</button>
  </div>
  {axes.map(a=><label key={a.id} style={{display:'block',margin:'14px 0',color:'#e8f7ff'}}>
   <span style={{display:'flex',justifyContent:'space-between',gap:8}}><b>{a.label}</b><span>{ratings[a.id]===undefined?'未入力':Math.round(a.weight*ratings[a.id]/5)+' / '+a.weight+'点'}</span></span>
   <select style={{width:'100%',padding:10,marginTop:8,borderRadius:8,background:'#102f44',color:'#fff',border:'1px solid #2b6578'}} value={ratings[a.id]??''} onChange={e=>update(a.id,e.target.value)}><option value="">評価を選択</option>{rubric.map((label,i)=><option key={i} value={i}>{label}</option>)}</select>
   {a.guide&&<small style={{color:'#a8c6d5'}}>{a.guide}</small>}
  </label>)}
  <div style={{padding:'18px 0',borderTop:'1px solid #28546b',marginTop:16}}>
   <small>試算結果（入力が全て揃うまで非表示）</small>
   <h3 style={{fontSize:30,margin:'6px 0',color:'#4bdaf2'}}>{score===null?'未評価':score+' / 100'} <span style={{fontSize:15}}>{severity(score)}</span></h3>
   <p style={{fontSize:13}}>試算は公開された事件の正式評価ではありません。実際の掲載には出典URL・評価日・評価版・信頼度A〜D・根拠説明を必須とします。日本関連度（JRI）は事件重大度とは独立した評価です。</p>
  </div>
  {!compact&&<><h3>参考にした国際的な枠組み</h3><div style={{display:'grid',gap:10}}>{referenceStandards.map(r=><a key={r.name} href={r.url} target="_blank" rel="noopener noreferrer" style={{color:'#62d9f0'}}>{r.name} — {r.note} ↗</a>)}</div><p style={{fontSize:13,marginTop:18}}>CVSSは技術的重大性、EPSSは悪用確率、SSVCは対応判断を扱います。これらを単純合算した指標ではありません。年間評価は収録件数・出典カバレッジを検証後に確定します。</p></>}
 </section>
}
