import { useLocalStorage } from './useLocalStorage';
import { Settings } from '@/types';

const defaultSettings: Settings = {
  fontFamily: 'serif',
  fontSize: 'medium',
  theme: 'light',
};

export function useSettings() {
  const [settings, setSettings] = useLocalStorage<Settings>('settings', defaultSettings);

  return { settings, setSettings };
}
