// CWFI v2.0: forward-looking structural signals. Scores rank investigation priority, not probability.
export const MODEL={version:'CWFI 2.0 / EXPERIMENTAL',axes:[
{id:'coupling',label:'不可視の結合度',weight:24,description:'表面上は独立したサービスが、同じ制御面・認証・運用に結びつく度合い'},
{id:'inversion',label:'正常運用の反転性',weight:20,description:'更新・復旧・自動化など本来安全を高める操作が障害を拡大し得る度合い'},
{id:'aftershock',label:'復旧後の残響',weight:18,description:'システムが復旧しても、業務・物流・信頼の正常化が遅れる度合い'},
{id:'autonomy',label:'機械判断の増幅',weight:16,description:'人間が介在しない判断・連鎖実行が影響を増幅する度合い'},
{id:'opacity',label:'観測不能性',weight:12,description:'既存の監視指標では変化の兆候や影響を捕捉しにくい度合い'},
{id:'transition',label:'転換点への接近',weight:10,description:'技術・制度・依存構造の変化が従来の前提を無効化する度合い'}
]};
export const score=r=>Math.round(MODEL.axes.reduce((n,a)=>n+a.weight*r[a.id]/5,0));
export const newsEvidence=[
{title:'Microsoft 365の大規模障害：潜在バグ、ゲートウェイ障害、容量不足の複合',date:'2026-11-16',source:'The Guardian / Microsoftの説明を報道',url:'https://www.theguardian.com/technology/2026/nov/16/microsoft-global-outage-cause',fact:'複数の要因が重なったサービス障害。サイバー侵害が原因とは報じられていない。'},
{title:'11月の障害群：Microsoft、FAA、金融・航空等',date:'2026-11-19',source:'Associated Press',url:'https://apnews.com/article/0c0f0cf4983a0f81ba88c4c4d2b8383f',fact:'複数の障害に共通する攻撃の証拠は確認されていない。'},
{title:'11月の障害群に関する依存・帰属分析',date:'2026-11-18',source:'Cloud Security Alliance',url:'https://labs.cloudsecurityalliance.org/research/csa-research-note-november-outage-cluster-correlated-fragili/',fact:'複数障害の原因を区別しつつ、依存集中と帰属の問題を整理。'},
{title:'AI開発ツールチェーンとサプライチェーンの動向',date:'2026-11-19',source:'Cloud Security Alliance',url:'https://labs.cloudsecurityalliance.org/research/ciso-daily-briefing-20261119/',fact:'AI開発・依存コンポーネントをめぐる脅威を報告。個別事案は一次情報による再確認が必要。'}
];
export const scenarioBlueprints=[
{id:'fi-01',title:'「障害が伝染する」より危険な未来──復旧操作が次の停止を生む社会',category:'可用性の反転',horizon:'2027–2030',ratings:{coupling:5,inversion:5,aftershock:5,autonomy:4,opacity:4,transition:4},confidence:'中',claim:'複数のシステムが連携する社会では、故障そのものより復旧の同期が新たな混雑と障害を生む。',blindspot:'復旧時間の短さだけを評価すると、再接続による負荷や業務の滞留を見逃す。',counter:'段階的再開、待ち行列の制御、代替手段の訓練で連鎖を弱められる。',watch:['復旧後に再び性能低下する事例','再接続集中を避ける運用設計の普及','システム復旧と業務正常化の時間差'],news:[0,1,2]},
{id:'fi-02',title:'攻撃者がいない危機──「正常な変更」が国家的リスクになる時代',category:'変更の逆説',horizon:'2027–2032',ratings:{coupling:5,inversion:5,aftershock:4,autonomy:4,opacity:5,transition:5},confidence:'中',claim:'更新・保守・容量増強・構成変更の複合が、悪意ある攻撃に匹敵する業務停止を起こし得る。',blindspot:'攻撃の有無で重大度を分けると、社会機能の可用性リスクを過小評価する。',counter:'変更前の依存関係評価、段階的展開、戻せる設計、実環境に近い負荷試験が有効。',watch:['変更・保守に起因する重大障害の割合','変更後の障害検知までの時間','切り戻しの実効性'],news:[0,1,2]},
{id:'fi-03',title:'AIが会社を壊すのではない──「誰も判断していない決定」が増える未来',category:'自律化の統治',horizon:'2027–2030',ratings:{coupling:4,inversion:5,aftershock:4,autonomy:5,opacity:5,transition:5},confidence:'中〜低',claim:'AIエージェントと自動化の連鎖が増えるほど、認証済み操作の責任と取り消し可能性が中心課題になる。',blindspot:'不正アクセスだけを監視すると、正規の権限で実行された誤った判断を区別しにくい。',counter:'操作の階層化、人間による重要操作承認、権限分離、監査ログ、実行取り消しが有効。',watch:['AIへの書き込み権限付与率','重要操作に対する承認・取り消し率','AI関連の誤操作や監査報告'],news:[1,3]}
];
