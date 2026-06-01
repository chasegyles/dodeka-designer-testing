import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');

const DB_PATH = process.env.DATABASE_PATH || path.join(PROJECT_ROOT, 'data', 'quiz.db');
const DB_DIR = path.dirname(DB_PATH);

if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

export const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

export function init() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS variants (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      source_urls TEXT NOT NULL,
      question_count INTEGER NOT NULL,
      questions TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      generated_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS attempts (
      id TEXT PRIMARY KEY,
      variant_id TEXT NOT NULL,
      taker_name TEXT NOT NULL,
      answers TEXT NOT NULL,
      correct_count INTEGER NOT NULL,
      total_count INTEGER NOT NULL,
      score_pct INTEGER NOT NULL,
      completed_at INTEGER NOT NULL,
      FOREIGN KEY (variant_id) REFERENCES variants(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_attempts_variant ON attempts(variant_id);
    CREATE INDEX IF NOT EXISTS idx_attempts_completed ON attempts(completed_at DESC);
  `);
  console.log('[db] ready at', DB_PATH);
}
