import React,{useState,useEffect} from 'react';
import {createPortal} from 'react-dom';
import './atlas.css';
import {intelligenceReport,reportVersion,verifiedProfiles} from './infrastructure-intelligence.js';
import {infrastructureExpansion,governmentFrameworkUrl} from './infrastructure-expansion.js';

const domains=[
{id:'airport',name:'空港',icon:'✈'},
{id:'port',name:'港湾',icon:'⚓'},
{id:'road',name:'道路・橋梁（関連分野）',icon:'▰'},
{id:'rail',name:'鉄道',icon:'▤'},
{id:'energy',name:'電力・エネルギー',icon:'⚡'},
{id:'communications',name:'情報通信',icon:'◎'},
{id:'water',name:'水道・治水',icon:'◈'},
{id:'medical',name:'医療',icon:'✚'},
{id:'logistics',name:'物流',icon:'▣'},
{id:'government',name:'行政サービス',icon:'▥'},
{id:'finance',name:'金融',icon:'¥'},
{id:'aviation',name:'航空',icon:'✈'},
{id:'gas',name:'ガス',icon:'♨'},
{id:'chemicals',name:'化学',icon:'◇'},
{id:'credit',name:'クレジット',icon:'▣'},
{id:'oil',name:'石油',icon:'◉'},
{id:'postal',name:'郵便',icon:'✉'}
];
const sites=[
['airport','成田国際空港','千葉県',35.77,140.39,'日本の国際旅客・航空貨物を支える主要空港。','運航支援・予約・手荷物などの情報システム障害、委託先経由の侵害。','国際便の遅延、航空貨物の滞留、関連交通への波及。'],
['airport','関西国際空港','大阪府',34.43,135.24,'関西圏の国際旅客・貨物輸送を支える海上空港。','運航情報の停止、ランサムウェア、通信サービス障害。','国際物流や観光、周辺輸送への影響。'],
['airport','羽田空港','東京都',35.55,139.78,'首都圏の国内・国際航空ネットワークの中核。','空港業務システムの障害、認証情報の窃取、外部サービス停止。','旅客移動や航空便の接続への影響。'],
['port','横浜港','神奈川県',35.45,139.65,'首都圏の国際貿易とコンテナ物流を支える港湾。','港湾物流システムへのランサムウェア、データ連携の停止。','貨物滞留、陸上輸送・製造業への影響。'],
['port','名古屋港','愛知県',35.09,136.88,'中部の製造業を支える国際貿易・自動車物流の主要港。','ターミナル業務システムの障害、サプライチェーン侵害。','部品調達・輸出入と工場稼働への影響。'],
['port','神戸港','兵庫県',34.68,135.19,'関西の国際コンテナ輸送と広域物流を担う港湾。','物流管理システム障害、外部委託先からの侵害。','国際物流と背後圏の配送遅延。'],
['road','瀬戸大橋','岡山県・香川県',34.40,133.82,'本州と四国を結ぶ道路・鉄道の重要な交通経路。','交通情報提供・運用管理システムの障害。','地域間輸送や代替ルートへの負荷増加。'],
['road','東京湾アクアライン','千葉県・神奈川県',35.46,139.87,'東京湾を横断し首都圏の道路交通を結ぶ重要路線。','道路情報・料金収受などのデジタルサービス障害。','広域交通や物流の遅延。'],
['road','東名高速道路（代表地点）','静岡県',35.10,138.86,'首都圏と中京圏をつなぐ広域物流・移動の幹線。','交通管制・情報提供システムの障害。','輸送計画の混乱と他路線への影響。'],
['rail','東京駅','東京都',35.68,139.77,'新幹線と在来線が集まる国内有数の交通結節点。','案内・予約・運行支援システムの障害。','広域旅客移動や乗換接続への影響。'],
['rail','新大阪駅','大阪府',34.73,135.50,'東海道・山陽新幹線と関西の鉄道網を結ぶ拠点。','旅客情報・運行関連システムの停止。','東西の広域移動への影響。'],
['energy','川崎臨海部','神奈川県',35.51,139.75,'石油・化学・電力関連産業が集積するエネルギー・産業地域。','産業制御系と業務系の連携障害、ランサムウェア。','生産活動やエネルギー供給関連業務への影響。'],
['energy','四日市コンビナート','三重県',34.96,136.62,'石油精製・化学工業などが集積する産業地域。','操業支援システムの障害、委託先の侵害。','生産・供給と関連物流への影響。'],
['communications','大手町通信・データセンター集積地域','東京都',35.69,139.76,'通信事業者やデータセンターが集まる都心の業務集積地域。','DDoS、通信サービス障害、クラウド・認証基盤の停止。','複数のオンラインサービスへの広域的な影響。'],
['communications','大阪都心通信集積地域','大阪府',34.69,135.50,'関西の通信・デジタルサービスを支える都市部の集積地域。','通信障害、クラウドサービスの停止、委託先リスク。','関西圏の企業・生活サービスへの影響。'],
['water','琵琶湖・淀川水系','滋賀県・京都府・大阪府',35.15,135.95,'関西の広い地域の水資源と治水に関わる水系。','監視・情報共有システムの障害、観測データの不整合。','水管理の判断や関係機関の連携への影響。'],
['medical','国立国際医療研究センター周辺','東京都',35.70,139.71,'高度医療・研究機能を担う医療拠点の一例。','電子カルテ障害、ランサムウェア、医療機器の接続リスク。','診療予約・診療継続や患者受入れへの影響。'],
['logistics','東京港・湾岸物流エリア','東京都',35.62,139.79,'首都圏の海上貨物と倉庫・陸送をつなぐ物流地域。','倉庫管理・配送計画システムの停止。','配送遅延と小売・製造業への波及。'],
['government','霞が関行政地区','東京都',35.67,139.75,'中央行政機関が集まる行政機能の中心地区。','行政サービス停止、情報漏えい、サプライチェーン侵害。','行政手続きや機関間の情報連携への影響。']
].map((s,i)=>({id:i,domain:s[0],name:s[1],region:s[2],lat:s[3],lng:s[4],importance:s[5],risk:s[6],impact:s[7]}));

