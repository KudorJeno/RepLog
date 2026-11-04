import { useColorScheme } from 'react-native';
import { useSettings } from './settings';

export interface Colors {
  bg: string;
  card: string;
  cardAlt: string;
  border: string;
  text: string;
  textMuted: string;
  primary: string;
  onPrimary: string;
  success: string;
  danger: string;
  chip: string;
  chipActive: string;
}

const dark: Colors = {
  bg: '#0F1115',
  card: '#181B21',
  cardAlt: '#20242C',
  border: '#2A2F38',
  text: '#F2F4F7',
  textMuted: '#98A1B0',
  primary: '#4F8CFF',
  onPrimary: '#FFFFFF',
  success: '#2EC27E',
  danger: '#F2564B',
  chip: '#20242C',
  chipActive: '#4F8CFF',
};

const light: Colors = {
  bg: '#F4F6F9',
  card: '#FFFFFF',
  cardAlt: '#EEF1F6',
  border: '#DDE2EA',
  text: '#14181F',
  textMuted: '#5E6878',
  primary: '#2F6BE0',
  onPrimary: '#FFFFFF',
  success: '#1E9E62',
  danger: '#D9382D',
  chip: '#E6EAF1',
  chipActive: '#2F6BE0',
};

export function useTheme(): { colors: Colors; isDark: boolean } {
  const { theme } = useSettings();
  const system = useColorScheme();
  const isDark = theme === 'system' ? system !== 'light' : theme === 'dark';
  return { colors: isDark ? dark : light, isDark };
}
