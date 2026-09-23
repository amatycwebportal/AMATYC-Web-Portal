import type { Request, Response } from 'express';
import { isTpseAdminEmail } from '@shared/tpseAdmin';

export type TpseAdminSession = {
  id: string;
  email: string;
};

export function parseTpseAdminSession(req: Request): TpseAdminSession | null {
  if (!req.user) return null;
  const user = req.user as { id?: string; email?: string };
  if (!user.id || !user.email) return null;
  if (!isTpseAdminEmail(user.email)) return null;
  return { id: user.id, email: user.email };
}

export function requireTpseAdmin(req: Request, res: Response): TpseAdminSession | null {
  if (!req.user) {
    res.status(401).json({ error: 'Not authenticated' });
    return null;
  }
  const session = parseTpseAdminSession(req);
  if (!session) {
    res.status(403).json({ error: 'Forbidden' });
    return null;
  }
  return session;
}
