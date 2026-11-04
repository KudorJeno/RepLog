import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SQLiteProvider } from 'expo-sqlite';
import { useEffect, type ReactNode } from 'react';
import { View } from 'react-native';
import { initBilling } from '@/billing/purchases';
import { migrateDbIfNeeded } from '@/db/schema';
import { ExercisesProvider } from '@/state/exercises';
import { RestTimerProvider } from '@/state/rest';
import { SettingsProvider, useSettings } from '@/state/settings';
import { useTheme } from '@/state/theme';
import { WorkoutProvider } from '@/state/workout';

function Providers({ children }: { children: ReactNode }) {
  return (
    <SQLiteProvider databaseName="replog.db" onInit={migrateDbIfNeeded}>
      <SettingsProvider>
        <ExercisesProvider>
          <WorkoutProvider>
            <RestTimerProvider>{children}</RestTimerProvider>
          </WorkoutProvider>
        </ExercisesProvider>
      </SettingsProvider>
    </SQLiteProvider>
  );
}

function Navigator() {
  const { colors, isDark } = useTheme();
  const { t, loaded, update } = useSettings();

  // Keep the stored Pro flag in sync with the store entitlement (also picks up restores and refunds).
  useEffect(() => {
    if (loaded) initBilling((isPro) => update({ isPro }));
  }, [loaded, update]);

  if (!loaded) return <View style={{ flex: 1, backgroundColor: colors.bg }} />;
  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.card },
          headerTintColor: colors.text,
          headerTitleStyle: { fontWeight: '700' },
          contentStyle: { backgroundColor: colors.bg },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="pick-exercises" options={{ title: t('exercises.pick'), presentation: 'modal' }} />
        <Stack.Screen name="exercise/new" options={{ title: t('exercises.create'), presentation: 'modal' }} />
        <Stack.Screen name="exercise/[id]" options={{ title: '' }} />
        <Stack.Screen name="history/[id]" options={{ title: '' }} />
        <Stack.Screen name="template/[id]" options={{ title: '' }} />
        <Stack.Screen name="prebuilt/[id]" options={{ title: '' }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <Providers>
      <Navigator />
    </Providers>
  );
}
