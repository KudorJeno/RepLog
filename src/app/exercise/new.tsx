import { router } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useState } from 'react';
import { Alert, ScrollView, View } from 'react-native';
import { Body, Button, ChipRow, Input, useBottomInset } from '@/components/ui';
import { EQUIPMENT, MUSCLES, type Equipment, type Muscle } from '@/data/types';
import { createCustomExercise } from '@/db/queries';
import { useExercises } from '@/state/exercises';
import { useSettings } from '@/state/settings';

export default function NewExerciseScreen() {
  const db = useSQLiteContext();
  const bottomInset = useBottomInset();
  const { t } = useSettings();
  const { reload } = useExercises();
  const [name, setName] = useState('');
  const [muscle, setMuscle] = useState<Muscle>('chest');
  const [equipment, setEquipment] = useState<Equipment>('barbell');
  const [howto, setHowto] = useState('');

  async function save() {
    if (!name.trim()) {
      Alert.alert(t('exercises.nameRequired'));
      return;
    }
    await createCustomExercise(db, { name: name.trim(), muscle, equipment, howto: howto.trim() });
    await reload();
    router.back();
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 8, paddingBottom: 24 + bottomInset }} keyboardShouldPersistTaps="handled">
      <Body muted>{t('common.name')}</Body>
      <Input value={name} onChangeText={setName} autoFocus />
      <Body muted style={{ marginTop: 12 }}>
        {t('exercises.muscle')}
      </Body>
      <View style={{ marginHorizontal: -16 }}>
        <ChipRow
          options={MUSCLES.map((m) => ({ value: m, label: t(`muscle.${m}`) }))}
          value={muscle}
          onChange={(v) => v && setMuscle(v)}
        />
      </View>
      <Body muted style={{ marginTop: 4 }}>
        {t('exercises.equipment')}
      </Body>
      <View style={{ marginHorizontal: -16 }}>
        <ChipRow
          options={EQUIPMENT.map((e) => ({ value: e, label: t(`equip.${e}`) }))}
          value={equipment}
          onChange={(v) => v && setEquipment(v)}
        />
      </View>
      <Body muted style={{ marginTop: 4 }}>
        {t('exercises.howtoOptional')}
      </Body>
      <Input value={howto} onChangeText={setHowto} multiline style={{ minHeight: 100, textAlignVertical: 'top' }} />
      <Button label={t('common.save')} onPress={save} style={{ marginTop: 16 }} />
    </ScrollView>
  );
}
