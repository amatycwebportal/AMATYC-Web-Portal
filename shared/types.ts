export type UserRole = "PROJECT_LEAD" | "LOCAL_LEADER" | "FACULTY" | "USER"
export interface User {
      id: string
      email?: string | null
      name?: string | null
      avatarUrl?: string | null
      role?: UserRole
    }
 


