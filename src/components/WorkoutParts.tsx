import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import type { ActiveExercise, SetRow as SetRowData } from '@/db/queries';
import { useExercises } from '@/state/exercises';
import { useRestTimer } from '@/state/rest';
import { useSettings } from '@/state/settings';
import { useTheme } from '@/state/theme';
import { useWorkout } from '@/state/workout';
import { Body, Button, Card, formatNumber } from './ui';

export function RestBanner() {
  const { endsAt, total, skip } = useRestTimer();
  const { t } = useSettings();
  const { colors } = useTheme();
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (endsAt === null) return;
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(id);
  }, [endsAt]);

  if (endsAt === null) return null;
  const left = Math.max(0, Math.ceil((endsAt - now) / 1000));
  const mm = Math.floor(left / 60);
  const ss = String(left % 60).padStart(2, '0');
  const progress = total > 0 ? 1 - left / total : 1;

  return (
    <View style={[styles.rest, { backgroundColor: colors.card, borderColor: colors.primary }]}>
      <View style={[styles.restProgress, { backgroundColor: colors.primary, width: `${Math.min(progress, 1) * 100}%` }]} />
      <View style={styles.restContent}>
        <Body bold>
          {t('workout.rest')}: {mm}:{ss}
        </Body>
        <Pressable onPress={skip} hitSlop={8}>
          <Body style={{ color: colors.primary, fontWeight: '700' }}>{t('workout.skipRest')}</Body>
        </Pressable>
      </View>
    </View>
  );
}

function numberOrNull(text: string): number | null {
  const n = parseFloat(text.replace(',', '.'));
  return Number.isFinite(n) && n >= 0 ? n : null;
}

function SetRowView({ exerciseRowId, set, index, prevText }: { exerciseRowId: number; set: SetRowData; index: number; prevText: string }) {
  const { colors } = useTheme();
  const { toDisplay, toKg } = useSettings();
  const { patchSet, removeSetFrom } = useWorkout();
  const rest = useRestTimer();

  const [weight, setWeight] = useState(set.weightKg != null ? formatNumber(toDisplay(set.weightKg)) : '');
  const [reps, setReps] = useState(set.reps != null ? String(set.reps) : '');

  // Re-sync if the stored value changes underneath (e.g. unit switch).
  useEffect(() => {
    setWeight(set.weightKg != null ? formatNumber(toDisplay(set.weightKg)) : '');
  }, [set.weightKg, toDisplay]);
  useEffect(() => {
    setReps(set.reps != null ? String(set.reps) : '');
  }, [set.reps]);

  function parsed() {
    const w = numberOrNull(weight);
    const r = numberOrNull(reps);
    return { weightKg: w != null ? toKg(w) : null, reps: r != null ? Math.round(r) : null };
  }

  function commit() {
    patchSet(exerciseRowId, set.id, parsed());
  }

  function toggleDone() {
    const done = !set.done;
    patchSet(exerciseRowId, set.id, { ...parsed(), done });
    if (done) rest.start();
  }

  const inputStyle = [
    styles.input,
    { backgroundColor: set.done ? 'transparent' : colors.cardAlt, color: colors.text, borderColor: colors.border },
  ];

  return (
    <Pressable
      onLongPress={() => removeSetFrom(set.id)}
      delayLongPress={600}
      style={[styles.setRow, set.done && { backgroundColor: colors.success + '22' }]}
    >
      <Body bold style={{ width: 28, textAlign: 'center' }}>
        {index + 1}
      </Body>
      <Body muted style={{ flex: 1, fontSize: 13 }} >
        {prevText}
      </Body>
      <TextInput
        value={weight}
        onChangeText={setWeight}
        onBlur={commit}
        keyboardType="decimal-pad"
        selectTextOnFocus
        style={[inputStyle, { width: 72 }]}
        placeholder="–"
        placeholderTextColor={colors.textMuted}
      />
      <TextInput
        value={reps}
        onChangeText={setReps}
        onBlur={commit}
        keyboardType="number-pad"
        selectTextOnFocus
        style={[inputStyle, { width: 56 }]}
        placeholder="–"
        placeholderTextColor={colors.textMuted}
      />
      <Pressable
        onPress={toggleDone}
        hitSlop={6}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: set.done }}
        style={[
          styles.check,
          { backgroundColor: set.done ? colors.success : colors.cardAlt, borderColor: set.done ? colors.success : colors.border },
        ]}
      >
        <Ionicons name="checkmark" size={20} color={set.done ? '#fff' : colors.textMuted} />
      </Pressable>
    </Pressable>
  );
}

