import { resolve } from 'node:path';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { readFile } from 'node:fs/promises';

const dbFile = resolve(process.cwd(), 'data.sqlite');

let instance;

export const getDb = async () => {
  if (instance) return instance;
  const db = await open({ filename: dbFile, driver: sqlite3.Database });
  // Ensure schema exists
  const schemaSql = await readFile(resolve(process.cwd(), 'src', 'schema.sql'), 'utf8');
  await db.exec(schemaSql);
  instance = db;
  return db;
};
