// CWJI v0.2 — original, uncalibrated research model. All scores are risk-directional.
export const domains={
  "threat": [
    [
      "国内被害率",
      25,
      "国内公表被害の観測対象当たり件数"
    ],
    [
      "悪用活動",
      25,
      "悪用確認とEPSSを区別"
    ],
    [
      "国内曝露",
      20,
      "国内対象の普及・曝露の集計"
    ],
    [
      "活動変化",
      15,
      "同一観測網の前期比"
    ],
    [
      "影響重大性",
      15,
      "確認された業務影響"
    ]
  ],
  "ai": [
    [
      "攻撃能力増幅",
      25,
      "比較実験の能力差"
    ],
    [
      "自律権限",
      20,
      "人間承認なしの操作範囲"
    ],
    [
      "制御不足",
      20,
      "監督・停止試験の失敗率"
    ],
    [
      "基盤集中",
      15,
      "代替不能なAI基盤への依存"
    ],
    [
      "社会影響",
      20,
      "確認されたAI関連被害"
    ]
  ],
  "geo": [
    [
      "対日緊張",
      25,
      "公的外交・安全保障評価"
    ],
    [
      "経済的威圧",
      20,
      "確認された制限措置"
    ],
    [
      "地域不安定性",
      20,
      "公表された地域情勢"
    ],
    [
      "制度変化",
      15,
      "政策・条約の変更"
    ],
    [
      "危機管理不足",
      20,
      "対話・危機管理制度の実効性"
    ]
  ],
  "disaster": [
    [
      "地震津波",
      25,
      "公的長期ハザード評価"
    ],
    [
      "気象水害",
      20,
      "公的警報・平年比較"
    ],
    [
      "火山地質",
      10,
      "公的活動評価"
    ],
    [
      "人口資産曝露",
      25,
      "集計された曝露人口・資産"
    ],
    [
      "複合ハザード",
      20,
      "公的複合災害想定"
    ]
  ],
  "infra": [
    [
      "機能停止",
      25,
      "全国集計の停止時間"
    ],
    [
      "共通依存",
      25,
      "分野間依存の公開集計"
    ],
    [
      "サービス集中",
      20,
      "市場集中度"
    ],
    [
      "設備老朽化",
      15,
      "公的更新統計"
    ],
    [
      "需要逼迫",
      15,
      "供給余力の集計"
    ]
  ],
  "supply": [
    [
      "輸入集中",
      25,
      "品目別輸入HHI"
    ],
    [
      "代替困難",
      25,
      "代替調達期間"
    ],
    [
      "物流制約",
      20,
      "集計物流遅延"
    ],
    [
      "在庫不足",
      15,
      "公表備蓄日数"
    ],
    [
      "供給変動",
      15,
      "調達量の変動"
    ]
  ],
  "tech": [
    [
      "海外技術依存",
      25,
      "技術別輸入・利用比率"
    ],
    [
      "移行困難",
      25,
      "代替技術への移行期間"
    ],
    [
      "研究開発不足",
      20,
      "研究開発の比較統計"
    ],
    [
      "人材不足",
      15,
      "公開人材需給統計"
    ],
    [
      "標準依存",
      15,
      "公開標準・知財依存評価"
    ]
  ],
  "defense": [
    [
      "予防不足",
      20,
      "管理策の実施率不足"
    ],
    [
      "検知不足",
      25,
      "集計検知試験結果"
    ],
    [
      "対応不足",
      25,
      "集計対応時間"
    ],
    [
      "人材不足",
      15,
      "防御人材の充足率"
    ],
    [
      "訓練不足",
      15,
      "訓練実施・検証率"
    ]
  ],
  "recovery": [
    [
      "復旧遅延",
      30,
      "目標復旧時間超過率"
    ],
    [
      "代替不足",
      25,
      "代替手段の検証率不足"
    ],
    [
      "継続計画不足",
      20,
      "BCP検証率不足"
    ],
    [
      "連携不足",
      15,
      "官民連携訓練の評価"
    ],
    [
      "復旧後不安定性",
      10,
      "再停止の集計率"
    ]
  ]
};
export const weights={"threat":15,"ai":15,"geo":15,"disaster":15,"infra":10,"supply":10,"tech":10,"defense":5,"recovery":5};
export const references=[["NATO Resilience Baseline Requirements","https://www.nato.int/en/about-us/official-texts-and-resources/official-texts/2026/09/15/2026-resilience-baseline-requirements"],["ODNI ICD 203","https://www.dni.gov/index.php/how-we-work/objectivity"],["FIRST EPSS","https://www.first.org/epss/faq"],["NIST AI RMF","https://airc.nist.gov/airmf-resources/playbook/"],["UNDRR G-DRSF","https://www.undrr.org/global-disaster-related-statistics-framework-faqs"]];
export const rubric=['低リスクを示す十分な証拠','軽微','限定的','顕著','重大','例外的・広範'];
// Evidence is mandatory; no imputation. Scores require metric-specific calibration.
export function evaluateDomain(id, rows=[]){
 const criteria=domains[id]; if(!criteria)return null;
 const valid=criteria.map(([name,w])=>({w,row:rows.find(r=>r.name===name)})).filter(({row:r})=>r&&Number.isInteger(r.rating)&&r.rating>=0&&r.rating<=5&&r.calibrated===true&&typeof r.source==='string'&&/^https?:\/\//.test(r.source)&&r.date&&r.rationale&&r.counter&&['high','medium','low'].includes(r.confidence));
 const coverage=valid.reduce((s,x)=>s+x.w,0);
 return {coverage,score:coverage===100?valid.reduce((s,x)=>s+x.w*x.row.rating/5,0):null,confidence:coverage===100?(valid.some(x=>x.row.confidence==='low')?'low':valid.some(x=>x.row.confidence==='medium')?'medium':'high'):null};
}
export function evaluateIndex(observations={},previous={}){
 const entries=Object.entries(weights).map(([id,w])=>{const d=evaluateDomain(id,observations[id]);return {id,weight:w,...d,contribution:d.score===null?null:d.score*w/100,delta:d.score!==null&&Number.isFinite(previous[id])?d.score-previous[id]:null};});
 const coverage=entries.reduce((s,e)=>s+e.weight*e.coverage/100,0);
 const score=entries.every(e=>e.score!==null)?entries.reduce((s,e)=>s+e.contribution,0):null;
 return {entries,coverage,score};
}
export function scenarioSensitivity(id,pointChange){return Number.isFinite(pointChange)&&Object.hasOwn(weights,id)?pointChange*weights[id]/100:null;}
