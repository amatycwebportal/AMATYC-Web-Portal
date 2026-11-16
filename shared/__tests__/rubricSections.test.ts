import { describe, expect, test } from 'vitest';
import {
  parseSectionDescriptions,
  pruneSectionDescriptions,
  renameSectionDescription,
  resolveSectionName,
} from '../../shared/rubricSections';

describe('parseSectionDescriptions', () => {
  test('keeps only non-blank string descriptions', () => {
    expect(parseSectionDescriptions({ A: 'Intro', B: '   ', C: 3 })).toEqual({ A: 'Intro' });
  });

  test('treats non-objects as empty', () => {
    expect(parseSectionDescriptions(null)).toEqual({});
    expect(parseSectionDescriptions(['x'])).toEqual({});
  });
});

describe('pruneSectionDescriptions', () => {
  test('drops descriptions for sections without scales', () => {
    expect(
      pruneSectionDescriptions({
        sectionDescriptions: { A: 'Keep', Gone: 'Drop' },
        sectionNames: ['A', resolveSectionName(null)],
      })
    ).toEqual({ A: 'Keep' });
  });
});

describe('renameSectionDescription', () => {
  test('moves the description to the new name', () => {
    expect(
      renameSectionDescription({
        sectionDescriptions: { Old: 'Text', Other: 'x' },
        fromName: 'Old',
        toName: 'New',
      })
    ).toEqual({ New: 'Text', Other: 'x' });
  });

  test('does nothing when the section has no description', () => {
    expect(
      renameSectionDescription({ sectionDescriptions: undefined, fromName: 'A', toName: 'B' })
    ).toEqual({});
  });
});
