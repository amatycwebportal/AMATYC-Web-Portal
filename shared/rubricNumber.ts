const RUBRIC_NUMBER_PATTERN = /Rubric\s+(\d+)/i;

export function parseRubricNumberFromTitle(title: string): number | null {
  const match = title.match(RUBRIC_NUMBER_PATTERN);
  if (!match?.[1]) {
    return null;
  }
  const parsedNumber = Number.parseInt(match[1], 10);
  return Number.isFinite(parsedNumber) ? parsedNumber : null;
}

export function formatRubricColumnLabel(rubricNumber: number | null, title: string): string {
  if (rubricNumber !== null) {
    return String(rubricNumber);
  }
  return title.length > 12 ? `${title.slice(0, 12)}…` : title;
}

export function compareRubricsByNumber(
  left: { title: string; rubricNumber?: number | null },
  right: { title: string; rubricNumber?: number | null }
): number {
  const leftNumber = left.rubricNumber ?? parseRubricNumberFromTitle(left.title);
  const rightNumber = right.rubricNumber ?? parseRubricNumberFromTitle(right.title);

  if (leftNumber !== null && rightNumber !== null && leftNumber !== rightNumber) {
    return leftNumber - rightNumber;
  }
  if (leftNumber !== null && rightNumber === null) {
    return -1;
  }
  if (leftNumber === null && rightNumber !== null) {
    return 1;
  }
  return left.title.localeCompare(right.title, undefined, { sensitivity: 'base' });
}
