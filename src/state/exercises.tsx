import { useSQLiteContext } from 'expo-sqlite';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { builtInExercises } from '@/data/exercises';
import type { Exercise } from '@/data/types';
import { customId, getCustomExercises } from '@/db/queries';
import { useSettings } from './settings';

interface Ctx {
  all: Exercise[];
  byId: (id: string) => Exercise;
  reload: () => Promise<void>;
}

const ExercisesContext = createContext<Ctx | null>(null);

export function ExercisesProvider({ children }: { children: ReactNode }) {
  const db = useSQLiteContext();
  const { lang, t } = useSettings();
  const [custom, setCustom] = useState<Exercise[]>([]);

  const reload = useCallback(async () => {
    const rows = await getCustomExercises(db);
    setCustom(
      rows.map((r) => ({
        id: customId(r.id),
        name: r.name,
        muscle: r.muscle,
        equipment: r.equipment,
        howto: r.howto,
        custom: true,
      })),
    );
  }, [db]);

  useEffect(() => {
    reload();
  }, [reload]);

  const value = useMemo<Ctx>(() => {
    const all = [...builtInExercises(lang), ...custom].sort((a, b) => a.name.localeCompare(b.name, lang));
    const map = new Map(all.map((e) => [e.id, e]));
    return {
      all,
      reload,
      byId: (id) =>
        map.get(id) ?? {
          id,
          name: t('exercises.removedExercise'),
          muscle: 'core',
          equipment: 'bodyweight',
          howto: '',
          custom: true,
        },
    };
  }, [lang, custom, reload, t]);

  return <ExercisesContext.Provider value={value}>{children}</ExercisesContext.Provider>;
}

export function useExercises(): Ctx {
  const ctx = useContext(ExercisesContext);
  if (!ctx) throw new Error('useExercises must be used inside ExercisesProvider');
  return ctx;
}
