export const USER_ROLES = ["PROJECT_LEAD", "LOCAL_LEADER", "USER"] as const;
export type UserRole = (typeof USER_ROLES)[number];

const USER_ROLE_LABELS: Record<UserRole, string> = {
  PROJECT_LEAD: "Administrator",
  LOCAL_LEADER: "College lead",
  USER: "User",
};

export function formatUserRole(role: string): string {
  if (role in USER_ROLE_LABELS) {
    return USER_ROLE_LABELS[role as UserRole];
  }
  return role;
}
export type AssignmentStatus = "ASSIGNED" | "IN_PROGRESS" | "COMPLETED";
export interface User {
  id: string;
  googleId: string;
  name: string;
  email: string;
  aliasName?: string | null;
  avatarUrl?: string;
  role: UserRole;
  institutionId?: string;
  privacyConsentAcceptedAt?: string | null;
  privacyPolicyVersion?: string | null;
  hasAcceptedPrivacyConsent?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Pathway {
  id: string;
  name: string;
  sortOrder: number;
}

export interface RubricLevelDescription {
      label: string
      description: string
    }
    
export interface RubricScale  {
      id: string
      originalScaleId?: string
      section?: string | null
      prompt: string
      orderIndex: number
      editable: boolean
      isGlobal: boolean
      levelDescriptions?: Record<number, RubricLevelDescription> | null
    }

export interface Rubric {
      id: string
      title: string
      description: string
      active: boolean
      scales: RubricScale[]
      graveyardScales?: RubricScale[]
      pathwayIds: string[]
      versions: { id: string; versionNum: number }[]
    }

export interface ScaleVersion {
  id: string;
  rubricVersionId: string;
  originalScaleId: string;
  prompt: string;
  orderIndex: number;
  editable: boolean;
  isGlobal: boolean;
  levelDescriptions: Record<number, RubricLevelDescription> | null;
  section: string | null;
}


export interface UserRubricAssignment {
  id: string;
  userId: string;
  rubricVersionId: string;
  status: AssignmentStatus;
}



export interface RubricVersion {
  id: string;
  versionNum: number;
  rubric: Rubric;
  scaleVersions: ScaleVersion[];
  assignments: UserRubricAssignment[];
  pathwayId?: string;
  pathwayName?: string | null;
  isGeneralPathway?: boolean;
}

export type ResponsePersistStatus = 'DRAFT' | 'SUBMITTED';

export interface Response {
  scaleVersionId: string;
  rubricVersionId: string;
  pathwayId?: string;
  userId: string;
  score: number;
  /** Note explaining the rating. Drafts may omit it; submission requires it. */
  justification?: string | null;
  /** Present when returned from the API. */
  status?: ResponsePersistStatus;
}

export type ConsensusResponseStatus = "DRAFT" | "SUBMITTED";

export interface ConsensusEntry {
  scaleVersionId: string;
  pathwayId?: string | null;
  score: number;
  justification: string;
}

export interface ConsensusAssignmentSummary {
  rubricVersionId: string;
  totalInstitutionUsers: number;
  assigned: number;
  inProgress: number;
  completed: number;
}

export interface ConsensusScaleInsight {
  scoreCounts: Record<number, number>;
  average: number | null;
}

/** Self-assessment justifications in histogram scope, keyed by scale version id (newest first per scale). */
export type ConsensusSubmissionNotesByScaleVersionId = Record<string, string[]>;

export interface ConsensusContextStatus {
  rubricVersionId: string;
  pathwayId: string;
  pathwayName: string;
  isGeneralPathway: boolean;
  consensusStatus: ConsensusResponseStatus | null;
  hasSubmittedConsensus: boolean;
}

export interface ConsensusContextGroup {
  pathwayId: string;
  pathwayName: string;
  isGeneralPathway?: boolean;
  contexts: ConsensusContextStatus[];
}

export interface AssignmentMatrixRubricColumn {
  id: string;
  title: string;
  rubricNumber: number | null;
}

export interface AssignmentMatrixUserRow {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface AssignmentMatrixEntry {
  userId: string;
  rubricId: string;
  pathwayId: string;
  pathwayName: string;
  isGeneralPathway: boolean;
  status: AssignmentStatus;
}

export interface AssignmentMatrixResponse {
  rubrics: AssignmentMatrixRubricColumn[];
  users: AssignmentMatrixUserRow[];
  assignments: AssignmentMatrixEntry[];
}
