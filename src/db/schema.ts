import type { SQLiteDatabase } from 'expo-sqlite';

const DATABASE_VERSION = 1;

export async function migrateDbIfNeeded(db: SQLiteDatabase) {
  await db.execAsync('PRAGMA foreign_keys = ON');
  const row = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
  const current = row?.user_version ?? 0;
  if (current >= DATABASE_VERSION) return;

  if (current === 0) {
    await db.execAsync(`
      PRAGMA journal_mode = 'wal';
      PRAGMA foreign_keys = ON;

      CREATE TABLE settings (
        key TEXT PRIMARY KEY NOT NULL,
        value TEXT NOT NULL
      );

      CREATE TABLE custom_exercises (
        id INTEGER PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        muscle TEXT NOT NULL,
        equipment TEXT NOT NULL,
        howto TEXT NOT NULL DEFAULT ''
      );

      CREATE TABLE templates (
        id INTEGER PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        created_at INTEGER NOT NULL
      );

      CREATE TABLE template_exercises (
        id INTEGER PRIMARY KEY NOT NULL,
        template_id INTEGER NOT NULL REFERENCES templates(id) ON DELETE CASCADE,
        exercise_id TEXT NOT NULL,
        position INTEGER NOT NULL,
        sets INTEGER NOT NULL
      );

      CREATE TABLE workouts (
        id INTEGER PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        started_at INTEGER NOT NULL,
        finished_at INTEGER
      );

      CREATE TABLE workout_exercises (
        id INTEGER PRIMARY KEY NOT NULL,
        workout_id INTEGER NOT NULL REFERENCES workouts(id) ON DELETE CASCADE,
        exercise_id TEXT NOT NULL,
        position INTEGER NOT NULL
      );

      CREATE TABLE sets (
        id INTEGER PRIMARY KEY NOT NULL,
        workout_exercise_id INTEGER NOT NULL REFERENCES workout_exercises(id) ON DELETE CASCADE,
        position INTEGER NOT NULL,
        reps INTEGER,
        weight_kg REAL,
        done INTEGER NOT NULL DEFAULT 0
      );

      CREATE INDEX idx_we_workout ON workout_exercises(workout_id);
      CREATE INDEX idx_we_exercise ON workout_exercises(exercise_id);
      CREATE INDEX idx_sets_we ON sets(workout_exercise_id);
      CREATE INDEX idx_te_template ON template_exercises(template_id);
    `);
  }

  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}
