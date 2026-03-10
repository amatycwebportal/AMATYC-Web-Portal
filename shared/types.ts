import { User } from '../generated/prisma/client'


export interface User {
      id: string
      email?: string | null
      name?: string | null
      avatarUrl?: string | null
    }
 