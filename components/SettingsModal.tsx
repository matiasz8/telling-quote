'use client';

import { useState, useRef, useEffect } from 'react';
import { Settings, FontFamily, FontSize, Theme, AccessibilitySettings, LetterSpacing, LineHeightOption, WordSpacing } from '@/types';
import { FONT_FAMILY_OPTIONS, FONT_SIZE_OPTIONS, THEME_OPTIONS } from '@/lib/constants';
import { theme as themeConfig } from '@/config/theme';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { resetTutorial, startSettingsTutorial } from '@/lib/tutorial';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: Settings;
  onSave: (settings: Settings) => void;
}

export default function SettingsModal({ isOpen, onClose, settings, onSave }: SettingsModalProps) {
  const [isGeneralOpen, setIsGeneralOpen] = useState(true);
  const [isAccessibilityOpen, setIsAccessibilityOpen] = useState(true);
  const modalRef = useRef<HTMLDivElement>(null);

  // Focus trap
  useFocusTrap(modalRef, isOpen);

  // Escape key handler
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

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
    fontFamily: 'serif' as FontFamily,
    letterSpacing: 'normal',
    lineHeight: 'normal',
    wordSpacing: 'normal',
    reduceMotion: false,
    contentWidth: 'medium',
  };

  const handleFontFamilyChange = (fontFamily: FontFamily) => {
    onSave({
      ...settings,
      accessibility: {
        ...accessibility,
        fontFamily,
      },
    });
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

        {/* Preview Text */}
        <div data-preview className={`sticky top-0 z-10 mb-6 p-4 rounded-lg border-2 ${getBgClass()} ${getAccentClass()}`}>
          <div className={`text-xs font-medium mb-2 ${getTextClass()}`}>Vista Previa</div>
          <div
            style={{
              fontFamily: themeConfig.fontFamilies[accessibility.fontFamily].family,
              fontSize: settings.fontSize === 'small' ? '14px' : settings.fontSize === 'medium' ? '16px' : settings.fontSize === 'large' ? '18px' : '20px',
              letterSpacing: themeConfig.letterSpacing[accessibility.letterSpacing].value,
              lineHeight: themeConfig.lineHeight[accessibility.lineHeight].value,
              wordSpacing: themeConfig.wordSpacing[accessibility.wordSpacing].value,
              maxWidth: accessibility.contentWidth === 'narrow' ? '45ch' : accessibility.contentWidth === 'wide' ? '80ch' : accessibility.contentWidth === 'full' ? 'none' : '65ch',
              transition: accessibility.reduceMotion ? 'none' : 'all 0.3s ease',
            }}
          >
            <p>
              The quick brown fox jumps over the lazy dog. Reading should be comfortable and accessible for everyone.
            </p>
          </div>
          <div className={`text-xs mt-3 ${getTextClass()} opacity-60 space-y-1`}>
            <div>{accessibility.reduceMotion && '🔇 Reduce Motion: ON'}</div>
            <div>Max line width: {accessibility.contentWidth === 'narrow' ? '45 chars (easier to read)' : accessibility.contentWidth === 'wide' ? '80 chars (more content)' : accessibility.contentWidth === 'full' ? 'unlimited (full width)' : '65 chars (default)'}</div>
          </div>
        </div>

        {/* General Settings Section */}
        <div className="mb-6">
          <button
            onClick={() => setIsGeneralOpen(!isGeneralOpen)}
            className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
              isGeneralOpen
                ? getHeaderBgClass()
                : getHoverClass()
            }`}
            aria-expanded={isGeneralOpen}
            aria-label="General settings section"
          >
            <span className="font-semibold">Ajustes Generales</span>
            <svg className={`w-5 h-5 transition-transform ${isGeneralOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>

          {isGeneralOpen && (
            <div className="mt-4 space-y-6">
              {/* Font Family */}
              <div data-tour="settings-font-family">
                <label className={`block text-sm font-medium ${getTextClass()} mb-3`}>
                  Familia de Fuente
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {FONT_FAMILY_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleFontFamilyChange(option.value)}
                      aria-label={`Select ${option.label} font`}
                      className={`p-3 border-2 rounded-lg transition-all duration-200 ${option.className} ${
                        accessibility.fontFamily === option.value
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
              <div data-tour="settings-font-size">
                <label className={`block text-sm font-medium ${getTextClass()} mb-3`}>
                  Tamaño de Letra
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
              <div data-tour="settings-theme">
                <label className={`block text-sm font-medium ${getTextClass()} mb-3`}>
                  Tema
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
            onClick={() => setIsAccessibilityOpen(!isAccessibilityOpen)}
            className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
              isAccessibilityOpen
                ? getHeaderBgClass()
                : getHoverClass()
            }`}
            aria-expanded={isAccessibilityOpen}
            aria-label="Accessibility settings section"
          >
            <span className="font-semibold">Accesibilidad</span>
            <svg className={`w-5 h-5 transition-transform ${isAccessibilityOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>

          {isAccessibilityOpen && (
            <div className="mt-4 space-y-6" data-tour="settings-accessibility-section">
              {/* Letter Spacing */}
              <div data-tour="settings-letter-spacing">
                <label className={`block text-sm font-medium ${getTextClass()} mb-3`}>
                  Espaciado entre Letras
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(themeConfig.letterSpacing).map(([key, option]) => (
                    <button
                      key={key}
                      onClick={() => handleAccessibilityChange('letterSpacing', key as LetterSpacing)}
                      aria-label={`Select ${option.label} letter spacing`}
                      className={`p-3 border-2 rounded-lg transition-all duration-200 ${
                        accessibility.letterSpacing === key
                          ? getActiveAccentClass()
                          : getAccentClass()
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Line Height */}
              <div data-tour="settings-line-height">
                <label className={`block text-sm font-medium ${getTextClass()} mb-3`}>
                  Altura de Línea
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(themeConfig.lineHeight).map(([key, option]) => (
                    <button
                      key={key}
                      onClick={() => handleAccessibilityChange('lineHeight', key as LineHeightOption)}
                      aria-label={`Select ${option.label} line height`}
                      className={`p-3 border-2 rounded-lg transition-all duration-200 ${
                        accessibility.lineHeight === key
                          ? getActiveAccentClass()
                          : getAccentClass()
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Word Spacing */}
              <div data-tour="settings-word-spacing">
                <label className={`block text-sm font-medium ${getTextClass()} mb-3`}>
                  Espaciado entre Palabras
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(themeConfig.wordSpacing).map(([key, option]) => (
                    <button
                      key={key}
                      onClick={() => handleAccessibilityChange('wordSpacing', key as WordSpacing)}
                      aria-label={`Select ${option.label} word spacing`}
                      className={`p-3 border-2 rounded-lg transition-all duration-200 ${
                        accessibility.wordSpacing === key
                          ? getActiveAccentClass()
                          : getAccentClass()
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reduce Motion Toggle */}
              <div data-tour="settings-reduce-motion">
                <label className={`block text-sm font-medium ${getTextClass()} mb-3`}>
                  Reducir Movimiento y Animaciones
                </label>
                <button
                  onClick={() => handleAccessibilityChange('reduceMotion', !accessibility.reduceMotion)}
                  className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    accessibility.reduceMotion
                      ? isHighContrast
                        ? 'bg-white'
                        : isDetox
                        ? 'bg-gray-900'
                        : isDark
                        ? 'bg-purple-600'
                        : 'bg-lime-500'
                      : isHighContrast
                      ? 'bg-gray-700'
                      : 'bg-gray-300'
                  }`}
                  role="switch"
                  aria-checked={accessibility.reduceMotion}
                  aria-label="Toggle reduce motion and animations"
                >
                  <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                      accessibility.reduceMotion ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
                <p className={`text-xs mt-2 ${getTextClass()} opacity-75`}>
                  {accessibility.reduceMotion ? 'Animations disabled' : 'Animations enabled'}
                </p>
              </div>

              {/* Focus Mode Toggle */}
              <div data-tour="settings-focus-mode">
                <label className={`block text-sm font-medium ${getTextClass()} mb-3`}>
                  Modo Enfoque
                </label>
                <button
                  onClick={() => handleAccessibilityChange('focusMode', !accessibility.focusMode)}
                  className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    accessibility.focusMode
                      ? isHighContrast
                        ? 'bg-white'
                        : isDetox
                        ? 'bg-gray-900'
                        : isDark
                        ? 'bg-purple-600'
                        : 'bg-lime-500'
                      : isHighContrast
                      ? 'bg-gray-700'
                      : 'bg-gray-300'
                  }`}
                  role="switch"
                  aria-checked={accessibility.focusMode || false}
                  aria-label="Toggle focus mode to dim UI distractions"
                >
                  <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                      accessibility.focusMode ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
                <p className={`text-xs mt-2 ${getTextClass()} opacity-75`}>
                  {accessibility.focusMode ? 'Interfaz atenuada durante lectura' : 'Visibilidad normal de la interfaz'}
                </p>
                
                {/* Visual Preview */}
                <div data-preview className={`p-4 rounded-lg border ${getAccentClass()}`}>
                  <p className={`text-xs font-medium mb-2 ${getTextClass()}`}>Vista Previa:</p>
                  <div className="flex items-center gap-3">
                    {/* Simulated UI elements */}
                    <div className={`flex-1 space-y-2 transition-opacity duration-300 ${accessibility.focusMode ? 'opacity-40' : 'opacity-100'}`}>
                      <div className={`h-2 rounded ${isHighContrast ? 'bg-white' : isDetox ? 'bg-gray-300' : isDark ? 'bg-gray-600' : 'bg-gray-300'}`} style={{ width: '60%' }} aria-hidden="true"></div>
                      <div className={`h-2 rounded ${isHighContrast ? 'bg-white' : isDetox ? 'bg-gray-300' : isDark ? 'bg-gray-600' : 'bg-gray-300'}`} style={{ width: '40%' }} aria-hidden="true"></div>
                      <p className="text-xs opacity-75">Header/UI</p>
                    </div>
                    <div className={`flex-1 space-y-2 transition-opacity duration-300 ${accessibility.focusMode ? 'opacity-100' : 'opacity-100'}`}>
                      <div className={`h-2 rounded ${isHighContrast ? 'bg-white' : isDetox ? 'bg-gray-700' : isDark ? 'bg-purple-500' : 'bg-emerald-500'}`} style={{ width: '80%' }} aria-hidden="true"></div>
                      <div className={`h-2 rounded ${isHighContrast ? 'bg-white' : isDetox ? 'bg-gray-700' : isDark ? 'bg-purple-500' : 'bg-emerald-500'}`} style={{ width: '90%' }} aria-hidden="true"></div>
                      <p className="text-xs opacity-75">Content</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content Width */}
              <div data-tour="settings-content-width">
                <label className={`block text-sm font-medium ${getTextClass()} mb-3`}>
                  Ancho del Contenido (en Lector)
                </label>
                <div className="grid grid-cols-1 gap-2">
                  <button
                    onClick={() => handleAccessibilityChange('contentWidth', 'narrow')}
                    aria-label="Select narrow content width (45 characters)"
                    className={`p-3 border-2 rounded-lg transition-all duration-200 text-left ${
                      accessibility.contentWidth === 'narrow'
                        ? getActiveAccentClass()
                        : getAccentClass()
                    }`}
                  >
                    <div className="font-medium">Angosto</div>
                    <div className="text-xs opacity-75">45 caracteres - Más fácil de leer</div>
                  </button>
                  <button
                    onClick={() => handleAccessibilityChange('contentWidth', 'medium')}
                    aria-label="Select medium content width (65 characters)"
                    className={`p-3 border-2 rounded-lg transition-all duration-200 text-left ${
                      accessibility.contentWidth === 'medium' || !accessibility.contentWidth
                        ? getActiveAccentClass()
                        : getAccentClass()
                    }`}
                  >
                    <div className="font-medium">Mediano</div>
                    <div className="text-xs opacity-75">65 caracteres - Predeterminado</div>
                  </button>
                  <button
                    onClick={() => handleAccessibilityChange('contentWidth', 'wide')}
                    aria-label="Select wide content width (80 characters)"
                    className={`p-3 border-2 rounded-lg transition-all duration-200 text-left ${
                      accessibility.contentWidth === 'wide'
                        ? getActiveAccentClass()
                        : getAccentClass()
                    }`}
                  >
                    <div className="font-medium">Ancho</div>
                    <div className="text-xs opacity-75">80 caracteres - Más contenido visible</div>
                  </button>
                  <button
                    onClick={() => handleAccessibilityChange('contentWidth', 'full')}
                    aria-label="Select full content width (unlimited)"
                    className={`p-3 border-2 rounded-lg transition-all duration-200 text-left ${
                      accessibility.contentWidth === 'full'
                        ? getActiveAccentClass()
                        : getAccentClass()
                    }`}
                  >
                    <div className="font-medium">Ancho Completo</div>
                    <div className="text-xs opacity-75">Ilimitado - Usa toda la pantalla</div>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className={`flex justify-between items-center gap-4 pt-4 border-t ${
          isHighContrast ? 'border-white' : isDetox ? 'border-gray-300' : 'border-gray-300 dark:border-gray-700'
        }`}>
          <button
            onClick={() => {
              startSettingsTutorial();
            }}
            data-tour="settings-tutorial-button"
            className={`px-4 py-2.5 rounded-lg transition-all duration-200 font-medium shadow-sm hover:shadow-md flex items-center gap-2 ${
              isHighContrast
                ? 'bg-black text-white border-2 border-white hover:bg-gray-900'
                : isDetox
                ? 'bg-white text-gray-900 border-2 border-gray-300 hover:bg-gray-50'
                : isDark
                ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Tutorial de Ajustes
          </button>
          <button
            onClick={() => {
              resetTutorial();
              onClose();
            }}
            className={`px-4 py-2.5 rounded-lg transition-all duration-200 font-medium shadow-sm hover:shadow-md flex items-center gap-2 ${
              isHighContrast
                ? 'bg-black text-white border-2 border-white hover:bg-gray-900'
                : isDetox
                ? 'bg-white text-gray-900 border-2 border-gray-300 hover:bg-gray-50'
                : isDark
                ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Tutorial Principal
          </button>
          <button
            onClick={onClose}
            aria-label="Close settings modal"
            className={`px-6 py-2.5 rounded-lg transition-all duration-200 font-medium shadow-md hover:shadow-lg ${
              isHighContrast
                ? 'bg-white text-black hover:bg-gray-200'
                : isDetox
                ? 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                : isDark
                ? 'bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white'
                : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white'
            }`}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
