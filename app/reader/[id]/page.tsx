'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useMemo, useEffect, useRef, useCallback, Fragment } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useSettings } from '@/hooks/useSettings';
import { useApplyAccessibilitySettings } from '@/hooks/useApplyAccessibilitySettings';
import { Reading } from '@/types';
import { processContent, getFontFamilyClass, getFontSizeClasses, getThemeClasses, ProcessedText } from '@/lib/utils';
import { STORAGE_KEYS, NAVIGATION_KEYS, TOUCH_SWIPE_THRESHOLD, ANNOUNCE_DEBOUNCE_TIME } from '@/lib/constants';
import confetti from 'canvas-confetti';
import { theme } from '@/config/theme';
import CodeBlock from '@/components/CodeBlock';
import katex from 'katex';
import 'katex/dist/katex.min.css';

// Helper function to get inline code classes based on theme
function getInlineCodeClasses(isDark: boolean): string {
  if (isDark) {
    return 'inline-block px-2 py-0.5 mx-1 bg-gray-800 text-green-400 rounded font-mono text-sm';
  }
  return 'inline-block px-2 py-0.5 mx-1 bg-orange-100 text-orange-800 rounded font-mono text-sm';
}

// Helper function to format text with all inline markdown styles
function formatText(text: string, isDark: boolean): React.ReactNode {
  // Process text in order of precedence to avoid conflicts
  type TextPart = { type: string; content: string; url?: string };
  let parts: TextPart[] = [{ type: 'text', content: text }];
  
  // 1. Process inline code first (highest priority, to protect it from other formatting)
  parts = parts.flatMap(part => {
    if (part.type !== 'text') return [part];
    const segments: TextPart[] = [];
    const codeRegex = /(`[^`]+`)/g;
    let lastIndex = 0;
    let match;
    
    while ((match = codeRegex.exec(part.content)) !== null) {
      if (match.index > lastIndex) {
        segments.push({ type: 'text', content: part.content.slice(lastIndex, match.index) });
      }
      segments.push({ type: 'code', content: match[1].slice(1, -1) });
      lastIndex = match.index + match[0].length;
    }
    
    if (lastIndex < part.content.length) {
      segments.push({ type: 'text', content: part.content.slice(lastIndex) });
    }
    
    return segments.length > 0 ? segments : [part];
  });
  
  // 2. Process inline math ($...$) - high priority to protect from other formatting
  parts = parts.flatMap(part => {
    if (part.type !== 'text') return [part];
    const segments: TextPart[] = [];
    const mathRegex = /(\$[^$]+\$)/g;
    let lastIndex = 0;
    let match;
    
    while ((match = mathRegex.exec(part.content)) !== null) {
      if (match.index > lastIndex) {
        segments.push({ type: 'text', content: part.content.slice(lastIndex, match.index) });
      }
      segments.push({ type: 'math', content: match[1].slice(1, -1) });
      lastIndex = match.index + match[0].length;
    }
    
    if (lastIndex < part.content.length) {
      segments.push({ type: 'text', content: part.content.slice(lastIndex) });
    }
    
    return segments.length > 0 ? segments : [part];
  });
  
  // 3. Process footnote references ([^1])
  parts = parts.flatMap(part => {
    if (part.type !== 'text') return [part];
    const segments: TextPart[] = [];
    const footnoteRegex = /(\[\^[^\]]+\])/g;
    let lastIndex = 0;
    let match;
    
    while ((match = footnoteRegex.exec(part.content)) !== null) {
      if (match.index > lastIndex) {
        segments.push({ type: 'text', content: part.content.slice(lastIndex, match.index) });
      }
      segments.push({ type: 'footnote', content: match[1].slice(2, -1) });
      lastIndex = match.index + match[0].length;
    }
    
    if (lastIndex < part.content.length) {
      segments.push({ type: 'text', content: part.content.slice(lastIndex) });
    }
    
    return segments.length > 0 ? segments : [part];
  });
  
  // 4. Process highlighting (==text==)
  parts = parts.flatMap(part => {
    if (part.type !== 'text') return [part];
    const segments: TextPart[] = [];
    const highlightRegex = /(==[^=]+==)/g;
    let lastIndex = 0;
    let match;
    
    while ((match = highlightRegex.exec(part.content)) !== null) {
      if (match.index > lastIndex) {
        segments.push({ type: 'text', content: part.content.slice(lastIndex, match.index) });
      }
      segments.push({ type: 'highlight', content: match[1].slice(2, -2) });
      lastIndex = match.index + match[0].length;
    }
    
    if (lastIndex < part.content.length) {
      segments.push({ type: 'text', content: part.content.slice(lastIndex) });
    }
    
    return segments.length > 0 ? segments : [part];
  });
  
  // 5. Process bold (**text**)
  parts = parts.flatMap(part => {
    if (part.type !== 'text') return [part];
    const segments: TextPart[] = [];
    const boldRegex = /(\*\*[^*]+\*\*)/g;
    let lastIndex = 0;
    let match;
    
    while ((match = boldRegex.exec(part.content)) !== null) {
      if (match.index > lastIndex) {
        segments.push({ type: 'text', content: part.content.slice(lastIndex, match.index) });
      }
      segments.push({ type: 'bold', content: match[1].slice(2, -2) });
      lastIndex = match.index + match[0].length;
    }
    
    if (lastIndex < part.content.length) {
      segments.push({ type: 'text', content: part.content.slice(lastIndex) });
    }
    
    return segments.length > 0 ? segments : [part];
  });
  
  // 6. Process strikethrough (~~text~~)
  parts = parts.flatMap(part => {
    if (part.type !== 'text') return [part];
    const segments: TextPart[] = [];
    const strikeRegex = /(~~[^~]+~~)/g;
    let lastIndex = 0;
    let match;
    
    while ((match = strikeRegex.exec(part.content)) !== null) {
      if (match.index > lastIndex) {
        segments.push({ type: 'text', content: part.content.slice(lastIndex, match.index) });
      }
      segments.push({ type: 'strike', content: match[1].slice(2, -2) });
      lastIndex = match.index + match[0].length;
    }
    
    if (lastIndex < part.content.length) {
      segments.push({ type: 'text', content: part.content.slice(lastIndex) });
    }
    
    return segments.length > 0 ? segments : [part];
  });
  
  // 7. Process italic (*text* or _text_)
  parts = parts.flatMap(part => {
    if (part.type !== 'text') return [part];
    const segments: TextPart[] = [];
    const italicRegex = /(\*[^*]+\*|_[^_]+_)/g;
    let lastIndex = 0;
    let match;
    
    while ((match = italicRegex.exec(part.content)) !== null) {
      if (match.index > lastIndex) {
        segments.push({ type: 'text', content: part.content.slice(lastIndex, match.index) });
      }
      segments.push({ type: 'italic', content: match[1].slice(1, -1) });
      lastIndex = match.index + match[0].length;
    }
    
    if (lastIndex < part.content.length) {
      segments.push({ type: 'text', content: part.content.slice(lastIndex) });
    }
    
    return segments.length > 0 ? segments : [part];
  });
  
  // 5. Process links [text](url)
  parts = parts.flatMap(part => {
    if (part.type !== 'text') return [part];
    const segments: TextPart[] = [];
    const linkRegex = /(\[([^\]]+)\]\(([^)]+)\))/g;
    let lastIndex = 0;
    let match;
    
    while ((match = linkRegex.exec(part.content)) !== null) {
      if (match.index > lastIndex) {
        segments.push({ type: 'text', content: part.content.slice(lastIndex, match.index) });
      }
      segments.push({ type: 'link', content: match[2], url: match[3] });
      lastIndex = match.index + match[0].length;
    }
    
    if (lastIndex < part.content.length) {
      segments.push({ type: 'text', content: part.content.slice(lastIndex) });
    }
    
    return segments.length > 0 ? segments : [part];
  });
  
  // Render the parts
  return (
    <>
      {parts.map((part, idx) => {
        switch (part.type) {
          case 'code':
            return (
              <span key={idx} className={getInlineCodeClasses(isDark)}>
                {part.content}
              </span>
            );
          case 'math':
            return (
              <span 
                key={idx} 
                className="inline-block px-2 mx-1"
                dangerouslySetInnerHTML={{ 
                  __html: katex.renderToString(part.content, {
                    displayMode: false,
                    throwOnError: false,
                  })
                }}
              />
            );
          case 'footnote':
            return (
              <sup key={idx}>
                <span className={`px-1 text-sm font-bold ${
                  isDark ? 'text-purple-400' : 'text-yellow-600'
                }`}>
                  [{part.content}]
                </span>
              </sup>
            );
          case 'highlight':
            return (
              <mark key={idx} className={`px-1 rounded ${
                isDark 
                  ? 'bg-yellow-500/40 text-yellow-100' 
                  : 'bg-yellow-200 text-yellow-900'
              }`}>
                {part.content}
              </mark>
            );
          case 'bold':
            return <strong key={idx} className="px-1">{part.content}</strong>;
          case 'italic':
            return <em key={idx} className="px-1">{part.content}</em>;
          case 'strike':
            return <del key={idx} className="line-through opacity-70 px-1">{part.content}</del>;
          case 'link':
            return (
              <a
                key={idx}
                href={part.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`underline px-1 ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}
              >
                {part.content}
              </a>
            );
          default:
            return <Fragment key={idx}>{part.content}</Fragment>;
        }
      })}
    </>
  );
}

