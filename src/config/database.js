import 'dotenv/config';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

console.log('DB_URL:', process.env.DB_URL ? 'Set' : 'NOT SET'); // ← Debug log

const sql = neon(process.env.DB_URL);

const db = drizzle(sql);

export { db, sql };
