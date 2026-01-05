export type Reading = {
  id: string;
  title: string;
  content: string;
  tags?: string[]; // Optional, default empty array
};

export type FontFamily = 'serif' | 'sans' | 'mono' | 'system';

export type FontSize = 'small' | 'medium' | 'large' | 'xlarge';

export type Theme = 'light' | 'dark';

export type Settings = {
  fontFamily: FontFamily;
  fontSize: FontSize;
  theme: Theme;
};
