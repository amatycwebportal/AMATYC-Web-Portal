function slugifySegment(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function buildConsensusOverviewHtmlFilename(scopeSlug: string): string {
  const dateSegment = new Date().toISOString().slice(0, 10);
  return `consensus-general-overview-${slugifySegment(scopeSlug)}-${dateSegment}.html`;
}
