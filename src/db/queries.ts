import type { SQLiteDatabase } from 'expo-sqlite';
import type { Equipment, Muscle } from '@/data/types';

// ---------- custom exercises ----------

export interface CustomExerciseRow {
  id: number;
  name: string;
  muscle: Muscle;
  equipment: Equipment;
  howto: string;
}

export const customId = (n: number) => `c_${n}`;

export function getCustomExercises(db: SQLiteDatabase) {
  return db.getAllAsync<CustomExerciseRow>('SELECT * FROM custom_exercises ORDER BY name COLLATE NOCASE');
}

export async function createCustomExercise(
  db: SQLiteDatabase,
  e: { name: string; muscle: Muscle; equipment: Equipment; howto: string },
) {
  const r = await db.runAsync(
    'INSERT INTO custom_exercises (name, muscle, equipment, howto) VALUES (?, ?, ?, ?)',
    e.name,
    e.muscle,
    e.equipment,
    e.howto,
  );
  return customId(r.lastInsertRowId);
}

export async function deleteCustomExercise(db: SQLiteDatabase, id: string) {
  await db.runAsync('DELETE FROM custom_exercises WHERE id = ?', Number(id.slice(2)));
}

export async function countCustomExercises(db: SQLiteDatabase) {
  const r = await db.getFirstAsync<{ n: number }>('SELECT COUNT(*) AS n FROM custom_exercises');
  return r?.n ?? 0;
}

// ---------- active workout ----------

export interface SetRow {
  id: number;
  position: number;
  reps: number | null;
  weightKg: number | null;
  done: boolean;
}

export interface PrevSet {
  reps: number | null;
  weightKg: number | null;
}

export interface ActiveExercise {
  id: number; // workout_exercises.id
  exerciseId: string;
  position: number;
  sets: SetRow[];
  prev: PrevSet[];
}

export interface ActiveWorkout {
  id: number;
  name: string;
  startedAt: number;
  exercises: ActiveExercise[];
}

/** Done sets from the most recent finished workout that contained this exercise. */
export async function getPreviousSets(db: SQLiteDatabase, exerciseId: string): Promise<PrevSet[]> {
  const last = await db.getFirstAsync<{ id: number }>(
    `SELECT we.id FROM workout_exercises we
       JOIN workouts w ON w.id = we.workout_id
      WHERE we.exercise_id = ? AND w.finished_at IS NOT NULL
        AND EXISTS (SELECT 1 FROM sets s WHERE s.workout_exercise_id = we.id AND s.done = 1)
      ORDER BY w.finished_at DESC, we.id DESC LIMIT 1`,
    exerciseId,
  );
  if (!last) return [];
  const rows = await db.getAllAsync<{ reps: number | null; weight_kg: number | null }>(
    'SELECT reps, weight_kg FROM sets WHERE workout_exercise_id = ? AND done = 1 ORDER BY position',
    last.id,
  );
  return rows.map((r) => ({ reps: r.reps, weightKg: r.weight_kg }));
}

export async function getActiveWorkout(db: SQLiteDatabase): Promise<ActiveWorkout | null> {
  const w = await db.getFirstAsync<{ id: number; name: string; started_at: number }>(
    'SELECT id, name, started_at FROM workouts WHERE finished_at IS NULL ORDER BY id DESC LIMIT 1',
  );
  if (!w) return null;
  const wes = await db.getAllAsync<{ id: number; exercise_id: string; position: number }>(
    'SELECT id, exercise_id, position FROM workout_exercises WHERE workout_id = ? ORDER BY position',
    w.id,
  );
  const exercises: ActiveExercise[] = [];
  for (const we of wes) {
    const sets = await db.getAllAsync<{
      id: number;
      position: number;
      reps: number | null;
      weight_kg: number | null;
      done: number;
    }>('SELECT id, position, reps, weight_kg, done FROM sets WHERE workout_exercise_id = ? ORDER BY position', we.id);
    exercises.push({
      id: we.id,
      exerciseId: we.exercise_id,
      position: we.position,
      sets: sets.map((s) => ({
        id: s.id,
        position: s.position,
        reps: s.reps,
        weightKg: s.weight_kg,
        done: s.done === 1,
      })),
      prev: await getPreviousSets(db, we.exercise_id),
    });
  }
  return { id: w.id, name: w.name, startedAt: w.started_at, exercises };
}

