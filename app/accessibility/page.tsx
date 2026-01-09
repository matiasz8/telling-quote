'use client';

import Link from 'next/link';
import { useSettings } from '@/hooks/useSettings';
import { useApplyAccessibilitySettings } from '@/hooks/useApplyAccessibilitySettings';
import { getThemeClasses, getFontFamilyClass, getFontSizeClasses } from '@/lib/utils';

export default function AccessibilityStatement() {
  const { settings } = useSettings();
  useApplyAccessibilitySettings(settings);

  const themeClasses = getThemeClasses(settings.theme);
  const fontFamilyClass = getFontFamilyClass(settings.accessibility?.fontFamily || 'serif');
  const fontSizeClasses = getFontSizeClasses(settings.fontSize);
  const isDark = settings.theme === 'dark';

  return (
    <div className={`min-h-screen ${themeClasses.bg} ${fontFamilyClass}`}>
      {/* Skip link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:bg-black focus:text-white focus:p-4 focus:rounded-b"
      >
        Skip to main content
      </a>

      {/* Header */}
      <header className={`${themeClasses.cardBg} border-b ${themeClasses.border} shadow-sm`}>
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className={`text-lg font-bold ${themeClasses.text} hover:${isDark ? 'text-purple-300' : 'text-emerald-700'}`}>
            ← Back to Dashboard
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main id="main-content" className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className={`${fontSizeClasses.title} font-bold ${themeClasses.text} mb-4`}>
            Accessibility Statement
          </h1>
          <p className={`${fontSizeClasses.subtitle} ${themeClasses.textSecondary} mb-8`}>
            Last updated: January 2026
          </p>

          {/* Commitment Section */}
          <section className={`mb-12 p-6 rounded-lg ${themeClasses.cardBg} border ${themeClasses.border}`}>
            <h2 className={`${fontSizeClasses.subtitle} font-semibold ${themeClasses.text} mb-4`}>
              Commitment to Accessibility
            </h2>
            <p className={`${themeClasses.textSecondary} mb-4 leading-relaxed`}>
              Telling is committed to being accessible and usable to everyone, including people with disabilities. We actively work to increase the accessibility and usability of our application.
            </p>
            <p className={`${themeClasses.textSecondary} leading-relaxed`}>
              This application aims to meet or exceed WCAG 2.1 Level AA accessibility standards.
            </p>
          </section>

          {/* WCAG Compliance Section */}
          <section className={`mb-12 p-6 rounded-lg ${themeClasses.cardBg} border ${themeClasses.border}`}>
            <h2 className={`${fontSizeClasses.subtitle} font-semibold ${themeClasses.text} mb-4`}>
              WCAG 2.1 Level AA Compliance
            </h2>
            <p className={`${themeClasses.textSecondary} mb-6 leading-relaxed`}>
              Our application is designed to be compliant with the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA:
            </p>
            <ul className={`${themeClasses.textSecondary} space-y-3 ml-6 mb-6`}>
              <li className="flex gap-3">
                <span className="flex-shrink-0 mt-1">✓</span>
                <span><strong>Perceivable:</strong> Content is presented in ways that can be perceived by all users</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 mt-1">✓</span>
                <span><strong>Operable:</strong> The application can be navigated using keyboard and various input methods</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 mt-1">✓</span>
                <span><strong>Understandable:</strong> Content is written clearly and the interface is predictable</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 mt-1">✓</span>
                <span><strong>Robust:</strong> The application works with a wide variety of assistive technologies</span>
              </li>
            </ul>
          </section>

          {/* Accessibility Features Section */}
          <section className={`mb-12 p-6 rounded-lg ${themeClasses.cardBg} border ${themeClasses.border}`}>
            <h2 className={`${fontSizeClasses.subtitle} font-semibold ${themeClasses.text} mb-6`}>
              Accessibility Features
            </h2>

            <div className="space-y-8">
              {/* Visual Features */}
              <div>
                <h3 className={`${fontSizeClasses.subtitle} font-medium ${themeClasses.text} mb-4`}>
                  🎨 Visual Accessibility
                </h3>
                <ul className={`${themeClasses.textSecondary} space-y-2 ml-6`}>
                  <li><strong>Four Theme Options:</strong> Light, Dark, Detox (minimal), and High Contrast (21:1 ratio)</li>
                  <li><strong>Dyslexia-Friendly Fonts:</strong> OpenDyslexic, Comic Sans, Atkinson Hyperlegible</li>
                  <li><strong>Text Spacing Controls:</strong> Adjustable letter, line, and word spacing</li>
                  <li><strong>Font Size Control:</strong> Four adjustable font size options</li>
                  <li><strong>Color-Blind Support:</strong> Visual patterns that work for all types of color blindness</li>
                  <li><strong>Content Width Options:</strong> Choose narrow, medium, or wide reading width</li>
                </ul>
              </div>

              {/* Screen Reader Features */}
              <div>
                <h3 className={`${fontSizeClasses.subtitle} font-medium ${themeClasses.text} mb-4`}>
                  🔊 Screen Reader Optimization
                </h3>
                <ul className={`${themeClasses.textSecondary} space-y-2 ml-6`}>
                  <li><strong>ARIA Labels:</strong> All interactive elements have descriptive labels</li>
                  <li><strong>Role Attributes:</strong> Proper semantic HTML and ARIA roles for all components</li>
                  <li><strong>Live Regions:</strong> Dynamic content updates announced to screen readers</li>
                  <li><strong>Skip Links:</strong> Jump directly to main content</li>
                  <li><strong>Semantic Structure:</strong> Proper heading hierarchy and landmark regions</li>
                </ul>
              </div>

              {/* Keyboard Navigation */}
              <div>
                <h3 className={`${fontSizeClasses.subtitle} font-medium ${themeClasses.text} mb-4`}>
                  ⌨️ Keyboard Navigation
                </h3>
                <ul className={`${themeClasses.textSecondary} space-y-2 ml-6`}>
                  <li><strong>Full Keyboard Support:</strong> All functionality accessible via keyboard</li>
                  <li><strong>Focus Indicators:</strong> Clear visual indicators for focused elements</li>
                  <li><strong>Tab Navigation:</strong> Logical tab order through interactive elements</li>
                  <li><strong>Keyboard Shortcuts:</strong> Press ? to view all available shortcuts</li>
                </ul>
              </div>

              {/* Motion & Animation */}
              <div>
                <h3 className={`${fontSizeClasses.subtitle} font-medium ${themeClasses.text} mb-4`}>
                  🎬 Motion &amp; Animation
                </h3>
                <ul className={`${themeClasses.textSecondary} space-y-2 ml-6`}>
                  <li><strong>Reduced Motion Support:</strong> Respects system preference for reduced motion</li>
                  <li><strong>Motion Toggle:</strong> Manually disable animations in settings</li>
                  <li><strong>No Auto-Playing Media:</strong> All media plays only with user interaction</li>
                </ul>
              </div>

              {/* Focus Mode & Content Width */}
              <div>
                <h3 className={`${fontSizeClasses.subtitle} font-medium ${themeClasses.text} mb-4`}>
                  🎯 Reading Experience
                </h3>
                <ul className={`${themeClasses.textSecondary} space-y-2 ml-6`}>
                  <li><strong>Focus Mode:</strong> Dim the UI to concentrate on reading content</li>
                  <li><strong>Adjustable Content Width:</strong> Narrow, medium, or wide reading widths</li>
                  <li><strong>Persistent Settings:</strong> All preferences saved locally and persist across sessions</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Keyboard Shortcuts Section */}
          <section className={`mb-12 p-6 rounded-lg ${themeClasses.cardBg} border ${themeClasses.border}`}>
            <h2 className={`${fontSizeClasses.subtitle} font-semibold ${themeClasses.text} mb-6`}>
              Keyboard Shortcuts
            </h2>
            <p className={`${themeClasses.textSecondary} mb-6 leading-relaxed`}>
              Available shortcuts throughout the application:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <div className="flex gap-3 mb-3">
                  <kbd className={`px-2 py-1 rounded text-sm font-medium shrink-0 ${isDark ? 'bg-gray-800 text-gray-100' : 'bg-gray-200 text-gray-900'}`}>Tab</kbd>
                  <span className={`text-sm ${themeClasses.textSecondary}`}>Move to next element</span>
                </div>
              </div>
              <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <div className="flex gap-3 mb-3">
                  <kbd className={`px-2 py-1 rounded text-sm font-medium shrink-0 ${isDark ? 'bg-gray-800 text-gray-100' : 'bg-gray-200 text-gray-900'}`}>Shift + Tab</kbd>
                  <span className={`text-sm ${themeClasses.textSecondary}`}>Move to previous element</span>
                </div>
              </div>
              <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <div className="flex gap-3 mb-3">
                  <kbd className={`px-2 py-1 rounded text-sm font-medium shrink-0 ${isDark ? 'bg-gray-800 text-gray-100' : 'bg-gray-200 text-gray-900'}`}>Enter</kbd>
                  <span className={`text-sm ${themeClasses.textSecondary}`}>Activate button / Next slide</span>
                </div>
              </div>
              <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <div className="flex gap-3 mb-3">
                  <kbd className={`px-2 py-1 rounded text-sm font-medium shrink-0 ${isDark ? 'bg-gray-800 text-gray-100' : 'bg-gray-200 text-gray-900'}`}>Esc</kbd>
                  <span className={`text-sm ${themeClasses.textSecondary}`}>Close modal / Settings</span>
                </div>
              </div>
              <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <div className="flex gap-3 mb-3">
                  <kbd className={`px-2 py-1 rounded text-sm font-medium shrink-0 ${isDark ? 'bg-gray-800 text-gray-100' : 'bg-gray-200 text-gray-900'}`}>?</kbd>
                  <span className={`text-sm ${themeClasses.textSecondary}`}>Show keyboard shortcuts</span>
                </div>
              </div>
              <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <div className="flex gap-3 mb-3">
                  <kbd className={`px-2 py-1 rounded text-sm font-medium shrink-0 ${isDark ? 'bg-gray-800 text-gray-100' : 'bg-gray-200 text-gray-900'}`}>← →</kbd>
                  <span className={`text-sm ${themeClasses.textSecondary}`}>Previous / Next slide</span>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section className={`mb-12 p-6 rounded-lg ${isDark ? 'bg-purple-900/20 border border-purple-500/50' : 'bg-emerald-50 border border-emerald-500'}`}>
            <h2 className={`${fontSizeClasses.subtitle} font-semibold ${themeClasses.text} mb-4`}>
              Accessibility Feedback
            </h2>
            <p className={`${themeClasses.textSecondary} mb-6 leading-relaxed`}>
              We welcome feedback on the accessibility of this application. If you encounter any barriers, please reach out:
            </p>
            <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white'} ${isDark ? 'border border-purple-500/30' : 'border border-emerald-200'}`}>
              <p className={`${themeClasses.textSecondary} font-medium`}>
                📧 Email: <a href="mailto:accessibility@telling.local" className={`${isDark ? 'text-purple-300 hover:text-purple-200' : 'text-emerald-600 hover:text-emerald-700'} underline`}>accessibility@telling.local</a>
              </p>
              <p className={`${themeClasses.textSecondary} text-sm mt-2`}>
                Please include details about the barrier you experienced and the browser you were using.
              </p>
            </div>
          </section>

          {/* Last Updated */}
          <div className={`text-center pt-8 border-t ${themeClasses.border}`}>
            <p className={`${themeClasses.textSecondary} text-sm`}>
              This accessibility statement was last updated in January 2026.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