export function ExerciseCard({ item, index, count }: { item: ActiveExercise; index: number; count: number }) {
  const { byId } = useExercises();
  const { t, unit, toDisplay } = useSettings();
  const { colors } = useTheme();
  const { addSetTo, removeSetFrom, removeExercise, move } = useWorkout();
  const exercise = byId(item.exerciseId);
  const done = item.sets.filter((s) => s.done).length;

  function prevText(i: number) {
    const p = item.prev[i];
    if (!p) return '';
    const w = p.weightKg != null ? `${formatNumber(toDisplay(p.weightKg))} ${unit}` : '–';
    return `${w} × ${p.reps ?? '–'}`;
  }

  return (
    <Card style={{ gap: 4, padding: 0, overflow: 'hidden' }}>
      <View style={styles.cardHeader}>
        <Pressable
          style={{ flex: 1 }}
          onPress={() => router.push({ pathname: '/exercise/[id]', params: { id: item.exerciseId } })}
          accessibilityRole="link"
        >
          <Body bold style={{ fontSize: 17, color: colors.primary }}>
            {exercise.name}
          </Body>
          <Body muted style={{ fontSize: 13 }}>
            {t('workout.setsProgress', { done, total: item.sets.length })}
            {item.sets.length - done > 0 ? ` · ${t('workout.setsLeft', { n: item.sets.length - done })}` : ''}
          </Body>
        </Pressable>
        <Pressable disabled={index === 0} onPress={() => move(item.id, -1)} hitSlop={8} accessibilityLabel={t('workout.moveUp')}>
          <Ionicons name="arrow-up" size={22} color={index === 0 ? colors.border : colors.textMuted} />
        </Pressable>
        <Pressable disabled={index === count - 1} onPress={() => move(item.id, 1)} hitSlop={8} accessibilityLabel={t('workout.moveDown')}>
          <Ionicons name="arrow-down" size={22} color={index === count - 1 ? colors.border : colors.textMuted} />
        </Pressable>
        <Pressable onPress={() => removeExercise(item.id)} hitSlop={8} accessibilityLabel={t('workout.removeExercise')}>
          <Ionicons name="trash-outline" size={22} color={colors.danger} />
        </Pressable>
      </View>

      <View style={styles.setHeader}>
        <Body muted style={{ width: 28, textAlign: 'center', fontSize: 12 }}>
          #
        </Body>
        <Body muted style={{ flex: 1, fontSize: 12 }}>
          {t('workout.previous')}
        </Body>
        <Body muted style={{ width: 72, textAlign: 'center', fontSize: 12 }}>
          {unit}
        </Body>
        <Body muted style={{ width: 56, textAlign: 'center', fontSize: 12 }}>
          {t('workout.reps')}
        </Body>
        <View style={{ width: 40 }} />
      </View>

      {item.sets.map((s, i) => (
        <SetRowView key={s.id} exerciseRowId={item.id} set={s} index={i} prevText={prevText(i)} />
      ))}

      <View style={{ padding: 10, flexDirection: 'row', gap: 8 }}>
        <Button label={t('workout.addSet')} variant="secondary" onPress={() => addSetTo(item.id)} style={{ flex: 1 }} />
        <Button
          label={t('workout.removeSet')}
          variant="secondary"
          disabled={item.sets.length === 0}
          onPress={() => removeSetFrom(item.sets[item.sets.length - 1].id)}
          style={{ flex: 1 }}
        />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  rest: { borderWidth: 1.5, borderRadius: 12, overflow: 'hidden', marginHorizontal: 16, marginTop: 10 },
  restProgress: { position: 'absolute', left: 0, top: 0, bottom: 0, opacity: 0.18 },
  restContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 14, paddingBottom: 6 },
  setHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 14 },
  setRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 14, paddingVertical: 5 },
  input: { borderWidth: StyleSheet.hairlineWidth, borderRadius: 8, paddingVertical: 7, textAlign: 'center', fontSize: 16, fontWeight: '600' },
  check: { width: 40, height: 36, borderRadius: 8, alignItems: 'center', justifyContent: 'center', borderWidth: StyleSheet.hairlineWidth },
});
