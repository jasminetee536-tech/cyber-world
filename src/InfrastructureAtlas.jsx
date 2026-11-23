import React,{useEffect,useRef,useState} from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './atlas.css';

const domains=[
{id:'airport',name:'空港',icon:'✈'},
{id:'port',name:'港湾',icon:'⚓'},
{id:'road',name:'道路・橋梁',icon:'▰'},
{id:'rail',name:'鉄道',icon:'▤'},
{id:'energy',name:'エネルギー',icon:'⚡'},
{id:'communications',name:'通信',icon:'◎'},
{id:'water',name:'水道・治水',icon:'◈'},
{id:'medical',name:'医療',icon:'✚'},
{id:'logistics',name:'物流',icon:'▣'},
{id:'government',name:'行政・防災',icon:'▥'}
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
function JapanMap({items,selected,onSelect}){
 const node=useRef(null),map=useRef(null),layer=useRef(null);
 const [tileError,setTileError]=useState(false);
 useEffect(()=>{if(!node.current||map.current)return;const m=L.map(node.current,{zoomControl:false,scrollWheelZoom:false,attributionControl:true,minZoom:4,maxZoom:12}).setView([37.5,137.3],5);const tiles=L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'&copy; OpenStreetMap contributors',maxZoom:18,className:'atlas-dark-tiles'});tiles.on('tileerror',()=>setTileError(true));tiles.on('tileload',()=>setTileError(false));tiles.addTo(m);L.control.zoom({position:'bottomright'}).addTo(m);map.current=m;layer.current=L.layerGroup().addTo(m);setTimeout(()=>m.invalidateSize(),150);return()=>{m.remove();map.current=null}},[]);
 useEffect(()=>{if(!map.current||!layer.current)return;layer.current.clearLayers();items.forEach(s=>{const active=selected?.id===s.id;L.circleMarker([s.lat,s.lng],{radius:active?11:7,color:active?'#ffd68d':'#8cf7ff',weight:active?3:2,fillColor:active?'#ffb84b':'#00d9ff',fillOpacity:1,className:active?'atlas-marker-active':'atlas-marker'}).addTo(layer.current).bindTooltip(s.name).on('click',()=>onSelect(s))})},[items,selected,onSelect]);
 useEffect(()=>{if(selected&&map.current)map.current.flyTo([selected.lat,selected.lng],Math.max(map.current.getZoom(),7),{duration:.65})},[selected?.id]);
 return <div className="atlas-map-shell"><div ref={node} className="atlas-map" aria-label="日本の重要インフラ地図"/><div className="atlas-map-vignette" aria-hidden="true"/>{tileError&&<div className="atlas-map-error" role="status">地図画像を読み込めません。右側の拠点一覧から詳細情報を確認できます。</div>}<div className="atlas-map-crosshair" aria-hidden="true">＋</div><div className="atlas-map-hud" aria-hidden="true"><span className="atlas-live-dot"/> JAPAN / GEO INTELLIGENCE <b>35°N · 139°E</b></div><div className="atlas-map-corner" aria-hidden="true">◢ CYBER WORLD / ATLAS</div></div>;
}
export default function InfrastructureAtlas(){
 const [domain,setDomain]=useState('all'),[selected,setSelected]=useState(null),[query,setQuery]=useState(''),[detailOpen,setDetailOpen]=useState(false),[mobileList,setMobileList]=useState(false);
 const items=sites.filter(s=>(domain==='all'||s.domain===domain)&&[s.name,s.region,s.importance].join(' ').toLowerCase().includes(query.trim().toLowerCase()));
 const active=selected&&items.find(s=>s.id===selected.id);
 const chooseSite=s=>{setSelected(s);setDetailOpen(false)};
 const moveSite=delta=>{const index=items.findIndex(s=>s.id===active?.id);if(items.length)chooseSite(items[(index+delta+items.length)%items.length])};
 const choose=d=>{setDomain(d);setSelected(null);setDetailOpen(false)};
 return <section className="atlas atlas-v2">
 <div className="atlas-heading atlas-heading-compact"><span className="cw-kicker">JAPAN / GEO INTELLIGENCE</span><h2>日本の重要インフラ</h2><p>地図のピンと拠点カードが連動。公開情報から社会的な重要性と想定リスクを読み解きます。</p><div className="atlas-summary"><span><b>{sites.length}</b> 収録拠点</span><span><b>{domains.length}</b> 分野</span><span>リスクスコア <b>未評価</b></span></div></div>
 <div className="atlas-domains atlas-domains-v2"><button type="button" className={'atlas-domain '+(domain==='all'?'is-active':'')} onClick={()=>choose('all')}><span>▦</span>すべて</button>{domains.map(d=><button type="button" key={d.id} className={'atlas-domain '+(domain===d.id?'is-active':'')} onClick={()=>choose(d.id)}><span>{d.icon}</span>{d.name}</button>)}</div>
 <div className="atlas-layout atlas-layout-v2"><div className="atlas-map-wrap"><div className="atlas-map-top"><strong>JAPAN / INFRASTRUCTURE MAP</strong><span>{items.length} 拠点を表示</span></div><JapanMap items={items} selected={active} onSelect={chooseSite}/>
 <div className="atlas-mobile-overlay">{active?<article className="atlas-floating-card"><div className="atlas-floating-main"><div><small>{domains.find(d=>d.id===active.domain)?.icon} {domains.find(d=>d.id===active.domain)?.name} / {active.region}</small><strong>{active.name}</strong><span>重要性：{active.importance}</span></div><button type="button" aria-label="選択解除" onClick={()=>setSelected(null)}>×</button></div><div className="atlas-floating-actions"><button type="button" onClick={()=>moveSite(-1)} aria-label="前の拠点">‹ 前へ</button><button type="button" onClick={()=>{setDetailOpen(v=>!v)}}>{detailOpen?'詳細を閉じる':'重要性・リスクを見る'} ▾</button><button type="button" onClick={()=>moveSite(1)} aria-label="次の拠点">次へ ›</button></div>{detailOpen&&<div className="atlas-floating-details"><b>想定リスク</b><p>{active.risk}</p><b>障害時の影響</b><p>{active.impact}</p><small>一般的なリスクの解説であり、実際の脆弱性や攻撃を示すものではありません。</small></div>}</article>:<div className="atlas-floating-prompt">◎ 地図のピンを選ぶと、ここに拠点情報が表示されます。</div>}</div>
 <small>地図上の点は公開情報に基づく代表位置・地域の目安です。設備の正確な所在地や脆弱箇所を示しません。</small></div>
 <div className="atlas-panel atlas-panel-v2"><div className="atlas-panel-title"><span>INFRASTRUCTURE DIRECTORY</span><h3>重要拠点を探す <small>{items.length}件</small></h3></div><label className="atlas-search"><span>⌕</span><input aria-label="拠点名・地域で検索" placeholder="拠点名・地域で検索" value={query} onChange={e=>{setQuery(e.target.value);setSelected(null)}}/></label><div className="atlas-site-list">{items.length?items.map(s=><button type="button" key={s.id} className={'atlas-site '+(active?.id===s.id?'is-active':'')} onClick={()=>chooseSite(s)}><span className="atlas-site-symbol">{domains.find(d=>d.id===s.domain)?.icon}</span><span><strong>{s.name}</strong><small>{domains.find(d=>d.id===s.domain)?.name} · {s.region}</small></span><b>›</b></button>):<p className="atlas-hint">条件に一致する拠点がありません。</p>}</div>{active&&<article className="atlas-detail atlas-desktop-detail"><span className="cw-kicker">INFRASTRUCTURE PROFILE</span><h3>{active.name}</h3><p className="atlas-region">{active.region}</p><h4>なぜ重要なのか</h4><p>{active.importance}</p><h4>想定されるサイバーリスク</h4><p>{active.risk}</p><h4>障害時の影響</h4><p>{active.impact}</p><p className="atlas-note">実際の攻撃や脆弱性を示す情報ではありません。拠点別リスクスコアは未評価です。</p></article>}</div></div>
 <p className="atlas-disclaimer">掲載拠点は代表例です。モックにあった危険度ランキング・高リスク件数・監視件数は、根拠のない数値を避けるため表示していません。</p>
 </section>;
}
