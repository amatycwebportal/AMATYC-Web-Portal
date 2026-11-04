import {
  ANALYTICS_GRAPH_META,
  type AnalyticsGraphId,
} from '../../features/admin/pages/local_leader/analytics/useAnalyticsGraphWorkspace';

export const CHART_EXPORT_SUFFIX_ATTR = 'data-chart-export-suffix';

/** Elements matching this attribute (or their descendants) are omitted from PNG export. */
export const CHART_EXPORT_EXCLUDE_ATTR = 'data-chart-export-exclude';

export type ChartExportViewSuffix = 'histogram' | 'boxplot' | 'statistics';

function slugifySegment(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function buildAnalyticsChartImageFilename(
  graphId: AnalyticsGraphId,
  viewSuffix?: ChartExportViewSuffix | string
): string {
  const titleSlug = slugifySegment(ANALYTICS_GRAPH_META[graphId].title);
  const dateSegment = new Date().toISOString().slice(0, 10);
  const segments = ['analytics', titleSlug];
  if (viewSuffix) {
    segments.push(slugifySegment(viewSuffix));
  }
  segments.push(dateSegment);
  return `${segments.join('-')}.png`;
}

export function resolveChartExportSuffixFromElement(
  exportRoot: HTMLElement
): ChartExportViewSuffix | undefined {
  const suffixNode = exportRoot.querySelector(`[${CHART_EXPORT_SUFFIX_ATTR}]`);
  const raw = suffixNode?.getAttribute(CHART_EXPORT_SUFFIX_ATTR);
  if (raw === 'histogram' || raw === 'boxplot' || raw === 'statistics') {
    return raw;
  }
  return undefined;
}