export async function hasActiveWorkout(db: SQLiteDatabase) {
  const r = await db.getFirstAsync<{ n: number }>('SELECT COUNT(*) AS n FROM workouts WHERE finished_at IS NULL');
  return (r?.n ?? 0) > 0;
}

async function insertExerciseWithSets(
  db: SQLiteDatabase,
  workoutId: number,
  exerciseId: string,
  position: number,
  setCount: number,
) {
  const prev = await getPreviousSets(db, exerciseId);
  const r = await db.runAsync(
    'INSERT INTO workout_exercises (workout_id, exercise_id, position) VALUES (?, ?, ?)',
    workoutId,
    exerciseId,
    position,
  );
  for (let i = 0; i < setCount; i++) {
    const p = prev[i] ?? prev[prev.length - 1];
    await db.runAsync(
      'INSERT INTO sets (workout_exercise_id, position, reps, weight_kg, done) VALUES (?, ?, ?, ?, 0)',
      r.lastInsertRowId,
      i,
      p?.reps ?? null,
      p?.weightKg ?? null,
    );
  }
}

export async function startWorkout(
  db: SQLiteDatabase,
  name: string,
  items: { exerciseId: string; sets: number }[],
) {
  let workoutId = 0;
  await db.withTransactionAsync(async () => {
    const r = await db.runAsync('INSERT INTO workouts (name, started_at) VALUES (?, ?)', name, Date.now());
    workoutId = r.lastInsertRowId;
    for (let i = 0; i < items.length; i++) {
      await insertExerciseWithSets(db, workoutId, items[i].exerciseId, i, items[i].sets);
    }
  });
  return workoutId;
}

export async function addExercisesToWorkout(db: SQLiteDatabase, workoutId: number, exerciseIds: string[]) {
  const r = await db.getFirstAsync<{ m: number | null }>(
    'SELECT MAX(position) AS m FROM workout_exercises WHERE workout_id = ?',
    workoutId,
  );
  let pos = (r?.m ?? -1) + 1;
  for (const id of exerciseIds) {
    await insertExerciseWithSets(db, workoutId, id, pos++, 3);
  }
}

export function updateSet(
  db: SQLiteDatabase,
  setId: number,
  patch: { reps?: number | null; weightKg?: number | null; done?: boolean },
) {
  const fields: string[] = [];
  const values: (number | null)[] = [];
  if (patch.reps !== undefined) {
    fields.push('reps = ?');
    values.push(patch.reps);
  }
  if (patch.weightKg !== undefined) {
    fields.push('weight_kg = ?');
    values.push(patch.weightKg);
  }
  if (patch.done !== undefined) {
    fields.push('done = ?');
    values.push(patch.done ? 1 : 0);
  }
  if (!fields.length) return Promise.resolve();
  return db.runAsync(`UPDATE sets SET ${fields.join(', ')} WHERE id = ?`, ...values, setId);
}

export async function addSet(db: SQLiteDatabase, workoutExerciseId: number) {
  const last = await db.getFirstAsync<{ position: number; reps: number | null; weight_kg: number | null }>(
    'SELECT position, reps, weight_kg FROM sets WHERE workout_exercise_id = ? ORDER BY position DESC LIMIT 1',
    workoutExerciseId,
  );
  await db.runAsync(
    'INSERT INTO sets (workout_exercise_id, position, reps, weight_kg, done) VALUES (?, ?, ?, ?, 0)',
    workoutExerciseId,
    (last?.position ?? -1) + 1,
    last?.reps ?? null,
    last?.weight_kg ?? null,
  );
}

export async function removeSet(db: SQLiteDatabase, setId: number) {
  await db.runAsync('DELETE FROM sets WHERE id = ?', setId);
}

export async function removeWorkoutExercise(db: SQLiteDatabase, workoutExerciseId: number) {
  await db.runAsync('DELETE FROM workout_exercises WHERE id = ?', workoutExerciseId);
}

/** Swaps the positions of two workout exercises. */
export async function swapWorkoutExercises(
  db: SQLiteDatabase,
  a: { id: number; position: number },
  b: { id: number; position: number },
) {
  await db.withTransactionAsync(async () => {
    await db.runAsync('UPDATE workout_exercises SET position = ? WHERE id = ?', b.position, a.id);
    await db.runAsync('UPDATE workout_exercises SET position = ? WHERE id = ?', a.position, b.id);
  });
}

export async function renameWorkout(db: SQLiteDatabase, workoutId: number, name: string) {
  await db.runAsync('UPDATE workouts SET name = ? WHERE id = ?', name, workoutId);
}

