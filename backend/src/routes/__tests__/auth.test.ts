import { randomUUID } from 'crypto';
import passport from 'passport';
import request from 'supertest';
import { afterAll, beforeAll, beforeEach, describe, expect, test } from 'vitest';

import { prisma } from '@lib/prisma';
import type { GoogleSignInIdentity } from '@lib/resolveUnrecognizedSignIn';
import { CURRENT_PRIVACY_POLICY_VERSION } from '@shared/privacyPolicy';
import { env } from '@config/env';
import app from '../../app';

type PassportWithStrategies = typeof passport & {
  _strategies: Record<string, passport.Strategy>;
};

let nextGoogleIdentity: GoogleSignInIdentity;

class ImmediateGoogleStrategy extends passport.Strategy {
  authenticate(): void {
    this.success?.(nextGoogleIdentity);
  }
}

const getRegisteredStrategies = (): Record<string, passport.Strategy> =>
  (passport as PassportWithStrategies)._strategies;

function buildIdentity(): GoogleSignInIdentity {
  const suffix = randomUUID();
  return {
    googleId: `auth-test-google-${suffix}`,
    email: `auth-test-${suffix}@example.com`,
    name: 'Auth Test',
    avatarUrl: '',
  };
}

describe('google sign-in waits for privacy consent', () => {
  const originalGoogleStrategy = getRegisteredStrategies().google;
  const createdEmails: string[] = [];

  beforeAll(() => {
    passport.use('google', new ImmediateGoogleStrategy());
  });

  beforeEach(() => {
    nextGoogleIdentity = buildIdentity();
    createdEmails.push(nextGoogleIdentity.email);
  });

  afterAll(async () => {
    if (originalGoogleStrategy) {
      passport.use('google', originalGoogleStrategy);
    }
    await prisma.user.deleteMany({ where: { email: { in: createdEmails } } });
  });

  test('new people are sent to the notice and get an account only after accepting', async () => {
    const agent = request.agent(app);

    const callbackResponse = await agent.get('/api/auth/google/callback');
    expect(callbackResponse.status).toBe(302);
    expect(callbackResponse.headers.location).toBe(`${env.FRONTEND_URL}/privacy-consent`);
    await expect(
      prisma.user.findFirst({ where: { email: nextGoogleIdentity.email } })
    ).resolves.toBeNull();

    const pendingResponse = await agent.get('/api/auth/privacy-consent/pending');
    expect(pendingResponse.body).toMatchObject({
      hasPendingSignIn: true,
      email: nextGoogleIdentity.email,
    });

    const acceptResponse = await agent.post('/api/auth/privacy-consent/pending');
    expect(acceptResponse.status).toBe(200);
    expect(acceptResponse.body.redirectPath).toBe('/rubrics/assigned');

    const storedUser = await prisma.user.findFirstOrThrow({
      where: { email: nextGoogleIdentity.email },
    });
    expect(storedUser.privacyPolicyVersion).toBe(CURRENT_PRIVACY_POLICY_VERSION);

    const sessionResponse = await agent.get('/api/auth/user');
    expect(sessionResponse.body.authenticated).toBe(true);
  });

  test('declining leaves no account and no session', async () => {
    const agent = request.agent(app);
    await agent.get('/api/auth/google/callback');

    const declineResponse = await agent.post('/api/auth/privacy-consent/decline');
    expect(declineResponse.status).toBe(204);

    const pendingResponse = await agent.get('/api/auth/privacy-consent/pending');
    expect(pendingResponse.body.hasPendingSignIn).toBe(false);
    await expect(
      prisma.user.findFirst({ where: { email: nextGoogleIdentity.email } })
    ).resolves.toBeNull();
    const sessionResponse = await agent.get('/api/auth/user');
    expect(sessionResponse.status).toBe(401);
  });

  test('returning people with current consent go straight to the site', async () => {
    await prisma.user.create({
      data: {
        ...nextGoogleIdentity,
        role: 'USER',
        privacyConsentAcceptedAt: new Date(),
        privacyPolicyVersion: CURRENT_PRIVACY_POLICY_VERSION,
      },
    });
    const agent = request.agent(app);

    const callbackResponse = await agent.get('/api/auth/google/callback');
    expect(callbackResponse.headers.location).toBe(`${env.FRONTEND_URL}/rubrics/assigned`);

    const sessionResponse = await agent.get('/api/auth/user');
    expect(sessionResponse.body.authenticated).toBe(true);
  });

  test('returning people without current consent are not signed in until they accept', async () => {
    await prisma.user.create({
      data: { ...nextGoogleIdentity, role: 'USER', privacyPolicyVersion: 'outdated' },
    });
    const agent = request.agent(app);

    const callbackResponse = await agent.get('/api/auth/google/callback');
    expect(callbackResponse.headers.location).toBe(`${env.FRONTEND_URL}/privacy-consent`);

    const sessionResponse = await agent.get('/api/auth/user');
    expect(sessionResponse.status).toBe(401);
  });
});
