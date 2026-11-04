import { router, Stack } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { Alert, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ExerciseBrowser } from '@/components/ExerciseBrowser';
import { countCustomExercises } from '@/db/queries';
import { FREE_LIMITS, useSettings } from '@/state/settings';
import { useTheme } from '@/state/theme';

export default function ExercisesScreen() {
  const db = useSQLiteContext();
  const { t, isPro } = useSettings();
  const { colors } = useTheme();

  async function onNew() {
    if (!isPro && (await countCustomExercises(db)) >= FREE_LIMITS.customExercises) {
      Alert.alert(t('pro.title'), t('pro.limitExercises', { n: FREE_LIMITS.customExercises }));
      return;
    }
    router.push('/exercise/new');
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerRight: () => (
            <Pressable onPress={onNew} hitSlop={12} style={{ marginRight: 16 }} accessibilityLabel={t('exercises.create')}>
              <Ionicons name="add-circle" size={28} color={colors.primary} />
            </Pressable>
          ),
        }}
      />
      <ExerciseBrowser onOpen={(e) => router.push({ pathname: '/exercise/[id]', params: { id: e.id } })} />
    </>
  );
}
