'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Reading } from '@/types';
import { processContent } from '@/utils/textProcessor';
import confetti from 'canvas-confetti';
import { theme, getInlineCodeClasses } from '@/config/theme';

// Helper function to format inline code (e.g., `awslocal s3 ls`)
function formatInlineCode(text: string) {
  // Detecta patrones de backticks: `código`
  const parts = text.split(/(`[^`]+`)/g);
  
  return parts.map((part, idx) => {
    // Si la parte está entre backticks, formatearla como código
    if (part.startsWith('`') && part.endsWith('`')) {
      const code = part.slice(1, -1); // Remover los backticks
      return (
        <span 
          key={idx} 
          className={getInlineCodeClasses()}
        >
          {code}
        </span>
      );
    }
    return part;
  });
}

export default function ReaderPage() {
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : '';
  const [readings] = useLocalStorage<Reading[]>('readings', []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastReadingId, setLastReadingId] = useState(id);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pageRef = useRef<HTMLDivElement | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const reading = useMemo(() => {
    if (!id) return undefined;
    return readings.find((r) => r.id === id);
  }, [id, readings]);

  const processedText = useMemo(() => {
    if (!reading) return [];
    return processContent(reading.title, reading.content);
  }, [reading]);

  // Reset index when reading changes (using derived state pattern)
  if (id !== lastReadingId) {
    setLastReadingId(id);
    setCurrentIndex(0);
  }

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => {
      if (prev < processedText.length - 1) {
        return prev + 1;
      }
      return prev;
    });
  }, [processedText.length]);

  const handlePrevious = useCallback(() => {
    setCurrentIndex((prev) => {
      if (prev > 0) {
        return prev - 1;
      }
      return prev;
    });
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        handlePrevious();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrevious]);

  // Track fullscreen changes
  useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!pageRef.current) return;
    if (!document.fullscreenElement) {
      pageRef.current.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  }, []);

  const goToStart = useCallback(() => {
    setCurrentIndex(0);
  }, []);

  const handleFinishReading = useCallback(() => {
    // Trigger confetti effect
    const duration = 2000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      
      // Shoot confetti from two sides
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);
  }, []);

  // Scroll navigation
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      
      // Clear existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      // Debounce scroll events
      scrollTimeoutRef.current = setTimeout(() => {
        if (e.deltaY > 0) {
          // Scrolling down - next sentence
          handleNext();
        } else if (e.deltaY < 0) {
          // Scrolling up - previous sentence
          handlePrevious();
        }
      }, 50);
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      window.removeEventListener('wheel', handleWheel);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [handleNext, handlePrevious]);

  if (!reading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Reading not found</h1>
          <Link href="/" className="text-blue-500 hover:text-blue-600">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (processedText.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">No content to display</h1>
          <Link href="/" className="text-blue-500 hover:text-blue-600">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // Safety check for currentIndex
  const safeIndex = Math.max(0, Math.min(currentIndex, processedText.length - 1));
  const currentSentence = processedText[safeIndex];
  const progress = processedText.length > 0 ? ((safeIndex + 1) / processedText.length) * 100 : 0;
  const isFinished = safeIndex === processedText.length - 1;

  return (
    <div ref={pageRef} className="min-h-screen bg-gray-50">
      {/* Progress Bar */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <Link href="/" className="text-sm text-blue-500 hover:text-blue-600">
              ← Back to Dashboard
            </Link>
            <span className="text-sm text-gray-600">
              {safeIndex + 1} / {processedText.length}
            </span>
          </div>
          <div className={`w-full ${theme.progressBar.background} rounded-full h-2 overflow-hidden`}>
            <div
              className={`${theme.progressBar.fill} h-2 rounded-full transition-all duration-300 ease-out`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {formatInlineCode(currentSentence.title)}
            </h2>
            {currentSentence.subtitle && !currentSentence.isSubtitleIntro && (
              <h3 className="text-lg font-medium text-gray-700">
                {formatInlineCode(currentSentence.subtitle)}
              </h3>
            )}
          </div>
          
          {/* Content area - bullets or regular text */}
          {currentSentence.isBulletPoint ? (
            <div className="my-12 text-gray-900 min-h-[200px] flex flex-col justify-center max-w-2xl mx-auto">
              {/* Parent bullet if this is a sub-bullet */}
              {(currentSentence.indentLevel ?? 0) > 0 && currentSentence.parentBullet && (
                <div className="mb-6 pb-4 border-b border-gray-200">
                  <div className={`flex items-start ${theme.bullets.parent.text} ${theme.bullets.parent.size} ${theme.bullets.parent.weight}`}>
                    <span className="mr-3 mt-1 shrink-0">
                      {currentSentence.parentIsNumbered ? `${currentSentence.parentNumberIndex ?? 1}.` : '•'}
                    </span>
                    <span>{formatInlineCode(currentSentence.parentBullet)}</span>
                  </div>
                </div>
              )}
              
              {/* Previous bullets (dimmed) */}
              {currentSentence.bulletHistory && currentSentence.bulletHistory.length > 0 && (
                <ul className="space-y-3 mb-4">
                  {currentSentence.bulletHistory.map((bullet, idx) => (
                    <li key={idx} className={`flex items-start ${theme.bullets.history.text} ${theme.bullets.history.size}`}>
                      <span className={`mr-3 mt-1 shrink-0 ${(currentSentence.indentLevel ?? 0) > 0 ? 'ml-8' : ''}`}>
                        {(currentSentence.indentLevel ?? 0) > 0
                          ? '◦'
                          : currentSentence.isNumberedList 
                            ? `${idx + 1}.` 
                            : '•'}
                      </span>
                      <span>{formatInlineCode(bullet)}</span>
                    </li>
                  ))}
                </ul>
              )}
              {/* Current bullet (highlighted) */}
              <ul className="space-y-3">
                <li className={`flex items-start ${
                  (currentSentence.indentLevel ?? 0) === 0 
                    ? `${theme.bullets.level0.text} ${theme.bullets.level0.size} ${theme.bullets.level0.weight}` 
                    : `${theme.bullets.level1.text} ${theme.bullets.level1.size} ${theme.bullets.level1.weight}`
                }`}>
                  <span className={`mr-3 mt-1 shrink-0 ${(currentSentence.indentLevel ?? 0) > 0 ? 'ml-8' : ''}`}>
                    {(currentSentence.indentLevel ?? 0) > 0
                      ? '◦'
                      : currentSentence.isNumberedList 
                        ? `${(currentSentence.bulletHistory?.length || 0) + 1}.` 
                        : '•'}
                  </span>
                  <span>{formatInlineCode(currentSentence.sentence)}</span>
                </li>
              </ul>
            </div>
          ) : (
            <p className={`font-serif my-12 text-gray-900 leading-relaxed text-center min-h-[200px] flex items-center justify-center ${
              currentSentence.isSubtitleIntro 
                ? `${theme.subtitleIntro.size} ${theme.subtitleIntro.weight} ${theme.subtitleIntro.style}` 
                : theme.regularText.size
            }`}>
              {formatInlineCode(currentSentence.sentence)}
            </p>
          )}

          {/* Actions */}
          <div className="flex items-center justify-center gap-4 mt-6">
            {/* Go to start */}
            <button
              onClick={goToStart}
              className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
              title="Go to start"
              aria-label="Go to start"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="11 19 2 12 11 5"></polyline>
                <line x1="22" y1="19" x2="22" y2="5"></line>
              </svg>
            </button>
            {/* Fullscreen toggle */}
            <button
              onClick={toggleFullscreen}
              className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
              title={isFullscreen ? 'Exit full screen' : 'Full screen'}
              aria-label={isFullscreen ? 'Exit full screen' : 'Full screen'}
            >
              {isFullscreen ? (
                // Minimize icon
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="4 14 10 14 10 20"></polyline>
                  <polyline points="20 10 14 10 14 4"></polyline>
                  <line x1="14" y1="10" x2="21" y2="3"></line>
                  <line x1="3" y1="21" x2="10" y2="14"></line>
                </svg>
              ) : (
                // Maximize icon
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <polyline points="9 21 3 21 3 15"></polyline>
                  <line x1="21" y1="3" x2="14" y2="10"></line>
                  <line x1="3" y1="21" x2="10" y2="14"></line>
                </svg>
              )}
            </button>
            {/* Finish reading button - only shown when finished */}
            {isFinished && (
              <Link
                href="/"
                onClick={handleFinishReading}
                className="p-3 rounded-full bg-green-500 hover:bg-green-600 text-white transition-colors"
                title="Finish reading"
                aria-label="Finish reading and return to dashboard"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

