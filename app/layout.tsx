import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { getAccessibilityUtilsScript } from "@/lib/utils/accessibility";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "tellingQuote - Interactive Reading",
  description: "An interactive reading application that converts markdown content into slide-style presentations",
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              ${getAccessibilityUtilsScript()}
              
              (function() {
                try {
                  const settings = JSON.parse(localStorage.getItem('settings') || '{}');
                  const root = document.documentElement;
                  
                  // Apply theme
                  root.classList.remove('dark-theme', 'detox-theme', 'high-contrast-theme');
                  if (settings.theme === 'dark') {
                    root.classList.add('dark-theme');
                  } else if (settings.theme === 'detox') {
                    root.classList.add('detox-theme');
                  } else if (settings.theme === 'high-contrast') {
                    root.classList.add('high-contrast-theme');
                  }
                  
                  // Apply accessibility settings
                  const a11y = settings.accessibility || {};
                  
                  // Apply font family
                  if (a11y.fontFamily) {
                    root.style.fontFamily = getFontFamily(a11y.fontFamily);
                  }
                  
                  // Apply text spacing
                  if (a11y.letterSpacing) {
                    root.style.letterSpacing = getLetterSpacing(a11y.letterSpacing);
                  }
                  
                  if (a11y.lineHeight) {
                    root.style.lineHeight = getLineHeight(a11y.lineHeight);
                  }
                  
                  if (a11y.wordSpacing) {
                    root.style.wordSpacing = getWordSpacing(a11y.wordSpacing);
                  }
                  
                  // Apply high contrast mode
                  if (a11y.highContrast) {
                    root.classList.add('high-contrast');
                  }
                  
                  // Apply reduce motion
                  const hasUserReduceMotionPreference = typeof a11y.reduceMotion === 'boolean';
                  
                  if (hasUserReduceMotionPreference) {
                    if (a11y.reduceMotion) {
                      root.classList.add('reduce-motion');
                    } else {
                      root.classList.remove('reduce-motion');
                    }
                  } else if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                    // Fall back to system preference for reduced motion only if no explicit user preference
                    root.classList.add('reduce-motion');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}
