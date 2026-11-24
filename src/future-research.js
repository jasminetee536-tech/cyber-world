// CWFI v2.0: forward-looking structural signals. Scores rank investigation priority, not probability.
export const MODEL={version:'CWFI 2.0 / EXPERIMENTAL',axes:[
{id:'coupling',label:'不可視の結合度',weight:24,description:'表面上は独立したサービスが、同じ制御面・認証・運用に結びつく度合い'},
{id:'inversion',label:'正常運用の反転性',weight:20,description:'更新・復旧・自動化など本来安全を高める操作が障害を拡大し得る度合い'},
{id:'aftershock',label:'復旧後の残響',weight:18,description:'システムが復旧しても、業務・物流・信頼の正常化が遅れる度合い'},
{id:'autonomy',label:'機械判断の増幅',weight:16,description:'人間が介在しない判断・連鎖実行が影響を増幅する度合い'},
{id:'opacity',label:'観測不能性',weight:12,description:'既存の監視指標では変化の兆候や影響を捕捉しにくい度合い'},
{id:'transition',label:'転換点への接近',weight:10,description:'技術・制度・依存構造の変化が従来の前提を無効化する度合い'}
]};
export const LEVELS=[
{min:0,max:19,name:'L0 / 観測段階',meaning:'独立したシグナルが乏しく、仮説の形成段階'},
{min:20,max:39,name:'L1 / 初期兆候',meaning:'限定的な兆候があるが、構造変化の裏付けは弱い'},
{min:40,max:54,name:'L2 / 要監視',meaning:'複数の論点が成立し、継続観測する価値がある'},
{min:55,max:69,name:'L3 / 重要シグナル',meaning:'複数の構造要因が確認でき、優先して検証すべき'},
{min:70,max:84,name:'L4 / 戦略的重要',meaning:'複数領域に影響する強い構造的根拠がある'},
{min:85,max:100,name:'L5 / 例外的警戒',meaning:'独立した強い証拠と重大な転換点が揃う極めて例外的な場合'}
];
export const levelFor=v=>LEVELS.find(x=>v>=x.min&&v<=x.max)||LEVELS[0];
export const AXIS_ANCHORS=[
{value:0,label:'根拠なし',rule:'観測情報も具体的な機序もない'},
{value:1,label:'弱い',rule:'理論上は成立するが、観測事実との結び付きが弱い'},
{value:2,label:'限定的',rule:'部分的な事例・機序はあるが、一般化は難しい'},
{value:3,label:'明確',rule:'公開事例と構造的な説明が整合している'},
{value:4,label:'強い',rule:'複数の独立した根拠があり、広い波及が説明できる'},
{value:5,label:'例外的',rule:'独立した強い根拠が重なり、代替説明も吟味済みの場合のみ'}
];
export const score=r=>Math.round(MODEL.axes.reduce((n,a)=>n+a.weight*r[a.id]/5,0));
export const newsEvidence=[
{title:'Microsoft 365の大規模障害：潜在バグ、ゲートウェイ障害、容量不足の複合',date:'2026-11-16',source:'The Guardian / Microsoftの説明を報道',url:'https://www.theguardian.com/technology/2026/nov/16/microsoft-global-outage-cause',fact:'複数の要因が重なったサービス障害。サイバー侵害が原因とは報じられていない。'},
{title:'11月の障害群：Microsoft、FAA、金融・航空等',date:'2026-11-19',source:'Associated Press',url:'https://apnews.com/article/0c0f0cf4983a0f81ba88c4c4d2b8383f',fact:'複数の障害に共通する攻撃の証拠は確認されていない。'},
{title:'11月の障害群に関する依存・帰属分析',date:'2026-11-18',source:'Cloud Security Alliance',url:'https://labs.cloudsecurityalliance.org/research/csa-research-note-november-outage-cluster-correlated-fragili/',fact:'複数障害の原因を区別しつつ、依存集中と帰属の問題を整理。'},
{title:'AI開発ツールチェーンとサプライチェーンの動向',date:'2026-11-19',source:'Cloud Security Alliance',url:'https://labs.cloudsecurityalliance.org/research/ciso-daily-briefing-20261119/',fact:'AI開発・依存コンポーネントをめぐる脅威を報告。個別事案は一次情報による再確認が必要。'}
];
newsEvidence.push({"title":"クラウドの機械ID侵害と復旧保護の重要性","date":"2026-09-25","source":"Microsoft Security Research","url":"https://www.microsoft.com/en-us/security/blog/2026/09/25/storm-3168-agentic-driven-cloud-attacks-using-compromised-service-principals/","fact":"侵害されたサービスプリンシパルによる破壊活動を報告。一部の独立した保護策は削除を阻止した。"},{"title":"Trivy供給網侵害と認証情報の回収","date":"2026-03-24","source":"Microsoft Defender Security Research","url":"https://www.microsoft.com/en-us/security/blog/2026/03/24/detecting-investigating-defending-against-trivy-supply-chain-compromise/","fact":"先行事件の不完全な対応と後続の供給網侵害を報告。"});
export const scenarioBlueprints=[
{id:'fi-01',title:'「障害が伝染する」より危険な未来──復旧操作が次の停止を生む社会',category:'可用性の反転',horizon:'2027–2030',ratings:{coupling:4,inversion:4,aftershock:4,autonomy:1,opacity:3,transition:2},confidence:'中',claim:'複数のシステムが連携する社会では、故障そのものより復旧の同期が新たな混雑と障害を生む。',blindspot:'復旧時間の短さだけを評価すると、再接続による負荷や業務の滞留を見逃す。',counter:'段階的再開、待ち行列の制御、代替手段の訓練で連鎖を弱められる。',watch:['復旧後に再び性能低下する事例','再接続集中を避ける運用設計の普及','システム復旧と業務正常化の時間差'],news:[0,1,2]},
{id:'fi-02',title:'攻撃者がいない危機──「正常な変更」が国家的リスクになる時代',category:'変更の逆説',horizon:'2027–2032',ratings:{coupling:3,inversion:4,aftershock:2,autonomy:1,opacity:3,transition:2},confidence:'中',claim:'更新・保守・容量増強・構成変更の複合が、悪意ある攻撃に匹敵する業務停止を起こし得る。',blindspot:'攻撃の有無で重大度を分けると、社会機能の可用性リスクを過小評価する。',counter:'変更前の依存関係評価、段階的展開、戻せる設計、実環境に近い負荷試験が有効。',watch:['変更・保守に起因する重大障害の割合','変更後の障害検知までの時間','切り戻しの実効性'],news:[0,1,2]},
{id:'fi-03',title:'AIが会社を壊すのではない──「誰も判断していない決定」が増える未来',category:'自律化の統治',horizon:'2027–2030',ratings:{coupling:2,inversion:3,aftershock:1,autonomy:4,opacity:2,transition:3},confidence:'中〜低',claim:'AIエージェントと自動化の連鎖が増えるほど、認証済み操作の責任と取り消し可能性が中心課題になる。',blindspot:'不正アクセスだけを監視すると、正規の権限で実行された誤った判断を区別しにくい。',counter:'操作の階層化、人間による重要操作承認、権限分離、監査ログ、実行取り消しが有効。',watch:['AIへの書き込み権限付与率','重要操作に対する承認・取り消し率','AI関連の誤操作や監査報告'],news:[1,3]}
,
{"id":"fi-04","title":"修正しても信頼は戻らない──機械IDの時代に生まれる「信頼復旧負債」","category":"信頼の復旧","horizon":"2027–2036","ratings":{"coupling":3,"inversion":2,"aftershock":3,"autonomy":3,"opacity":3,"transition":3},"confidence":"中・暫定","claim":"侵入経路の修正と既存権限の失効の時間差が、クラウド時代の復旧負債になる。","blindspot":"稼働率や修正率だけでは既存の信頼関係の健全性を測れない。","counter":"短命の認証情報、独立した復旧権限、失効の実測が普及し、修正後の二次被害が減少すれば仮説を弱める。","watch":["修正から旧権限の失効確認までの時間","機械IDの棚卸し率","独立した復旧試験の成功率"],"news":[4,5],"threatIds":["watch-20261124-apim","watch-20261124-glinet"]}
];
