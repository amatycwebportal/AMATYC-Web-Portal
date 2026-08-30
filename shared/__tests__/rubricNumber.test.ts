import { describe, expect, test } from 'vitest';
import {
  compareRubricsByNumber,
  formatRubricColumnLabel,
  parseRubricNumberFromTitle,
} from '../../shared/rubricNumber';

describe('parseRubricNumberFromTitle', () => {
  test('parses rubric number from standard title', () => {
    expect(
      parseRubricNumberFromTitle(
        'Project EMBER — Rubric 3: Introductory Mathematics Course Structures (5 criteria)'
      )
    ).toBe(3);
  });

  test('returns null when title has no rubric number', () => {
    expect(parseRubricNumberFromTitle('Custom assessment template')).toBeNull();
  });
});

describe('formatRubricColumnLabel', () => {
  test('returns numeric label when rubric number is known', () => {
    expect(formatRubricColumnLabel(2, 'Project EMBER — Rubric 2: Climate')).toBe('2');
  });

  test('falls back to truncated title when rubric number is missing', () => {
    expect(formatRubricColumnLabel(null, 'Very long rubric title here')).toBe('Very long ru…');
  });
});

describe('compareRubricsByNumber', () => {
  test('sorts by parsed rubric number ascending', () => {
    const sorted = [
      { title: 'Project EMBER — Rubric 7: Instruction' },
      { title: 'Project EMBER — Rubric 1: Student Success' },
      { title: 'Project EMBER — Rubric 3: Structures' },
    ].sort(compareRubricsByNumber);

    expect(sorted.map((row) => parseRubricNumberFromTitle(row.title))).toEqual([1, 3, 7]);
  });
});
