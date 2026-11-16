import { describe, expect, test } from 'vitest';
import {
  formatRubricTextAsLabel,
  formatRubricTextAsPlainText,
  parseRubricText,
} from '../../shared/rubricText';

describe('parseRubricText', () => {
  test('splits labeled links from surrounding text', () => {
    expect(parseRubricText('See [the guide](https://amatyc.org/guide) first.')).toEqual([
      { kind: 'text', text: 'See ' },
      { kind: 'link', text: 'the guide', url: 'https://amatyc.org/guide' },
      { kind: 'text', text: ' first.' },
    ]);
  });

  test('links bare URLs without trailing punctuation', () => {
    expect(parseRubricText('Visit https://amatyc.org.')).toEqual([
      { kind: 'text', text: 'Visit ' },
      { kind: 'link', text: 'https://amatyc.org', url: 'https://amatyc.org' },
      { kind: 'text', text: '.' },
    ]);
  });

  test('ignores non-http links', () => {
    expect(parseRubricText('[bad](javascript:alert(1))')).toEqual([
      { kind: 'text', text: '[bad](javascript:alert(1))' },
    ]);
  });

  test('keeps line breaks inside text segments', () => {
    expect(parseRubricText('Line one\nLine two')).toEqual([
      { kind: 'text', text: 'Line one\nLine two' },
    ]);
  });
});

describe('formatRubricTextAsPlainText', () => {
  test('rewrites labeled links as text (url)', () => {
    expect(formatRubricTextAsPlainText('See [guide](https://a.org).')).toBe(
      'See guide (https://a.org).'
    );
  });

  test('leaves bare URLs unchanged', () => {
    expect(formatRubricTextAsPlainText('https://a.org')).toBe('https://a.org');
  });
});

describe('formatRubricTextAsLabel', () => {
  test('keeps link text and collapses line breaks', () => {
    expect(formatRubricTextAsLabel('See [guide](https://a.org)\nnow')).toBe('See guide now');
  });
});
