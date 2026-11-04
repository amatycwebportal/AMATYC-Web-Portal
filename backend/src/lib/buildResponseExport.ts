import { type Prisma, prisma } from '@lib/prisma';
import {
  GENERAL_PATHWAY_ID,
  PATHWAY_GENERAL_KEY,
  isPathwayId,
  resolvePathwayId,
} from '@shared/pathways';

export const RESPONSE_EXPORT_ALL_SECTIONS = '__all_sections__';
export const RESPONSE_EXPORT_ALL_SCALES = '__all_scales__';
export const RESPONSE_EXPORT_UNCATEGORIZED = '__uncategorized__';

/** Query token for the General pathway. */
export const RESPONSE_EXPORT_GENERAL_CONTEXT_KEY = PATHWAY_GENERAL_KEY;

const LEGACY_RESPONSE_EXPORT_GLOBAL_CONTEXT_KEY = '__global__';

/** Pathway UUIDs only; maps general tokens to the General pathway id. */
export function filterResponseContextKeysToPathwayIds(keys: string[]): string[] {
  const pathwayIds = keys.map((key) => {
    if (key === RESPONSE_EXPORT_GENERAL_CONTEXT_KEY || key === LEGACY_RESPONSE_EXPORT_GLOBAL_CONTEXT_KEY) {
      return GENERAL_PATHWAY_ID;
    }
    return key;
  });
  return [...new Set(pathwayIds.filter((pathwayId) => isPathwayId(pathwayId)))];
}

/** @deprecated Use filterResponseContextKeysToPathwayIds */
export const filterResponseContextKeysToCourseBinIds = filterResponseContextKeysToPathwayIds;

type BuildExportWhereArgs = {
  rubricId: string;
  sectionKey: string;
  scaleVersionId: string;
  institutionIdScope: string | null;
  rubricVersionIds?: string[];
  /**
   * When set, restrict to these pathway ids / general tokens.
   * Empty array = no matching rows. When omitted, no pathway scope filter.
   */
  responseContextKeys?: string[];
};

export async function buildResponseExportWhere(
  args: BuildExportWhereArgs
): Promise<{ where: Prisma.ResponseWhereInput } | { error: string }> {
  const rubric = await prisma.rubric.findUnique({
    where: { id: args.rubricId },
    select: { id: true },
  });
  if (!rubric) {
    return { error: 'Rubric not found' };
  }

  const rubricVersions = await prisma.rubricVersion.findMany({
    where: { rubricId: args.rubricId },
    select: { id: true },
  });
  const allRubricVersionIds = rubricVersions.map((row) => row.id);
  if (allRubricVersionIds.length === 0) {
    return { error: 'No rubric versions for this rubric' };
  }

  let effectiveRubricVersionIds = allRubricVersionIds;
  if (args.rubricVersionIds && args.rubricVersionIds.length > 0) {
    const allowed = new Set(allRubricVersionIds);
    effectiveRubricVersionIds = args.rubricVersionIds.filter((id) => allowed.has(id));
    if (effectiveRubricVersionIds.length === 0) {
      return { error: 'No matching rubric versions for this rubric' };
    }
  }

  let scaleVersionFilter: Prisma.ScaleVersionWhereInput = {};

  if (args.sectionKey !== RESPONSE_EXPORT_ALL_SECTIONS) {
    if (args.sectionKey === RESPONSE_EXPORT_UNCATEGORIZED) {
      scaleVersionFilter = {
        ...scaleVersionFilter,
        OR: [{ section: null }, { section: '' }],
      };
    } else {
      scaleVersionFilter = { ...scaleVersionFilter, section: args.sectionKey };
    }
  }

  if (args.scaleVersionId !== RESPONSE_EXPORT_ALL_SCALES) {
    const selected = await prisma.scaleVersion.findFirst({
      where: {
        id: args.scaleVersionId,
        rubricVersionId: { in: effectiveRubricVersionIds },
      },
      select: { originalScaleId: true },
    });
    if (!selected) {
      return { error: 'Selected scale is not part of this rubric' };
    }
    scaleVersionFilter = { ...scaleVersionFilter, originalScaleId: selected.originalScaleId };
  }

  const hasScaleVersionPredicate = Object.keys(scaleVersionFilter).length > 0;

  let pathwayScopeFilter: Prisma.ResponseWhereInput | undefined;
  if (args.responseContextKeys !== undefined) {
    const uniqueKeys = [...new Set(args.responseContextKeys)];
    if (uniqueKeys.length === 0) {
      return { error: 'No response contexts selected' };
    }
    const pathwayIds = filterResponseContextKeysToPathwayIds(uniqueKeys);
    if (pathwayIds.length === 0) {
      return { error: 'No response contexts selected' };
    }
    pathwayScopeFilter = { pathwayId: { in: pathwayIds } };
  }

  const where: Prisma.ResponseWhereInput = {
    rubricVersionId: { in: effectiveRubricVersionIds },
    status: 'SUBMITTED',
    ...(args.institutionIdScope !== null
      ? { user: { is: { institutionId: args.institutionIdScope } } }
      : {}),
    ...(hasScaleVersionPredicate ? { scaleVersion: scaleVersionFilter } : {}),
    ...(pathwayScopeFilter !== undefined ? pathwayScopeFilter : {}),
  };

  return { where };
}

