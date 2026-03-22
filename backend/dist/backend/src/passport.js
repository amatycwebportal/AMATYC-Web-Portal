import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { UserRole } from '@lib/prisma';
import { prisma } from "@lib/prisma";
import { env } from "./config/env";
passport.use(new GoogleStrategy({
    clientID: env.GOOGLE_CLIENT_ID,
    clientSecret: env.GOOGLE_CLIENT_SECRET,
    callbackURL: env.GOOGLE_CALLBACK_URL,
}, async (_accessToken, _refreshToken, profile, done) => {
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
    }
    catch (err) {
        return done(err, undefined);
    }
}));
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
    try {
        const user = await prisma.user.findUnique({ where: { id } });
        done(null, user);
    }
    catch (err) {
        done(err, undefined);
    }
});
export default passport;
//# sourceMappingURL=passport.js.map