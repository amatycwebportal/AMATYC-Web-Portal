import { CONSENSUS_OVERVIEW_EXPORT_EXCLUDE_ATTR } from './consensusOverviewExportAttributes';

const INLINE_STYLE_PROPERTIES = [
  'align-items',
  'background',
  'background-color',
  'background-image',
  'border',
  'border-bottom',
  'border-collapse',
  'border-color',
  'border-radius',
  'border-spacing',
  'border-top',
  'border-width',
  'box-sizing',
  'color',
  'display',
  'flex',
  'flex-direction',
  'flex-wrap',
  'font-family',
  'font-size',
  'font-weight',
  'gap',
  'height',
  'justify-content',
  'line-height',
  'margin',
  'margin-bottom',
  'margin-top',
  'max-height',
  'max-width',
  'min-width',
  'opacity',
  'outline',
  'outline-offset',
  'overflow',
  'padding',
  'padding-bottom',
  'padding-left',
  'padding-right',
  'padding-top',
  'text-align',
  'vertical-align',
  'white-space',
  'width',
] as const;

function escapeHtmlText(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function removeExcludedNodes(root: HTMLElement): void {
  root.querySelectorAll(`[${CONSENSUS_OVERVIEW_EXPORT_EXCLUDE_ATTR}]`).forEach((node) => {
    node.remove();
  });
}

function applyInlineStylesFromSource(sourceRoot: HTMLElement, cloneRoot: HTMLElement): void {
  const sourceNodes = [sourceRoot, ...Array.from(sourceRoot.querySelectorAll('*'))];
  const cloneNodes = [cloneRoot, ...Array.from(cloneRoot.querySelectorAll('*'))];

  for (let index = 0; index < sourceNodes.length; index += 1) {
    const sourceNode = sourceNodes[index];
    const cloneNode = cloneNodes[index];
    if (!(sourceNode instanceof HTMLElement) || !(cloneNode instanceof HTMLElement)) {
      continue;
    }
    const computed = window.getComputedStyle(sourceNode);
    const styleText = INLINE_STYLE_PROPERTIES.map(
      (property) => `${property}:${computed.getPropertyValue(property)}`
    ).join(';');
    cloneNode.setAttribute('style', styleText);
  }
}

async function expandCollapsedAccordions(root: HTMLElement): Promise<() => void> {
  const collapsedSummaries = Array.from(
    root.querySelectorAll('.MuiAccordion-root:not(.Mui-expanded) .MuiAccordionSummary-root')
  ).filter((node): node is HTMLElement => node instanceof HTMLElement);

  if (collapsedSummaries.length === 0) {
    return () => undefined;
  }

  collapsedSummaries.forEach((summary) => {
    summary.click();
  });

  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => resolve());
    });
  });

  return () => {
    collapsedSummaries.forEach((summary) => {
      summary.click();
    });
  };
}

export type BuildStandaloneHtmlFromElementParams = {
  element: HTMLElement;
  documentTitle: string;
};

export function buildStandaloneHtmlFromElement(
  params: BuildStandaloneHtmlFromElementParams
): string {
  const { element, documentTitle } = params;
  const clone = element.cloneNode(true) as HTMLElement;
  applyInlineStylesFromSource(element, clone);
  removeExcludedNodes(clone);

  const bodyHtml = clone.outerHTML;
  const safeTitle = escapeHtmlText(documentTitle);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${safeTitle}</title>
  <style>
    body { margin: 0; background: #fff; }
  </style>
</head>
<body>
${bodyHtml}
</body>
</html>`;
}

export async function prepareElementForHtmlExport(element: HTMLElement): Promise<() => void> {
  return expandCollapsedAccordions(element);
}
