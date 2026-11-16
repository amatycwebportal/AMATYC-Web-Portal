/** Section name used for scales that have no section label. */
export const DEFAULT_SECTION_NAME = 'General';

/** Section descriptions keyed by section name; sections without one have no key. */
export type SectionDescriptions = Record<string, string>;

export const resolveSectionName = (section: string | null | undefined): string =>
  section ?? DEFAULT_SECTION_NAME;

/** Reads stored JSON into a map, keeping only non-blank string descriptions. */
export function parseSectionDescriptions(value: unknown): SectionDescriptions {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return {};
  }
  const entries = Object.entries(value as Record<string, unknown>).filter(
    (entry): entry is [string, string] => typeof entry[1] === 'string' && entry[1].trim().length > 0
  );
  return Object.fromEntries(entries);
}

/** Drops descriptions for sections that no longer have scales, and blank descriptions. */
export function pruneSectionDescriptions(params: {
  sectionDescriptions: unknown;
  sectionNames: Iterable<string>;
}): SectionDescriptions {
  const liveSectionNames = new Set(params.sectionNames);
  const entries = Object.entries(parseSectionDescriptions(params.sectionDescriptions)).filter(
    ([sectionName]) => liveSectionNames.has(sectionName)
  );
  return Object.fromEntries(entries);
}

/** Moves a description to a section's new name when the section is renamed. */
export function renameSectionDescription(params: {
  sectionDescriptions: SectionDescriptions | undefined;
  fromName: string;
  toName: string;
}): SectionDescriptions {
  const { [params.fromName]: description, ...rest } = params.sectionDescriptions ?? {};
  return description === undefined ? rest : { ...rest, [params.toName]: description };
}
