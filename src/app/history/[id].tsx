import { Ionicons } from '@expo/vector-icons';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, View } from 'react-native';
import {
  Body,
  Button,
  Card,
  EmptyState,
  formatDate,
  formatNumber,
  Heading,
  NameDialog,
  useBottomInset,
} from '@/components/ui';
import { countTemplates, createTemplate, deleteHistoryWorkout, getHistoryDetail, type HistoryDetail } from '@/db/queries';
import { useExercises } from '@/state/exercises';
import { FREE_LIMITS, useSettings } from '@/state/settings';
import { useTheme } from '@/state/theme';

export default function HistoryDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const db = useSQLiteContext();
  const bottomInset = useBottomInset();
  const { t, lang, unit, toDisplay, isPro } = useSettings();
  const { byId } = useExercises();
  const { colors } = useTheme();
  const [detail, setDetail] = useState<HistoryDetail | null | undefined>(undefined);
  const [naming, setNaming] = useState(false);

  useEffect(() => {
    getHistoryDetail(db, Number(id)).then(setDetail);
  }, [db, id]);

  if (detail === undefined) return null;
  if (detail === null) return <EmptyState body={t('common.notFound')} />;

  const minutes = Math.max(1, Math.round((detail.finishedAt - detail.startedAt) / 60000));
  const volume = detail.exercises.reduce(
    (sum, e) => sum + e.sets.reduce((s, x) => s + (x.reps ?? 0) * (x.weightKg ?? 0), 0),
    0,
  );
  const setCount = detail.exercises.reduce((n, e) => n + e.sets.length, 0);

  async function startSaveTemplate() {
    if (!isPro && (await countTemplates(db)) >= FREE_LIMITS.savedWorkouts) {
      Alert.alert(t('pro.title'), t('pro.limitWorkouts', { n: FREE_LIMITS.savedWorkouts }));
      return;
    }
    setNaming(true);
  }

  async function saveTemplate(name: string) {
    if (!detail) return;
    setNaming(false);
    await createTemplate(
      db,
      name,
      detail.exercises.map((e) => ({ exerciseId: e.exerciseId, sets: e.sets.length })),
    );
    Alert.alert(t('workout.templateSaved'));
  }

  function confirmDelete() {
    Alert.alert(t('history.deleteConfirm'), undefined, [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('common.delete'),
        style: 'destructive',
        onPress: async () => {
          await deleteHistoryWorkout(db, Number(id));
          router.back();
        },
      },
    ]);
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 24 + bottomInset }}>
      <Stack.Screen options={{ title: detail.name }} />
      <View>
        <Heading>{detail.name}</Heading>
        <Body muted style={{ marginTop: 4 }}>
          {formatDate(detail.finishedAt, lang)}
        </Body>
      </View>
      <Card style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
        <Stat label={t('history.duration')} value={t('history.min', { n: minutes })} />
        <Stat label={t('history.sets')} value={String(setCount)} />
        <Stat label={t('history.volume')} value={`${formatNumber(Math.round(toDisplay(volume)))} ${unit}`} />
      </Card>
      {detail.exercises.map((e, i) => (
        <Pressable
          key={`${e.exerciseId}-${i}`}
          onPress={() => router.push({ pathname: '/exercise/[id]', params: { id: e.exerciseId } })}
          accessibilityRole="link"
        >
          <Card style={{ gap: 4 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Body bold style={{ color: colors.primary, flex: 1 }}>
                {byId(e.exerciseId).name}
              </Body>
              <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
            </View>
            {e.sets.map((s, j) => (
              <Body key={j} muted>
                {j + 1}.  {s.weightKg != null ? `${formatNumber(toDisplay(s.weightKg))} ${unit}` : '–'} × {s.reps ?? '–'}
              </Body>
            ))}
          </Card>
        </Pressable>
      ))}
      <Button label={t('workout.saveAsTemplate')} variant="secondary" onPress={startSaveTemplate} />
      <Button label={t('common.delete')} variant="danger" onPress={confirmDelete} />
      <NameDialog
        visible={naming}
        title={t('workout.saveAsTemplate')}
        initial={detail.name}
        onCancel={() => setNaming(false)}
        onSubmit={saveTemplate}
      />
    </ScrollView>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ alignItems: 'center' }}>
      <Body bold style={{ fontSize: 17 }}>
        {value}
      </Body>
      <Body muted style={{ fontSize: 12 }}>
        {label}
      </Body>
    </View>
  );
}
