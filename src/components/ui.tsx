import { useEffect, useState, type ReactNode } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSettings } from '@/state/settings';
import { useTheme } from '@/state/theme';

/** Space needed under scrolling content so it clears the Android navigation buttons. */
export function useBottomInset() {
  return useSafeAreaInsets().bottom;
}

export function Card({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  const { colors } = useTheme();
  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }, style]}>{children}</View>
  );
}

export function Body({ children, style, muted, bold }: { children: ReactNode; style?: StyleProp<TextStyle>; muted?: boolean; bold?: boolean }) {
  const { colors } = useTheme();
  return (
    <Text style={[{ color: muted ? colors.textMuted : colors.text, fontSize: 15 }, bold && { fontWeight: '700' }, style]}>
      {children}
    </Text>
  );
}

export function Heading({ children, style }: { children: ReactNode; style?: StyleProp<TextStyle> }) {
  const { colors } = useTheme();
  return <Text style={[{ color: colors.text, fontSize: 22, fontWeight: '800' }, style]}>{children}</Text>;
}

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function Button({ label, onPress, variant = 'primary', disabled, style }: ButtonProps) {
  const { colors } = useTheme();
  const bg =
    variant === 'primary' ? colors.primary : variant === 'danger' ? colors.danger : variant === 'secondary' ? colors.cardAlt : 'transparent';
  const fg = variant === 'primary' || variant === 'danger' ? colors.onPrimary : variant === 'ghost' ? colors.primary : colors.text;
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [styles.button, { backgroundColor: bg, opacity: disabled ? 0.4 : pressed ? 0.8 : 1 }, style]}
    >
      <Text style={{ color: fg, fontWeight: '700', fontSize: 15 }}>{label}</Text>
    </Pressable>
  );
}

export function Chip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, { backgroundColor: active ? colors.chipActive : colors.chip }]}
    >
      <Text style={{ color: active ? colors.onPrimary : colors.text, fontWeight: '600', fontSize: 13 }}>{label}</Text>
    </Pressable>
  );
}

/** Sorts filter options alphabetically by their (localized) label. */
export function sortByLabel<T extends { label: string }>(options: T[], lang: string): T[] {
  return [...options].sort((a, b) => a.label.localeCompare(b.label, lang));
}

export function ChipRow<T extends string>({
  options,
  value,
  onChange,
  allLabel,
}: {
  options: { value: T; label: string }[];
  value: T | null;
  onChange: (v: T | null) => void;
  allLabel?: string;
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.chipScroll}
      contentContainerStyle={styles.chipRow}
    >
      {allLabel !== undefined && <Chip label={allLabel} active={value === null} onPress={() => onChange(null)} />}
      {options.map((o) => (
        <Chip key={o.value} label={o.label} active={value === o.value} onPress={() => onChange(o.value)} />
      ))}
    </ScrollView>
  );
}

export function Input(props: React.ComponentProps<typeof TextInput>) {
  const { colors } = useTheme();
  return (
    <TextInput
      placeholderTextColor={colors.textMuted}
      {...props}
      style={[
        styles.input,
        { backgroundColor: colors.cardAlt, color: colors.text, borderColor: colors.border },
        props.style,
      ]}
    />
  );
}

/** Cross-platform replacement for Alert.prompt (which only exists on iOS). */
export function NameDialog({
  visible,
  title,
  initial,
  onCancel,
  onSubmit,
}: {
  visible: boolean;
  title: string;
  initial: string;
  onCancel: () => void;
  onSubmit: (name: string) => void;
}) {
  const { colors } = useTheme();
  const { t } = useSettings();
  const [text, setText] = useState(initial);
  useEffect(() => {
    if (visible) setText(initial);
  }, [visible, initial]);
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.backdrop}>
        <View style={[styles.dialog, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Heading style={{ fontSize: 18, marginBottom: 12 }}>{title}</Heading>
          <Input value={text} onChangeText={setText} autoFocus placeholder={t('common.name')} />
          <View style={styles.dialogButtons}>
            <Button label={t('common.cancel')} variant="ghost" onPress={onCancel} />
            <Button label={t('common.save')} disabled={!text.trim()} onPress={() => onSubmit(text.trim())} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

export function EmptyState({ title, body, children }: { title?: string; body: string; children?: ReactNode }) {
  return (
    <View style={styles.empty}>
      {title ? <Heading style={{ textAlign: 'center', marginBottom: 8 }}>{title}</Heading> : null}
      <Body muted style={{ textAlign: 'center', marginBottom: 16 }}>
        {body}
      </Body>
      {children}
    </View>
  );
}

export function formatDate(ms: number, lang: string) {
  return new Date(ms).toLocaleDateString(lang === 'ro' ? 'ro-RO' : 'en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatNumber(n: number) {
  return Number.isInteger(n) ? String(n) : n.toFixed(1);
}

const styles = StyleSheet.create({
  card: { borderWidth: StyleSheet.hairlineWidth, borderRadius: 14, padding: 14 },
  button: { paddingVertical: 12, paddingHorizontal: 18, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  chip: { paddingVertical: 7, paddingHorizontal: 14, borderRadius: 18 },
  // A horizontal ScrollView shrinks by default, which squashed the chips when a list sat below it.
  chipScroll: { flexGrow: 0, flexShrink: 0 },
  chipRow: { paddingHorizontal: 16, paddingVertical: 8, gap: 8 },
  input: { borderWidth: StyleSheet.hairlineWidth, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 16 },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', padding: 24 },
  dialog: { borderRadius: 16, padding: 18, borderWidth: StyleSheet.hairlineWidth },
  dialogButtons: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8, marginTop: 16 },
  empty: { alignItems: 'center', justifyContent: 'center', padding: 32 },
});
