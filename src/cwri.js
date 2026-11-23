// CWRI v1.0 — transparent editorial scoring specification.
// This is not CVSS, EPSS, or a government-issued alert level.
export const CWRI_VERSION='1.0';
export const incidentAxes=[
 {id:'society',label:'社会・経済への影響',weight:20,guide:'実証された業務停止・被害範囲・経済損失'},
 {id:'infrastructure',label:'重要インフラへの影響',weight:25,guide:'公共サービス・エネルギー・医療・交通・物流'},
 {id:'technical',label:'技術的重大性',weight:15,guide:'侵害範囲・持続性・復旧難易度'},
 {id:'security',label:'国家安全保障への影響',weight:20,guide:'政府機能・防衛・安全保障'},
 {id:'international',label:'国際的な波及',weight:10,guide:'国境を越えた被害と供給網の連鎖'},
 {id:'structural',label:'構造的・長期的影響',weight:10,guide:'後続の攻撃・長期的な制度や運用への影響'}
];
export const annualAxes=[
 {id:'peak',label:'最大重大事件',weight:35},
 {id:'concentration',label:'重大事件の集中度',weight:25},
 {id:'evolution',label:'攻撃手法・脅威構造の変化',weight:20},
 {id:'japan',label:'日本への影響・関連性',weight:20}
];
export const rubric=[
 '0：確認された影響なし',
 '1：限定的な影響',
 '2：局所的・短期的な影響',
 '3：複数組織または重要な機能に影響',
 '4：広域・長期または重大な影響',
 '5：極めて広範・深刻な影響'
];
export function weightedScore(axes,ratings){
 if(!axes.every(a=>Number.isInteger(ratings?.[a.id])&&ratings[a.id]>=0&&ratings[a.id]<=5))return null;
 return Math.round(axes.reduce((sum,a)=>sum+a.weight*ratings[a.id]/5,0));
}
export function severity(score){
 if(score==null)return '未評価';
 if(score>=80)return '極めて重大';
 if(score>=60)return '重大';
 if(score>=40)return '中程度';
 if(score>=20)return '限定的';
 return '軽微';
}
export function validateAssessment(record){
 return Boolean(record?.sourceUrls?.length && record?.assessedAt && record?.version===CWRI_VERSION && ['A','B','C','D'].includes(record?.confidence));
}
export const referenceStandards=[
 {name:'FIRST CVSS v4.0',url:'https://www.first.org/cvss/v4.0/specification-document',note:'脆弱性の技術的重大性'},
 {name:'FIRST EPSS',url:'https://www.first.org/epss/',note:'今後30日間の脆弱性悪用確率'},
 {name:'CISA SSVC',url:'https://www.cisa.gov/stakeholder-specific-vulnerability-categorization-ssvc',note:'脆弱性対応の意思決定'},
 {name:'NIST CSF 2.0',url:'https://www.nist.gov/cyberframework',note:'リスク管理の考え方'},
 {name:'ENISA Threat Landscape',url:'https://www.enisa.europa.eu/topics/cyber-threats/threats-and-trends',note:'脅威動向の分析'}
];
