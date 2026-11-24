// JCTI v1: domestic systemic threat, independent of editorial article scores.
export const jctiAxes=[['frequency','発生頻度・増加速度',15],['diversity','脅威の多様性',10],['technology','攻撃能力・技術進化',15],['ai','AIによる増幅',15],['targeting','対日脅威',10],['dependency','デジタル依存度',10],['cascade','複合・連鎖リスク',10],['anxiety','社会的不安',15]];
export const jctiSnapshot={date:'2026-11-24',observations:[]};
export const jctiHistory=[]; // Append only fully validated dated snapshots; never erase on failed collection.
function evaluateSnapshot(snapshot){
 const entries=jctiAxes.map(([id,label,weight])=>{const row=snapshot.observations.find(x=>x.id===id&&x.calibrated===true&&Number.isFinite(x.score)&&x.score>=0&&x.score<=100&&x.sources?.length&&x.period&&x.rationale&&x.confidence);return {id,label,weight,score:row?.score??null};});
 const coverage=entries.reduce((n,e)=>n+(e.score===null?0:e.weight),0);
 const lower=entries.reduce((n,e)=>n+(e.score??0)*e.weight/100,0);
 return {date:snapshot.date,entries,coverage,score:coverage===100?Math.round(lower):null,range:[Math.floor(lower),Math.ceil(lower+100-coverage)]};
}

export function evaluateJCTI(snapshot=jctiSnapshot,history=jctiHistory){
 const current=evaluateSnapshot(snapshot);
 if(current.score!==null)return {...current,status:'current',currentCoverage:current.coverage};
 const previous=history.filter(x=>x.date<=snapshot.date).map(evaluateSnapshot).filter(x=>x.score!==null).sort((a,b)=>b.date.localeCompare(a.date))[0];
 return previous?{...previous,status:'previous',currentCoverage:current.coverage}:{...current,status:'unavailable',currentCoverage:current.coverage};
}
