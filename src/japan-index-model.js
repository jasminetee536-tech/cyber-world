// CWJI v1 — risk and capability scores are distinct.
export const domains={
  "threat": [
    [
      "攻撃活動",
      20,
      "同一観測網の攻撃活動の変化"
    ],
    [
      "攻撃能力",
      20,
      "公開分析による能力の実証"
    ],
    [
      "脆弱性・悪用状況",
      20,
      "国内曝露と悪用確認"
    ],
    [
      "対日攻撃意図",
      15,
      "対日標的化の公開証拠"
    ],
    [
      "被害規模",
      15,
      "国内被害の集計"
    ],
    [
      "脅威の進化速度",
      10,
      "新手法の普及速度"
    ]
  ],
  "ai": [
    [
      "攻撃能力の増幅",
      25,
      "比較実験の能力差"
    ],
    [
      "自律性・権限",
      20,
      "承認なしの操作範囲"
    ],
    [
      "AIシステムの安全性",
      15,
      "AI固有の侵害・漏えいリスク"
    ],
    [
      "攻防能力格差",
      15,
      "比較試験による能力差"
    ],
    [
      "AI基盤への依存",
      15,
      "基盤集中度"
    ],
    [
      "統治・制御能力の不足",
      10,
      "監督・停止試験の失敗率"
    ]
  ],
  "infra": [
    [
      "社会機能への影響",
      25,
      "デジタル障害の社会的影響"
    ],
    [
      "デジタル依存度",
      20,
      "IT・OT依存の集計"
    ],
    [
      "分野間の相互依存",
      20,
      "共通依存の集計"
    ],
    [
      "技術・設備の健全性不足",
      15,
      "保守・更新不足の統計"
    ],
    [
      "供給網・集中依存",
      10,
      "デジタル供給網の集中度"
    ],
    [
      "複合災害への曝露",
      10,
      "災害によるデジタル機能への影響"
    ]
  ],
  "defense": [
    [
      "予防力",
      20,
      "管理策の実施率・防護試験"
    ],
    [
      "検知力",
      20,
      "検知試験の成功率・検知時間"
    ],
    [
      "阻止力",
      20,
      "封じ込め試験・被害拡大阻止率"
    ],
    [
      "情報力",
      15,
      "警戒情報の適時性・有効性"
    ],
    [
      "即応力",
      15,
      "初動判断・対応時間の集計"
    ],
    [
      "国家防衛力",
      10,
      "公開された官民連携・指揮統制訓練の成果"
    ]
  ],
  "recovery": [
    [
      "復旧速度",
      25,
      "目標復旧時間の達成率"
    ],
    [
      "代替・冗長能力",
      20,
      "代替機能の検証成功率"
    ],
    [
      "データ復元能力",
      15,
      "復元試験・目標復旧時点の達成率"
    ],
    [
      "事業継続能力",
      15,
      "BCP訓練の達成率"
    ],
    [
      "広域復旧・相互支援",
      15,
      "官民共同復旧訓練の成果"
    ],
    [
      "適応・再発防止能力",
      10,
      "改善措置の実施・再発率"
    ]
  ]
};
export const weights={threat:30,ai:20,infra:20,defense:15,recovery:15};
export const isCapability=id=>id==='defense'||id==='recovery';
export const externalFactors=[['自然災害','infra','recovery'],['地政学・軍事情勢','threat','defense'],['供給網・経済安全保障','infra','recovery'],['先端技術','ai','threat','defense']];
export const references=[["NIST CSF 2.0","https://www.nist.gov/cyberframework"],["NIST AI RMF","https://www.nist.gov/itl/ai-risk-management-framework"],["FIRST EPSS","https://www.first.org/epss/"],["CISA KEV","https://www.cisa.gov/known-exploited-vulnerabilities-catalog"],["ITU GCI","https://www.itu.int/itu-d/sites/cybersecurity/gci/"]];
export const rubric=['低リスクを示す証拠','軽微','限定的','顕著','重大','例外的・広範'];
export const capabilityRubric=['能力が機能しない証拠','初期','限定的','実用的','高度','継続的に検証された卓越能力'];
// Evidence is mandatory; no imputation. Scores require metric-specific calibration.
export function evaluateDomain(id, rows=[]){
 const criteria=domains[id]; if(!criteria)return null;
 const valid=criteria.map(([name,w])=>({w,row:rows.find(r=>r.name===name)})).filter(({row:r})=>r&&Number.isInteger(r.rating)&&r.rating>=0&&r.rating<=5&&r.calibrated===true&&typeof r.source==='string'&&/^https?:\/\//.test(r.source)&&r.date&&r.rationale&&r.counter&&['high','medium','low'].includes(r.confidence));
 const coverage=valid.reduce((s,x)=>s+x.w,0);
 return {coverage,score:coverage===100?valid.reduce((s,x)=>s+x.w*x.row.rating/5,0):null,confidence:coverage===100?(valid.some(x=>x.row.confidence==='low')?'low':valid.some(x=>x.row.confidence==='medium')?'medium':'high'):null};
}
export const cwjiHistory=[]; // Retain validated observation snapshots across collection failures.
export function evaluateIndex(observations={},previous={},history=cwjiHistory){
 const entries=Object.entries(weights).map(([id,w])=>{const current=evaluateDomain(id,observations[id]); const fallback=current.score===null?history.slice().sort((a,b)=>b.date.localeCompare(a.date)).map(x=>({...evaluateDomain(id,x.observations?.[id]),date:x.date})).find(x=>x.score!==null):null; const d=fallback||current;return {id,weight:w,...d,status:fallback?'previous':current.score===null?'unavailable':'current',currentCoverage:current.coverage,contribution:d.score===null?null:(isCapability(id)?100-d.score:d.score)*w/100,delta:d.score!==null&&Number.isFinite(previous[id])?d.score-previous[id]:null};});
 const coverage=entries.reduce((s,e)=>s+e.weight*e.coverage/100,0);
 const score=entries.every(e=>e.score!==null)?entries.reduce((s,e)=>s+e.contribution,0):null;
 return {entries,coverage,score};
}
export function scenarioSensitivity(id,pointChange){return Number.isFinite(pointChange)&&Object.hasOwn(weights,id)?pointChange*weights[id]/100*(isCapability(id)?-1:1):null;}
