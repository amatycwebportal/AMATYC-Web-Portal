export type UserRole = "PROJECT_LEAD" | "LOCAL_LEADER" | "FACULTY" | "USER"
export interface User {
      id: string
      email?: string | null
      name?: string | null
      avatarUrl?: string | null
      role?: UserRole
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