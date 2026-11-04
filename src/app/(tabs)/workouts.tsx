import { useFocusEffect } from 'expo-router';
import { router } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Body, Button, Card, ChipRow, EmptyState, sortByLabel } from '@/components/ui';
import { FREE_PREBUILT_IDS, PREBUILT_WORKOUTS } from '@/data/prebuilt';
import { MUSCLES, WORKOUT_TAGS, type Muscle, type WorkoutTag } from '@/data/types';
import { listTemplates, type TemplateSummary } from '@/db/queries';
import { useSettings } from '@/state/settings';
import { useTheme } from '@/state/theme';

type Tab = 'mine' | 'prebuilt';
type Filter = { kind: 'tag'; value: WorkoutTag } | { kind: 'muscle'; value: Muscle };

export default function WorkoutsScreen() {
  const db = useSQLiteContext();
  const { t, lang, isPro } = useSettings();
  const { colors } = useTheme();
  const [tab, setTab] = useState<Tab>('mine');
  const [filterKey, setFilterKey] = useState<string | null>(null);
  const [templates, setTemplates] = useState<TemplateSummary[]>([]);

  useFocusEffect(
    useCallback(() => {
      listTemplates(db).then(setTemplates);
    }, [db]),
  );

  // "Legs" exists both as a day type and a muscle group; show it once and match either.
  const filterOptions = useMemo(
    () =>
      sortByLabel(
        [
          ...WORKOUT_TAGS.map((v) => ({ value: `tag:${v}`, label: t(`tag.${v}`) })),
          ...MUSCLES.filter((v) => v !== 'legs').map((v) => ({ value: `muscle:${v}`, label: t(`muscle.${v}`) })),
        ],
        lang,
      ),
    [t, lang],
  );

  // Free workouts first, then the Pro ones; each group keeps its original order.
  const prebuilt = useMemo(() => {
    let list = PREBUILT_WORKOUTS;
    if (filterKey) {
      const [kind, value] = filterKey.split(':') as [Filter['kind'], string];
      list = list.filter((w) =>
        kind === 'tag'
          ? w.tags.includes(value as WorkoutTag) || (value === 'legs' && w.muscles.includes('legs'))
          : w.muscles.includes(value as Muscle),
      );
    }
    const free = list.filter((w) => FREE_PREBUILT_IDS.has(w.id));
    const pro = list.filter((w) => !FREE_PREBUILT_IDS.has(w.id));
    return [...free, ...pro];
  }, [filterKey]);

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.segment}>
        {(['mine', 'prebuilt'] as Tab[]).map((k) => (
          <Pressable
            key={k}
            onPress={() => setTab(k)}
            style={[styles.segmentItem, { backgroundColor: tab === k ? colors.primary : colors.cardAlt }]}
          >
            <Body bold style={{ color: tab === k ? colors.onPrimary : colors.text }}>
              {k === 'mine' ? t('workouts.mine') : t('workouts.prebuilt')}
            </Body>
          </Pressable>
        ))}
      </View>

      {tab === 'prebuilt' ? (
        <>
          <ChipRow allLabel={t('common.all')} options={filterOptions} value={filterKey} onChange={setFilterKey} />
          <FlatList
            data={prebuilt}
            keyExtractor={(w) => w.id}
            contentContainerStyle={{ padding: 16, gap: 10 }}
            ListEmptyComponent={<EmptyState body={t('exercises.none')} />}
            renderItem={({ item }) => {
              const locked = !isPro && !FREE_PREBUILT_IDS.has(item.id);
              return (
                <Pressable onPress={() => router.push({ pathname: '/prebuilt/[id]', params: { id: item.id } })}>
                  <Card style={styles.row}>
                    <View style={{ flex: 1 }}>
                      <Body bold style={{ fontSize: 16 }}>
                        {item.name[lang]}
                      </Body>
                      <Body muted style={{ fontSize: 13, marginTop: 2 }}>
                        {item.tags.map((x) => t(`tag.${x}`)).join(' · ')} · {t('common.exercises', { n: item.exercises.length })}
                      </Body>
                    </View>
                    {locked ? (
                      <Body bold style={{ color: colors.primary }}>
                        {t('workouts.locked')}
                      </Body>
                    ) : (
                      <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
                    )}
                  </Card>
                </Pressable>
              );
            }}
          />
        </>
      ) : (
        <FlatList
          data={templates}
          keyExtractor={(w) => String(w.id)}
          contentContainerStyle={{ padding: 16, gap: 10 }}
          ListEmptyComponent={
            <EmptyState body={t('workouts.noneSaved')}>
              <Button label={t('workouts.browsePrebuilt')} variant="secondary" onPress={() => setTab('prebuilt')} />
            </EmptyState>
          }
          renderItem={({ item }) => (
            <Pressable onPress={() => router.push({ pathname: '/template/[id]', params: { id: String(item.id) } })}>
              <Card style={styles.row}>
                <View style={{ flex: 1 }}>
                  <Body bold style={{ fontSize: 16 }}>
                    {item.name}
                  </Body>
                  <Body muted style={{ fontSize: 13, marginTop: 2 }}>
                    {t('common.exercises', { n: item.exerciseCount })}
                  </Body>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
              </Card>
            </Pressable>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  segment: { flexDirection: 'row', gap: 8, paddingHorizontal: 16, paddingTop: 12 },
  segmentItem: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
});
