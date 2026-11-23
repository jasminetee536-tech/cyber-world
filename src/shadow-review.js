// SHADOW INDEX REVIEW v1 — assessment must never rewrite the original score.
export const REVIEW_VERSION='1.0';
const dayMs=86400000;
const toDay=s=>String(s||'').slice(0,10);
const time=s=>Date.parse(toDay(s)+'T00:00:00Z');
export function reviewDue(day,now=new Date()){
 const elapsed=Math.floor((Date.now()===0?0:now.getTime()-time(day))/dayMs);
 return {day:toDay(day),elapsedDays:elapsed,weekDue:elapsed>=7,weekOverdue:elapsed>7};
}
export function evaluateReview(original,followup,options={}){
 const score=original?.score;
 if(!Number.isFinite(score))return {verdict:'not_assessable',label:'評価不能',reason:'初回スコアが存在しません。',originalScore:score??null,reviewScore:null};
 const current=followup?.score;
 const delta=Number.isFinite(current)?current-score:null;
 const resolved=options.resolutionEvidence===true && Array.isArray(options.evidenceUrls) && options.evidenceUrls.some(u=>/^https:\/\//.test(u));
 const status=resolved?'resolved_verified':options.resolutionClaimed?'resolution_unverified':Number.isFinite(current)?'followup_available':'insufficient_evidence';
 const verdict=resolved?'closed_with_evidence':status==='resolution_unverified'?'pending_verification':delta===null?'not_assessable':Math.abs(delta)<=10?'stable':delta>0?'increased':'decreased';
 const labels={closed_with_evidence:'解決を確認（根拠あり）',pending_verification:'解決情報の検証待ち',not_assessable:'再評価に必要な情報不足',stable:'スコア変化は限定的',increased:'観測上のリスク上昇',decreased:'観測上のリスク低下'};
 return {verdict,label:labels[verdict],status,originalScore:score,reviewScore:Number.isFinite(current)?current:null,delta,reason:resolved?'解決根拠が登録されています。スコアの的中・不的中を証明するものではありません。':delta===null?'追跡情報が不足しています。': '当時のスコアと追跡時点のスコアを比較した結果です。異なる日付の全体スコアは個別事件の解決証明にはなりません。',evidenceUrls:resolved?options.evidenceUrls:[],reviewVersion:REVIEW_VERSION};
}
export function buildReviewRecords(snapshots,now=new Date()){
 const ordered=[...snapshots].filter(x=>x&&x.date).sort((a,b)=>a.date.localeCompare(b.date));
 return ordered.filter(x=>reviewDue(x.date,now).weekDue).map(original=>{
  const target=time(original.date)+7*dayMs;
  const followup=ordered.find(x=>time(x.date)>=target);
  const outcome=evaluateReview(original,followup);
  return {id:original.date+'-week',type:'week',initialDate:original.date,reviewDate:followup?.date||null,dueDate:new Date(target).toISOString().slice(0,10),leadEvent:original.leadEvent||null,initialConfidence:original.confidence||'D',...outcome};
 }).reverse();
}
