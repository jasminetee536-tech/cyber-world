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
  {
    "title": "国内ランサム被害の高止まり",
    "date": "2026-11-24（確認日）",
    "source": "警視庁",
    "url": "https://www.keishicho.metro.tokyo.lg.jp/kurashi/cyber/notes/ransomware_threat.html",
    "fact": "警視庁は2026年上半期の報告を123件とし、2020年下半期以降の半期最多と説明した。"
  },
  {
    "title": "委託先依存が生む国内企業の共通リスク",
    "date": "2026-11-24（確認日）",
    "source": "IPA",
    "url": "https://www.ipa.go.jp/security/10threats/10threats2026.html",
    "fact": "IPAの2026年組織向け評価では委託・供給網が第2位。"
  },
  {
    "title": "生成AIと国内組織の新たな危機認識",
    "date": "2026-11-24（確認日）",
    "source": "IPA",
    "url": "https://www.ipa.go.jp/security/10threats/10threats2026.html",
    "fact": "IPAの2026年評価でAI関連リスクが初めて組織向け第3位に入った。"
  },
  {
    "title": "国内の遠隔接続環境に残る管理上の課題",
    "date": "2026-11-24（確認日）",
    "source": "警察庁",
    "url": "https://www.npa.go.jp/bureau/cyber/pdf/R7countermeasures_leaflet.pdf",
    "fact": "警察庁の2026年1月資料では調査対象のVPN利用組織の52%が最新パッチ未適用だった。"
  },
  {
    "title": "日本をめぐる標的型攻撃への警戒",
    "date": "2026-11-24（確認日）",
    "source": "警察庁",
    "url": "https://www.npa.go.jp/publications/statistics/cybersecurity/index.html",
    "fact": "警察庁の2025年情勢報告は国家との関係が疑われる集団による情報窃取活動を指摘している。"
  },
  {
    "title": "国内サービスを止めるDDoSの社会的影響",
    "date": "2026-11-24（確認日）",
    "source": "警察庁",
    "url": "https://www.npa.go.jp/publications/statistics/cybersecurity/index.html",
    "fact": "警察庁は2024年末から2025年初めの重要サービスへの妨害被害を報告している。"
  },
  {
    "title": "個人情報と不正ログインへの国内の懸念",
    "date": "2026-11-24（確認日）",
    "source": "IPA",
    "url": "https://www.ipa.go.jp/security/10threats/10threats2026.html",
    "fact": "IPAは2026年の個人向け脅威に情報窃取と不正ログインを挙げている。"
  },
  {
    "title": "偽情報と詐欺が揺さぶる日本の信頼",
    "date": "2026-11-24（確認日）",
    "source": "IPA",
    "url": "https://www.ipa.go.jp/pressrelease/2025/press20250910.html",
    "fact": "IPAの白書2025はAIの悪用と認知領域への攻撃に懸念を示す。"
  },
  {
    "title": "個人を狙う金融・決済詐欺",
    "date": "2026-11-24（確認日）",
    "source": "IPA",
    "url": "https://www.ipa.go.jp/security/10threats/10threats2026.html",
    "fact": "IPAの個人向け評価にはフィッシングや銀行・カードの不正利用が含まれる。"
  },
  {
    "title": "現場の危機認識と対策のギャップ",
    "date": "2026-11-24（確認日）",
    "source": "警察庁",
    "url": "https://www.npa.go.jp/bureau/cyber/pdf/R7countermeasures_leaflet.pdf",
    "fact": "警察庁の企業調査資料では社外アクセス時にIDとパスワードのみを使う回答が39.8%だった。"
  },
  {
    "title": "VMwareの仮想サーバー管理に弱点、複数の業務に影響のおそれ",
    "date": "2026-11-25（脅威モニター掲載日）",
    "source": "IPA",
    "url": "https://www.ipa.go.jp/security/security-alert/2026/alert20261124.html",
    "fact": "複数の業務サーバーをまとめて管理するVMware vCenter Serverに、正規の認証をすり抜けられる弱点が見つかりました。IPAは悪用報告を踏まえ、対象製品の更新を呼びかけています。"
  },
  {
    "title": "公開サイトの通信を取り次ぐZoraxyに複数の弱点",
    "date": "2026-11-25（脅威モニター掲載日）",
    "source": "JVN",
    "url": "https://jvn.jp/jp/JVN84156789/index.html",
    "fact": "ウェブサイトの通信を取り次ぐZoraxyに、外部から内部サービスへ通信が届くおそれのある弱点が見つかりました。JVNは修正版への更新を案内しています。"
  },
  {
    "title": "PHPの複数脆弱性、公開サイトの更新と侵害調査を優先",
    "date": "2026-11-25（脅威モニター掲載日）",
    "source": "JPCERT/CC",
    "url": "https://www.jpcert.or.jp/at/2026/at260033.html",
    "fact": "予約フォームなどを動かすPHPの弱点について、JPCERT/CCが11月20日に注意喚起を更新しました。10月公表分には実際の悪用報告があります。"
  },
  {
    "title": "Siemens製の工場向け機器・ソフト、11月の更新で確認すべきこと",
    "date": "2026-11-25（脅威モニター掲載日）",
    "source": "JVN",
    "url": "https://jvn.jp/vu/JVNVU98354779/",
    "fact": "JVNがSiemens製品の月次注意情報を11月24日に更新しました。対象機器の確認と、操業への影響を考慮した更新計画が必要です。"
  },
  {
    "title": "SoftBank Airターミナル6の脆弱性、修正版は自動配信済み",
    "date": "2026-11-25（脅威モニター掲載日）",
    "source": "JVN",
    "url": "https://jvn.jp/jp/JVN64740097/index.html",
    "fact": "家庭や小規模事業所で使われる通信端末の弱点について、JVNが11月20日に情報を更新しました。提供元は利用者の操作は不要と説明しています。"
  }
];
export const scenarioBlueprints=[
  {
    "id": "fi-20261125-control-plane",
    "title": "仮想化の集約が進む日本企業で、復旧権限の独立性が経営課題になる",
    "category": "サプライチェーン",
    "date": "2026-11-25",
    "horizon": "2027–2031",
    "ratings": {
      "coupling": 3,
      "inversion": 3,
      "aftershock": 3,
      "autonomy": 1,
      "opacity": 2,
      "transition": 2
    },
    "confidence": "低〜中・暫定（既存観測に基づく）",
    "claim": "2027〜2031年、共通管理基盤への依存が続く企業では、業務別のバックアップだけでなく管理権限の独立性が復旧能力の評価項目になる可能性がある。",
    "blindspot": "仮想サーバーを個別に分離しても管理面が共通なら、管理機能の障害や侵害で複数の業務の復旧が同時に制約される。バックアップの保管先だけでなく、復元時の認証と管理機能の依存先を分離する必要がある。",
    "counter": "管理基盤の分離と独立復旧試験が普及し、共通管理障害による業務停止が減少すること。",
    "watch": [
      "独立管理経路で復元可能な業務の割合",
      "共通管理基盤起因の同時停止件数"
    ],
    "news": [
      10
    ],
    "threatIds": [
      "jp-watch-20261125-vmware"
    ]
  },
  {
    "id": "fi-20261125-web-maintenance",
    "title": "公開サービスの安全性を左右するのは開発力より保守責任の明確さになる",
    "category": "脆弱性",
    "date": "2026-11-25",
    "horizon": "2027–2031",
    "ratings": {
      "coupling": 3,
      "inversion": 2,
      "aftershock": 2,
      "autonomy": 1,
      "opacity": 3,
      "transition": 2
    },
    "confidence": "低〜中・暫定（既存観測に基づく）",
    "claim": "2027〜2031年、公開窓口と実行環境の保守主体が分かれる組織では、修正責任と資産情報の共有がサービス継続性の重要な評価項目になる可能性がある。",
    "blindspot": "通信を取り次ぐ層とアプリケーション実行層は異なる保守契約に属し得る。片方だけを修正しても全体の安全性を確認できず、更新後の接続・予約・認証の確認にも部門間の連携が必要となる。二つの告知は同一攻撃を示すものではない。",
    "counter": "責任分界が明確化し、対象判定と修正の遅延が継続的に縮小すること。",
    "watch": [
      "対象判定までの日数",
      "保守責任者が未確定の公開資産割合"
    ],
    "news": [
      11,
      12
    ],
    "threatIds": [
      "jp-watch-20261125-zoraxy",
      "jp-watch-20261125-php"
    ]
  },
  {
    "id": "fi-20261125-ot-maintenance",
    "title": "工場のサイバー防御が安全な停止・再稼働能力の競争になる",
    "category": "重要インフラ",
    "date": "2026-11-25",
    "horizon": "2027–2031",
    "ratings": {
      "coupling": 3,
      "inversion": 3,
      "aftershock": 3,
      "autonomy": 1,
      "opacity": 2,
      "transition": 2
    },
    "confidence": "低〜中・暫定（既存観測に基づく）",
    "claim": "2027〜2031年、設備の長期利用と更新頻度の差が続く場合、製造業では修正の速さだけでなく安全に停止し再稼働できる能力が供給継続性を左右する可能性がある。",
    "blindspot": "工場の監視・制御製品では更新に工程の調整や安全確認が必要な場合がある。更新を急ぐことと操業の安全性は別の評価軸であり、代替監視や検証環境があれば両者の両立が容易になる。",
    "counter": "検証環境と計画保守の普及により更新遅延と再稼働時間がともに短縮すること。",
    "watch": [
      "保守枠不足による更新延期日数",
      "安全確認を含む再稼働時間"
    ],
    "news": [
      13
    ],
    "threatIds": [
      "jp-watch-20261125-siemens"
    ]
  },
  {
    "id": "fi-20261125-managed-edge",
    "title": "家庭・小規模店舗の通信安全性が提供元の更新保証に依存する未来",
    "category": "重要インフラ",
    "date": "2026-11-25",
    "horizon": "2027–2031",
    "ratings": {
      "coupling": 2,
      "inversion": 2,
      "aftershock": 2,
      "autonomy": 2,
      "opacity": 2,
      "transition": 2
    },
    "confidence": "低〜中・暫定（既存観測に基づく）",
    "claim": "2027〜2031年、自動更新型の通信端末が普及する場合、利用者自身の保守負担は減る一方、提供元の更新到達性とサポート期間が安全性を左右する可能性がある。",
    "blindspot": "自動配信は手動更新の負担を減らすが、長期間未接続の端末やサポート終了機器の扱いは別途確認が必要になる。今回の事例は自動更新が提供されたという観測であり、更新障害や国内被害の証拠ではない。",
    "counter": "更新到達率とサポート期限の透明性が改善し、未更新端末が継続的に減少すること。",
    "watch": [
      "更新到達率（公表される場合）",
      "サポート終了端末の残存割合"
    ],
    "news": [
      14
    ],
    "threatIds": [
      "jp-watch-20261125-softbank"
    ]
  },
  {
    "id": "fi-jp-1",
    "title": "復旧完了ではなく取引再開までが長期化する日本企業",
    "category": "ランサムウェア",
    "horizon": "2027–2031",
    "ratings": {
      "coupling": 4,
      "inversion": 3,
      "aftershock": 4,
      "autonomy": 1,
      "opacity": 3,
      "transition": 3
    },
    "confidence": "低〜中・暫定",
    "claim": "復旧完了ではなく取引再開までが長期化する日本企業という条件付き仮説。操業停止と顧客対応が同時に発生する場合、取引先にも負担が及ぶ。",
    "blindspot": "操業停止と顧客対応が同時に発生する場合、取引先にも負担が及ぶ。",
    "counter": "共同復旧訓練の普及と停止期間の短縮",
    "watch": [
      "業務正常化までの日数"
    ],
    "news": [
      0
    ],
    "threatIds": [
      "jp-watch-20261124-1"
    ]
  },
  {
    "id": "fi-jp-2",
    "title": "委託先の復旧能力が取引条件になる未来",
    "category": "サプライチェーン",
    "horizon": "2027–2031",
    "ratings": {
      "coupling": 4,
      "inversion": 3,
      "aftershock": 3,
      "autonomy": 1,
      "opacity": 3,
      "transition": 3
    },
    "confidence": "低〜中・暫定",
    "claim": "委託先の復旧能力が取引条件になる未来という条件付き仮説。複数企業が同じ委託サービスを利用する場合には影響が相関する。",
    "blindspot": "複数企業が同じ委託サービスを利用する場合には影響が相関する。",
    "counter": "代替委託先の確保と共同監査の実効性",
    "watch": [
      "委託先起因の停止件数"
    ],
    "news": [
      1
    ],
    "threatIds": [
      "jp-watch-20261124-2"
    ]
  },
  {
    "id": "fi-jp-3",
    "title": "AIの判断を取り消せる企業と取り消せない企業",
    "category": "AI・サイバー",
    "horizon": "2027–2031",
    "ratings": {
      "coupling": 3,
      "inversion": 3,
      "aftershock": 2,
      "autonomy": 4,
      "opacity": 3,
      "transition": 4
    },
    "confidence": "低〜中・暫定",
    "claim": "AIの判断を取り消せる企業と取り消せない企業という条件付き仮説。生成物の信頼性と業務権限の管理が同時に必要になる。",
    "blindspot": "生成物の信頼性と業務権限の管理が同時に必要になる。",
    "counter": "重要操作の承認と取り消し機能の普及",
    "watch": [
      "AI関連の誤操作報告"
    ],
    "news": [
      2
    ],
    "threatIds": [
      "jp-watch-20261124-3"
    ]
  },
  {
    "id": "fi-jp-4",
    "title": "更新能力が取引継続性を左右する社会",
    "category": "脆弱性",
    "horizon": "2027–2031",
    "ratings": {
      "coupling": 3,
      "inversion": 3,
      "aftershock": 3,
      "autonomy": 1,
      "opacity": 3,
      "transition": 3
    },
    "confidence": "低〜中・暫定",
    "claim": "更新能力が取引継続性を左右する社会という条件付き仮説。保守の遅れが外部接続の安全性に影響する。",
    "blindspot": "保守の遅れが外部接続の安全性に影響する。",
    "counter": "更新遅延と侵害件数の継続的な減少",
    "watch": [
      "修正までの日数"
    ],
    "news": [
      3
    ],
    "threatIds": [
      "jp-watch-20261124-4"
    ]
  },
  {
    "id": "fi-jp-5",
    "title": "機密情報の継続的な保護が産業競争力を左右する未来",
    "category": "国家・APT",
    "horizon": "2027–2031",
    "ratings": {
      "coupling": 3,
      "inversion": 2,
      "aftershock": 3,
      "autonomy": 1,
      "opacity": 4,
      "transition": 3
    },
    "confidence": "低〜中・暫定",
    "claim": "機密情報の継続的な保護が産業競争力を左右する未来という条件付き仮説。機密情報の保護と帰属判断には別々の証拠が必要。",
    "blindspot": "機密情報の保護と帰属判断には別々の証拠が必要。",
    "counter": "情報窃取の減少と検知能力の改善",
    "watch": [
      "国内の確認済み標的型事案"
    ],
    "news": [
      4
    ],
    "threatIds": [
      "jp-watch-20261124-5"
    ]
  },
  {
    "id": "fi-jp-6",
    "title": "デジタルサービスの代替経路が社会の標準になる未来",
    "category": "重要インフラ",
    "horizon": "2027–2031",
    "ratings": {
      "coupling": 4,
      "inversion": 3,
      "aftershock": 3,
      "autonomy": 1,
      "opacity": 2,
      "transition": 3
    },
    "confidence": "低〜中・暫定",
    "claim": "デジタルサービスの代替経路が社会の標準になる未来という条件付き仮説。可用性の低下が利用者の生活や企業活動に及ぶ。",
    "blindspot": "可用性の低下が利用者の生活や企業活動に及ぶ。",
    "counter": "妨害時も代替サービスで業務継続できること",
    "watch": [
      "利用不能時間と代替利用率"
    ],
    "news": [
      5
    ],
    "threatIds": [
      "jp-watch-20261124-6"
    ]
  },
  {
    "id": "fi-jp-7",
    "title": "本人確認の回復が生活再建の一部になる未来",
    "category": "情報漏えい",
    "horizon": "2027–2031",
    "ratings": {
      "coupling": 3,
      "inversion": 2,
      "aftershock": 4,
      "autonomy": 1,
      "opacity": 3,
      "transition": 3
    },
    "confidence": "低〜中・暫定",
    "claim": "本人確認の回復が生活再建の一部になる未来という条件付き仮説。個人の認証情報の再利用は複数サービスの被害につながり得る。",
    "blindspot": "個人の認証情報の再利用は複数サービスの被害につながり得る。",
    "counter": "耐フィッシング認証と迅速な救済の普及",
    "watch": [
      "アカウント回復に要する時間"
    ],
    "news": [
      6
    ],
    "threatIds": [
      "jp-watch-20261124-7"
    ]
  },
  {
    "id": "fi-jp-8",
    "title": "情報の出所を確認できることが社会参加の条件になる未来",
    "category": "AI・サイバー",
    "horizon": "2027–2031",
    "ratings": {
      "coupling": 3,
      "inversion": 2,
      "aftershock": 3,
      "autonomy": 3,
      "opacity": 4,
      "transition": 3
    },
    "confidence": "低〜中・暫定",
    "claim": "情報の出所を確認できることが社会参加の条件になる未来という条件付き仮説。情報の真偽確認に要する負担が市民と組織に増える可能性がある。",
    "blindspot": "情報の真偽確認に要する負担が市民と組織に増える可能性がある。",
    "counter": "真正性確認の普及と詐欺被害の減少",
    "watch": [
      "偽情報関連の被害相談"
    ],
    "news": [
      7
    ],
    "threatIds": [
      "jp-watch-20261124-8"
    ]
  },
  {
    "id": "fi-jp-9",
    "title": "金融サービスの安全評価が救済速度を重視する未来",
    "category": "情報漏えい",
    "horizon": "2027–2031",
    "ratings": {
      "coupling": 3,
      "inversion": 2,
      "aftershock": 4,
      "autonomy": 2,
      "opacity": 3,
      "transition": 3
    },
    "confidence": "低〜中・暫定",
    "claim": "金融サービスの安全評価が救済速度を重視する未来という条件付き仮説。被害後の資金回復と本人確認は生活上の負担となる。",
    "blindspot": "被害後の資金回復と本人確認は生活上の負担となる。",
    "counter": "不正送金の抑止と補償期間の短縮",
    "watch": [
      "被害額と救済期間"
    ],
    "news": [
      8
    ],
    "threatIds": [
      "jp-watch-20261124-9"
    ]
  },
  {
    "id": "fi-jp-10",
    "title": "安全対策の運用負担が国内企業の格差を広げる未来",
    "category": "脆弱性",
    "horizon": "2027–2031",
    "ratings": {
      "coupling": 3,
      "inversion": 3,
      "aftershock": 3,
      "autonomy": 1,
      "opacity": 4,
      "transition": 3
    },
    "confidence": "低〜中・暫定",
    "claim": "安全対策の運用負担が国内企業の格差を広げる未来という条件付き仮説。対策の実施状況は現場の制約を考える材料だが、不安感そのものを測った値ではない。",
    "blindspot": "対策の実施状況は現場の制約を考える材料だが、不安感そのものを測った値ではない。",
    "counter": "中小企業の対策・支援利用率が改善すること",
    "watch": [
      "代表性のある不安調査と対策実施率"
    ],
    "news": [
      9
    ],
    "threatIds": [
      "jp-watch-20261124-10"
    ]
  }
];
