import type { User } from '@shared/types';

export type UserContextSelection = {
  includeGeneral: boolean;
  courseBinIds: string[];
};

export type UserFilterMode = 'all' | 'user' | 'coursebin';

export const DEFAULT_USER_CONTEXT_SELECTION: UserContextSelection = {
  includeGeneral: true,
  courseBinIds: [],
};

export function countUserContexts(selection: UserContextSelection): number {
  return (selection.includeGeneral ? 1 : 0) + selection.courseBinIds.length;
}

export function hasAtLeastOneContext(selection: UserContextSelection): boolean {
  return countUserContexts(selection) > 0;
}

export function isGeneralContextLocked(selection: UserContextSelection): boolean {
  return selection.includeGeneral && selection.courseBinIds.length === 0;
}

export function isCourseBinContextLocked(
  selection: UserContextSelection,
  courseBinId: string
): boolean {
  return (
    selection.courseBinIds.includes(courseBinId) &&
    !selection.includeGeneral &&
    selection.courseBinIds.length === 1
  );
}

export function resolveMatchingCourseBinIds(args: {
  user: User;
  selectedCourseBinIds: string[];
}): string[] {
  const userLinkedBinIds = new Set(args.user.userCourseBins.map((entry) => entry.courseBinId));
  return args.selectedCourseBinIds.filter((courseBinId) => userLinkedBinIds.has(courseBinId));
}

export function isUserMatchedByCourseBinFilter(args: {
  user: User;
  selectedCourseBinIds: string[];
}): boolean {
  return resolveMatchingCourseBinIds(args).length > 0;
}

export function buildDefaultUserContextSelection(args: {
  user: User;
  filterModes: Set<UserFilterMode>;
  selectedCourseBinIds: string[];
  selectedUserIds: string[];
}): UserContextSelection {
  if (args.filterModes.has('all')) {
    return { ...DEFAULT_USER_CONTEXT_SELECTION };
  }

  const isMatchedByCourseBin =
    args.filterModes.has('coursebin') &&
    args.selectedCourseBinIds.length > 0 &&
    isUserMatchedByCourseBinFilter({
      user: args.user,
      selectedCourseBinIds: args.selectedCourseBinIds,
    });

  const isMatchedByName =
    args.filterModes.has('user') && args.selectedUserIds.includes(args.user.id);

  if (isMatchedByCourseBin && !isMatchedByName) {
    return {
      includeGeneral: false,
      courseBinIds: resolveMatchingCourseBinIds({
        user: args.user,
        selectedCourseBinIds: args.selectedCourseBinIds,
      }),
    };
  }

  return { ...DEFAULT_USER_CONTEXT_SELECTION };
}

export function buildPerUserContextAssignments(args: {
  users: User[];
  rubricIds: string[];
  userContextByUserId: Record<string, UserContextSelection>;
}): Array<{
  userId: string;
  rubricId: string;
  includeGeneral: boolean;
  courseBinIds: string[];
}> {
  return args.users.flatMap((targetUser) => {
    const selection = args.userContextByUserId[targetUser.id] ?? DEFAULT_USER_CONTEXT_SELECTION;
    return args.rubricIds.map((rubricId) => ({
      userId: targetUser.id,
      rubricId,
      includeGeneral: selection.includeGeneral,
      courseBinIds: selection.courseBinIds,
    }));
  });
}

export function buildUserContextByUserId(args: {
  affectedUsers: User[];
  filterModes: Set<UserFilterMode>;
  selectedCourseBinIds: string[];
  selectedUserIds: string[];
  previousContexts: Record<string, UserContextSelection>;
  manuallyEditedUserIds: Set<string>;
}): Record<string, UserContextSelection> {
  const next: Record<string, UserContextSelection> = {};

  for (const affectedUser of args.affectedUsers) {
    if (args.manuallyEditedUserIds.has(affectedUser.id) && args.previousContexts[affectedUser.id]) {
      next[affectedUser.id] = args.previousContexts[affectedUser.id];
      continue;
    }

    next[affectedUser.id] = buildDefaultUserContextSelection({
      user: affectedUser,
      filterModes: args.filterModes,
      selectedCourseBinIds: args.selectedCourseBinIds,
      selectedUserIds: args.selectedUserIds,
    });
  }

  return next;
}
