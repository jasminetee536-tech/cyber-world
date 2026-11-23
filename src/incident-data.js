import {incidentAxes,annualAxes,weightedScore} from './cwri.js';
// Curated, preliminary editorial assessments. They are NOT official scores.
// Scores are withheld for records without independently verified evidence.
const raw=[
[2010,'Stuxnet','産業制御','イランの核関連施設を標的にした産業制御システムへの攻撃が公になった。','制御システムの分離、機器の整合性検証、可搬媒体の管理。',[3,5,5,5,3,5],'https://www.cisa.gov/news-events/ics-advisories/icsa-10-272-01'],
[2011,'RSA SecurID侵害','認証','認証製品の供給元への侵害が発表され、認証技術を取り巻く供給網リスクが注目された。','認証手段の多層化とベンダー依存の点検。',[3,2,4,3,3,4],'https://www.cisa.gov/'],
[2012,'Shamoon','破壊型マルウェア','中東の企業環境を狙った破壊的マルウェアが大規模な端末被害を引き起こした。','復旧イメージの隔離保管と広域再構築手順。',[4,3,4,3,2,4],'https://www.cisa.gov/'],
[2014,'Sony Pictures侵害','情報漏えい・破壊','映画会社への侵害で情報流出と業務妨害が発生した。','情報漏えい・業務停止・脅迫への統合対応。',[4,1,4,4,3,4],'https://www.fbi.gov/news/press-releases/update-on-sony-investigation'],
[2015,'ウクライナ電力網攻撃','重要インフラ','サイバー攻撃が電力供給停止に結び付いた事例として知られる。','OTの手動復旧と事業継続計画。',[4,5,4,5,2,5],'https://www.cisa.gov/news-events/ics-alerts/ir-alert-h-16-056-01'],
[2016,'Mirai / Dyn DNS障害','IoT・DDoS','侵害されたIoT機器による大規模なDDoSがDNSサービスと多数のサイトに影響した。','IoT初期認証の管理とDNSの冗長化。',[4,3,4,2,5,5],'https://www.cisa.gov/'],
[2017,'WannaCry','ランサムウェア','Windowsの脆弱性を悪用したワーム型ランサムウェアが世界各地の組織に影響した。','更新・分離・復旧可能なバックアップ。',[5,5,4,4,5,5],'https://www.cisa.gov/'],
[2017,'NotPetya','破壊型・供給網','ソフトウェアの更新経路を悪用した破壊的マルウェアが国際的に波及した。','ソフトウェア供給網の検証と全社復旧訓練。',[5,5,5,5,5,5],'https://www.cisa.gov/'],
[2020,'SolarWinds侵害','サプライチェーン','ネットワーク管理ソフトの更新を経由する侵害が明らかになった。','管理系ソフトの権限最小化とログ監視。',[4,4,5,5,5,5],'https://www.cisa.gov/news-events/alerts/2020/12/13/active-exploitation-solarwinds-software'],
[2021,'Colonial Pipeline','重要インフラ','ランサムウェア被害を受けた米国燃料パイプライン事業者が運営を停止した。','IT侵害と事業運営の連動を見直す。',[5,5,3,4,2,4],'https://www.cisa.gov/'],
[2023,'名古屋港ターミナル障害','港湾・物流','ランサムウェアに関連する障害でコンテナ搬出入業務が停止した。','港湾物流の代替運用と復旧手順。',[4,5,3,3,2,4],'https://www.nagoyaport.co.jp/']
];
export const incidents=raw.map(([year,title,type,summary,lesson,ratings,url],i)=>{
 const axisRatings=Object.fromEntries(incidentAxes.map((a,j)=>[a.id,ratings[j]]));
 return {id:'cwri-'+year+'-'+i,year,title,type,summary,lesson,ratings:axisRatings,score:weightedScore(incidentAxes,axisRatings),sourceUrls:[url],confidence:'C',assessedAt:'2026-11-23',version:'1.0',status:'暫定・要一次資料照合',jri:null,reviewHistory:[{date:'2026-11-23',reason:'初期の編集部試算。詳細な根拠照合と独立レビューが未完了',score:weightedScore(incidentAxes,axisRatings)}]};
});
export function annualSummary(year){
 const list=incidents.filter(x=>x.year===Number(year));
 if(!list.length)return {count:0,score:null,summary:'収録事件がないため評価できません。未収録は事件がなかったことを意味しません。'};
 const ranked=[...list].sort((a,b)=>b.score-a.score);
 return {count:list.length,score:null,peak:ranked[0].score,summary:`${year}年の収録事件は${list.length}件。最大の暫定事件重大度は${ranked[0].title}（${ranked[0].score}点）です。年間指数は年間20件の収集目標とデータの網羅性を満たしていないため未算定です。`};
}
// An annual score must not be computed from a convenience sample.
// To publish, an editor must supply four independently evidenced 0-5 ratings.
export function calculateAnnualFromReviewedEvidence(ratings,evidence){
 if(!evidence?.complete || !evidence?.sourceUrls?.length || !evidence?.reviewedAt)return null;
 return weightedScore(annualAxes,ratings);
}
