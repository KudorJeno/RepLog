import { getLocales } from 'expo-localization';
import { useSQLiteContext } from 'expo-sqlite';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { STRINGS, type StringKey } from '@/i18n/strings';
import type { Lang } from '@/data/types';

export type Unit = 'kg' | 'lb';
export type ThemePref = 'dark' | 'light' | 'system';

export interface Settings {
  lang: Lang;
  unit: Unit;
  theme: ThemePref;
  restSeconds: number;
  isPro: boolean;
}

export const FREE_LIMITS = { savedWorkouts: 3, customExercises: 3 };

const KG_PER_LB = 0.45359237;

function defaultLang(): Lang {
  const code = getLocales()[0]?.languageCode;
  return code === 'ro' ? 'ro' : 'en';
}

const DEFAULTS = (): Settings => ({
  lang: defaultLang(),
  unit: 'kg',
  theme: 'dark',
  restSeconds: 90,
  isPro: false,
});

interface Ctx extends Settings {
  loaded: boolean;
  update: (patch: Partial<Settings>) => Promise<void>;
  t: (key: StringKey, params?: Record<string, string | number>) => string;
  /** kg (stored) -> number in the display unit, rounded for display */
  toDisplay: (kg: number) => number;
  /** display-unit number -> kg for storage */
  toKg: (value: number) => number;
}

const SettingsContext = createContext<Ctx | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const db = useSQLiteContext();
  const [settings, setSettings] = useState<Settings>(DEFAULTS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const rows = await db.getAllAsync<{ key: string; value: string }>('SELECT key, value FROM settings');
      const map = new Map(rows.map((r) => [r.key, r.value]));
      const d = DEFAULTS();
      setSettings({
        lang: map.get('lang') === 'ro' || map.get('lang') === 'en' ? (map.get('lang') as Lang) : d.lang,
        unit: map.get('unit') === 'lb' ? 'lb' : 'kg',
        theme: (['dark', 'light', 'system'] as const).includes(map.get('theme') as ThemePref)
          ? (map.get('theme') as ThemePref)
          : d.theme,
        restSeconds: Number(map.get('restSeconds')) > 0 ? Number(map.get('restSeconds')) : d.restSeconds,
        isPro: map.get('isPro') === '1',
      });
      setLoaded(true);
    })();
  }, [db]);

  const update = useCallback(
    async (patch: Partial<Settings>) => {
      setSettings((s) => ({ ...s, ...patch }));
      for (const [k, v] of Object.entries(patch)) {
        const value = typeof v === 'boolean' ? (v ? '1' : '0') : String(v);
        await db.runAsync(
          'INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value',
          k,
          value,
        );
      }
    },
    [db],
  );

  const value = useMemo<Ctx>(() => {
    const dict = STRINGS[settings.lang];
    return {
      ...settings,
      loaded,
      update,
      t: (key, params) => {
        let s = dict[key] ?? key;
        if (params) for (const [k, v] of Object.entries(params)) s = s.replace(`{${k}}`, String(v));
        return s;
      },
      toDisplay: (kg) => {
        const v = settings.unit === 'kg' ? kg : kg / KG_PER_LB;
        return Math.round(v * 10) / 10;
      },
      toKg: (v) => (settings.unit === 'kg' ? v : v * KG_PER_LB),
    };
  }, [settings, loaded, update]);

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings(): Ctx {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used inside SettingsProvider');
  return ctx;
}
