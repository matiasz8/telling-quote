'use client';

import { useEffect, useRef } from 'react';
import type { TTSSettings } from '@/types';
import { useTTS } from '@/hooks/useTTS';
import { cn } from '@/lib/utils';

type TTSPlayerProps = {
  text: string;
  settings: TTSSettings;
  onSentenceChange?: (index: number) => void;
  onComplete?: () => void;
  className?: string;
};

export function TTSPlayer({
  text,
  settings,
  onSentenceChange,
  onComplete,
  className,
}: TTSPlayerProps) {
  const { state, actions } = useTTS({
    settings,
    onSentenceChange,
    onComplete,
    onError: (error) => {
      console.error('TTS Error:', error);
    },
  });

  const hasLoadedRef = useRef(false);
  const prevTextRef = useRef<string>(text);

  // Load text when component mounts or text changes
  useEffect(() => {
    if (!text) return;

    const isTextChanged = text !== prevTextRef.current;
    const wasPlaying = state.isPlaying;

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
      actions.load(text);
      hasLoadedRef.current = true;

      // Auto-play if enabled
      if (settings.autoPlay && settings.enabled) {
        setTimeout(() => actions.play(), 300);
      }
    }
  }, [text, settings.autoPlay, settings.enabled, actions, state.isPlaying]);

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

  return (
    <div
      className={cn(
        'fixed bottom-4 left-1/2 -translate-x-1/2',
        'bg-white dark:bg-gray-800 rounded-lg shadow-lg',
        'border border-gray-200 dark:border-gray-700',
        'px-4 py-3 flex items-center gap-4',
        'min-w-[320px] max-w-md',
        'z-40',
        className
      )}
      role="region"
      aria-label="Text-to-Speech Player"
    >
      {/* Play/Pause Button */}
      <button
        onClick={actions.toggle}
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
            {state.isPlaying ? 'Leyendo' : state.isPaused ? 'Pausado' : 'Listo'}
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
          'w-8 h-8 rounded flex items-center justify-center',
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
          'w-8 h-8 rounded flex items-center justify-center',
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
          'w-8 h-8 rounded flex items-center justify-center',
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
  );
}
