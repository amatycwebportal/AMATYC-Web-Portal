import dotenv from 'dotenv';
dotenv.config();
const required = [
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
    'GOOGLE_CALLBACK_URL',
    'SESSION_SECRET',
    'FRONTEND_URL',
    'PORT',
];
const missing = required.filter((k) => !process.env[k]);
if (missing.length > 0)
    throw new Error(`Missing env vars: ${missing.join(', ')}`);
export const env = {
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL,
    SESSION_SECRET: process.env.SESSION_SECRET,
    FRONTEND_URL: process.env.FRONTEND_URL,
    PORT: process.env.PORT || '4000',
    GMAIL_USER: process.env.GMAIL_USER,
    GMAIL_APP_PASSWORD: process.env.GMAIL_APP_PASSWORD,
};
//# sourceMappingURL=env.js.map