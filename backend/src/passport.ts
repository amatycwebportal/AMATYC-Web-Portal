import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import type { Profile, VerifyCallback } from 'passport-google-oauth20';
import { prisma } from '@lib/prisma';
import {
  buildGoogleSignInIdentity,
  resolveUnrecognizedSignIn,
} from '@lib/resolveUnrecognizedSignIn';
import { env } from './config/env';

passport.use(
  new GoogleStrategy(
    {
      clientID: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      callbackURL: env.GOOGLE_CALLBACK_URL,
    },
    async (_accessToken: string, _refreshToken: string, profile: Profile, done: VerifyCallback) => {
      try {
        const user = await resolveUnrecognizedSignIn(buildGoogleSignInIdentity(profile));
        return done(null, user);
      } catch (err) {
        return done(err, undefined);
      }
    }
  )
);
// Test
passport.serializeUser((user: Express.User & { id?: string }, done) => done(null, user.id));

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id }, include: { userCourseBins: true } });
    done(null, user);
  } catch (err) {
    done(err, undefined);
  }
});

export default passport;
