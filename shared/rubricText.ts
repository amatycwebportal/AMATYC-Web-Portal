export type RubricTextSegment =
  | { kind: 'text'; text: string }
  | { kind: 'link'; text: string; url: string };

// Matches `[label](http(s)://url)` or a bare http(s) URL, excluding trailing punctuation.
const RUBRIC_LINK_PATTERN =
  /\[([^\]\n]+)\]\((https?:\/\/[^\s)]+)\)|(https?:\/\/[^\s<>]*[^\s<>.,;:!?)\]'"])/g;

const LABELED_LINK_GROUP = 1;
const LABELED_URL_GROUP = 2;
const BARE_URL_GROUP = 3;

function buildLinkSegment(match: RegExpMatchArray): RubricTextSegment {
  const bareUrl = match[BARE_URL_GROUP];
  if (bareUrl) {
    return { kind: 'link', text: bareUrl, url: bareUrl };
  }
  return {
    kind: 'link',
    text: match[LABELED_LINK_GROUP] ?? '',
    url: match[LABELED_URL_GROUP] ?? '',
  };
}

export function parseRubricText(text: string): RubricTextSegment[] {
  const segments: RubricTextSegment[] = [];
  let cursor = 0;
  for (const match of text.matchAll(RUBRIC_LINK_PATTERN)) {
    const start = match.index ?? 0;
    if (start > cursor) {
      segments.push({ kind: 'text', text: text.slice(cursor, start) });
    }
    segments.push(buildLinkSegment(match));
    cursor = start + match[0].length;
  }
  if (cursor < text.length) {
    segments.push({ kind: 'text', text: text.slice(cursor) });
  }
  return segments;
}

const formatSegmentAsPlainText = (segment: RubricTextSegment): string =>
  segment.kind === 'link' && segment.text !== segment.url
    ? `${segment.text} (${segment.url})`
    : segment.text;

/** Renders rubric wording for plain-text outputs such as CSV: `[text](url)` becomes `text (url)`. */
export const formatRubricTextAsPlainText = (text: string): string =>
  parseRubricText(text).map(formatSegmentAsPlainText).join('');

/** Rubric wording reduced to visible text only, for short single-line labels. */
export const formatRubricTextAsLabel = (text: string): string =>
  parseRubricText(text)
    .map((segment) => segment.text)
    .join('')
    .replace(/\s+/g, ' ')
    .trim();
