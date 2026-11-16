import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import type { Profile, VerifyCallback } from 'passport-google-oauth20';
import { prisma } from '@lib/prisma';
import { buildGoogleSignInIdentity } from '@lib/resolveUnrecognizedSignIn';
import { env } from './config/env';

// Only resolves the Google identity; the auth callback decides whether to sign in or ask for consent.
passport.use(
  new GoogleStrategy(
    {
      clientID: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      callbackURL: env.GOOGLE_CALLBACK_URL,
    },
    (_accessToken: string, _refreshToken: string, profile: Profile, done: VerifyCallback) =>
      done(null, buildGoogleSignInIdentity(profile))
  )
);

passport.serializeUser((user: Express.User & { id?: string }, done) => done(null, user.id));

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user);
  } catch (err) {
    done(err, undefined);
  }
});

export default passport;
