// JCTI v1: domestic systemic threat, independent of editorial article scores.
export const jctiAxes=[['frequency','発生頻度・増加速度',15],['diversity','脅威の多様性',10],['technology','攻撃能力・技術進化',15],['ai','AIによる増幅',15],['targeting','対日脅威',10],['dependency','デジタル依存度',10],['cascade','複合・連鎖リスク',10],['anxiety','社会的不安',15]];
export const jctiSnapshot={
  "date": "2026-11-24",
  "observations": [
    {
      "id": "frequency",
      "score": 80,
      "sources": [
        "https://www.npsc.go.jp/pressconf_2026/03_12.htm",
        "https://www.npa.go.jp/publications/statistics/cybersecurity/data/R7/R07_cyber_jousei.pdf"
      ],
      "period": "2025",
      "rationale": "フィッシング報告前年比42.9%増、ランサム被害226件。高水準かつ増加を80とする暫定段階評価。",
      "confidence": "medium",
      "calibrated": false,
      "provisional": true
    },
    {
      "id": "diversity",
      "score": 80,
      "sources": [
        "https://www.ipa.go.jp/pressrelease/2025/press20260129.html",
        "https://www.npsc.go.jp/pressconf_2026/03_12.htm"
      ],
      "period": "2025",
      "rationale": "犯罪、国家背景、供給網、内部不正、DDoSなど複数類型が確認され、広範な脅威を80と評価。",
      "confidence": "medium",
      "calibrated": false,
      "provisional": true
    },
    {
      "id": "technology",
      "score": 80,
      "sources": [
        "https://www.npa.go.jp/publications/statistics/cybersecurity/data/R7/R07_cyber_jousei.pdf",
        "https://www.npsc.go.jp/pressconf_2026/03_12.htm"
      ],
      "period": "2025",
      "rationale": "防御に応じ通信方式を変更する攻撃と脆弱性探索の最多記録。高度な適応能力を80と評価。",
      "confidence": "medium",
      "calibrated": false,
      "provisional": true
    },
    {
      "id": "ai",
      "score": 60,
      "sources": [
        "https://www.npsc.go.jp/pressconf_2026/03_12.htm",
        "https://www.ipa.go.jp/pressrelease/2025/press20260129.html"
      ],
      "period": "2025",
      "rationale": "生成AI悪用による偽サイト・不正プログラム作成が確認。増幅量の比較測定がないため60の暫定評価。",
      "confidence": "low",
      "calibrated": false,
      "provisional": true
    },
    {
      "id": "targeting",
      "score": 80,
      "sources": [
        "https://www.npsc.go.jp/pressconf_2026/03_12.htm"
      ],
      "period": "2025",
      "rationale": "国家関与が疑われる攻撃が国内で確認。対日標的化が顕著なため80。",
      "confidence": "medium",
      "calibrated": false,
      "provisional": true
    },
    {
      "id": "dependency",
      "score": 85.7,
      "sources": [
        "https://www.nict.go.jp/info-barrierfree/relate/statistics/elder_net.html"
      ],
      "period": "2025",
      "rationale": "国民のネット利用率85.7%をデジタル依存の代理指標として使用。業務依存そのものではない。",
      "confidence": "low",
      "calibrated": false,
      "provisional": true
    },
    {
      "id": "cascade",
      "score": 80,
      "sources": [
        "https://www.npsc.go.jp/pressconf_2026/03_12.htm",
        "https://www.ipa.go.jp/pressrelease/2025/press20260129.html"
      ],
      "period": "2025",
      "rationale": "企業活動の長期阻害と国民生活への影響、供給網攻撃の上位継続を根拠に80。全国的連鎖の定量測定なし。",
      "confidence": "low",
      "calibrated": false,
      "provisional": true
    },
    {
      "id": "anxiety",
      "score": 71.8,
      "sources": [
        "https://www.caa.go.jp/policies/policy/consumer_system/meeting_materials/assets/consumer_system_cms205_251208_02.pdf"
      ],
      "period": "2024",
      "rationale": "総務省調査のネット利用時に不安を感じる割合71.8%を代理指標として使用。サイバー専用の不安尺度ではない。",
      "confidence": "medium",
      "calibrated": false,
      "provisional": true
    }
  ],
  "provisional": true
};
export const jctiHistory=[{"date":"2026-11-24","observations":[{"id":"frequency","score":80,"sources":["https://www.npsc.go.jp/pressconf_2026/03_12.htm","https://www.npa.go.jp/publications/statistics/cybersecurity/data/R7/R07_cyber_jousei.pdf"],"period":"2025","rationale":"フィッシング報告前年比42.9%増、ランサム被害226件。高水準かつ増加を80とする暫定段階評価。","confidence":"medium","calibrated":false,"provisional":true},{"id":"diversity","score":80,"sources":["https://www.ipa.go.jp/pressrelease/2025/press20260129.html","https://www.npsc.go.jp/pressconf_2026/03_12.htm"],"period":"2025","rationale":"犯罪、国家背景、供給網、内部不正、DDoSなど複数類型が確認され、広範な脅威を80と評価。","confidence":"medium","calibrated":false,"provisional":true},{"id":"technology","score":80,"sources":["https://www.npa.go.jp/publications/statistics/cybersecurity/data/R7/R07_cyber_jousei.pdf","https://www.npsc.go.jp/pressconf_2026/03_12.htm"],"period":"2025","rationale":"防御に応じ通信方式を変更する攻撃と脆弱性探索の最多記録。高度な適応能力を80と評価。","confidence":"medium","calibrated":false,"provisional":true},{"id":"ai","score":60,"sources":["https://www.npsc.go.jp/pressconf_2026/03_12.htm","https://www.ipa.go.jp/pressrelease/2025/press20260129.html"],"period":"2025","rationale":"生成AI悪用による偽サイト・不正プログラム作成が確認。増幅量の比較測定がないため60の暫定評価。","confidence":"low","calibrated":false,"provisional":true},{"id":"targeting","score":80,"sources":["https://www.npsc.go.jp/pressconf_2026/03_12.htm"],"period":"2025","rationale":"国家関与が疑われる攻撃が国内で確認。対日標的化が顕著なため80。","confidence":"medium","calibrated":false,"provisional":true},{"id":"dependency","score":85.7,"sources":["https://www.nict.go.jp/info-barrierfree/relate/statistics/elder_net.html"],"period":"2025","rationale":"国民のネット利用率85.7%をデジタル依存の代理指標として使用。業務依存そのものではない。","confidence":"low","calibrated":false,"provisional":true},{"id":"cascade","score":80,"sources":["https://www.npsc.go.jp/pressconf_2026/03_12.htm","https://www.ipa.go.jp/pressrelease/2025/press20260129.html"],"period":"2025","rationale":"企業活動の長期阻害と国民生活への影響、供給網攻撃の上位継続を根拠に80。全国的連鎖の定量測定なし。","confidence":"low","calibrated":false,"provisional":true},{"id":"anxiety","score":71.8,"sources":["https://www.caa.go.jp/policies/policy/consumer_system/meeting_materials/assets/consumer_system_cms205_251208_02.pdf"],"period":"2024","rationale":"総務省調査のネット利用時に不安を感じる割合71.8%を代理指標として使用。サイバー専用の不安尺度ではない。","confidence":"medium","calibrated":false,"provisional":true}],"provisional":true}]; // Append only fully validated dated snapshots; never erase on failed collection.
function evaluateSnapshot(snapshot){
 const entries=jctiAxes.map(([id,label,weight])=>{const row=snapshot.observations.find(x=>x.id===id&&(x.calibrated===true||(snapshot.provisional===true&&x.provisional===true))&&Number.isFinite(x.score)&&x.score>=0&&x.score<=100&&x.sources?.length&&x.period&&x.rationale&&x.confidence);return {id,label,weight,score:row?.score??null};});
 const coverage=entries.reduce((n,e)=>n+(e.score===null?0:e.weight),0);
 const lower=entries.reduce((n,e)=>n+(e.score??0)*e.weight/100,0);
 return {provisional:snapshot.provisional===true,date:snapshot.date,entries,coverage,score:coverage===100?Math.round(lower):null,range:[Math.floor(lower),Math.ceil(lower+100-coverage)]};
}

export function evaluateJCTI(snapshot=jctiSnapshot,history=jctiHistory){
 const current=evaluateSnapshot(snapshot);
 if(current.score!==null)return {...current,status:'current',currentCoverage:current.coverage};
 const previous=history.filter(x=>x.date<=snapshot.date).map(evaluateSnapshot).filter(x=>x.score!==null).sort((a,b)=>b.date.localeCompare(a.date))[0];
 return previous?{...previous,status:'previous',currentCoverage:current.coverage}:{...current,status:'unavailable',currentCoverage:current.coverage};
}
