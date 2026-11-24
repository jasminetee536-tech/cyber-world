import React from 'react';
import { threatWatchArticles } from './threat-watch-articles.js';
import { scenarioBlueprints, newsEvidence } from './future-research.js';
import { futureLongform } from './future-longform.js';

const pageSources = {
  '脅威モニター': ['threat'],
  '未来予測': ['future'],
  'サイバー図鑑': ['encyclopedia'],
  '日本インフラ': ['infrastructure'],
  '事件年表': ['incidents'],
  'AI分析': ['analysis', 'research'],
  '地政学・経済安全保障': ['research'],
  '災害分析': ['research'],
  '国家レジリエンス': ['research'],
  '研究': ['research'],
  '分析レポート': ['research', 'threat', 'incidents'],
  '情報連関分析': ['threat', 'incidents'],
  'ニュース': ['threat', 'incidents'],
  '情報基盤': ['threat', 'future'],
};

function latestDay(values) {
  return values.map(value => typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}/)?.[0])
    .filter(Boolean).sort().at(-1);
}

function articleDates(articles) {
  return articles.flatMap(({ date, updatedAt, updatedDate }) => [date, updatedAt, updatedDate]);
}

const sourceDates = {
  ...__CONTENT_CHANGE_DATES__,
  threat: latestDay([__CONTENT_CHANGE_DATES__.threat, ...articleDates(threatWatchArticles)]),
  future: latestDay([__CONTENT_CHANGE_DATES__.future, ...articleDates([...scenarioBlueprints, ...futureLongform, ...newsEvidence])]),
};
const siteDate = latestDay(Object.values(sourceDates));

export default function PageUpdate({ page, reviewDates = [], badge }) {
  const sources = pageSources[page] ?? Object.keys(sourceDates);
  const date = latestDay([
    ...sources.map(key => sourceDates[key]),
    ...(sources.includes('incidents') ? reviewDates : []),
  ]);
  const displayedDate = date ?? siteDate;
  if (!displayedDate) return null;
  const formatted = displayedDate.replaceAll('-', '.');
  if (badge) return <span className="tm-status"><time dateTime={displayedDate} title="更新日">{formatted}</time> / {badge}</span>;

  return <div className="cw-page-update">
    <span>{date ? '更新日' : 'サイト更新日'}</span>
    <time dateTime={displayedDate}>{formatted}</time>
  </div>;
}
