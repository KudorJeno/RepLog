import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { Alert, ScrollView, View } from 'react-native';
import { Body, Button, Card, EmptyState, Heading, useBottomInset } from '@/components/ui';
import { FREE_PREBUILT_IDS, PREBUILT_WORKOUTS } from '@/data/prebuilt';
import { countTemplates, createTemplate } from '@/db/queries';
import { useExercises } from '@/state/exercises';
import { FREE_LIMITS, useSettings } from '@/state/settings';
import { useStartWorkout } from '@/state/useStartWorkout';

export default function PrebuiltDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const db = useSQLiteContext();
  const bottomInset = useBottomInset();
  const { t, lang, isPro } = useSettings();
  const { byId } = useExercises();
  const startWorkout = useStartWorkout();

  const index = PREBUILT_WORKOUTS.findIndex((w) => w.id === id);
  const workout = PREBUILT_WORKOUTS[index];
  if (!workout) return <EmptyState body={t('common.notFound')} />;

  const locked = !isPro && !FREE_PREBUILT_IDS.has(workout.id);
  const items = workout.exercises.map(([exerciseId, sets]) => ({ exerciseId, sets }));

  async function saveCopy() {
    if (!isPro && (await countTemplates(db)) >= FREE_LIMITS.savedWorkouts) {
      Alert.alert(t('pro.title'), t('pro.limitWorkouts', { n: FREE_LIMITS.savedWorkouts }));
      return;
    }
    await createTemplate(db, workout.name[lang], items);
    Alert.alert(t('workout.templateSaved'));
    router.back();
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 24 + bottomInset }}>
      <Stack.Screen options={{ title: workout.name[lang] }} />
      <View>
        <Heading>{workout.name[lang]}</Heading>
        <Body muted style={{ marginTop: 4 }}>
          {workout.tags.map((x) => t(`tag.${x}`)).join(' · ')}
        </Body>
      </View>
      {items.map((it) => (
        <Card key={it.exerciseId} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Body bold style={{ flex: 1 }}>
            {byId(it.exerciseId).name}
          </Body>
          <Body muted>{t('common.sets', { n: it.sets })}</Body>
        </Card>
      ))}
      {locked ? (
        <Card>
          <Body bold style={{ marginBottom: 4 }}>
            {t('pro.title')}
          </Body>
          <Body muted>{t('pro.limitPrebuilt')}</Body>
        </Card>
      ) : (
        <>
          <Button label={t('workouts.start')} onPress={() => startWorkout(workout.name[lang], items)} />
          <Button label={t('workouts.saveCopy')} variant="secondary" onPress={saveCopy} />
        </>
      )}
    </ScrollView>
  );
}
