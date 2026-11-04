import {
  GENERAL_PATHWAY_ID,
  PATHWAY_GENERAL_KEY,
  PATHWAYS,
  isGeneralPathwayId,
  resolvePathwayId,
} from '@shared/pathways';

/** Raw scope from URL: empty = all contexts; legacy `predefinedBinId` supported. */
export function readPathwayScopeFromSearchParams(searchParams: URLSearchParams): string {
  return (searchParams.get('pathwayId') ?? searchParams.get('predefinedBinId') ?? '').trim();
}

export function formatPathwayScopeLabel(scopeSelection: string): string {
  if (!scopeSelection) {
    return 'All contexts';
  }
  const resolvedId = resolvePathwayId(scopeSelection);
  if (scopeSelection === PATHWAY_GENERAL_KEY || isGeneralPathwayId(resolvedId)) {
    return 'General';
  }
  return PATHWAYS.find((pathway) => pathway.id === resolvedId)?.name ?? scopeSelection;
}

/** Project lead review: omit param when scope is empty (all contexts). */
export function appendOptionalPathwayScopeParam(
  params: URLSearchParams,
  scopeSelection: string
): void {
  if (!scopeSelection) {
    return;
  }
  params.set(
    'pathwayId',
    scopeSelection === PATHWAY_GENERAL_KEY ? PATHWAY_GENERAL_KEY : resolvePathwayId(scopeSelection)
  );
}

/** Local leader consensus session: absent URL param means general pathway. */
export function appendSessionPathwayParam(
  params: URLSearchParams,
  scopeSelection: string
): void {
  const value = scopeSelection || PATHWAY_GENERAL_KEY;
  params.set(
    'pathwayId',
    value === PATHWAY_GENERAL_KEY ? PATHWAY_GENERAL_KEY : resolvePathwayId(value)
  );
}

export function buildPathwayScopeQuerySuffix(scopeSelection: string): string {
  if (!scopeSelection) {
    return '';
  }
  const param =
    scopeSelection === PATHWAY_GENERAL_KEY
      ? PATHWAY_GENERAL_KEY
      : resolvePathwayId(scopeSelection);
  return `&pathwayId=${encodeURIComponent(param)}`;
}

export function pathwayScopeSelectionFromContext(pathwayId: string, isGeneralPathway: boolean): string {
  return isGeneralPathway ? PATHWAY_GENERAL_KEY : pathwayId || GENERAL_PATHWAY_ID;
}
