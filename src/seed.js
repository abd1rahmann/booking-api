import 'dotenv/config';
import { resolve } from 'node:path';
import { readFileSync } from 'node:fs';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const dbFile = resolve(process.cwd(), 'data.sqlite');

const run = async () => {
  const db = await open({ filename: dbFile, driver: sqlite3.Database });
  const schema = readFileSync(resolve(process.cwd(), 'src', 'schema.sql'), 'utf8');
  await db.exec(schema);

  // Clear data
  await db.exec('DELETE FROM appointments; DELETE FROM users; DELETE FROM services;');

  // Seed services
  await db.run('INSERT INTO services (name, duration_min, price) VALUES (?,?,?);', ['Haircut', 30, 350]);
  await db.run('INSERT INTO services (name, duration_min, price) VALUES (?,?,?);', ['Massage', 60, 800]);
  await db.run('INSERT INTO services (name, duration_min, price) VALUES (?,?,?);', ['Consultation', 45, 500]);

  console.log('Database reset and seeded ✅');
  await db.close();
};

run().catch(err => {
  console.error(err);
  process.exit(1);
});
