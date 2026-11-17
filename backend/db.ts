import { DatabaseSync } from 'node:sqlite';
import { mkdirSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
export function openDatabase() {
 const filename = resolve(process.env.DB_PATH || 'storage/detka.sqlite');
 mkdirSync(dirname(filename), { recursive: true });
 const database = new DatabaseSync(filename);
 database.exec('PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON; PRAGMA busy_timeout=5000;');
 database.exec('CREATE TABLE IF NOT EXISTS schema_migrations (version INTEGER PRIMARY KEY)');
 const current = database.prepare('SELECT version FROM schema_migrations WHERE version=1').get();
 if (!current) {
  database.exec('BEGIN');
  try { database.exec(readFileSync(resolve('backend/migrations/001.sql'),'utf8')); database.exec('COMMIT'); }
  catch(error) { database.exec('ROLLBACK'); throw error; }
 }
 return database;
}