const additionalSites=[
['airport','中部国際空港','愛知県','中部圏の国際航空輸送と製造業の貨物ネットワークを支える拠点。','航空物流や予約・運航支援のデジタルサービス停止。','輸出入の遅延と周辺交通への影響。'],
['airport','新千歳空港','北海道','北海道の航空旅客・貨物の主要玄関口。','運航情報・旅客案内・航空関連サービスの停止。','北海道内外の移動と観光・物流への波及。'],
['airport','福岡空港','福岡県','九州の広域航空交通を担う主要空港。','空港業務・旅客情報の可用性低下。','国内外の移動や地域経済への影響。'],
['port','東京港','東京都','首都圏のコンテナ貨物と国内物流を支える港湾。','ターミナル運営・荷役管理システムの障害。','輸入貨物の滞留と流通への影響。'],
['port','博多港','福岡県','九州とアジアを結ぶ港湾・旅客物流の拠点。','港湾情報システムや貨物データ連携の停止。','海上輸送や地域物流の混乱。'],
['rail','品川駅','東京都','東海道新幹線と首都圏の複数路線が接続する拠点。','案内・予約・運行関連サービスの障害。','広域移動や乗換への影響。'],
['rail','博多駅','福岡県','九州新幹線・山陽新幹線と地域鉄道の結節点。','旅客案内や運行情報の障害。','九州の広域交通と観光への影響。'],
['energy','柏崎刈羽原子力発電所','新潟県','大規模発電設備を有する重要なエネルギー施設。稼働状況と供給寄与は時点により異なる。','業務系・委託先システムの障害と運用継続リスク。','安全管理上の対応や事業運営への影響。'],
['energy','苫東厚真発電所','北海道','北海道の電力供給を支える主要な火力発電拠点の一つ。','運用支援システムや外部サービスの停止。','地域の電力供給計画や復旧対応への影響。'],
['energy','東京湾岸エネルギー供給地域','東京都・神奈川県','首都圏の発電・燃料供給に関わる広域産業集積地域。','複数事業者間の情報連携や物流の障害。','燃料・電力関連の供給調整への影響。'],
['communications','東京インターネット相互接続集積地域','東京都','国内外のネットワーク相互接続を担う事業者が集まる都市部。','広域通信障害やルーティング・認証基盤の不具合。','複数のオンラインサービスへの連鎖。'],
['communications','大阪インターネット相互接続集積地域','大阪府','西日本の通信・データ流通を支える都市部の集積。','接続サービスの障害や委託先への依存。','関西圏のデジタルサービスへの影響。'],
['water','利根川水系','関東地方','首都圏の水資源と治水に関わる広域水系。','水文データ・監視・連絡システムの停止。','水管理判断と関係機関の調整への影響。'],
['water','淀川流域の浄水・配水ネットワーク','大阪府・京都府','関西の生活用水を支える複数自治体の水道インフラ。','監視・料金・運用情報システムの停止。','住民向け案内と水道業務の継続への影響。'],
['medical','大阪大学医学部附属病院','大阪府','高度医療・研究・教育機能を担う大学病院。','電子カルテや医療情報システムの障害。','診療継続・患者受入れ・連携医療への影響。'],
['medical','東京大学医学部附属病院','東京都','高度医療と臨床研究を担う大学病院。','医療情報システムの可用性低下や委託先リスク。','診療や医療連携への影響。'],
['logistics','成田空港周辺航空貨物地域','千葉県','国際航空貨物の集荷・通関・配送が集中する地域。','貨物追跡・倉庫管理・データ交換の停止。','高付加価値貨物や製造業の供給網への影響。'],
['logistics','名古屋港背後圏物流地域','愛知県','製造業と港湾を結ぶ物流ネットワークの集積地域。','物流管理や輸送計画の障害。','部品供給と輸出入への影響。'],
['government','東京都庁','東京都','首都の行政サービスと広域防災調整を担う行政拠点。','行政情報サービス・認証基盤の停止。','住民サービスや災害対応の情報連携への影響。'],
['government','大阪府庁','大阪府','大阪府域の行政サービス・危機管理を担う拠点。','行政業務システムの停止や情報漏えい。','住民手続きと関係機関の連携への影響。'],
['road','関門橋','山口県・福岡県','本州と九州を結ぶ道路交通の重要経路。','道路交通情報や運営支援サービスの停止。','広域物流と迂回路への負荷。'],
['road','明石海峡大橋','兵庫県','本州と淡路島を結ぶ道路ネットワークの要所。','交通情報・料金収受・運用支援サービスの障害。','地域間物流や交通計画への影響。']
].map((s,i)=>({id:sites.length+i,domain:s[0],name:s[1],region:s[2],importance:s[3],risk:s[4],impact:s[5]}));
const allSites=[...sites,...additionalSites,...infrastructureExpansion];
const imageByDomain={
 airport:'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=900&q=80',
 port:'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=900&q=80',
 road:'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=900&q=80',
 rail:'https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=900&q=80',
 energy:'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=900&q=80',
 communications:'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=900&q=80',
 water:'https://images.unsplash.com/photo-1437482078695-73f5ca6c96e2?auto=format&fit=crop&w=900&q=80',
 medical:'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=900&q=80',
 logistics:'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=900&q=80',
 government:'https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=900&q=80',
 finance:'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=900&q=80',
 aviation:'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=900&q=80',
 gas:'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=900&q=80',
 chemicals:'https://images.unsplash.com/photo-1532094349884-543bc11b2340?auto=format&fit=crop&w=900&q=80',
 credit:'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=900&q=80',
 oil:'https://images.unsplash.com/photo-1516939884455-1445c8652f83?auto=format&fit=crop&w=900&q=80',
 postal:'https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&w=900&q=80'
};
const scoreAxes=[{id:'impact',label:'社会的影響',weight:30},{id:'substitution',label:'代替の難しさ',weight:20},{id:'cascade',label:'分野間の波及',weight:20},{id:'digital',label:'デジタル依存度',weight:15},{id:'recovery',label:'復旧の複雑さ',weight:15}];
// Editorial facility-level estimates, not audited security findings. Values are reviewed per named site.
const facilityRatings=[
[5,4,5,4,4],[4,4,4,4,4],[5,4,5,5,4],[5,4,5,4,4],[5,4,5,4,5],
[4,3,4,4,4],[4,5,4,3,4],[4,3,4,3,3],[5,3,5,4,3],[5,4,5,5,4],
[5,4,5,4,4],[5,3,5,4,5],[4,3,4,4,4],[5,4,5,5,4],[4,3,4,5,4],
[5,4,5,3,5],[4,3,4,5,4],[5,3,5,4,4],[5,4,5,5,4],
[4,3,4,4,4],[4,4,4,4,4],[4,3,4,4,3],[5,4,5,4,4],[3,3,3,3,3],
[4,4,4,4,4],[4,3,4,4,3],[5,5,5,4,5],[5,4,5,4,5],[5,4,5,4,4],
[5,4,5,5,5],[4,4,4,5,4],[5,4,5,3,5],[4,3,4,3,4],[5,4,5,5,5],
[5,4,5,5,4],[5,4,5,4,4],[4,3,4,4,4],[5,4,5,4,4],[4,3,4,4,4],
[5,4,5,3,4],[4,4,4,3,4]
];
const sitePhotos=["photo-1436491865332-7a61a109cc05","photo-1506947411487-a56738267384","photo-1474302770737-173ee21bab63","photo-1578575437130-527eed3abbec","photo-1494412519320-aa613dfb7738","photo-1586528116311-ad8dd3c8310d","photo-1500534623283-312aade485b7","photo-1519501025264-65ba15a82390","photo-1449965408869-eaa3f722e40d","photo-1474487548417-781cb71495f3","photo-1515165562835-c4c4b5a4c13e","photo-1473341304170-971dccb5ac1e","photo-1497435334941-8c899ee9e8e9","photo-1558494949-ef010cbdcc31","photo-1544197150-b99a580bb7a8","photo-1437482078695-73f5ca6c96e2","photo-1551076805-e1869033e561","photo-1565793298595-6ba897b80b3d","photo-1487958449943-2429e8be8625","photo-1446776811953-b23d57bd21aa","photo-1464037866556-6812c9d1c72e","photo-1488085061387-422e29b40080","photo-1534274988757-a28bf1a57c17","photo-1527631746610-bca00a040d60","photo-1519681393784-d120267933ba","photo-1529070538774-1843cb3265df","photo-1451187580459-43490279c0fa","photo-1509391366360-2e959784a276","photo-1516939884455-1445c8652f83","photo-1518770660439-4636190af475","photo-1516321318423-f06f85e504b3","photo-1501785888041-af3ef285b470","photo-1470770841072-f978cf4d019e","photo-1538108149393-fbbd81895907","photo-1519494026892-80bbd2d6fd0d","photo-1566576912321-d58ddd7a6088","photo-1497366754035-f200968a6e72","photo-1527576539890-dfa815648363","photo-1521737711867-e3b97375f902","photo-1473448912268-2022ce9509d8","photo-1500530855697-b586d89ba3ee"];
function photoFor(site){return sitePhotos[site.id]?'https://images.unsplash.com/'+sitePhotos[site.id]+'?auto=format&fit=crop&w=1100&q=82&sig='+site.id:imageByDomain[site.domain]||imageByDomain.government;}
const infrastructureLevels=[['CRITICAL','85–100','国家規模の基幹機能に代替困難な停止が連鎖する、極めて例外的な重要度'],['HIGH','70–84','広域の生活・産業に大きく影響し、代替や復旧が難しい'],['MEDIUM','50–69','地域・分野にとって重要だが、影響範囲や代替手段に一定の限定がある'],['LOW','30–49','主に局所的な影響が想定され、代替手段が比較的確保しやすい'],['MINIMAL','0–29','社会的影響が限定的と評価できる場合']];
const infrastructureLevel=score=>score>=85?'CRITICAL':score>=70?'HIGH':score>=50?'MEDIUM':score>=30?'LOW':'MINIMAL';
// Reserve extreme scores for independently supported, cross-sector systemic importance.
const calibratedInfrastructureScore=raw=>Math.round(100*Math.pow(raw/100,1.7));
function assess(site){
 const values=facilityRatings[site.id]||[3,2,3,3,3];
 const axes=scoreAxes.map((axis,i)=>({...axis,value:values[i]}));
 return {axes,score:calibratedInfrastructureScore(axes.reduce((total,a)=>total+a.weight*a.value/5,0)),confidence:'D',method:'拠点別の編集上の暫定推定'};
}
function report(site){
 const sector=domains.find(d=>d.id===site.domain)?.name||'重要インフラ';
 return [
 ['評価対象と公共的重要性',site.name+'は'+site.region+'に位置する、または同地域を代表する'+sector+'の分析対象である。'+site.importance+' 本評価では、施設の公開情報で確認できる社会的機能と、同分野に共通するサービス継続上の課題を区別する。地域や集積地を対象とする場合、個々の設備・事業者の状態を推定しているわけではない。'],
 ['依存関係と波及経路', '重要インフラの障害は、単独の施設内にとどまらず、利用者、関連事業者、輸送・通信・電力などの周辺サービスに伝播し得る。'+site.impact+' ただし、実際の波及範囲は発生時刻、運用体制、代替経路、季節的な需要、他組織との連携に左右される。公開情報だけでは正確な被害人数や停止時間を断定できない。'],
 ['サイバー脅威の評価', 'この分野で検討すべきシナリオには、'+site.risk+' そのほか、外部委託先のアカウント管理、業務ネットワークと制御系の境界、ソフトウェア更新、バックアップの健全性、クラウド・通信事業者への依存を確認する必要がある。これらは一般的な脅威シナリオであり、当該施設に実在する脆弱性や攻撃の兆候を示すものではない。'],
 ['継続性と回復力', '分析上の重要な問いは、障害を完全に防げるかだけではなく、発生時に安全な縮退運転や手作業への切替が可能か、情報共有が維持できるか、代替サービスを確保できるかである。復旧時間目標、訓練頻度、バックアップの隔離、復旧時の優先順位などは、公開情報だけでは個別施設ごとに十分確認できないため、断定を避ける。'],
 ['スコアの読み方と不確実性','CWRI-ICの値は社会的影響30%、代替困難性20%、分野間波及20%、デジタル依存15%、復旧複雑性15%を各5段階で重み付けした原点に非線形補正（100×（原点/100）の1.7乗）を適用した参考指標である。現在は分野別の共通仮定を使用し、個別施設の監査、稼働率、事故履歴、機密情報を採点に使っていない。施設固有の実測評価ではなく、施設固有の危険度ランキングや侵害確率と解釈してはならない。'],
 ['追加検証が必要な情報','今後は事業者・所管省庁の公式資料、年次報告、サービス停止の公表、関連するJPCERT/CC・NISC・CISAの注意喚起、事業継続に関する公開情報を照合し、評価時点と参照URLを明示する。一次資料が確認できない項目は「証拠不十分」と表示し、数値を事実として扱わない。']
 ].map(([title,body])=>({title,body}));
}

