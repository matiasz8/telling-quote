'use client';

import { useEffect, useRef, useState } from 'react';
import type { TTSSettings } from '@/types';
import { useTTS } from '@/hooks/useTTS';
import { cn } from '@/lib/utils';

type TTSPlayerProps = {
  text: string;
  settings: TTSSettings;
  onSentenceChange?: (index: number) => void;
  onComplete?: () => void;
  onPlayingStateChange?: (isPlaying: boolean) => void;
  className?: string;
};

export function TTSPlayer({
  text,
  settings,
  onSentenceChange,
  onComplete,
  onPlayingStateChange,
  className,
}: TTSPlayerProps) {
  const [isAutoplayBlocked, setIsAutoplayBlocked] = useState(false);

  const { state, actions } = useTTS({
    settings,
    onSentenceChange,
    onComplete,
    onError: (error) => {
      if (error.message.includes('not-allowed')) {
        setIsAutoplayBlocked(true);
        return;
      }
      console.error('TTS Error:', error);
    },
  });

  const hasLoadedRef = useRef(false);
  const prevTextRef = useRef<string>(text);
  const prevReadingIdRef = useRef<string>('');
  const autoPlayTriggeredRef = useRef(false);

  // Detect reading changes by checking text content significantly changed
  const currentReadingId = text.slice(0, 50); // Use first 50 chars as identifier
  
  // Reset loaded flag when reading changes
  useEffect(() => {
    if (currentReadingId !== prevReadingIdRef.current && prevReadingIdRef.current !== '') {
      hasLoadedRef.current = false;
      autoPlayTriggeredRef.current = false; // Reset autoPlay flag for new reading
      prevReadingIdRef.current = currentReadingId;
    } else if (prevReadingIdRef.current === '') {
      prevReadingIdRef.current = currentReadingId;
    }
  }, [currentReadingId]);

  // Load text when component mounts or text changes
  useEffect(() => {
    if (!text) return;

    const isTextChanged = text !== prevTextRef.current;
    const wasPlaying = state.isPlaying;

    console.log('[TTSPlayer] Load effect triggered:', {
      isTextChanged,
      wasPlaying,
      hasLoaded: hasLoadedRef.current,
      autoPlay: settings.autoPlay,
      enabled: settings.enabled,
      textLength: text.length,
    });

    if (isTextChanged) {
      // Text changed, need to reload
      actions.stop();
      actions.load(text);
      prevTextRef.current = text;
      hasLoadedRef.current = true;

      if (wasPlaying && settings.enabled) {
        setTimeout(() => actions.play(), 100);
      }
    } else if (!hasLoadedRef.current) {
      // Initial load
      console.log('[TTSPlayer] Initial load - loading text');
      actions.load(text);
      hasLoadedRef.current = true;
      // AutoPlay will be handled by separate useEffect when sentences are ready
    }
  }, [text, settings.autoPlay, settings.enabled, actions, state.isPlaying]);

  // Auto-play when text is loaded and ready
  useEffect(() => {
    if (
      settings.autoPlay && 
      settings.enabled && 
      state.totalSentences > 0 && 
      !state.isPlaying && 
      hasLoadedRef.current &&
      !autoPlayTriggeredRef.current
    ) {
      console.log('[TTSPlayer] Text loaded and ready, triggering auto-play');
      autoPlayTriggeredRef.current = true; // Mark as triggered
      
      // Small delay to ensure everything is ready
      const timer = setTimeout(() => {
        console.log('[TTSPlayer] Executing auto-play');
        actions.play();
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [settings.autoPlay, settings.enabled, state.totalSentences, state.isPlaying, actions]);

  // If browser blocks autoplay, retry once user interacts with the page
  useEffect(() => {
    if (!isAutoplayBlocked || !settings.enabled || !settings.autoPlay || state.isPlaying) {
      return;
    }

    const retryPlayback = () => {
      setIsAutoplayBlocked(false);
      actions.play();
    };

    window.addEventListener('pointerdown', retryPlayback, { once: true });
    window.addEventListener('keydown', retryPlayback, { once: true });

    return () => {
      window.removeEventListener('pointerdown', retryPlayback);
      window.removeEventListener('keydown', retryPlayback);
    };
  }, [isAutoplayBlocked, settings.enabled, settings.autoPlay, state.isPlaying, actions]);

  // Notify parent when playing state changes
  useEffect(() => {
    if (onPlayingStateChange) {
      onPlayingStateChange(state.isPlaying);
    }
  }, [state.isPlaying, onPlayingStateChange]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!settings.enabled) return;

      // Alt + P: Play/Pause
      if (e.altKey && e.key === 'p') {
        e.preventDefault();
        actions.toggle();
      }

      // Alt + S: Stop
      if (e.altKey && e.key === 's') {
        e.preventDefault();
        actions.stop();
      }

      // Alt + ArrowLeft: Previous sentence
      if (e.altKey && e.key === 'ArrowLeft') {
        e.preventDefault();
        actions.previousSentence();
      }

      // Alt + ArrowRight: Next sentence
      if (e.altKey && e.key === 'ArrowRight') {
        e.preventDefault();
        actions.nextSentence();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [settings.enabled, actions]);

  if (!settings.enabled || !state.isSupported) {
    return null;
  }

  const progressPercentage = state.totalSentences > 0
    ? (state.currentSentenceIndex / state.totalSentences) * 100
    : 0;

  const playbackStatusLabel = isAutoplayBlocked
    ? 'Bloqueado por navegador'
    : state.isPlaying
    ? 'Leyendo'
    : state.isPaused
    ? 'Pausado'
    : 'Listo';

  const handleToggle = () => {
    setIsAutoplayBlocked(false);
    actions.toggle();
  };

  return (
    <>
      {isAutoplayBlocked && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
          <div className="rounded-full border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs text-amber-700 shadow-sm dark:border-amber-700 dark:bg-amber-950/80 dark:text-amber-300">
            Autoplay bloqueado. Toca la pantalla o presiona una tecla.
          </div>
        </div>
      )}

      <div
        className={cn(
          'fixed bottom-4 left-1/2 -translate-x-1/2',
          'bg-white dark:bg-gray-800 rounded-lg shadow-lg',
          'border border-gray-200 dark:border-gray-700',
          'px-3 sm:px-4 py-2.5 sm:py-3 flex items-center gap-3 sm:gap-4',
          'min-w-[280px] sm:min-w-[320px] max-w-md',
          'z-40',
          className
        )}
        role="region"
        aria-label="Text-to-Speech Player"
      >
      {/* Play/Pause Button */}
      <button
        onClick={handleToggle}
        className={cn(
          'w-10 h-10 rounded-full flex items-center justify-center',
          'transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
          state.isPlaying
            ? 'bg-blue-600 hover:bg-blue-700 text-white'
            : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200'
        )}
        aria-label={state.isPlaying ? 'Pause reading' : 'Start reading'}
        aria-pressed={state.isPlaying}
      >
        {state.isPlaying ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>

      {/* Progress Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between text-sm mb-1">
          <span className="text-gray-700 dark:text-gray-300 font-medium">
            {playbackStatusLabel}
          </span>
          <span className="text-gray-500 dark:text-gray-400 text-xs">
            {state.currentSentenceIndex + 1} / {state.totalSentences}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-blue-600 h-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercentage}%` }}
            role="progressbar"
            aria-valuenow={state.currentSentenceIndex}
            aria-valuemin={0}
            aria-valuemax={state.totalSentences}
          />
        </div>
      </div>

      {/* Previous Sentence */}
      <button
        onClick={actions.previousSentence}
        disabled={state.currentSentenceIndex === 0}
        className={cn(
          'w-10 h-10 sm:w-8 sm:h-8 rounded flex items-center justify-center',
          'transition-colors duration-200',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
          state.currentSentenceIndex === 0
            ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
        )}
        aria-label="Previous sentence"
        title="Previous sentence (Alt+←)"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-5 h-5"
        >
          <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
        </svg>
      </button>

      {/* Next Sentence */}
      <button
        onClick={actions.nextSentence}
        disabled={state.currentSentenceIndex >= state.totalSentences - 1}
        className={cn(
          'w-10 h-10 sm:w-8 sm:h-8 rounded flex items-center justify-center',
          'transition-colors duration-200',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
          state.currentSentenceIndex >= state.totalSentences - 1
            ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
        )}
        aria-label="Next sentence"
        title="Next sentence (Alt+→)"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-5 h-5"
        >
          <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z" />
        </svg>
      </button>

      {/* Stop Button */}
      <button
        onClick={actions.stop}
        className={cn(
          'w-10 h-10 sm:w-8 sm:h-8 rounded flex items-center justify-center',
          'text-gray-600 dark:text-gray-400',
          'hover:bg-gray-100 dark:hover:bg-gray-700',
          'transition-colors duration-200',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
        )}
        aria-label="Stop reading"
        title="Stop (Alt+S)"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-4 h-4"
        >
          <path d="M6 6h12v12H6z" />
        </svg>
      </button>

      {/* Screen reader live region */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {state.isPlaying
          ? `Reading sentence ${state.currentSentenceIndex + 1} of ${state.totalSentences}`
          : state.isPaused
          ? 'Paused'
          : 'Stopped'}
      </div>
      </div>
    </>
  );
}
