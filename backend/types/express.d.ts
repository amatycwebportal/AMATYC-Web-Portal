import { User } from '../generated/prisma/client'

declare global {
  namespace Express {
    interface User {
      id: string
      email?: string | null
      name?: string | null
      avatarUrl?: string | null
    }
  }
}