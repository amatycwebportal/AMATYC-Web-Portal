import { toPng } from 'html-to-image';
import { CHART_EXPORT_EXCLUDE_ATTR } from './buildAnalyticsChartImageFilename';
import { CHART_EXPORT_LIGHT_CLASS } from './chartExportLightSurface';
import { triggerBrowserFileDownload } from './triggerBrowserFileDownload';

function shouldIncludeNodeInChartExport(node: Node): boolean {
  if (!(node instanceof Element)) {
    return true;
  }
  if (node.closest(`[${CHART_EXPORT_EXCLUDE_ATTR}]`)) {
    return false;
  }
  if (node.classList.contains('MuiChartsToolbar-root') || node.closest('.MuiChartsToolbar-root')) {
    return false;
  }
  return true;
}

export type DownloadElementAsPngParams = {
  element: HTMLElement;
  filename: string;
};

export type DownloadElementAsPngResult = {
  ok: boolean;
  errorMessage?: string;
};

export async function executeDownloadElementAsPng(
  params: DownloadElementAsPngParams
): Promise<DownloadElementAsPngResult> {
  const { element, filename } = params;
  const width = element.scrollWidth;
  const height = element.scrollHeight;

  if (width === 0 || height === 0) {
    return { ok: false, errorMessage: 'Nothing to export yet.' };
  }

  element.classList.add(CHART_EXPORT_LIGHT_CLASS);
  try {
    const dataUrl = await toPng(element, {
      cacheBust: true,
      pixelRatio: 2,
      width,
      height,
      backgroundColor: '#ffffff',
      filter: shouldIncludeNodeInChartExport,
    });
    const response = await fetch(dataUrl);
    const blob = await response.blob();
    triggerBrowserFileDownload(blob, filename);
    return { ok: true };
  } catch {
    return { ok: false, errorMessage: 'Could not create chart image.' };
  } finally {
    element.classList.remove(CHART_EXPORT_LIGHT_CLASS);
  }
}