export type ResponseExportRow = {
  responseId: string;
  submittedAtIso: string;
  status: string;
  score: number;
  rubricId: string;
  rubricTitle: string;
  rubricVersionId: string;
  rubricVersionNumber: number;
  scaleVersionId: string;
  originalScaleId: string;
  scalePrompt: string;
  scaleOrderIndex: number;
  scaleSection: string;
  respondentUserId: string;
  respondentName: string;
  respondentEmail: string;
  respondentAliasName: string;
  respondentRole: string;
  institutionId: string;
  institutionName: string;
  pathwayId: string;
  pathwayName: string;
};

const CSV_HEADER: string[] = [
  'response_id',
  'submitted_at',
  'status',
  'score',
  'rubric_id',
  'rubric_title',
  'rubric_version_id',
  'rubric_version_number',
  'scale_version_id',
  'original_scale_id',
  'scale_prompt',
  'scale_order_index',
  'scale_section',
  'respondent_user_id',
  'respondent_name',
  'respondent_email',
  'respondent_alias_name',
  'respondent_role',
  'institution_id',
  'institution_name',
  'pathway_id',
  'pathway_name',
];

export function responseExportRowsToCsvStrings(rows: ResponseExportRow[]): string[][] {
  return rows.map((row) => [
    row.responseId,
    row.submittedAtIso,
    row.status,
    String(row.score),
    row.rubricId,
    row.rubricTitle,
    row.rubricVersionId,
    String(row.rubricVersionNumber),
    row.scaleVersionId,
    row.originalScaleId,
    row.scalePrompt,
    String(row.scaleOrderIndex),
    row.scaleSection,
    row.respondentUserId,
    row.respondentName,
    row.respondentEmail,
    row.respondentAliasName,
    row.respondentRole,
    row.institutionId,
    row.institutionName,
    row.pathwayId,
    row.pathwayName,
  ]);
}

export function getResponseExportCsvHeader(): string[] {
  return [...CSV_HEADER];
}

/** College leads receive aliases in respondent_name and a blank respondent_email. */
export function redactResponseExportRowsForCollegeLead(
  rows: ResponseExportRow[]
): ResponseExportRow[] {
  return rows.map((row) => ({
    ...row,
    respondentName: row.respondentAliasName || 'Anonymous',
    respondentEmail: '',
  }));
}

export async function fetchResponseExportRows(
  where: Prisma.ResponseWhereInput
): Promise<ResponseExportRow[]> {
  const responses = await prisma.response.findMany({
    where,
    select: {
      id: true,
      submittedAt: true,
      status: true,
      score: true,
      pathwayId: true,
      pathway: { select: { id: true, name: true } },
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          aliasName: true,
          role: true,
          institutionId: true,
          institution: { select: { name: true } },
        },
      },
      scaleVersion: {
        select: {
          id: true,
          originalScaleId: true,
          prompt: true,
          orderIndex: true,
          section: true,
        },
      },
      rubricVersion: {
        select: {
          id: true,
          versionNum: true,
          rubric: { select: { id: true, title: true } },
        },
      },
    },
    orderBy: { submittedAt: 'desc' },
  });

  return responses.map((response) => {
    const institutionId = response.user.institutionId ?? '';
    const section = response.scaleVersion.section ?? '';
    const pathwayId = resolvePathwayId(response.pathwayId);

    return {
      responseId: response.id,
      submittedAtIso: response.submittedAt.toISOString(),
      status: response.status,
      score: response.score,
      rubricId: response.rubricVersion.rubric.id,
      rubricTitle: response.rubricVersion.rubric.title,
      rubricVersionId: response.rubricVersion.id,
      rubricVersionNumber: response.rubricVersion.versionNum,
      scaleVersionId: response.scaleVersion.id,
      originalScaleId: response.scaleVersion.originalScaleId,
      scalePrompt: response.scaleVersion.prompt,
      scaleOrderIndex: response.scaleVersion.orderIndex,
      scaleSection: section,
      respondentUserId: response.user.id,
      respondentName: response.user.name,
      respondentEmail: response.user.email,
      respondentAliasName: response.user.aliasName ?? '',
      respondentRole: response.user.role,
      institutionId,
      institutionName: response.user.institution?.name ?? '',
      pathwayId,
      pathwayName: response.pathway?.name ?? 'General',
    };
  });
}
