import {incidentAxes,annualAxes,weightedScore} from './cwri.js';
import {expandedIncidents} from './incident-expansion.js';
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
const initialIncidents=raw.map(([year,title,type,summary,lesson,ratings,url],i)=>{
 const axisRatings=Object.fromEntries(incidentAxes.map((a,j)=>[a.id,ratings[j]]));
 return {id:'cwri-'+year+'-'+i,year,title,type,summary,lesson,ratings:axisRatings,score:weightedScore(incidentAxes,axisRatings),sourceUrls:[url],confidence:'C',assessedAt:'2026-11-23',version:'1.0',status:'暫定・要一次資料照合',jri:null,reviewHistory:[{date:'2026-11-23',reason:'初期の編集部試算。詳細な根拠照合と独立レビューが未完了',score:weightedScore(incidentAxes,axisRatings)}]};
});

const editorialSections=[
'【技術と背景】この事案の分析では、攻撃の起点と被害の広がりを分けて考える必要があります。脆弱性があっても、すべての環境で同じ被害が生じるわけではありません。資産構成、認証方式、監視体制、外部との接続状況が結果を左右します。',
'【影響の連鎖】情報流出、システム停止、復旧遅延は異なる問題です。顧客への通知や取引先への影響、代替運用の負担など、社会的な損失は直接の技術被害だけでは測れません。重要インフラでは現場の安全を最優先に評価する必要があります。',
'【日本への視点】海外で確認された手口や障害は、日本国内の同種の業務やサービスを見直す材料になります。ただし同じ製品を使っていることだけで被害を断定できません。採用状況と構成を確認し、共通依存の有無を調べる必要があります。',
'【対応の優先順位】まず事実関係と影響範囲を確認し、ログや証拠を保全します。そのうえで権限管理、ネットワーク分離、更新、バックアップからの復旧などを適切に組み合わせます。無計画な操作は証拠を失わせたり業務停止を長引かせたりするため注意が必要です。',
'【組織的な教訓】事故後の改善では、技術的な修正だけでなく、委託先との責任分担、連絡経路、訓練、例外運用の監査が必要です。復旧したことと侵入経路が解消されたことは同義ではありません。',
'【情報の確度】公表された情報と独自分析を混同しないことが重要です。攻撃者の帰属、被害範囲、原因は後日の調査で変わる場合があります。未確認事項を断定せず、追加の一次資料が確認できた時点で更新します。',
'【将来への示唆】この事案が示すのは、ひとつの侵害が複数の業務へ波及し得るという構造的な問題です。ただし将来の発生頻度や具体的な被害を予言するものではありません。対策の実効性は訓練と実測で確かめる必要があります。'
];
const initialWithDetails=initialIncidents.map(e=>({...e,detail:'【事件の概要】'+e.summary+'\\n\\n【教訓】'+e.lesson+'\\n\\n'+editorialSections.join('\\n\\n')+'\\n\\n【CYBER WORLDの分析】'+e.title+'を単独の技術的問題ではなく、認証・運用・復旧・社会機能のつながりから検討します。個別事実の追加確認と出典照合が必要な編集草稿です。'}));
export const incidents=[...initialWithDetails,...expandedIncidents].sort((a,b)=>b.year-a.year||a.title.localeCompare(b.title,'ja'));
export function annualSummary(year){
 const list=incidents.filter(x=>x.year===Number(year));
 if(!list.length)return {count:0,score:null,summary:'収録事件がないため評価できません。未収録は事件がなかったことを意味しません。'};
 const ranked=list.filter(x=>Number.isFinite(x.score)).sort((a,b)=>b.score-a.score);
 return {count:list.length,score:null,peak:ranked[0]?.score??null,summary:`${year}年の収録事件は${list.length}件。${ranked.length?'採点済みの事件で最大の暫定重大度は'+ranked[0].title+'（'+ranked[0].score+'点）です。':'個別事件の採点は未完了です。'}未採点の編集草稿が含まれるため、年間指数は未算定です。`};
}
// An annual score must not be computed from a convenience sample.
// To publish, an editor must supply four independently evidenced 0-5 ratings.
export function calculateAnnualFromReviewedEvidence(ratings,evidence){
 if(!evidence?.complete || !evidence?.sourceUrls?.length || !evidence?.reviewedAt)return null;
 return weightedScore(annualAxes,ratings);
}
