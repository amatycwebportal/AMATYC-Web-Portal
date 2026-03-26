export type UserRole = "PROJECT_LEAD" | "LOCAL_LEADER" | "FACULTY" | "USER";
export type AssignmentStatus = "ASSIGNED" | "IN_PROGRESS" | "COMPLETED";
export interface User {
  id: string;
  googleId: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: UserRole;
  institutionId?: string;
  userCourseBins: { userId: string; courseBinId: string }[];
  createdAt: string;
  updatedAt: string;
}

export interface PredefinedCourseBin {
  id: string;
  binName: string;
}

export interface CourseBin {
      id: string
      displayName: string
      predefinedBinId: string
      institutionId: string
    }
 
export interface RubricLevelDescription {
      label: string
      description: string
    }
    
export interface RubricScale  {
      id: string
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
      versions: { id: string; versionNum: number }[]
    }

export interface ScaleVersionBin {
  scaleVersionId: string;
  predefinedBinId: string;
}

export interface PredefinedCourseBin {
  id: string;
  binName: string;
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
  scaleVersionBins: ScaleVersionBin[];
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
}

export interface CourseBin {
      id: string
      displayName: string
      predefinedBinId: string
      institutionId: string
    }