/**
 * Finishes the workout: unchecked sets and exercises with no completed sets are dropped.
 * Returns false if there were no completed sets (nothing finished).
 */
export async function finishWorkout(db: SQLiteDatabase, workoutId: number) {
  const r = await db.getFirstAsync<{ n: number }>(
    `SELECT COUNT(*) AS n FROM sets s JOIN workout_exercises we ON we.id = s.workout_exercise_id
      WHERE we.workout_id = ? AND s.done = 1`,
    workoutId,
  );
  if (!r || r.n === 0) return false;
  await db.withTransactionAsync(async () => {
    await db.runAsync(
      `DELETE FROM sets WHERE done = 0 AND workout_exercise_id IN
         (SELECT id FROM workout_exercises WHERE workout_id = ?)`,
      workoutId,
    );
    await db.runAsync(
      `DELETE FROM workout_exercises WHERE workout_id = ?
         AND NOT EXISTS (SELECT 1 FROM sets WHERE workout_exercise_id = workout_exercises.id)`,
      workoutId,
    );
    await db.runAsync('UPDATE workouts SET finished_at = ? WHERE id = ?', Date.now(), workoutId);
  });
  return true;
}

export async function discardWorkout(db: SQLiteDatabase, workoutId: number) {
  await db.runAsync('DELETE FROM workouts WHERE id = ?', workoutId);
}

// ---------- templates (saved workouts) ----------

export interface TemplateSummary {
  id: number;
  name: string;
  createdAt: number;
  exerciseCount: number;
}

export interface TemplateDetail {
  id: number;
  name: string;
  items: { exerciseId: string; sets: number }[];
}

export async function listTemplates(db: SQLiteDatabase): Promise<TemplateSummary[]> {
  const rows = await db.getAllAsync<{ id: number; name: string; created_at: number; n: number }>(
    `SELECT t.id, t.name, t.created_at,
            (SELECT COUNT(*) FROM template_exercises te WHERE te.template_id = t.id) AS n
       FROM templates t ORDER BY t.created_at DESC`,
  );
  return rows.map((r) => ({ id: r.id, name: r.name, createdAt: r.created_at, exerciseCount: r.n }));
}

export async function countTemplates(db: SQLiteDatabase) {
  const r = await db.getFirstAsync<{ n: number }>('SELECT COUNT(*) AS n FROM templates');
  return r?.n ?? 0;
}

export async function getTemplate(db: SQLiteDatabase, id: number): Promise<TemplateDetail | null> {
  const t = await db.getFirstAsync<{ id: number; name: string }>('SELECT id, name FROM templates WHERE id = ?', id);
  if (!t) return null;
  const items = await db.getAllAsync<{ exercise_id: string; sets: number }>(
    'SELECT exercise_id, sets FROM template_exercises WHERE template_id = ? ORDER BY position',
    id,
  );
  return { id: t.id, name: t.name, items: items.map((i) => ({ exerciseId: i.exercise_id, sets: i.sets })) };
}

export async function createTemplate(
  db: SQLiteDatabase,
  name: string,
  items: { exerciseId: string; sets: number }[],
) {
  let id = 0;
  await db.withTransactionAsync(async () => {
    const r = await db.runAsync('INSERT INTO templates (name, created_at) VALUES (?, ?)', name, Date.now());
    id = r.lastInsertRowId;
    for (let i = 0; i < items.length; i++) {
      await db.runAsync(
        'INSERT INTO template_exercises (template_id, exercise_id, position, sets) VALUES (?, ?, ?, ?)',
        id,
        items[i].exerciseId,
        i,
        items[i].sets,
      );
    }
  });
  return id;
}

export async function deleteTemplate(db: SQLiteDatabase, id: number) {
  await db.runAsync('DELETE FROM templates WHERE id = ?', id);
}

export async function renameTemplate(db: SQLiteDatabase, id: number, name: string) {
  await db.runAsync('UPDATE templates SET name = ? WHERE id = ?', name, id);
}

// ---------- history ----------

export interface HistoryItem {
  id: number;
  name: string;
  startedAt: number;
  finishedAt: number;
  exerciseCount: number;
  setCount: number;
  volumeKg: number;
}