export default function InfrastructureAtlas(){
 const [domain,setDomain]=useState('all'),[query,setQuery]=useState(''),[selected,setSelected]=useState(null),[sort,setSort]=useState('score'),[expanded,setExpanded]=useState(false),[sectorOpen,setSectorOpen]=useState(false);
 useEffect(()=>{if(selected===null&&!sectorOpen)return;const old=document.body.style.overflow;const focus=document.activeElement;document.body.style.overflow='hidden';const key=e=>{if(e.key==='Escape'){setSelected(null);setSectorOpen(false)}};document.addEventListener('keydown',key);return()=>{document.body.style.overflow=old;document.removeEventListener('keydown',key);if(focus instanceof HTMLElement)focus.focus({preventScroll:true});};},[selected,sectorOpen]);
 const filtered=allSites.filter(s=>(domain==='all'||s.domain===domain)&&[s.name,s.region,s.importance].join(' ').toLowerCase().includes(query.trim().toLowerCase())).sort((a,b)=>sort==='name'?a.name.localeCompare(b.name,'ja'):sort==='region'?a.region.localeCompare(b.region,'ja'):assess(b).score-assess(a).score||a.id-b.id);
 const shown=expanded?filtered:filtered.slice(0,8);
 const active=allSites.find(s=>s.id===selected);
 const profile=active?assess(active):null;
 return <section className="atlas atlas-directory">
 <header className="atlas-directory-hero"><div><span className="cw-kicker">CYBER WORLD / INFRASTRUCTURE INTELLIGENCE</span><h2>日本の重要インフラ</h2><p>政府の重要インフラ16分野を軸に、公開情報から社会を支える拠点・サービスを読み解く。</p></div><div className="atlas-directory-stats"><span><b>{allSites.length}</b>収録対象</span><span><b>16</b>政府指定分野 + 関連分野</span><span><b>5</b>評価軸</span></div></header>
 <p className="atlas-government-context">分類の基準：<a href={governmentFrameworkUrl} target="_blank" rel="noopener noreferrer">国家サイバー統括室「重要インフラ対策」 ↗</a>（2026年10月施行の16分野）。道路・治水等は関連する公共基盤として追加。掲載施設・地域はCYBER WORLDが選んだ分析例であり、政府による個別施設の指定一覧ではありません。</p><div className="atlas-method-strip"><strong>CWRI-IC</strong><span>社会的重要度の参考評価 / 100点（最高評価は例外的）</span><button type="button" onClick={()=>setSelected(-1)}>評価方法 ↗</button></div>
 <div className="atlas-directory-controls"><label className="atlas-directory-search"><span>⌕</span><input type="search" aria-label="施設・地域を検索" placeholder="施設・地域を検索" value={query} onChange={e=>{setQuery(e.target.value);setExpanded(false)}}/></label><select aria-label="並び替え" value={sort} onChange={e=>setSort(e.target.value)}><option value="score">重要度順</option><option value="name">名称順</option><option value="region">地域順</option></select></div>
 <div className="atlas-sector-filter"><button type="button" className="atlas-sector-trigger" aria-expanded={sectorOpen} onClick={()=>setSectorOpen(true)}><span>分野 / SECTOR</span><strong>{domain==='all'?'すべての分野':domains.find(d=>d.id===domain)?.name}</strong><span>⌄</span></button></div>
 {sectorOpen&&createPortal(<div className="atlas-sector-backdrop" onClick={()=>setSectorOpen(false)} onKeyDown={e=>{if(e.key==='Escape')setSectorOpen(false)}}><section role="dialog" aria-modal="true" aria-label="分野を選択" className="atlas-sector-panel" onClick={e=>e.stopPropagation()}><header><div><small>INFRASTRUCTURE / SECTOR INDEX</small><h3>分野を選択</h3></div><button type="button" autoFocus onClick={()=>setSectorOpen(false)} aria-label="閉じる">×</button></header><div className="atlas-sector-options">{[{id:'all',name:'すべての分野'},...domains].map(d=><button type="button" key={d.id} className={domain===d.id?'active':''} aria-pressed={domain===d.id} onClick={()=>{setDomain(d.id);setExpanded(false);setSectorOpen(false)}}><span>{d.id==='road'?'道路・橋梁':d.name}</span><small>{d.id==='all'?allSites.length:allSites.filter(s=>s.domain===d.id).length}件 {domain===d.id?'✓':''}</small></button>)}</div></section></div>,document.body)}


 <div className="atlas-directory-count"><strong>重要拠点一覧</strong><small>{filtered.length}件</small></div>
 <div className="atlas-directory-grid">{shown.map(s=>{const a=assess(s);return <button className="atlas-directory-card" type="button" key={s.id} onClick={()=>setSelected(s.id)}><div className="atlas-directory-photo"><img src={photoFor(s)} alt={s.name+'に関連する写真'} loading="lazy" referrerPolicy="no-referrer" onError={e=>{e.currentTarget.onerror=null;e.currentTarget.src=imageByDomain[s.domain]}}/></div><div className="atlas-directory-info"><div className="atlas-directory-meta">{domains.find(d=>d.id===s.domain)?.name} / {s.region}</div><h3>{s.name}</h3><p>{s.importance}</p>{s.recordType&&<small className="atlas-record-type">{s.recordType}</small>}<div className="atlas-directory-bottom"><span>分野別参考指標</span><strong>{a.score}<small>/100 · {infrastructureLevel(a.score)}</small></strong></div></div></button>})}</div>
 {!filtered.length&&<p className="atlas-directory-empty">該当する拠点はありません。検索条件を変更してください。</p>}
 {filtered.length>8&&<button className="atlas-directory-more" type="button" onClick={()=>setExpanded(v=>!v)}>{expanded?'最初の8件に戻す':'さらに '+(filtered.length-8)+' 件を表示 ↓'}</button>}
 <p className="atlas-directory-caveat">CWRI-ICは独自の社会的重要度指標です。実際の脆弱性・侵害確率・個別施設の安全性を測定するものではありません。点数は分野モデルに基づく参考値です。</p>
 {(active||selected===-1)&&createPortal(<div className="atlas-modal-backdrop" onClick={()=>setSelected(null)}><article className="atlas-profile" role="dialog" aria-modal="true" aria-label={active?active.name+'の分析':'評価方法'} onClick={e=>e.stopPropagation()}><button className="atlas-profile-close" type="button" autoFocus onClick={()=>setSelected(null)} aria-label="閉じる">×</button>{active?<><div className="atlas-profile-image"><img src={photoFor(active)} alt={active.name+'に関連する分野の参考イメージ'} onError={e=>{e.currentTarget.onerror=null;e.currentTarget.src=imageByDomain[active.domain]}} /></div><div className="atlas-profile-content"><span className="cw-kicker">{reportVersion}</span><h2>{active.name}</h2><p className="atlas-profile-region">{active.region} / {domains.find(d=>d.id===active.domain)?.name}</p>{active.recordType&&<p className="atlas-record-type">{active.recordType} / 編集部選定・政府個別指定の確認ではありません</p>}<div className="atlas-profile-score"><div><small>CWRI-IC / 分野別参考指標</small><strong>{profile.score}<small>/100</small></strong><span>{infrastructureLevel(profile.score)}</span><span>分野モデルによる参考値</span></div><div>{profile.axes.map(a=><div className="atlas-axis" key={a.id}><span>{a.label}</span><meter min="0" max="5" value={a.value}/><b>{a.value}/5</b></div>)}</div></div><div className="atlas-level-inline">{infrastructureLevels.map(([name,range])=><span className={'atlas-level-'+name.toLowerCase()} key={name}>{name} {range}</span>)}</div><p className="atlas-profile-warning">分野別の参考値であり、施設固有の安全性・脆弱性を評価するものではありません。</p>{intelligenceReport(active,profile).map((part,i)=><section key={i}><h3>{String(i+1).padStart(2,'0')} / {part.title}</h3><p>{part.body}</p></section>)}<div className="atlas-profile-sources"><h3>調査・参照先</h3>{verifiedProfiles[active.name]?.sources.map(([label,url])=><a key={url} href={url} target="_blank" rel="noreferrer">{label}</a>)}<p>以下は分野共通の評価枠組みです。</p><a href="https://www.nist.gov/cyberframework" target="_blank" rel="noreferrer">NIST Cybersecurity Framework 2.0</a><a href="https://www.cisa.gov/topics/critical-infrastructure-security-and-resilience" target="_blank" rel="noreferrer">CISA Critical Infrastructure Security & Resilience</a><a href={governmentFrameworkUrl} target="_blank" rel="noreferrer">国家サイバー統括室：重要インフラ16分野の公式定義</a></div></div></>:<div className="atlas-profile-content"><span className="cw-kicker">METHODOLOGY / CWRI-IC v0.1</span><h2>評価方法と限界</h2><p>世界のサイバーリスク・レジリエンスの考え方を参考にした、CYBER WORLD独自の参考指標です。国際機関の認定や公式スコアではありません。</p>{scoreAxes.map(a=><section key={a.id}><h3>{a.label} / {a.weight}%</h3><p>分野の一般的な特徴を1〜5の尺度で評価する参考モデルです。</p></section>)}<p>計算式：各軸の（0〜5の評価 ÷ 5）× 重みを合計して原点を算出し、100×（原点/100）の1.7乗で補正します。中程度の事象が高得点に集中することを避け、85点以上は極めて例外的な社会的重要度とします。施設固有の危険度順位ではありません。</p><section><h3>スコアレベルの定義</h3><div className="atlas-level-guide">{infrastructureLevels.map(([name,range,description])=><div className={'atlas-level-'+name.toLowerCase()} key={name}><b>{name}</b><strong>{range}</strong><span>{description}</span></div>)}</div></section></div>}</article></div>,document.body)}
 </section>;
}
