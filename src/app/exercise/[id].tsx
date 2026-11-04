import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useEffect, useState } from 'react';
import { Alert, ScrollView, View } from 'react-native';
import { LineChart } from '@/components/LineChart';
import { Body, Button, Card, ChipRow, formatDate, formatNumber, Heading, useBottomInset } from '@/components/ui';
import { deleteCustomExercise, getExerciseSessions, type ExerciseSession } from '@/db/queries';
import { useExercises } from '@/state/exercises';
import { useSettings } from '@/state/settings';

type Metric = 'maxWeight' | 'volume' | 'est1rm';

export default function ExerciseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const db = useSQLiteContext();
  const bottomInset = useBottomInset();
  const { t, lang, isPro, toDisplay, unit } = useSettings();
  const { byId, reload } = useExercises();
  const exercise = byId(id);
  const [sessions, setSessions] = useState<ExerciseSession[]>([]);
  const [metric, setMetric] = useState<Metric>('maxWeight');

  useEffect(() => {
    getExerciseSessions(db, id).then(setSessions);
  }, [db, id]);

  const remove = useCallback(() => {
    Alert.alert(t('exercises.deleteConfirm'), undefined, [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('common.delete'),
        style: 'destructive',
        onPress: async () => {
          await deleteCustomExercise(db, id);
          await reload();
          router.back();
        },
      },
    ]);
  }, [db, id, reload, t]);

  const points = sessions.map((s) => ({
    x: s.date,
    y: toDisplay(metric === 'maxWeight' ? s.topWeightKg : metric === 'volume' ? s.volumeKg : s.est1rmKg),
  }));

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 24 + bottomInset }}>
      <Stack.Screen options={{ title: exercise.name }} />
      <View>
        <Heading>{exercise.name}</Heading>
        <Body muted style={{ marginTop: 4 }}>
          {t(`muscle.${exercise.muscle}`)} · {t(`equip.${exercise.equipment}`)}
        </Body>
      </View>

      <Card>
        <Body bold style={{ marginBottom: 6 }}>
          {t('exercises.howto')}
        </Body>
        <Body muted={!exercise.howto}>{exercise.howto || t('exercises.noHowto')}</Body>
      </Card>

      <Card>
        <Body bold style={{ marginBottom: 6 }}>
          {t('chart.title')}
        </Body>
        {!isPro ? (
          <Body muted>{t('pro.limitCharts')}</Body>
        ) : sessions.length < 2 ? (
          <Body muted>{t('chart.notEnough')}</Body>
        ) : (
          <>
            <View style={{ marginHorizontal: -16 }}>
              <ChipRow
                options={[
                  { value: 'maxWeight' as Metric, label: t('chart.maxWeight') },
                  { value: 'volume' as Metric, label: t('chart.volume') },
                  { value: 'est1rm' as Metric, label: t('chart.est1rm') },
                ]}
                value={metric}
                onChange={(v) => v && setMetric(v)}
              />
            </View>
            <LineChart
              points={points}
              formatY={(v) => formatNumber(Math.round(v * 10) / 10)}
              formatX={(ms) => formatDate(ms, lang)}
            />
            <Body muted style={{ fontSize: 12, marginTop: 4 }}>
              {t('chart.best')}: {formatNumber(Math.max(...points.map((p) => p.y)))} {unit}
            </Body>
          </>
        )}
      </Card>

      <View style={{ gap: 8 }}>
        <Body bold>{t('exercises.history')}</Body>
        {sessions.length === 0 ? (
          <Body muted>{t('exercises.noHistory')}</Body>
        ) : (
          [...sessions].reverse().map((s) => (
            <Card key={s.workoutId}>
              <Body muted style={{ fontSize: 13, marginBottom: 4 }}>
                {formatDate(s.date, lang)}
              </Body>
              <Body>
                {s.sets
                  .map((x) => `${x.weightKg != null ? formatNumber(toDisplay(x.weightKg)) : '–'} ${unit} × ${x.reps ?? '–'}`)
                  .join('   ')}
              </Body>
            </Card>
          ))
        )}
      </View>

      {exercise.custom && id.startsWith('c_') ? (
        <Button label={t('common.delete')} variant="danger" onPress={remove} />
      ) : null}
    </ScrollView>
  );
}
