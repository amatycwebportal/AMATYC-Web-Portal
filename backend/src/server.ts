import express from "express";
import type { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";
import passport from "passport";
import type { Profile } from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import type { VerifyCallback } from "passport-google-oauth20";
import { PrismaClient, UserRole } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg'
import type { User } from '../../shared/types';

dotenv.config();

const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_CALLBACK_URL,
  SESSION_SECRET,
  FRONTEND_URL,
  PORT,
} = process.env;
const missingEnvVars = [
  { key: "GOOGLE_CLIENT_ID", value: GOOGLE_CLIENT_ID },
  { key: "GOOGLE_CLIENT_SECRET", value: GOOGLE_CLIENT_SECRET },
  { key: "GOOGLE_CALLBACK_URL", value: GOOGLE_CALLBACK_URL },
  { key: "SESSION_SECRET", value: SESSION_SECRET },
  { key: "FRONTEND_URL", value: FRONTEND_URL },
  { key: "PORT", value: PORT },
].filter(item => !item.value)
 .map(item => item.key);

if (missingEnvVars.length > 0) {
  console.error(`Missing environment variables: ${missingEnvVars.join(", ")}`);
} else {
  console.log("All required environment variables are set.");
}
if (
  !GOOGLE_CLIENT_ID ||
  !GOOGLE_CLIENT_SECRET ||
  !GOOGLE_CALLBACK_URL ||
  !SESSION_SECRET ||
  !FRONTEND_URL
) {
  throw new Error("Missing required Google OAuth environment variables.");
}

const app = express();
const pool = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter: pool })

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.json());

app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: GOOGLE_CALLBACK_URL,
    },
    async(
      _accessToken: string,
      _refreshToken: string,
      profile: Profile,
      done: VerifyCallback
    ) => {
      try {
        // Find existing user by Google ID
        let user = await prisma.user.findUnique({
          where: { googleId: profile.id },
        });

        if (!user) {
          // Create new user if not exists
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

        return done(null, user); // Passport attaches user to req.user
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.serializeUser(
  (user: Express.User & { id?: string }, done: (err: unknown, id?: unknown) => void) => {
    done(null, user.id);
  }
);

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

app.get("/health", (_, res) => {
  res.json({ status: "ok" });
});

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/auth/google/failure",
    session: true,
  }),
  
  (_req, res) => {
    res.redirect(`${FRONTEND_URL}/profile`);
  }
);

app.get("/auth/google/failure", (_req, res) => {
  res.redirect(`${FRONTEND_URL}/sign-in?auth=error`);
});

app.get("/auth/user", (req: Request, res: Response) => {
  const request = req as Request & { user?: User };

  if (!request.user) {
    res.status(401).json({ authenticated: false });
    return;
  }

  res.json({
    authenticated: true,
    user: {
      id: request.user.id,
      email: request.user.email,
      name: request.user.name,
      avatarUrl: request.user.avatarUrl,
    }
  });
});

app.post("/auth/logout", (req: Request, res: Response) => {
  const request = req as Request & {
    logout: (done: (err: unknown) => void) => void;
    user?: Profile;
  };

  if (!request.user) {
    res.status(204).end();
    return;
  }

  request.logout((err) => {
    if (err) {
      res.status(500).json({ message: "Failed to log out." });
      return;
    }
    res.status(204).end();
  });
});

const port = PORT || "4000";
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
