'use client';

import { useState } from 'react';
import { Settings, FontFamily, FontSize, Theme, AccessibilitySettings, LetterSpacing, LineHeightOption, WordSpacing } from '@/types';
import { FONT_FAMILY_OPTIONS, FONT_SIZE_OPTIONS, THEME_OPTIONS } from '@/lib/constants';
import { theme as themeConfig } from '@/config/theme';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: Settings;
  onSave: (settings: Settings) => void;
}

export default function SettingsModal({ isOpen, onClose, settings, onSave }: SettingsModalProps) {
  const [expandedSection, setExpandedSection] = useState<'general' | 'accessibility'>('general');

  if (!isOpen) return null;

  const isDark = settings.theme === 'dark';
  const isDetox = settings.theme === 'detox';
  const isHighContrast = settings.theme === 'high-contrast';
  
  const getBgClass = () => {
    if (isHighContrast) return 'bg-black text-white border-2 border-white';
    if (isDetox) return 'bg-white text-gray-900 border border-gray-200';
    return isDark ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900';
  };
  
  const getTextClass = () => {
    if (isHighContrast) return 'text-gray-300';
    if (isDetox) return 'text-gray-700';
    return isDark ? 'text-gray-300' : 'text-gray-700';
  };
  
  const getAccentClass = () => {
    if (isHighContrast) return 'border-white bg-black';
    if (isDetox) return 'border-gray-200 bg-gray-50';
    return isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50';
  };
  
  const getActiveAccentClass = () => {
    if (isHighContrast) return 'border-white bg-white text-black';
    if (isDetox) return 'border-gray-300 bg-gray-100';
    return isDark ? 'border-purple-500 bg-purple-900/30' : 'border-emerald-500 bg-emerald-50';
  };
  
  const getHoverClass = () => {
    if (isHighContrast) return 'hover:bg-white hover:text-black';
    if (isDetox) return 'hover:bg-gray-50';
    return isDark ? 'hover:bg-gray-700 hover:text-gray-200' : 'hover:bg-gray-50 hover:text-gray-900';
  };
  
  const getHeaderBgClass = () => {
    if (isHighContrast) return 'bg-black text-white';
    if (isDetox) return 'bg-gray-50 text-gray-900';
    return isDark ? 'bg-purple-900/30 text-purple-300' : 'bg-emerald-50 text-emerald-700';
  };
  const accessibility = settings.accessibility || {
    fontFamily: settings.fontFamily,
    letterSpacing: 'normal',
    lineHeight: 'normal',
    wordSpacing: 'normal',
    highContrast: false,
    reduceMotion: false,
    contentWidth: 'medium',
    focusMode: false,
  };

  const handleFontFamilyChange = (fontFamily: FontFamily) => {
    onSave({ ...settings, fontFamily });
  };

  const handleFontSizeChange = (fontSize: FontSize) => {
    onSave({ ...settings, fontSize });
  };

  const handleThemeChange = (theme: Theme) => {
    onSave({ ...settings, theme });
  };

  const handleAccessibilityChange = <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => {
    onSave({
      ...settings,
      accessibility: {
        ...accessibility,
        [key]: value,
      },
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        className={`${getBgClass()} rounded-lg shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 id="settings-title" className="text-2xl font-bold">Settings</h2>
          <button
            onClick={onClose}
            aria-label="Close settings"
            className={`${isHighContrast ? 'text-white hover:text-black' : isDetox ? 'text-gray-400 hover:text-gray-600' : isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'} transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 rounded`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* General Settings Section */}
        <div className="mb-6">
          <button
            onClick={() => setExpandedSection('general')}
            className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
              expandedSection === 'general'
                ? getHeaderBgClass()
                : getHoverClass()
            }`}
            aria-expanded={expandedSection === 'general'}
            aria-label="General settings section"
          >
            <span className="font-semibold">General Settings</span>
            <svg className={`w-5 h-5 transition-transform ${expandedSection === 'general' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>

          {expandedSection === 'general' && (
            <div className="mt-4 space-y-6">
              {/* Font Family */}
              <div>
                <label className={`block text-sm font-medium ${getTextClass()} mb-3`}>
                  Font Family
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {FONT_FAMILY_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleFontFamilyChange(option.value)}
                      aria-label={`Select ${option.label} font`}
                      className={`p-3 border-2 rounded-lg transition-all duration-200 ${option.className} ${
                        settings.fontFamily === option.value
                          ? getActiveAccentClass()
                          : getAccentClass()
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Font Size */}
              <div>
                <label className={`block text-sm font-medium ${getTextClass()} mb-3`}>
                  Font Size
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {FONT_SIZE_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleFontSizeChange(option.value)}
                      aria-label={`Select ${option.label} font size`}
                      className={`p-3 border-2 rounded-lg transition-all duration-200 ${
                        settings.fontSize === option.value
                          ? getActiveAccentClass()
                          : getAccentClass()
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Theme */}
              <div>
                <label className={`block text-sm font-medium ${getTextClass()} mb-3`}>
                  Theme
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {THEME_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleThemeChange(option.value)}
                      aria-label={`Select ${option.label} theme`}
                      className={`p-3 border-2 rounded-lg transition-all duration-200 ${
                        settings.theme === option.value
                          ? getActiveAccentClass()
                          : getAccentClass()
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Accessibility Settings Section */}
        <div className="mb-6 border-t border-gray-300 dark:border-gray-700 pt-4">
          <button
            onClick={() => setExpandedSection(expandedSection === 'accessibility' ? '' : 'accessibility')}
            className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
              expandedSection === 'accessibility'
                ? getHeaderBgClass()
                : getHoverClass()
            }`}
            aria-expanded={expandedSection === 'accessibility'}
            aria-label="Accessibility settings section"
          >
            <span className="font-semibold">Accessibility</span>
            <svg className={`w-5 h-5 transition-transform ${expandedSection === 'accessibility' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>

          {expandedSection === 'accessibility' && (
            <div className="mt-4 space-y-6">
              {/* Dyslexia-friendly Font */}
              <div>
                <label className={`block text-sm font-medium ${getTextClass()} mb-2`}>
                  Dyslexia-Friendly Font
                </label>
                <select
                  value={accessibility.fontFamily}
                  onChange={(e) => handleAccessibilityChange('fontFamily', e.target.value as FontFamily)}
                  aria-label="Select dyslexia-friendly font"
                  className={`w-full p-2 rounded-lg border-2 transition-all ${
                    isHighContrast
                      ? 'bg-black border-white text-white'
                      : isDetox
                      ? 'bg-white border-gray-300 text-gray-900'
                      : isDark
                      ? 'bg-gray-700 border-gray-600 text-gray-100'
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                >
                  {Object.entries(themeConfig.fontFamilies).map(([key, font]) => (
                    <option key={key} value={key}>
                      {font.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Letter Spacing */}
              <div>
                <label id="letter-spacing-label" className={`block text-sm font-medium ${getTextClass()} mb-3`}>
                  Letter Spacing
                </label>
                <div role="radiogroup" aria-labelledby="letter-spacing-label" className="space-y-2">
                  {Object.entries(themeConfig.letterSpacing).map(([key, option]) => (
                    <label key={key} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="letterSpacing"
                        value={key}
                        checked={accessibility.letterSpacing === key}
                        onChange={() => handleAccessibilityChange('letterSpacing', key as LetterSpacing)}
                        className="w-4 h-4 cursor-pointer"
                      />
                      <span className="text-sm">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Line Height */}
              <div>
                <label id="line-height-label" className={`block text-sm font-medium ${getTextClass()} mb-3`}>
                  Line Height
                </label>
                <div role="radiogroup" aria-labelledby="line-height-label" className="space-y-2">
                  {Object.entries(themeConfig.lineHeight).map(([key, option]) => (
                    <label key={key} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="lineHeight"
                        value={key}
                        checked={accessibility.lineHeight === key}
                        onChange={() => handleAccessibilityChange('lineHeight', key as LineHeightOption)}
                        className="w-4 h-4 cursor-pointer"
                      />
                      <span className="text-sm">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Word Spacing */}
              <div>
                <label id="word-spacing-label" className={`block text-sm font-medium ${getTextClass()} mb-3`}>
                  Word Spacing
                </label>
                <div role="radiogroup" aria-labelledby="word-spacing-label" className="space-y-2">
                  {Object.entries(themeConfig.wordSpacing).map(([key, option]) => (
                    <label key={key} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="wordSpacing"
                        value={key}
                        checked={accessibility.wordSpacing === key}
                        onChange={() => handleAccessibilityChange('wordSpacing', key as WordSpacing)}
                        className="w-4 h-4 cursor-pointer"
                      />
                      <span className="text-sm">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* High Contrast Toggle */}
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={accessibility.highContrast}
                  onChange={(e) => handleAccessibilityChange('highContrast', e.target.checked)}
                  aria-label="Enable high contrast mode (21:1 ratio)"
                  className="w-4 h-4 cursor-pointer"
                />
                <span className="text-sm">High Contrast Mode (21:1 ratio)</span>
              </label>

              {/* Reduce Motion Toggle */}
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={accessibility.reduceMotion}
                  onChange={(e) => handleAccessibilityChange('reduceMotion', e.target.checked)}
                  aria-label="Reduce motion and animations"
                  className="w-4 h-4 cursor-pointer"
                />
                <span className="text-sm">Reduce Motion & Animations</span>
              </label>

              {/* Content Width */}
              <div>
                <label className={`block text-sm font-medium ${getTextClass()} mb-3`}>
                  Content Width
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="contentWidth"
                      value="narrow"
                      checked={accessibility.contentWidth === 'narrow'}
                      onChange={() => handleAccessibilityChange('contentWidth', 'narrow')}
                      aria-label="Content width: Narrow (45 characters)"
                      className="w-4 h-4 cursor-pointer"
                    />
                    <span className="text-sm">Narrow (45 chars) - Better for reading</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="contentWidth"
                      value="medium"
                      checked={accessibility.contentWidth === 'medium' || !accessibility.contentWidth}
                      onChange={() => handleAccessibilityChange('contentWidth', 'medium')}
                      aria-label="Content width: Medium (65 characters)"
                      className="w-4 h-4 cursor-pointer"
                    />
                    <span className="text-sm">Medium (65 chars) - Default</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="contentWidth"
                      value="wide"
                      checked={accessibility.contentWidth === 'wide'}
                      onChange={() => handleAccessibilityChange('contentWidth', 'wide')}
                      aria-label="Content width: Wide (80 characters)"
                      className="w-4 h-4 cursor-pointer"
                    />
                    <span className="text-sm">Wide (80 chars) - More content visible</span>
                  </label>
                </div>
              </div>

              {/* Focus Mode Toggle */}
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={accessibility.focusMode}
                  onChange={(e) => handleAccessibilityChange('focusMode', e.target.checked)}
                  aria-label="Enable focus mode to dim UI except current content"
                  className="w-4 h-4 cursor-pointer"
                />
                <span className="text-sm">Focus Mode - Dim UI, focus on content</span>
              </label>
            </div>
          )}
        </div>

        <div className={`flex justify-end pt-4 border-t ${
          isHighContrast ? 'border-white' : isDetox ? 'border-gray-300' : 'border-gray-300 dark:border-gray-700'
        }`}>
          <button
            onClick={onClose}
            aria-label="Close settings modal"
            className={`px-6 py-2.5 rounded-lg transition-all duration-200 font-medium shadow-md hover:shadow-lg ${
              isHighContrast
                ? 'bg-white text-black hover:bg-gray-200'
                : isDetox
                ? 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                : isDark
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
