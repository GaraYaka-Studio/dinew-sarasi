import { defineConfig } from 'drizzle-kit';

import './envConfig.ts'

if (!process.env.DATABASE_URL) throw new Error("Main Database URL is not set! (DATABASE_URL)");

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
