import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ExerciseBrowser } from '@/components/ExerciseBrowser';
import { Button } from '@/components/ui';
import { useSettings } from '@/state/settings';
import { useTheme } from '@/state/theme';
import { useWorkout } from '@/state/workout';

export default function PickExercisesScreen() {
  const { t } = useSettings();
  const { colors } = useTheme();
  const { addExercises } = useWorkout();
  const [selected, setSelected] = useState<string[]>([]);
  const insets = useSafeAreaInsets();

  function toggle(id: string) {
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  }

  async function confirm() {
    await addExercises(selected);
    router.back();
  }

  return (
    <View style={{ flex: 1 }}>
      <ExerciseBrowser selected={new Set(selected)} onOpen={(e) => toggle(e.id)} />
      <View
        style={[
          styles.footer,
          { backgroundColor: colors.card, borderTopColor: colors.border, paddingBottom: 12 + insets.bottom },
        ]}
      >
        <Button
          label={t('exercises.addTo')}
          disabled={selected.length === 0}
          onPress={confirm}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: { padding: 12, borderTopWidth: StyleSheet.hairlineWidth },
});
