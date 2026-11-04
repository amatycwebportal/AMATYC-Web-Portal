import { GENERAL_PATHWAY_ID } from '@shared/pathways';
import type { User } from '@shared/types';

export type UserContextSelection = {
  pathwayIds: string[];
};

export type UserFilterMode = 'all' | 'user';

export const DEFAULT_USER_CONTEXT_SELECTION: UserContextSelection = {
  pathwayIds: [GENERAL_PATHWAY_ID],
};

export function countUserContexts(selection: UserContextSelection): number {
  return selection.pathwayIds.length;
}

export function hasAtLeastOneContext(selection: UserContextSelection): boolean {
  return selection.pathwayIds.length > 0;
}

export function isPathwayLocked(selection: UserContextSelection, pathwayId: string): boolean {
  return selection.pathwayIds.length === 1 && selection.pathwayIds.includes(pathwayId);
}

export function buildDefaultUserContextSelection(): UserContextSelection {
  return { pathwayIds: [...DEFAULT_USER_CONTEXT_SELECTION.pathwayIds] };
}

export function buildPerUserContextAssignments(args: {
  users: User[];
  rubricIds: string[];
  userContextByUserId: Record<string, UserContextSelection>;
}): Array<{
  userId: string;
  rubricId: string;
  includeGeneral: boolean;
  pathwayIds: string[];
}> {
  return args.users.flatMap((targetUser) => {
    const selection = args.userContextByUserId[targetUser.id] ?? DEFAULT_USER_CONTEXT_SELECTION;
    return args.rubricIds.map((rubricId) => ({
      userId: targetUser.id,
      rubricId,
      includeGeneral: selection.pathwayIds.includes(GENERAL_PATHWAY_ID),
      pathwayIds: selection.pathwayIds,
    }));
  });
}

export function buildUserContextByUserId(args: {
  affectedUsers: User[];
  previousContexts: Record<string, UserContextSelection>;
  manuallyEditedUserIds: Set<string>;
}): Record<string, UserContextSelection> {
  const next: Record<string, UserContextSelection> = {};

  for (const affectedUser of args.affectedUsers) {
    if (args.manuallyEditedUserIds.has(affectedUser.id) && args.previousContexts[affectedUser.id]) {
      next[affectedUser.id] = args.previousContexts[affectedUser.id];
      continue;
    }

    next[affectedUser.id] = buildDefaultUserContextSelection();
  }

  return next;
}