function countWords(text: string): number {
  if (!text) return 0;
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function getAutoAdvanceDurationMs(sentence: ProcessedText, wpm: number): number {
  if (sentence.isImage) return 5000;

  const safeWpm = Math.max(100, Math.min(400, wpm || 200));
  const rawText = sentence.sentence || '';
  let adjustedWords = countWords(rawText);
  const rawChars = rawText.replace(/\s+/g, '').length;

  if (sentence.isCodeBlock) {
    adjustedWords *= 2;
  }

  if (sentence.isTable) {
    adjustedWords *= 1.4;
  }

  if (sentence.isSubtitleIntro) {
    adjustedWords = Math.max(adjustedWords, 8);
  }

  const wordMs = (adjustedWords / safeWpm) * 60 * 1000;
  const charsPerMinute = safeWpm * 5;
  const charMs = rawChars > 0 ? (rawChars / charsPerMinute) * 60 * 1000 : 0;
  const ms = Math.max(wordMs, charMs);

  return Math.max(3000, Math.min(60000, ms));
}

export default function ReaderPage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : '';
  const [readings] = useLocalStorage<Reading[]>(STORAGE_KEYS.READINGS, []);
  const [completedReadings, setCompletedReadings] = useLocalStorage<string[]>('completedReadings', []);
  const { settings } = useSettings();
  useApplyAccessibilitySettings(settings);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastReadingId, setLastReadingId] = useState(id);
  const [announcedIndex, setAnnouncedIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const announceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pageRef = useRef<HTMLDivElement | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  const [isAutoAdvanceActive, setIsAutoAdvanceActive] = useState(false);
  const [isAutoAdvancePaused, setIsAutoAdvancePaused] = useState(false);
  const [autoAdvanceElapsed, setAutoAdvanceElapsed] = useState(0);
  const autoAdvanceIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const autoAdvanceStartRef = useRef<number | null>(null);

  const fontFamilyClass = getFontFamilyClass(settings.accessibility?.fontFamily || 'serif');
  const fontSizeClasses = getFontSizeClasses(settings.fontSize);
  const themeClasses = getThemeClasses(settings.theme);
  const isDark = settings.theme === 'dark';
  const isDetox = settings.theme === 'detox';
  const isHighContrast = settings.theme === 'high-contrast';

  const autoAdvance = settings.autoAdvance || {
    enabled: false,
    wpm: 200,
    autoStart: false,
    showProgress: true,
  };
  
  // Get reading transition setting
  const readingTransition = settings.accessibility?.readingTransition || 'fade-theme';

  // Get content width directly for immediate render
  const contentWidth = settings.accessibility?.contentWidth || 'medium';
  const contentWidthStyle = {
    narrow: '45ch',
    medium: '65ch',
    wide: '80ch',
    full: 'none'
  }[contentWidth];

  const reading = useMemo(() => {
    if (!id) return undefined;
    return readings.find((r) => r.id === id);
  }, [id, readings]);

  const processedText = useMemo(() => {
    if (!reading) return [];
    return processContent(reading.title, reading.content);
  }, [reading]);

  const autoAdvanceDurationMs = useMemo(() => {
    if (processedText.length === 0) return 0;
    const safeIndex = Math.max(0, Math.min(currentIndex, processedText.length - 1));
    return getAutoAdvanceDurationMs(processedText[safeIndex], autoAdvance.wpm);
  }, [processedText, currentIndex, autoAdvance.wpm]);

  // Reset index when reading changes (using derived state pattern)
  if (id !== lastReadingId) {
    setLastReadingId(id);
    setCurrentIndex(0);
    setAnnouncedIndex(0);
  }

  // Debounce announcements to avoid overwhelming screen readers during rapid navigation
  useEffect(() => {
    // Clear any existing timeout
    if (announceTimeoutRef.current) {
      clearTimeout(announceTimeoutRef.current);
    }

    // Set a new timeout to update the announcement after navigation stops
    announceTimeoutRef.current = setTimeout(() => {
      setAnnouncedIndex(currentIndex);
    }, ANNOUNCE_DEBOUNCE_TIME);

    // Cleanup on unmount or when currentIndex changes
    return () => {
      if (announceTimeoutRef.current) {
        clearTimeout(announceTimeoutRef.current);
      }
    };
  }, [currentIndex]);

  const clearAutoAdvanceTimer = useCallback(() => {
    if (autoAdvanceIntervalRef.current) {
      clearInterval(autoAdvanceIntervalRef.current);
      autoAdvanceIntervalRef.current = null;
    }
  }, []);

  // Reset auto-advance when disabled
  useEffect(() => {
    if (!autoAdvance.enabled && (isAutoAdvanceActive || autoAdvanceElapsed > 0)) {
      clearAutoAdvanceTimer();
      // Use callback form to avoid setting state during render
      setTimeout(() => {
        setIsAutoAdvanceActive(false);
        setIsAutoAdvancePaused(false);
        setAutoAdvanceElapsed(0);
      }, 0);
    }
  }, [autoAdvance.enabled, clearAutoAdvanceTimer, isAutoAdvanceActive, autoAdvanceElapsed]);

  // Auto-start when enabled
  useEffect(() => {
    if (autoAdvance.enabled && autoAdvance.autoStart && !isAutoAdvanceActive) {
      setTimeout(() => {
        setIsAutoAdvanceActive(true);
        setIsAutoAdvancePaused(false);
      }, 0);
    }
  }, [autoAdvance.enabled, autoAdvance.autoStart, id, isAutoAdvanceActive]);

  const handleNext = useCallback(() => {
    if (isTransitioning) return; // Prevent multiple transitions
    
    // Reset auto-advance timer when advancing
    setAutoAdvanceElapsed(0);
    if (isAutoAdvanceActive && !isAutoAdvancePaused) {
      autoAdvanceStartRef.current = Date.now();
    }
    
    // Skip transition if reduce motion is enabled, transition is 'none', 'spotlight', or 'line-focus'
    // (spotlight and line-focus don't use enter/exit animations)
    const shouldAnimate = !settings.accessibility?.reduceMotion && 
                          readingTransition !== 'none' && 
                          readingTransition !== 'spotlight' &&
                          readingTransition !== 'line-focus';
    
    if (shouldAnimate) {
      setIsTransitioning(true);
      // Wait for exit animation to complete before changing content
      setTimeout(() => {
        setCurrentIndex((prev) => {
          if (prev < processedText.length - 1) {
            return prev + 1;
          }
          return prev;
        });
        setIsTransitioning(false);
      }, readingTransition === 'swipe' ? 400 : 300); // Match CSS animation duration
    } else {
      setCurrentIndex((prev) => {
        if (prev < processedText.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }
  }, [processedText.length, isTransitioning, settings.accessibility?.reduceMotion, readingTransition, isAutoAdvanceActive, isAutoAdvancePaused]);

  useEffect(() => {
    if (!autoAdvance.enabled || !isAutoAdvanceActive || isAutoAdvancePaused || autoAdvanceDurationMs === 0) {
      clearAutoAdvanceTimer();
      return;
    }

    autoAdvanceStartRef.current = Date.now() - autoAdvanceElapsed;

    autoAdvanceIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - (autoAdvanceStartRef.current ?? Date.now());
      setAutoAdvanceElapsed(elapsed);

      if (elapsed >= autoAdvanceDurationMs) {
        clearAutoAdvanceTimer();
        setAutoAdvanceElapsed(0);

        if (currentIndex < processedText.length - 1) {
          handleNext();
        } else {
          setIsAutoAdvanceActive(false);
          setIsAutoAdvancePaused(false);
        }
      }
    }, 100);

    return () => {
      clearAutoAdvanceTimer();
    };
  }, [
    autoAdvance.enabled,
    autoAdvanceDurationMs,
    autoAdvanceElapsed,
    clearAutoAdvanceTimer,
    currentIndex,
    handleNext,
    isAutoAdvanceActive,
    isAutoAdvancePaused,
    processedText.length,
  ]);

  const handleAutoAdvanceToggle = () => {
    if (!isAutoAdvanceActive) {
      setIsAutoAdvanceActive(true);
      setIsAutoAdvancePaused(false);
      return;
    }

    if (isAutoAdvancePaused) {
      setIsAutoAdvancePaused(false);
    } else {
      setIsAutoAdvancePaused(true);
    }
  };

  const handlePrevious = useCallback(() => {
    if (isTransitioning) return; // Prevent multiple transitions
    
    // Reset auto-advance timer when going back
    setAutoAdvanceElapsed(0);
    if (isAutoAdvanceActive && !isAutoAdvancePaused) {
      setIsAutoAdvancePaused(true);
      autoAdvanceStartRef.current = Date.now();
    }
    
    // Skip transition if reduce motion is enabled, transition is 'none', 'spotlight', or 'line-focus'
    const shouldAnimate = !settings.accessibility?.reduceMotion && 
                          readingTransition !== 'none' && 
                          readingTransition !== 'spotlight' &&
                          readingTransition !== 'line-focus';
    
    if (shouldAnimate) {
      setIsTransitioning(true);
      // Wait for exit animation to complete before changing content
      setTimeout(() => {
        setCurrentIndex((prev) => {
          if (prev > 0) {
            return prev - 1;
          }
          return prev;
        });
        setIsTransitioning(false);
      }, readingTransition === 'swipe' ? 400 : 300); // Match CSS animation duration
    } else {
      setCurrentIndex((prev) => {
        if (prev > 0) {
          return prev - 1;
        }
        return prev;
      });
    }
  }, [isTransitioning, settings.accessibility?.reduceMotion, readingTransition, isAutoAdvanceActive, isAutoAdvancePaused]);

  const toggleFullscreen = useCallback(() => {
    if (!pageRef.current) return;
    if (!document.fullscreenElement) {
      pageRef.current.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  }, []);

  const goToStart = useCallback(() => {
    if (isAutoAdvanceActive && !isAutoAdvancePaused) {
      setIsAutoAdvancePaused(true);
    }
    setCurrentIndex(0);
  }, [isAutoAdvanceActive, isAutoAdvancePaused]);

  const goToEnd = useCallback(() => {
    if (isAutoAdvanceActive && !isAutoAdvancePaused) {
      setIsAutoAdvancePaused(true);
    }
    setCurrentIndex(processedText.length - 1);
  }, [processedText.length, isAutoAdvanceActive, isAutoAdvancePaused]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input/textarea
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return;
      }

      // Arrow keys and basic navigation
      if (NAVIGATION_KEYS.NEXT.includes(e.key)) {
        e.preventDefault();
        handleNext();
      } else if (NAVIGATION_KEYS.PREVIOUS.includes(e.key)) {
        e.preventDefault();
        handlePrevious();
      }
      // Space key navigation
      else if (e.key === ' ') {
        e.preventDefault();
        if (e.shiftKey) {
          handlePrevious();
        } else {
          handleNext();
        }
      }
      // Home/End navigation
      else if (e.key === 'Home') {
        e.preventDefault();
        goToStart();
      } else if (e.key === 'End') {
        e.preventDefault();
        goToEnd();
      }
      // Fullscreen toggle
      else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        toggleFullscreen();
      }
      // Exit reading (go back to dashboard)
      else if (e.key === 'Backspace') {
        e.preventDefault();
        router.push('/');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrevious, goToStart, goToEnd, toggleFullscreen, router]);

  // Touch gestures for mobile
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchMove = (e: TouchEvent) => {
      touchEndX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = () => {
      const diffX = touchStartX.current - touchEndX.current;

      if (Math.abs(diffX) > TOUCH_SWIPE_THRESHOLD) {
        if (diffX > 0) {
          // Swiped left -> next slide
          handleNext();
        } else {
          // Swiped right -> previous slide
          handlePrevious();
        }
      }

      // Reset values
      touchStartX.current = 0;
      touchEndX.current = 0;
    };

    const element = pageRef.current;
    if (element) {
      element.addEventListener('touchstart', handleTouchStart);
      element.addEventListener('touchmove', handleTouchMove);
      element.addEventListener('touchend', handleTouchEnd);

      return () => {
        element.removeEventListener('touchstart', handleTouchStart);
        element.removeEventListener('touchmove', handleTouchMove);
        element.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [handleNext, handlePrevious]);

  // Track fullscreen changes
  useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  const handleFinishReading = useCallback(() => {
    // Mark reading as completed
    if (id && !completedReadings.includes(id)) {
      setCompletedReadings([...completedReadings, id]);
    }
    
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
  }, [id, completedReadings, setCompletedReadings]);

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
      <div className={`min-h-screen ${themeClasses.bg} flex items-center justify-center`}>
        <div className="text-center">
          <h1 className={`text-2xl font-bold ${themeClasses.text} mb-4`}>No content to display</h1>
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
  const autoAdvanceProgress = autoAdvanceDurationMs > 0
    ? Math.min(100, (autoAdvanceElapsed / autoAdvanceDurationMs) * 100)
    : 0;
  const autoAdvanceRingRadius = 20;
  const autoAdvanceRingCircumference = 2 * Math.PI * autoAdvanceRingRadius;
  const autoAdvanceRingOffset = autoAdvanceRingCircumference - (autoAdvanceProgress / 100) * autoAdvanceRingCircumference;

  // Use debounced index for announcements
  const safeAnnouncedIndex = Math.max(0, Math.min(announcedIndex, processedText.length - 1));

  return (
    <div ref={pageRef} className={`min-h-screen ${themeClasses.bg} ${fontFamilyClass}`}>
      {/* Skip link for keyboard navigation */}
      <a
        href="#reader-main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:bg-black focus:text-white focus:p-4 focus:rounded-b"
      >
        Skip to main reading content
      </a>

      {/* Live region for screen reader announcements */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
        role="status"
      >
        Slide {safeAnnouncedIndex + 1} of {processedText.length}
      </div>
      {/* Progress Bar */}
      <div className={`sticky top-0 z-10 ${themeClasses.cardBg} border-b ${themeClasses.border} shadow-sm`}>
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <Link href="/" className="text-sm text-blue-500 hover:text-blue-600">
              ← Back to Dashboard
            </Link>
            <span className={`text-sm ${themeClasses.textSecondary}`}>
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
      <div 
        id="reader-main-content" 
        className={`container mx-auto px-4 py-12 ${
          readingTransition === 'line-focus' && !settings.accessibility?.reduceMotion
            ? 'line-focus-mode'
            : readingTransition === 'spotlight' && !settings.accessibility?.reduceMotion
            ? 'spotlight-mode'
            : ''
        }`}
      >
        <div 
          key={currentIndex}
          className={`mx-auto ${
            settings.accessibility?.reduceMotion || readingTransition === 'none'
              ? ''
              : readingTransition === 'spotlight' && !settings.accessibility?.reduceMotion
              ? 'spotlight-content'
              : isTransitioning
              ? readingTransition === 'fade-theme'
                ? 'reading-transition-fade-exit'
                : readingTransition === 'swipe'
                ? 'reading-transition-swipe-exit'
                : ''
              : readingTransition === 'fade-theme'
              ? 'reading-transition-fade-enter'
              : readingTransition === 'swipe'
              ? 'reading-transition-swipe-enter'
              : ''
          }`}
          style={{ 
            maxWidth: contentWidthStyle,
          }}
        >
          <div className="mb-8 text-center spotlight-header">
            <h2 className={`${fontSizeClasses.title} font-semibold ${themeClasses.text} mb-2`}>
              {formatText(currentSentence.title, isDark)}
            </h2>
            {currentSentence.subtitle && !currentSentence.isSubtitleIntro && (
              <h3 className={`${fontSizeClasses.subtitle} font-medium ${themeClasses.textSecondary}`}>
                {formatText(currentSentence.subtitle, isDark)}
              </h3>
            )}
          </div>
          
          {/* Content area - code blocks, images, bullets, blockquotes or regular text */}
          {currentSentence.isCodeBlock ? (
            <CodeBlock 
              code={currentSentence.sentence} 
              language={currentSentence.codeLanguage || 'text'} 
              isDark={isDark} 
            />
          ) : currentSentence.isImage ? (
            <div className="my-12 flex flex-col items-center justify-center min-h-[400px]">
              <div className={`relative w-full max-w-4xl h-[60vh] rounded-lg overflow-hidden shadow-lg ${
                isDark ? 'shadow-purple-900/50' : 'shadow-gray-400/50'
              }`}>
                <Image 
                  src={currentSentence.imageUrl || ''} 
                  alt={currentSentence.imageAlt || currentSentence.sentence}
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
              {currentSentence.imageAlt && (
                <p className={`mt-4 ${themeClasses.textSecondary} ${fontSizeClasses.subtitle} italic text-center`}>
                  {currentSentence.imageAlt}
                </p>
              )}
            </div>
          ) : currentSentence.isBlockquote ? (
            <blockquote className={`my-12 px-6 py-4 border-l-4 spotlight-current ${
              isDark 
                ? 'border-purple-500 bg-purple-900/20' 
                : 'border-emerald-500 bg-emerald-50'
            } rounded-r-lg`}>
              <p className={`${themeClasses.text} ${fontSizeClasses.text} italic leading-relaxed`}>
                {formatText(currentSentence.sentence, isDark)}
              </p>
            </blockquote>
          ) : currentSentence.isTable ? (
            <div className="my-12 overflow-x-auto">
              <table className={`min-w-full ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg rounded-lg overflow-hidden`}>
                <thead className={isDark ? 'bg-purple-900/50' : 'bg-linear-to-r from-yellow-400 to-lime-400'}>
                  <tr>
                    {currentSentence.tableHeaders?.map((header, idx) => (
                      <th key={idx} className={`px-6 py-4 text-left ${fontSizeClasses.subtitle} font-semibold ${
                        isDark ? 'text-purple-200' : 'text-gray-800'
                      }`}>
                        {formatText(header, isDark)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {currentSentence.tableRows?.map((row, rowIdx) => (
                    <tr key={rowIdx} className={`border-t ${
                      isDark 
                        ? 'border-gray-700 hover:bg-gray-700/50' 
                        : 'border-gray-200 hover:bg-gray-50'
                    } transition-colors`}>
                      {row.map((cell, cellIdx) => (
                        <td key={cellIdx} className={`px-6 py-4 ${themeClasses.text} ${fontSizeClasses.text}`}>
                          {formatText(cell, isDark)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : currentSentence.isCheckbox ? (
            <div className={`my-12 flex items-center justify-center ${themeClasses.text} ${fontSizeClasses.text}`}>
              <div className="flex items-start gap-4 max-w-2xl w-full">
                <div className={`mt-1 shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
                  currentSentence.isChecked
                    ? isDark 
                      ? 'bg-purple-500 border-purple-500' 
                      : 'bg-lime-500 border-lime-500'
                    : isDark
                      ? 'border-gray-600 bg-gray-800'
                      : 'border-gray-400 bg-white'
                }`}>
                  {currentSentence.isChecked && (
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className={currentSentence.isChecked ? 'line-through opacity-60' : ''}>
                  {formatText(currentSentence.sentence, isDark)}
                </span>
              </div>
            </div>
          ) : currentSentence.isFootnoteDef ? (
            <div className={`my-12 ${themeClasses.text} ${fontSizeClasses.text} max-w-2xl mx-auto`}>
              <div className={`px-6 py-4 rounded-lg border-l-4 ${
                isDark 
                  ? 'bg-gray-800/50 border-purple-500' 
                  : 'bg-yellow-50 border-yellow-400'
              }`}>
                <div className="flex items-start gap-2">
                  <span className={`text-sm font-bold ${isDark ? 'text-purple-400' : 'text-yellow-600'}`}>
                    [{currentSentence.footnoteId}]
                  </span>
                  <span className="flex-1">
                    {formatText(currentSentence.footnoteText || '', isDark)}
                  </span>
                </div>
              </div>
            </div>
          ) : currentSentence.isMathBlock ? (
            <div className={`my-12 flex items-center justify-center ${themeClasses.text}`}>
              <div 
                className={`px-8 py-6 rounded-lg ${
                  isDark ? 'bg-gray-800/50' : 'bg-white shadow-md'
                }`}
                dangerouslySetInnerHTML={{ 
                  __html: katex.renderToString(currentSentence.mathContent || '', {
                    displayMode: true,
                    throwOnError: false,
                  })
                }}
              />
            </div>
          ) : currentSentence.isBulletPoint ? (
            <div className={`my-12 ${themeClasses.text} min-h-[200px] flex flex-col justify-center max-w-2xl mx-auto`}>
              {/* Parent bullet if this is a sub-bullet */}
              {(currentSentence.indentLevel ?? 0) > 0 && currentSentence.parentBullet && (
                <div className={`mb-6 pb-4 border-b ${themeClasses.border}`}>
                  <div className={`flex items-start ${themeClasses.textSecondary} ${fontSizeClasses.bullet} ${theme.bullets.parent.weight}`}>
                    <span className="mr-3 mt-1 shrink-0">
                      {currentSentence.parentIsNumbered ? `${currentSentence.parentNumberIndex ?? 1}.` : '•'}
                    </span>
                    <span>{formatText(currentSentence.parentBullet, isDark)}</span>
                  </div>
                </div>
              )}
              
              {/* Previous bullets (dimmed) */}
              {currentSentence.bulletHistory && currentSentence.bulletHistory.length > 0 && (
                <ul className="space-y-3 mb-4 spotlight-history">
                  {currentSentence.bulletHistory.map((bullet, idx) => (
                    <li key={idx} className={`flex items-start ${themeClasses.textSecondary} ${fontSizeClasses.bullet}`}>
                      <span className={`mr-3 mt-1 shrink-0 ${(currentSentence.indentLevel ?? 0) > 0 ? 'ml-8' : ''}`}>
                        {(currentSentence.indentLevel ?? 0) > 0
                          ? '◦'
                          : currentSentence.isNumberedList 
                            ? `${idx + 1}.` 
                            : '•'}
                      </span>
                      <span>{formatText(bullet, isDark)}</span>
                    </li>
                  ))}
                </ul>
              )}
              {/* Current bullet (highlighted) */}
              <ul className="space-y-3">
                <li className={`flex items-start spotlight-current ${
                  (currentSentence.indentLevel ?? 0) === 0 
                    ? `${themeClasses.textSecondary} ${fontSizeClasses.bullet} ${theme.bullets.level0.weight}` 
                    : `${themeClasses.text} ${fontSizeClasses.bullet} ${theme.bullets.level1.weight}`
                }`}>
                  <span className={`mr-3 mt-1 shrink-0 ${(currentSentence.indentLevel ?? 0) > 0 ? 'ml-8' : ''}`}>
                    {(currentSentence.indentLevel ?? 0) > 0
                      ? '◦'
                      : currentSentence.isNumberedList 
                        ? `${(currentSentence.bulletHistory?.length || 0) + 1}.` 
                        : '•'}
                  </span>
                  <span>{formatText(currentSentence.sentence, isDark)}</span>
                </li>
              </ul>
            </div>
          ) : (
            <p 
              className={`my-12 ${themeClasses.text} leading-relaxed text-center min-h-[200px] flex items-center justify-center spotlight-current ${
                currentSentence.isSubtitleIntro 
                  ? `${fontSizeClasses.subtitle} ${theme.subtitleIntro.weight} ${theme.subtitleIntro.style}` 
                  : fontSizeClasses.text
              } ${
                readingTransition === 'line-focus' && !settings.accessibility?.reduceMotion
                  ? 'reading-line-focused'
                  : ''
              }`}
            >
              {formatText(currentSentence.sentence, isDark)}
            </p>
          )}

          {/* Actions */}
          <div data-tour="reader-navigation" className={`flex items-center justify-center gap-4 mt-6 spotlight-actions ${isFinished ? 'spotlight-finished' : ''}`}>
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
            {autoAdvance.enabled && (
              <div className="relative flex flex-col items-center">
                {autoAdvance.showProgress && (
                  <svg className={`absolute inset-0 w-12 h-12 ${
                    isHighContrast
                      ? 'text-white'
                      : isDetox
                      ? 'text-gray-800'
                      : isDark
                      ? 'text-purple-400'
                      : 'text-emerald-500'
                  }`} viewBox="0 0 48 48">
                    <circle
                      cx="24"
                      cy="24"
                      r={autoAdvanceRingRadius}
                      stroke="currentColor"
                      strokeWidth="3"
                      fill="none"
                      className="opacity-20"
                    />
                    <circle
                      cx="24"
                      cy="24"
                      r={autoAdvanceRingRadius}
                      stroke="currentColor"
                      strokeWidth="3"
                      fill="none"
                      strokeDasharray={`${autoAdvanceRingCircumference} ${autoAdvanceRingCircumference}`}
                      strokeDashoffset={autoAdvanceRingOffset}
                      strokeLinecap="round"
                      className="transition-all duration-100 ease-linear"
                    />
                  </svg>
                )}
                <button
                  onClick={handleAutoAdvanceToggle}
                  className="relative w-12 h-12 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                  title={
                    !isAutoAdvanceActive
                      ? 'Start auto-advance'
                      : isAutoAdvancePaused
                      ? 'Resume auto-advance'
                      : 'Pause auto-advance'
                  }
                  aria-label="Toggle auto-advance timer"
                >
                  {isAutoAdvanceActive && !isAutoAdvancePaused ? (
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <rect x="6" y="5" width="4" height="14" rx="1" />
                      <rect x="14" y="5" width="4" height="14" rx="1" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="6,4 20,12 6,20" />
                    </svg>
                  )}
                </button>
                <span className={`mt-1 text-[10px] ${themeClasses.textSecondary}`}>
                  Auto {autoAdvance.wpm} WPM
                </span>
              </div>
            )}
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

