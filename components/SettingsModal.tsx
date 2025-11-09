'use client';

import { Settings, FontFamily, FontSize, Theme } from '@/types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: Settings;
  onSave: (settings: Settings) => void;
}

const fontFamilyOptions: { value: FontFamily; label: string; className: string }[] = [
  { value: 'serif', label: 'Serif', className: 'font-serif' },
  { value: 'sans', label: 'Sans Serif', className: 'font-sans' },
  { value: 'mono', label: 'Monospace', className: 'font-mono' },
  { value: 'system', label: 'System', className: '' },
];

const fontSizeOptions: { value: FontSize; label: string }[] = [
  { value: 'small', label: 'Small' },
  { value: 'medium', label: 'Medium' },
  { value: 'large', label: 'Large' },
  { value: 'xlarge', label: 'Extra Large' },
];

const themeOptions: { value: Theme; label: string }[] = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
];

export default function SettingsModal({ isOpen, onClose, settings, onSave }: SettingsModalProps) {
  if (!isOpen) return null;

  const isDark = settings.theme === 'dark';

  const handleFontFamilyChange = (fontFamily: FontFamily) => {
    onSave({ ...settings, fontFamily });
  };

  const handleFontSizeChange = (fontSize: FontSize) => {
    onSave({ ...settings, fontSize });
  };

  const handleThemeChange = (theme: Theme) => {
    onSave({ ...settings, theme });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`${isDark ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'} rounded-lg shadow-xl max-w-md w-full p-6`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Settings</h2>
          <button
            onClick={onClose}
            className={`${isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'} transition-colors`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Font Family */}
        <div className="mb-6">
          <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-3`}>
            Font Family
          </label>
          <div className="grid grid-cols-2 gap-2">
            {fontFamilyOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleFontFamilyChange(option.value)}
                className={`p-3 border-2 rounded-lg transition-all duration-200 ${option.className} ${
                  settings.fontFamily === option.value
                    ? isDark
                      ? 'border-purple-500 bg-purple-900/30 shadow-md'
                      : 'border-emerald-500 bg-emerald-50 shadow-md'
                    : isDark
                    ? 'border-gray-600 hover:border-gray-500 bg-gray-700'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Font Size */}
        <div className="mb-6">
          <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-3`}>
            Font Size
          </label>
          <div className="grid grid-cols-2 gap-2">
            {fontSizeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleFontSizeChange(option.value)}
                className={`p-3 border-2 rounded-lg transition-all duration-200 ${
                  settings.fontSize === option.value
                    ? isDark
                      ? 'border-purple-500 bg-purple-900/30 shadow-md'
                      : 'border-emerald-500 bg-emerald-50 shadow-md'
                    : isDark
                    ? 'border-gray-600 hover:border-gray-500 bg-gray-700'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Theme */}
        <div className="mb-6">
          <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-3`}>
            Theme
          </label>
          <div className="grid grid-cols-2 gap-2">
            {themeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleThemeChange(option.value)}
                className={`p-3 border-2 rounded-lg transition-all duration-200 ${
                  settings.theme === option.value
                    ? isDark
                      ? 'border-purple-500 bg-purple-900/30 shadow-md'
                      : 'border-emerald-500 bg-emerald-50 shadow-md'
                    : isDark
                    ? 'border-gray-600 hover:border-gray-500 bg-gray-700'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className={`px-6 py-2.5 rounded-lg transition-all duration-200 font-medium shadow-md hover:shadow-lg ${
              isDark
                ? 'bg-linear-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white'
                : 'bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white'
            }`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
