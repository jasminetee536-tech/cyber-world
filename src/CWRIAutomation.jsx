import React,{useEffect,useState} from 'react';
export default function CWRIAutomation(){
 const [data,setData]=useState(null),[error,setError]=useState(''),[reviews,setReviews]=useState(null);
 useEffect(()=>{let active=true;const load=()=>fetch('/api/cwri').then(r=>{if(!r.ok)throw Error('取得できませんでした');return r.json()}).then(x=>{if(active){setData(x);setError('')}}).catch(()=>{if(active)setError('公式データを取得できませんでした')});load();fetch('/api/cwri/reviews').then(r=>r.json()).then(x=>{if(active)setReviews(x)}).catch(()=>{});const timer=setInterval(load,1800000);return()=>{active=false;clearInterval(timer)}},[]);
 return <section className="cw-section" style={{margin:'28px 0'}}>
 <div className="cw-section-head"><div><span className="cw-kicker">AUTOMATED EVIDENCE WATCH / CWRI v1.0</span><h2>自動収集・評価待ちシグナル</h2></div></div>
 <p>公式データから自動取得。悪用確認済みの脆弱性は事件発生の証拠とは異なるため、被害を確認するまで事件重大度を採点しません。</p>
 {error&&<p className="cw-empty">{error}</p>}
 {data&&<><p>最終取得：{data.updatedAt?.slice(0,16).replace('T',' ')} UTC / KEV収録 {data.metrics?.kevCatalogTotal??'不明'}件 / NVD直近24時間 {data.metrics?.nvdPublishedLast24h??'取得不可'}件</p>
 <div className="cw-future-grid">{data.signals?.slice(0,4).map(x=><article key={x.id} className="cw-future-card" style={{textAlign:'left',cursor:'default'}}><small>{x.date} / {x.category} / {x.level}</small><h3>{x.id} — {x.title}</h3><p>{x.description}</p><div><span>CWRI：被害未確認・採点保留</span><a href={x.sourceUrl} target="_blank" rel="noopener noreferrer">公式資料 ↗</a></div></article>)}</div>
 <p className="cw-footnote">分類は自動であり、個別事件の存在や日本への影響を示すものではありません。継続保存にはCloudflare D1の設定が必要です。</p></>}
 {reviews?.status==='ok'&&<div style={{marginTop:20}}><h3>7日後・30日後の自動レビュー</h3><p>直近の公開情報の変化を記録しています。これは被害の解決判定ではありません。</p>{reviews.reviews?.slice(0,6).map((x,i)=><p key={i}>{x.day} / {x.window_days}日後 / {x.cve} — {x.reason}</p>)}</div>}{reviews?.status==='not_configured'&&<p className="cw-footnote">レビュー履歴の永続保存は準備中です。</p>}{!data&&!error&&<p className="cw-empty">公式データを確認しています。</p>}
 </section>
}
