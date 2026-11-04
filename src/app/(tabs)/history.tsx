import { router, useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';
import { FlatList, Pressable, View } from 'react-native';
import { Body, Card, EmptyState, formatDate, formatNumber } from '@/components/ui';
import { listHistory, type HistoryItem } from '@/db/queries';
import { useSettings } from '@/state/settings';

export default function HistoryScreen() {
  const db = useSQLiteContext();
  const { t, lang, unit, toDisplay } = useSettings();
  const [items, setItems] = useState<HistoryItem[] | null>(null);

  useFocusEffect(
    useCallback(() => {
      listHistory(db).then(setItems);
    }, [db]),
  );

  if (items === null) return null;

  return (
    <FlatList
      data={items}
      keyExtractor={(w) => String(w.id)}
      contentContainerStyle={{ padding: 16, gap: 10, flexGrow: 1 }}
      ListEmptyComponent={<EmptyState body={t('history.empty')} />}
      renderItem={({ item }) => (
        <Pressable onPress={() => router.push({ pathname: '/history/[id]', params: { id: String(item.id) } })}>
          <Card>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Body bold style={{ fontSize: 16, flex: 1 }}>
                {item.name}
              </Body>
              <Body muted>{formatDate(item.finishedAt, lang)}</Body>
            </View>
            <Body muted style={{ marginTop: 6, fontSize: 13 }}>
              {t('common.exercises', { n: item.exerciseCount })} · {t('common.sets', { n: item.setCount })} ·{' '}
              {formatNumber(Math.round(toDisplay(item.volumeKg)))} {unit}
            </Body>
          </Card>
        </Pressable>
      )}
    />
  );
}
