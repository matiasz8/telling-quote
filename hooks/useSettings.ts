import { useLocalStorage } from './useLocalStorage';
import { Settings } from '@/types';
import { DEFAULT_SETTINGS, STORAGE_KEYS } from '@/lib/constants';

export function useSettings() {
  const [settings, setSettings] = useLocalStorage<Settings>(
    STORAGE_KEYS.SETTINGS,
    DEFAULT_SETTINGS
  );

  return { settings, setSettings };
}
