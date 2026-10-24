import type { Request } from 'express';
import passport from 'passport';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, test, vi } from 'vitest';

import { prisma } from '@lib/prisma';
import { CURRENT_PRIVACY_POLICY_VERSION } from '@shared/privacyPolicy';
import { env } from '@config/env';
import app from '../../app';

const TEST_USER_ID = 'privacy-consent-callback-user';
const INVITE_TOKEN = 'invite-token';

type PassportWithStrategies = typeof passport & {
  _strategies: Record<string, passport.Strategy>;
};

class ImmediateGoogleStrategy extends passport.Strategy {
  authenticate(_req: Request): void {
    this.success?.({
      id: TEST_USER_ID,
      privacyConsentAcceptedAt: null,
      privacyPolicyVersion: null,
    });
  }
}

function getRegisteredStrategies(): Record<string, passport.Strategy> {
  return (passport as PassportWithStrategies)._strategies;
}

describe('google callback privacy consent', () => {
  const originalGoogleStrategy = getRegisteredStrategies().google;
  const updateUser = vi.spyOn(prisma.user, 'update');

  beforeAll(() => {
    passport.use('google', new ImmediateGoogleStrategy());
    updateUser.mockImplementation((async (args: { data: Record<string, unknown> }) => ({
      id: TEST_USER_ID,
      userCourseBins: [],
      privacyConsentAcceptedAt: null,
      privacyPolicyVersion: null,
      ...args.data,
    })) as typeof prisma.user.update);
  });

  afterAll(() => {
    passport.use('google', originalGoogleStrategy);
    updateUser.mockRestore();
  });

  test('copies pending consent onto the user instead of showing the notice again', async () => {
    const agent = request.agent(app);

    const pendingResponse = await agent.post('/api/auth/privacy-consent/pending');
    expect(pendingResponse.status).toBe(200);

    const callbackResponse = await agent.get('/api/auth/google/callback');

    expect(updateUser).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: TEST_USER_ID },
        data: expect.objectContaining({
          privacyPolicyVersion: CURRENT_PRIVACY_POLICY_VERSION,
        }),
      })
    );
    expect(callbackResponse.status).toBe(302);
    expect(callbackResponse.headers.location).toBe(`${env.FRONTEND_URL}/rubrics/assigned`);
  });

  test('sends an invited user to accept the invite after copying pending consent', async () => {
    updateUser.mockClear();
    const agent = request.agent(app);

    const pendingResponse = await agent.post('/api/auth/privacy-consent/pending');
    expect(pendingResponse.status).toBe(200);

    const callbackResponse = await agent.get(
      `/api/auth/google/callback?state=${encodeURIComponent(INVITE_TOKEN)}`
    );

    expect(updateUser).toHaveBeenCalled();
    expect(callbackResponse.status).toBe(302);
    expect(callbackResponse.headers.location).toBe(
      `${env.FRONTEND_URL}/accept-invite?token=${INVITE_TOKEN}`
    );
  });
});
