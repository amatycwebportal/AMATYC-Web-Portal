import express from "express";
import cors from "cors";
import session from "express-session";
import passport from "./passport";
import authRouter from "./routes/auth";
import { env } from "./config/env";

const app = express();

app.use(cors({ origin: env.FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(session({ secret: env.SESSION_SECRET, resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

app.get("/health", (_, res) => res.json({ status: "ok" }));
app.use("/auth", authRouter);

export default app;