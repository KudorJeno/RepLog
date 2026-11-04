import Constants, { ExecutionEnvironment } from 'expo-constants';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Platform } from 'react-native';
import { useSettings } from './settings';

const CHANNEL_ID = 'rest-timer';

// expo-notifications throws on import inside Expo Go (Android, SDK 53+), so it is loaded lazily
// and skipped there. In a development or production build it works normally; in Expo Go only
// the on-screen rest timer is available.
type NotificationsModule = typeof import('expo-notifications');
const Notifications: NotificationsModule | null = (() => {
  if (Constants.executionEnvironment === ExecutionEnvironment.StoreClient) return null;
  try {
    return require('expo-notifications') as NotificationsModule;
  } catch {
    return null;
  }
})();

Notifications?.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

interface Ctx {
  endsAt: number | null;
  total: number;
  start: () => Promise<void>;
  skip: () => Promise<void>;
}

const RestContext = createContext<Ctx | null>(null);

export function RestTimerProvider({ children }: { children: ReactNode }) {
  const { restSeconds, t } = useSettings();
  const [endsAt, setEndsAt] = useState<number | null>(null);
  const [total, setTotal] = useState(restSeconds);
  const scheduledId = useRef<string | null>(null);

  const cancelScheduled = useCallback(async () => {
    if (scheduledId.current && Notifications) {
      await Notifications.cancelScheduledNotificationAsync(scheduledId.current).catch(() => {});
      scheduledId.current = null;
    }
  }, []);

  useEffect(() => {
    if (Notifications && Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync(CHANNEL_ID, {
        name: 'Rest timer',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
      }).catch(() => {});
    }
  }, []);

  // Clear the banner once the timer runs out.
  useEffect(() => {
    if (endsAt === null) return;
    const ms = endsAt - Date.now();
    if (ms <= 0) {
      setEndsAt(null);
      return;
    }
    const id = setTimeout(() => setEndsAt(null), ms);
    return () => clearTimeout(id);
  }, [endsAt]);

  const start = useCallback(async () => {
    await cancelScheduled();
    setTotal(restSeconds);
    setEndsAt(Date.now() + restSeconds * 1000);
    if (!Notifications) return;
    try {
      let perm = await Notifications.getPermissionsAsync();
      if (perm.status !== 'granted' && perm.canAskAgain) perm = await Notifications.requestPermissionsAsync();
      if (perm.status !== 'granted') return;
      scheduledId.current = await Notifications.scheduleNotificationAsync({
        content: { title: t('workout.restOver'), body: t('workout.restOverBody') },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: restSeconds,
          channelId: CHANNEL_ID,
        },
      });
    } catch {
      // Notifications are a nice-to-have; the on-screen timer still works.
    }
  }, [cancelScheduled, restSeconds, t]);

  const skip = useCallback(async () => {
    setEndsAt(null);
    await cancelScheduled();
  }, [cancelScheduled]);

  const value = useMemo(() => ({ endsAt, total, start, skip }), [endsAt, total, start, skip]);
  return <RestContext.Provider value={value}>{children}</RestContext.Provider>;
}

export function useRestTimer(): Ctx {
  const ctx = useContext(RestContext);
  if (!ctx) throw new Error('useRestTimer must be used inside RestTimerProvider');
  return ctx;
}
