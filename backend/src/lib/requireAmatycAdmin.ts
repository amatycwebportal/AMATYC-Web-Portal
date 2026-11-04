import type { Request, Response } from 'express';
import { isAmatycAdminEmail } from '@shared/amatycAdmin';

export type AmatycAdminSession = {
  id: string;
  email: string;
};

export function parseAmatycAdminSession(req: Request): AmatycAdminSession | null {
  if (!req.user) return null;
  const user = req.user as { id?: string; email?: string };
  if (!user.id || !user.email) return null;
  if (!isAmatycAdminEmail(user.email)) return null;
  return { id: user.id, email: user.email };
}

export function requireAmatycAdmin(req: Request, res: Response): AmatycAdminSession | null {
  if (!req.user) {
    res.status(401).json({ error: 'Not authenticated' });
    return null;
  }
  const session = parseAmatycAdminSession(req);
  if (!session) {
    res.status(403).json({ error: 'Forbidden' });
    return null;
  }
  return session;
}
