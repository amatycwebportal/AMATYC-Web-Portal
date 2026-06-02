import {
  buildStandaloneHtmlFromElement,
  prepareElementForHtmlExport,
} from './buildStandaloneHtmlFromElement';
import { triggerBrowserFileDownload } from '../charting/triggerBrowserFileDownload';

export type DownloadElementAsHtmlParams = {
  element: HTMLElement;
  filename: string;
  documentTitle: string;
};

export type DownloadElementAsHtmlResult = {
  ok: boolean;
  errorMessage?: string;
};

export async function executeDownloadElementAsHtml(
  params: DownloadElementAsHtmlParams
): Promise<DownloadElementAsHtmlResult> {
  const { element, filename, documentTitle } = params;
  const width = element.scrollWidth;
  const height = element.scrollHeight;

  if (width === 0 || height === 0) {
    return { ok: false, errorMessage: 'Nothing to export yet.' };
  }

  if (element.querySelector('.MuiCircularProgress-root')) {
    return { ok: false, errorMessage: 'Content is still loading. Try again in a moment.' };
  }

  const restoreAccordions = await prepareElementForHtmlExport(element);

  try {
    const html = buildStandaloneHtmlFromElement({ element, documentTitle });
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    triggerBrowserFileDownload(blob, filename);
    return { ok: true };
  } catch {
    return { ok: false, errorMessage: 'Could not create HTML file.' };
  } finally {
    restoreAccordions();
  }
}
