import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { MUSCLES, type Exercise, type Muscle } from '@/data/types';
import { useExercises } from '@/state/exercises';
import { useSettings } from '@/state/settings';
import { useTheme } from '@/state/theme';
import { Body, ChipRow, EmptyState, Input, sortByLabel } from './ui';

interface Props {
  onOpen: (e: Exercise) => void;
  /** When set, rows show a check mark for selected ids. */
  selected?: ReadonlySet<string>;
}

export function ExerciseBrowser({ onOpen, selected }: Props) {
  const { all } = useExercises();
  const { t, lang } = useSettings();
  const { colors } = useTheme();
  const [query, setQuery] = useState('');
  const [muscle, setMuscle] = useState<Muscle | null>(null);

  const data = useMemo(() => {
    const q = query.trim().toLowerCase();
    return all.filter((e) => (!muscle || e.muscle === muscle) && (!q || e.name.toLowerCase().includes(q)));
  }, [all, query, muscle]);

  return (
    <View style={{ flex: 1 }}>
      <View style={{ paddingHorizontal: 16, paddingTop: 12 }}>
        <Input value={query} onChangeText={setQuery} placeholder={t('exercises.search')} autoCorrect={false} />
      </View>
      <ChipRow
        allLabel={t('common.all')}
        value={muscle}
        onChange={setMuscle}
        options={sortByLabel(
          MUSCLES.map((m) => ({ value: m, label: t(`muscle.${m}`) })),
          lang,
        )}
      />
      <FlatList
        data={data}
        keyExtractor={(e) => e.id}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 24 }}
        ListEmptyComponent={<EmptyState body={t('exercises.none')} />}
        renderItem={({ item }) => {
          const isSelected = selected?.has(item.id);
          return (
            <Pressable
              onPress={() => onOpen(item)}
              style={[styles.row, { borderBottomColor: colors.border }]}
              android_ripple={{ color: colors.cardAlt }}
            >
              <View style={{ flex: 1 }}>
                <Body bold>{item.name}</Body>
                <Body muted style={{ fontSize: 13, marginTop: 2 }}>
                  {t(`muscle.${item.muscle}`)} · {t(`equip.${item.equipment}`)}
                  {item.custom ? ` · ${t('exercises.customBadge')}` : ''}
                </Body>
              </View>
              {selected ? (
                <Ionicons
                  name={isSelected ? 'checkmark-circle' : 'ellipse-outline'}
                  size={26}
                  color={isSelected ? colors.primary : colors.textMuted}
                />
              ) : (
                <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
              )}
            </Pressable>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
