import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ErrorBoundary } from "@/components/ErrorBoundary";
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
              (function() {
                try {
                  const settings = JSON.parse(localStorage.getItem('settings') || '{}');
                  
                  // Apply theme
                  if (settings.theme === 'dark') {
                    document.documentElement.classList.add('dark-theme');
                  }
                  
                  // Apply accessibility settings
                  const a11y = settings.accessibility || {};
                  
                  // Apply font family
                  if (a11y.fontFamily) {
                    document.documentElement.style.fontFamily = getFontFamily(a11y.fontFamily);
                  }
                  
                  // Apply text spacing
                  if (a11y.letterSpacing) {
                    const letterSpacingMap = {
                      'normal': 'normal',
                      'wide': '0.05em',
                      'extra-wide': '0.1em'
                    };
                    document.documentElement.style.letterSpacing = letterSpacingMap[a11y.letterSpacing] || 'normal';
                  }
                  
                  if (a11y.lineHeight) {
                    const lineHeightMap = {
                      'compact': '1.4',
                      'normal': '1.6',
                      'relaxed': '1.8',
                      'loose': '2.0'
                    };
                    document.documentElement.style.lineHeight = lineHeightMap[a11y.lineHeight] || '1.6';
                  }
                  
                  if (a11y.wordSpacing) {
                    const wordSpacingMap = {
                      'normal': 'normal',
                      'wide': '0.1em'
                    };
                    document.documentElement.style.wordSpacing = wordSpacingMap[a11y.wordSpacing] || 'normal';
                  }
                  
                  // Apply high contrast mode
                  if (a11y.highContrast) {
                    document.documentElement.classList.add('high-contrast');
                  }
                  
                  // Apply reduce motion
                  if (a11y.reduceMotion) {
                    document.documentElement.classList.add('reduce-motion');
                  }
                  
                  // Check for system preference for reduced motion
                  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                    document.documentElement.classList.add('reduce-motion');
                  }
                  
                  // Helper function to get font family
                  function getFontFamily(fontFamily) {
                    const fontMap = {
                      'system': 'system-ui, -apple-system, sans-serif',
                      'serif': 'Georgia, serif',
                      'sans': '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                      'mono': '"Courier New", monospace',
                      'opendyslexic': 'OpenDyslexic, sans-serif',
                      'comic-sans': '"Comic Sans MS", cursive',
                      'atkinson': 'Atkinson Hyperlegible, sans-serif'
                    };
                    return fontMap[fontFamily] || 'system-ui, -apple-system, sans-serif';
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
