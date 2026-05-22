import { type Prisma, prisma } from '@lib/prisma';

export const RESPONSE_EXPORT_ALL_SECTIONS = '__all_sections__';
export const RESPONSE_EXPORT_ALL_SCALES = '__all_scales__';
export const RESPONSE_EXPORT_UNCATEGORIZED = '__uncategorized__';

/** Query token for responses with no course bin (general / institution-wide assignment context). */
export const RESPONSE_EXPORT_GENERAL_CONTEXT_KEY = '__general__';

const LEGACY_RESPONSE_EXPORT_GLOBAL_CONTEXT_KEY = '__global__';

/** Course-bin UUIDs only; excludes general-context tokens (including legacy `__global__`). */
export function filterResponseContextKeysToCourseBinIds(keys: string[]): string[] {
  return keys.filter(
    (key) =>
      key !== RESPONSE_EXPORT_GENERAL_CONTEXT_KEY &&
      key !== LEGACY_RESPONSE_EXPORT_GLOBAL_CONTEXT_KEY
  );
}

type BuildExportWhereArgs = {
  rubricId: string;
  sectionKey: string;
  scaleVersionId: string;
  institutionIdScope: string | null;
  /** Subset of rubric version row IDs to include. Empty/omitted = all versions of the rubric. */
  rubricVersionIds?: string[];
  /**
   * When set, restrict to these institution contexts: `RESPONSE_EXPORT_GENERAL_CONTEXT_KEY` and/or
   * course bin row UUIDs. Empty array = no matching rows (caller may short-circuit).
   * When omitted, no course-bin scope filter (all contexts).
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

  let courseBinScopeFilter: Prisma.ResponseWhereInput | undefined;
  if (args.responseContextKeys !== undefined) {
    const uniqueKeys = [...new Set(args.responseContextKeys)];
    if (uniqueKeys.length === 0) {
      return { error: 'No response contexts selected' };
    }
    const includeGeneral =
      uniqueKeys.includes(RESPONSE_EXPORT_GENERAL_CONTEXT_KEY) ||
      uniqueKeys.includes(LEGACY_RESPONSE_EXPORT_GLOBAL_CONTEXT_KEY);
    const courseBinIds = filterResponseContextKeysToCourseBinIds(uniqueKeys);
    const orBranches: Prisma.ResponseWhereInput[] = [];
    if (includeGeneral) {
      orBranches.push({ courseBinId: null });
    }
    if (courseBinIds.length > 0) {
      orBranches.push({ courseBinId: { in: courseBinIds } });
    }
    if (orBranches.length === 1) {
      courseBinScopeFilter = orBranches[0];
    } else {
      courseBinScopeFilter = { OR: orBranches };
    }
  }

  const where: Prisma.ResponseWhereInput = {
    rubricVersionId: { in: effectiveRubricVersionIds },
    status: 'SUBMITTED',
    ...(args.institutionIdScope !== null
      ? { user: { is: { institutionId: args.institutionIdScope } } }
      : {}),
    ...(hasScaleVersionPredicate ? { scaleVersion: scaleVersionFilter } : {}),
    ...(courseBinScopeFilter !== undefined ? courseBinScopeFilter : {}),
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
  respondentRole: string;
  institutionId: string;
  institutionName: string;
  predefinedCourseBinId: string;
  predefinedCourseBinName: string;
  institutionCourseBinDisplayName: string;
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
  'respondent_role',
  'institution_id',
  'institution_name',
  'predefined_course_bin_id',
  'predefined_course_bin_name',
  'institution_course_bin_display_name',
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
    row.respondentRole,
    row.institutionId,
    row.institutionName,
    row.predefinedCourseBinId,
    row.predefinedCourseBinName,
    row.institutionCourseBinDisplayName,
  ]);
}

export function getResponseExportCsvHeader(): string[] {
  return [...CSV_HEADER];
}

function resolveEffectivePredefinedBinId(response: {
  predefinedBinId: string | null;
  courseBin: { predefinedBinId: string } | null;
}): string | null {
  return response.predefinedBinId ?? response.courseBin?.predefinedBinId ?? null;
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
      predefinedBinId: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
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
      predefinedCourseBin: { select: { binName: true } },
      courseBinId: true,
      courseBin: {
        select: {
          id: true,
          displayName: true,
          predefinedBinId: true,
          predefinedCourseBin: { select: { binName: true } },
        },
      },
    },
    orderBy: { submittedAt: 'desc' },
  });

  const pairKeys = new Set<string>();
  for (const response of responses) {
    const institutionId = response.user.institutionId;
    const binId = resolveEffectivePredefinedBinId(response);
    if (institutionId && binId && !response.courseBin?.displayName) {
      pairKeys.add(`${institutionId}|${binId}`);
    }
  }

  const institutionBinDisplayByPair = new Map<string, string>();
  if (pairKeys.size > 0) {
    const institutionIds = [...new Set([...pairKeys].map((key) => key.split('|')[0]!))];
    const predefinedBinIds = [...new Set([...pairKeys].map((key) => key.split('|')[1]!))];
    const courseBins = await prisma.courseBin.findMany({
      where: {
        institutionId: { in: institutionIds },
        predefinedBinId: { in: predefinedBinIds },
      },
      select: {
        institutionId: true,
        predefinedBinId: true,
        displayName: true,
      },
    });
    for (const bin of courseBins) {
      institutionBinDisplayByPair.set(
        `${bin.institutionId}|${bin.predefinedBinId}`,
        bin.displayName
      );
    }
  }

  return responses.map((response) => {
    const institutionId = response.user.institutionId ?? '';
    const effectivePredefinedBinId = resolveEffectivePredefinedBinId(response);
    const pair =
      institutionId && effectivePredefinedBinId
        ? `${institutionId}|${effectivePredefinedBinId}`
        : '';
    const institutionCourseBinDisplayName =
      response.courseBin?.displayName ??
      (pair ? (institutionBinDisplayByPair.get(pair) ?? '') : '');

    const section = response.scaleVersion.section ?? '';

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
      respondentRole: response.user.role,
      institutionId,
      institutionName: response.user.institution?.name ?? '',
      predefinedCourseBinId: effectivePredefinedBinId ?? '',
      predefinedCourseBinName:
        response.predefinedCourseBin?.binName ??
        response.courseBin?.predefinedCourseBin?.binName ??
        '',
      institutionCourseBinDisplayName,
    };
  });
}
