import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, View } from 'react-native';
import { Body, Button, Card, EmptyState, Heading, NameDialog, useBottomInset } from '@/components/ui';
import { deleteTemplate, getTemplate, renameTemplate, type TemplateDetail } from '@/db/queries';
import { useExercises } from '@/state/exercises';
import { useSettings } from '@/state/settings';
import { useStartWorkout } from '@/state/useStartWorkout';

export default function TemplateDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const db = useSQLiteContext();
  const bottomInset = useBottomInset();
  const { t } = useSettings();
  const { byId } = useExercises();
  const startWorkout = useStartWorkout();
  const [template, setTemplate] = useState<TemplateDetail | null | undefined>(undefined);
  const [renaming, setRenaming] = useState(false);

  useEffect(() => {
    getTemplate(db, Number(id)).then(setTemplate);
  }, [db, id]);

  if (template === undefined) return null;
  if (template === null) return <EmptyState body={t('common.notFound')} />;

  function confirmDelete() {
    Alert.alert(t('workouts.deleteConfirm'), undefined, [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('common.delete'),
        style: 'destructive',
        onPress: async () => {
          await deleteTemplate(db, Number(id));
          router.back();
        },
      },
    ]);
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 24 + bottomInset }}>
      <Stack.Screen options={{ title: template.name }} />
      <View>
        <Heading>{template.name}</Heading>
      </View>
      {template.items.map((it, i) => (
        <Card key={`${it.exerciseId}-${i}`} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Body bold style={{ flex: 1 }}>
            {byId(it.exerciseId).name}
          </Body>
          <Body muted>{t('common.sets', { n: it.sets })}</Body>
        </Card>
      ))}
      <Button label={t('workouts.start')} onPress={() => startWorkout(template.name, template.items)} />
      <Button label={t('workouts.rename')} variant="secondary" onPress={() => setRenaming(true)} />
      <Button label={t('common.delete')} variant="danger" onPress={confirmDelete} />
      <NameDialog
        visible={renaming}
        title={t('workouts.rename')}
        initial={template.name}
        onCancel={() => setRenaming(false)}
        onSubmit={async (name) => {
          setRenaming(false);
          await renameTemplate(db, template.id, name);
          setTemplate({ ...template, name });
        }}
      />
    </ScrollView>
  );
}
