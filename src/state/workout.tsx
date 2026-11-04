import { useSQLiteContext } from 'expo-sqlite';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  addExercisesToWorkout,
  addSet,
  discardWorkout,
  finishWorkout,
  getActiveWorkout,
  removeSet,
  removeWorkoutExercise,
  startWorkout,
  swapWorkoutExercises,
  updateSet,
  type ActiveWorkout,
} from '@/db/queries';

interface Ctx {
  workout: ActiveWorkout | null;
  loaded: boolean;
  reload: () => Promise<void>;
  start: (name: string, items: { exerciseId: string; sets: number }[]) => Promise<void>;
  addExercises: (ids: string[]) => Promise<void>;
  patchSet: (
    exerciseRowId: number,
    setId: number,
    patch: { reps?: number | null; weightKg?: number | null; done?: boolean },
  ) => Promise<void>;
  addSetTo: (exerciseRowId: number) => Promise<void>;
  removeSetFrom: (setId: number) => Promise<void>;
  removeExercise: (exerciseRowId: number) => Promise<void>;
  move: (exerciseRowId: number, dir: -1 | 1) => Promise<void>;
  finish: () => Promise<boolean>;
  discard: () => Promise<void>;
}

const WorkoutContext = createContext<Ctx | null>(null);

export function WorkoutProvider({ children }: { children: ReactNode }) {
  const db = useSQLiteContext();
  const [workout, setWorkout] = useState<ActiveWorkout | null>(null);
  const [loaded, setLoaded] = useState(false);

  const reload = useCallback(async () => {
    setWorkout(await getActiveWorkout(db));
    setLoaded(true);
  }, [db]);

  useEffect(() => {
    reload();
  }, [reload]);

  const value = useMemo<Ctx>(
    () => ({
      workout,
      loaded,
      reload,
      start: async (name, items) => {
        await startWorkout(db, name, items);
        await reload();
      },
      addExercises: async (ids) => {
        if (!workout) return;
        await addExercisesToWorkout(db, workout.id, ids);
        await reload();
      },
      // Set edits update local state immediately so typing stays responsive.
      patchSet: async (exerciseRowId, setId, patch) => {
        setWorkout((w) =>
          w
            ? {
                ...w,
                exercises: w.exercises.map((e) =>
                  e.id !== exerciseRowId
                    ? e
                    : { ...e, sets: e.sets.map((s) => (s.id === setId ? { ...s, ...patch } : s)) },
                ),
              }
            : w,
        );
        await updateSet(db, setId, patch);
      },
      addSetTo: async (exerciseRowId) => {
        await addSet(db, exerciseRowId);
        await reload();
      },
      removeSetFrom: async (setId) => {
        await removeSet(db, setId);
        await reload();
      },
      removeExercise: async (exerciseRowId) => {
        await removeWorkoutExercise(db, exerciseRowId);
        await reload();
      },
      move: async (exerciseRowId, dir) => {
        if (!workout) return;
        const i = workout.exercises.findIndex((e) => e.id === exerciseRowId);
        const j = i + dir;
        if (i < 0 || j < 0 || j >= workout.exercises.length) return;
        await swapWorkoutExercises(db, workout.exercises[i], workout.exercises[j]);
        await reload();
      },
      finish: async () => {
        if (!workout) return false;
        const ok = await finishWorkout(db, workout.id);
        if (ok) await reload();
        return ok;
      },
      discard: async () => {
        if (!workout) return;
        await discardWorkout(db, workout.id);
        await reload();
      },
    }),
    [db, workout, loaded, reload],
  );

  return <WorkoutContext.Provider value={value}>{children}</WorkoutContext.Provider>;
}

export function useWorkout(): Ctx {
  const ctx = useContext(WorkoutContext);
  if (!ctx) throw new Error('useWorkout must be used inside WorkoutProvider');
  return ctx;
}
