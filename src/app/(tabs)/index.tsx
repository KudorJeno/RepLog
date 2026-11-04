import { router, Stack } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, View } from 'react-native';
import { Body, Button, EmptyState, NameDialog } from '@/components/ui';
import { ExerciseCard, RestBanner } from '@/components/WorkoutParts';
import { countTemplates, createTemplate, renameWorkout } from '@/db/queries';
import { useRestTimer } from '@/state/rest';
import { FREE_LIMITS, useSettings } from '@/state/settings';
import { useTheme } from '@/state/theme';
import { useWorkout } from '@/state/workout';

export default function WorkoutScreen() {
  const db = useSQLiteContext();
  const { t, isPro } = useSettings();
  const { colors } = useTheme();
  const { workout, loaded, start, finish, discard, reload } = useWorkout();
  const rest = useRestTimer();
  const [namingTemplate, setNamingTemplate] = useState(false);
  const [renaming, setRenaming] = useState(false);

  if (!loaded) return null;

  if (!workout) {
    return (
      <>
        <Stack.Screen options={{ headerTitle: t('tab.workout'), headerRight: () => null }} />
        <EmptyState title={t('workout.emptyTitle')} body={t('workout.emptyBody')}>
          <View style={{ gap: 10, width: '100%', maxWidth: 360 }}>
            <Button label={t('workout.startEmpty')} onPress={() => start(t('workout.defaultName'), [])} />
            <Button
              label={t('workout.browseWorkouts')}
              variant="secondary"
              onPress={() => router.navigate('/workouts')}
            />
          </View>
        </EmptyState>
      </>
    );
  }

  const allSets = workout.exercises.flatMap((e) => e.sets);
  const doneCount = allSets.filter((s) => s.done).length;

  function confirmFinish() {
    if (!workout) return;
    if (doneCount === 0) {
      Alert.alert(t('workout.finishConfirm'), t('workout.finishEmpty'));
      return;
    }
    const unchecked = allSets.length - doneCount;
    Alert.alert(t('workout.finishConfirm'), unchecked > 0 ? t('workout.finishUnchecked', { n: unchecked }) : undefined, [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('workout.finish'),
        onPress: async () => {
          await rest.skip();
          if (await finish()) router.navigate('/history');
        },
      },
    ]);
  }

  function confirmDiscard() {
    Alert.alert(t('workout.discard'), t('workout.discardConfirm'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('common.delete'),
        style: 'destructive',
        onPress: async () => {
          await rest.skip();
          await discard();
        },
      },
    ]);
  }

  async function startSaveTemplate() {
    if (!isPro && (await countTemplates(db)) >= FREE_LIMITS.savedWorkouts) {
      Alert.alert(t('pro.title'), t('pro.limitWorkouts', { n: FREE_LIMITS.savedWorkouts }));
      return;
    }
    setNamingTemplate(true);
  }

  async function saveTemplate(name: string) {
    if (!workout) return;
    setNamingTemplate(false);
    await createTemplate(
      db,
      name,
      workout.exercises.map((e) => ({ exerciseId: e.exerciseId, sets: e.sets.length })),
    );
    Alert.alert(t('workout.templateSaved'));
  }

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          headerTitle: t('tab.workout'),
          headerRight: () =>
            allSets.length > 0 ? (
              <Pressable onPress={confirmFinish} hitSlop={10} style={{ marginRight: 16 }}>
                <Body bold style={{ color: colors.primary, fontSize: 16 }}>
                  {t('workout.finish')}
                </Body>
              </Pressable>
            ) : null,
        }}
      />
      <RestBanner />
      <ScrollView contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
        {workout.exercises.length > 0 ? (
          <Pressable onPress={() => setRenaming(true)}>
            <Body bold style={{ fontSize: 20 }}>
              {workout.name}
            </Body>
            <Body muted style={{ marginTop: 2 }}>
              {t('workout.setsProgress', { done: doneCount, total: allSets.length })}
            </Body>
          </Pressable>
        ) : (
          <Body muted style={{ textAlign: 'center' }}>
            {t('workout.nothingYet')}
          </Body>
        )}
        {workout.exercises.map((e, i) => (
          <ExerciseCard key={e.id} item={e} index={i} count={workout.exercises.length} />
        ))}
        <Button label={t('workout.addExercise')} onPress={() => router.push('/pick-exercises')} />
        {workout.exercises.length > 0 && (
          <Button label={t('workout.saveAsTemplate')} variant="secondary" onPress={startSaveTemplate} />
        )}
        <Button label={t('workout.discard')} variant="ghost" onPress={confirmDiscard} />
      </ScrollView>

      <NameDialog
        visible={namingTemplate}
        title={t('workout.saveAsTemplate')}
        initial={workout.name}
        onCancel={() => setNamingTemplate(false)}
        onSubmit={saveTemplate}
      />
      <NameDialog
        visible={renaming}
        title={t('workouts.rename')}
        initial={workout.name}
        onCancel={() => setRenaming(false)}
        onSubmit={async (name) => {
          setRenaming(false);
          await renameWorkout(db, workout.id, name);
          await reload();
        }}
      />
    </View>
  );
}
