export type Reading = {
  id: string;
  title: string;
  content: string;
  tags?: string[]; // Optional, default empty array
  createdAt?: Date | number;
  updatedAt?: Date | number;
  isCompleted?: boolean;
  syncedAt?: number;
  deletedAt?: number | null;
};

export type FontFamily = 'serif' | 'sans' | 'mono' | 'system' | 'opendyslexic' | 'comic-sans' | 'atkinson';

export type FontSize = 'small' | 'medium' | 'large' | 'xlarge';

export type Theme = 'light' | 'dark' | 'detox' | 'high-contrast';

export type LetterSpacing = 'normal' | 'wide' | 'extra-wide';

export type LineHeightOption = 'compact' | 'normal' | 'relaxed' | 'loose';

export type WordSpacing = 'normal' | 'wide';

export type ContentWidth = 'narrow' | 'medium' | 'wide' | 'full';

export type ReadingTransition = 'none' | 'fade-theme' | 'swipe' | 'line-focus' | 'spotlight';

export type AccessibilitySettings = {
  fontFamily: FontFamily;
  letterSpacing: LetterSpacing;
  lineHeight: LineHeightOption;
  wordSpacing: WordSpacing;
  reduceMotion: boolean;
  contentWidth?: ContentWidth;
  focusMode?: boolean; // PRD-004 FR-9: Dim UI distractions during reading
  readingTransition?: ReadingTransition; // Issue #5: Reading transition effects
};

export type Settings = {
  fontSize: FontSize;
  theme: Theme;
  accessibility?: AccessibilitySettings;
  syncedAt?: number;
};

export type User = {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  createdAt?: number;
  lastSeen?: number;
};

export type SyncStatus = {
  isSignedIn: boolean;
  isSyncing: boolean;
  lastSyncAt: number | null;
  syncError: string | null;
  isOffline: boolean;
};
