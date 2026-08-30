import type { NextFunction, Request, Response } from 'express';
import { hasAcceptedPrivacyConsent } from '@shared/privacyPolicy';

function isConsentExempt(req: Request): boolean {
  const path = req.originalUrl.split('?')[0] ?? '';
  if (path.startsWith('/api/auth')) {
    return true;
  }
  if (path.startsWith('/api/health')) {
    return true;
  }
  return false;
}

export function requirePrivacyConsent(req: Request, res: Response, next: NextFunction): void {
  if (!req.user || isConsentExempt(req)) {
    next();
    return;
  }

  const user = req.user as {
    privacyConsentAcceptedAt?: Date | null;
    privacyPolicyVersion?: string | null;
  };

  if (!hasAcceptedPrivacyConsent(user)) {
    res.status(403).json({
      error: 'Privacy consent required',
      code: 'PRIVACY_CONSENT_REQUIRED',
    });
    return;
  }

  next();
}
