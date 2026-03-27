import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import type { Profile, VerifyCallback } from 'passport-google-oauth20';
import { UserRole } from '@lib/prisma';
import { prisma } from '@lib/prisma';
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
        let user = await prisma.user.findUnique({ where: { googleId: profile.id } });
        if (!user) {
          user = await prisma.user.create({
            data: {
              googleId: profile.id,
              email: profile.emails?.[0]?.value ?? '',
              name: profile.displayName,
              avatarUrl: profile.photos?.[0]?.value ?? '',
              role: UserRole.USER,
            },
          });
        }
        return done(null, user);
      } catch (err) {
        return done(err, undefined);
      }
    }
  )
);

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