export async function listHistory(db: SQLiteDatabase): Promise<HistoryItem[]> {
  const rows = await db.getAllAsync<{
    id: number;
    name: string;
    started_at: number;
    finished_at: number;
    ex: number;
    sets: number;
    volume: number | null;
  }>(
    `SELECT w.id, w.name, w.started_at, w.finished_at,
            (SELECT COUNT(*) FROM workout_exercises we WHERE we.workout_id = w.id) AS ex,
            (SELECT COUNT(*) FROM sets s JOIN workout_exercises we ON we.id = s.workout_exercise_id
              WHERE we.workout_id = w.id AND s.done = 1) AS sets,
            (SELECT SUM(COALESCE(s.reps, 0) * COALESCE(s.weight_kg, 0)) FROM sets s
               JOIN workout_exercises we ON we.id = s.workout_exercise_id
              WHERE we.workout_id = w.id AND s.done = 1) AS volume
       FROM workouts w WHERE w.finished_at IS NOT NULL ORDER BY w.finished_at DESC`,
  );
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    startedAt: r.started_at,
    finishedAt: r.finished_at,
    exerciseCount: r.ex,
    setCount: r.sets,
    volumeKg: r.volume ?? 0,
  }));
}

export interface HistoryDetail {
  id: number;
  name: string;
  startedAt: number;
  finishedAt: number;
  exercises: { exerciseId: string; sets: { reps: number | null; weightKg: number | null }[] }[];
}

export async function getHistoryDetail(db: SQLiteDatabase, id: number): Promise<HistoryDetail | null> {
  const w = await db.getFirstAsync<{ id: number; name: string; started_at: number; finished_at: number }>(
    'SELECT id, name, started_at, finished_at FROM workouts WHERE id = ? AND finished_at IS NOT NULL',
    id,
  );
  if (!w) return null;
  const wes = await db.getAllAsync<{ id: number; exercise_id: string }>(
    'SELECT id, exercise_id FROM workout_exercises WHERE workout_id = ? ORDER BY position',
    id,
  );
  const exercises = [];
  for (const we of wes) {
    const sets = await db.getAllAsync<{ reps: number | null; weight_kg: number | null }>(
      'SELECT reps, weight_kg FROM sets WHERE workout_exercise_id = ? AND done = 1 ORDER BY position',
      we.id,
    );
    exercises.push({
      exerciseId: we.exercise_id,
      sets: sets.map((s) => ({ reps: s.reps, weightKg: s.weight_kg })),
    });
  }
  return { id: w.id, name: w.name, startedAt: w.started_at, finishedAt: w.finished_at, exercises };
}

export async function deleteHistoryWorkout(db: SQLiteDatabase, id: number) {
  await db.runAsync('DELETE FROM workouts WHERE id = ? AND finished_at IS NOT NULL', id);
}

// ---------- per-exercise progress ----------

export interface ExerciseSession {
  workoutId: number;
  date: number;
  topWeightKg: number;
  volumeKg: number;
  est1rmKg: number;
  sets: { reps: number | null; weightKg: number | null }[];
}

export async function getExerciseSessions(db: SQLiteDatabase, exerciseId: string): Promise<ExerciseSession[]> {
  const rows = await db.getAllAsync<{
    workout_id: number;
    finished_at: number;
    reps: number | null;
    weight_kg: number | null;
  }>(
    `SELECT w.id AS workout_id, w.finished_at, s.reps, s.weight_kg
       FROM sets s
       JOIN workout_exercises we ON we.id = s.workout_exercise_id
       JOIN workouts w ON w.id = we.workout_id
      WHERE we.exercise_id = ? AND s.done = 1 AND w.finished_at IS NOT NULL
      ORDER BY w.finished_at, s.position`,
    exerciseId,
  );
  const sessions = new Map<number, ExerciseSession>();
  for (const r of rows) {
    let s = sessions.get(r.workout_id);
    if (!s) {
      s = { workoutId: r.workout_id, date: r.finished_at, topWeightKg: 0, volumeKg: 0, est1rmKg: 0, sets: [] };
      sessions.set(r.workout_id, s);
    }
    const reps = r.reps ?? 0;
    const w = r.weight_kg ?? 0;
    s.sets.push({ reps: r.reps, weightKg: r.weight_kg });
    s.topWeightKg = Math.max(s.topWeightKg, w);
    s.volumeKg += reps * w;
    // Epley estimate
    if (reps > 0 && w > 0) s.est1rmKg = Math.max(s.est1rmKg, w * (1 + reps / 30));
  }
  return [...sessions.values()];
}
