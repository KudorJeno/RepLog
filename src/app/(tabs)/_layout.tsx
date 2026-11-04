import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, StyleSheet, View, type ColorValue } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Tabs, type BottomTabBarButtonProps } from 'expo-router/js-tabs';
import { useSettings } from '@/state/settings';
import { useTheme } from '@/state/theme';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

function icon(name: IconName) {
  return ({ color, size }: { color: ColorValue; size: number }) => <Ionicons name={name} color={color} size={size} />;
}

const HIGHLIGHT_BELOW_TEXT = 4;

/**
 * Tab button with a rectangular pressed highlight, from the top of the bar to 4 px below the label.
 * The touch target is still the whole tab; only the highlight is sized to the icon + label block.
 */
function TabButton(props: BottomTabBarButtonProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [contentHeight, setContentHeight] = useState(0);
  const base = StyleSheet.flatten(props.style) ?? {};
  const padTop = typeof base.paddingTop === 'number' ? base.paddingTop : 5;

  return (
    <Pressable
      onPress={props.onPress}
      onLongPress={props.onLongPress}
      testID={props.testID}
      accessibilityRole={props.accessibilityRole}
      accessibilityState={props.accessibilityState}
      accessibilityLabel={props.accessibilityLabel}
      // The bottom spacing lives inside the button (not the tab bar) so the whole tab is tappable.
      style={[props.style, { paddingBottom: 12 + insets.bottom }]}
    >
      {({ pressed }) => (
        <>
          {pressed && contentHeight > 0 && (
            <View
              pointerEvents="none"
              style={[
                StyleSheet.absoluteFill,
                { bottom: undefined, height: padTop + contentHeight + HIGHLIGHT_BELOW_TEXT, backgroundColor: colors.border },
              ]}
            />
          )}
          <View style={{ alignItems: 'center' }} onLayout={(e) => setContentHeight(e.nativeEvent.layout.height)}>
            {props.children}
          </View>
        </>
      )}
    </Pressable>
  );
}

export default function TabsLayout() {
  const { colors } = useTheme();
  const { t } = useSettings();
  const insets = useSafeAreaInsets();
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: colors.card },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: '700' },
        // Explicit height so the labels clear the Android navigation buttons (edge-to-edge).
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          height: 56 + insets.bottom,
          paddingTop: 0,
          paddingBottom: 0,
        },
        tabBarLabelStyle: { fontSize: 11 },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        sceneStyle: { backgroundColor: colors.bg },
        tabBarButton: (props) => <TabButton {...props} />,
      }}
    >
      <Tabs.Screen name="index" options={{ title: t('tab.workout'), tabBarLabel: t('tab.workout.short'), tabBarIcon: icon('barbell') }} />
      <Tabs.Screen name="exercises" options={{ title: t('tab.exercises'), tabBarIcon: icon('list') }} />
      <Tabs.Screen name="workouts" options={{ title: t('tab.workouts'), tabBarIcon: icon('albums') }} />
      <Tabs.Screen name="history" options={{ title: t('tab.history'), tabBarIcon: icon('time') }} />
      <Tabs.Screen name="settings" options={{ title: t('tab.settings'), tabBarIcon: icon('settings') }} />
    </Tabs>
  );
}
