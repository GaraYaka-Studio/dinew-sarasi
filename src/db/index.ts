import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';

import * as schema from './schema';

if (!process.env.DATABASE_URL) throw new Error("Database URL is not set! (DATABASE_URL)");

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

export const db = drizzle({
    client: pool,
    schema,
});
