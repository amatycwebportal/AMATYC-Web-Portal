export type UserRole = "PROJECT_LEAD" | "LOCAL_LEADER" | "FACULTY" | "USER"
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
      section: string
      prompt: string
      orderIndex: number
      editable: boolean
      isGlobal: boolean
      levelDescriptions: Record<number, RubricLevelDescription>
    }

export interface Rubric {
      id: string
      title: string
      description: string
      active: boolean
      scales: RubricScale[]
    }

export interface CourseBin {
      id: string
      displayName: string
      predefinedBinId: string
      institutionId: string
    }
