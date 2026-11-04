import { router } from 'expo-router';
import { Alert } from 'react-native';
import { useSettings } from './settings';
import { useWorkout } from './workout';

/** Starts a workout from a list of exercises, refusing if one is already in progress. */
export function useStartWorkout() {
  const { t } = useSettings();
  const { workout, start } = useWorkout();
  return async (name: string, items: { exerciseId: string; sets: number }[]) => {
    if (workout) {
      Alert.alert(t('workouts.activeExists'));
      return;
    }
    await start(name, items);
    router.navigate('/');
  };
}
