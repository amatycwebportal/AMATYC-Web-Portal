import express from 'express';
import cors from 'cors';
import session from 'express-session';
import passport from './passport';
import { env } from './config/env';
import authRouter from './routes/auth';
import healthRouter from './routes/health';
import rubricsRouter from './routes/rubrics';
const app = express();

app.use(cors({ origin: env.FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(session({ secret: env.SESSION_SECRET, resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

app.use('/health', healthRouter);
app.use('/auth', authRouter);
app.use('/rubrics', rubricsRouter);
export default app;
