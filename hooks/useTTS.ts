import { useState, useEffect, useLayoutEffect, useCallback, useRef, useMemo } from 'react';
import type { TTSSettings } from '@/types';

export type TTSState = {
  isPlaying: boolean;
  isPaused: boolean;
  currentSentenceIndex: number;
  totalSentences: number;
  isSupported: boolean;
  availableVoices: SpeechSynthesisVoice[];
};

type UseTTSOptions = {
  settings: TTSSettings;
  onSentenceChange?: (index: number) => void;
  onComplete?: () => void;
  onError?: (error: Error) => void;
};

export function useTTS(options: UseTTSOptions) {
  const { settings, onSentenceChange, onComplete, onError } = options;

  // Check browser support immediately
  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  const [state, setState] = useState<TTSState>({
    isPlaying: false,
    isPaused: false,
    currentSentenceIndex: 0,
    totalSentences: 0,
    isSupported,
    availableVoices: [],
  });

  // Compute current voice based on settings and available voices
  const currentVoice = useMemo(() => {
    if (state.availableVoices.length === 0) {
      console.log('[useTTS] No voices available yet for selection');
      return null;
    }

    console.log('[useTTS] Selecting voice:', settings.voice);
    
    // Try to find the requested voice
    const selectedVoice = state.availableVoices.find(
      (voice) => voice.name === settings.voice
    );

    if (selectedVoice) {
      console.log('[useTTS] Found exact match:', selectedVoice.name);
      return selectedVoice;
    }
    
    // Fallback: try to find any Spanish voice
    const spanishVoice = state.availableVoices.find(
      (voice) => voice.lang.startsWith('es')
    );
    
    if (spanishVoice) {
      console.log('[useTTS] Using fallback Spanish voice:', spanishVoice.name);
      return spanishVoice;
    }
    
    // Last resort: use first available voice
    console.log('[useTTS] Using first available voice:', state.availableVoices[0].name);
    return state.availableVoices[0];
  }, [settings.voice, state.availableVoices]);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const sentencesRef = useRef<string[]>([]);
  const isStoppedRef = useRef(false);
  const speakSentenceRef = useRef<((index: number) => void) | null>(null);

  // Report error if not supported
  useEffect(() => {
    if (!isSupported && onError) {
      onError(new Error('Web Speech API not supported in this browser'));
    }
  }, [isSupported, onError]);

  // Load available voices (using useLayoutEffect to load synchronously)
  useLayoutEffect(() => {
    if (!state.isSupported) return;

    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      
      if (voices.length === 0) {
        console.log('[useTTS] No voices loaded yet');
        return;
      }

      console.log('[useTTS] Loaded', voices.length, 'voices');
      
      // Prefer Neural/Premium voices
      const sortedVoices = voices.sort((a, b) => {
        const aIsNeural = a.name.includes('Neural') || a.name.includes('Premium');
        const bIsNeural = b.name.includes('Neural') || b.name.includes('Premium');
        if (aIsNeural && !bIsNeural) return -1;
        if (!aIsNeural && bIsNeural) return 1;
        return 0;
      });

      setState((prev) => ({ ...prev, availableVoices: sortedVoices }));
    };

    // Load voices immediately
    loadVoices();

    // Voices might load asynchronously in some browsers
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, [state.isSupported]);

  // Parse text into speakable chunks
  const parseTextIntoSentences = useCallback((text: string): string[] => {
    // Preferred path: if producer provides newline-delimited chunks, preserve them as-is
    if (text.includes('\n')) {
      return text
        .split(/\n+/)
        .map((chunk) => chunk.trim())
        .filter((chunk) => chunk.length > 0);
    }

    // Fallback: split by sentence endings, preserving the delimiter
    const rawSentences = text.split(/([.!?]+(?:\s+|$))/);
    const sentences: string[] = [];

    for (let i = 0; i < rawSentences.length; i += 2) {
      const sentence = rawSentences[i];
      const delimiter = rawSentences[i + 1] || '';
      const combined = (sentence + delimiter).trim();

      if (combined.length > 0) {
        sentences.push(combined);
      }
    }

    return sentences;
  }, []);

  // Filter out code blocks if skipCode is enabled
  const filterCodeBlocks = useCallback((text: string): string => {
    if (!settings.skipCode) return text;

    // Remove code blocks (```)
    let filtered = text.replace(/```[\s\S]*?```/g, '[código omitido]');
    
    // Remove inline code (`) but keep short ones (likely not code)
    filtered = filtered.replace(/`[^`]{20,}`/g, '[código omitido]');
    
    return filtered;
  }, [settings.skipCode]);

  // Estimate speech duration for auto-advance integration
  const estimateSpeechDuration = useCallback((text: string, rate: number): number => {
    const wordsPerMinute = 150 * rate; // Average speaking rate
    const wordCount = text.split(/\s+/).length;
    return (wordCount / wordsPerMinute) * 60 * 1000; // milliseconds
  }, []);

  // Speak a specific sentence
  const speakSentence = useCallback((index: number) => {
    if (!state.isSupported || index >= sentencesRef.current.length) {
      console.log('[useTTS] Cannot speak - not supported or invalid index:', index);
      return;
    }

    // Get current voice or fallback
    let voice = currentVoice;
    
    if (!voice && state.availableVoices.length > 0) {
      console.log('[useTTS] No voice set, using fallback');
      voice = state.availableVoices.find(v => v.lang.startsWith('es')) || state.availableVoices[0];
    }
    
    if (!voice) {
      console.error('[useTTS] No voice available at all');
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const sentence = sentencesRef.current[index];
    console.log('[useTTS] Speaking sentence', index, 'of', sentencesRef.current.length, ':', sentence.substring(0, 50));
    
    const utterance = new SpeechSynthesisUtterance(sentence);
    
    utterance.voice = voice;
    utterance.rate = settings.rate;
    utterance.lang = voice.lang;

    utterance.onstart = () => {
      console.log('[useTTS] Started speaking sentence:', index);
      setState((prev) => ({ 
        ...prev, 
        isPlaying: true, 
        isPaused: false,
        currentSentenceIndex: index 
      }));
      
      if (onSentenceChange) {
        onSentenceChange(index);
      }
    };

    utterance.onend = () => {
      console.log('[useTTS] Sentence complete:', index);
      
      if (isStoppedRef.current) {
        console.log('[useTTS] Was stopped, not advancing');
        isStoppedRef.current = false;
        return;
      }

      // Move to next sentence
      const nextIndex = index + 1;
      
      if (nextIndex < sentencesRef.current.length) {
        console.log('[useTTS] Moving to next sentence:', nextIndex);
        // Use ref to avoid closure issue
        if (speakSentenceRef.current) {
          speakSentenceRef.current(nextIndex);
        }
      } else {
        console.log('[useTTS] All sentences complete, calling onComplete');
        // All sentences complete
        setState((prev) => ({ 
          ...prev, 
          isPlaying: false, 
          currentSentenceIndex: 0 
        }));
        
        if (onComplete) {
          console.log('[useTTS] Calling onComplete callback');
          onComplete();
        }
      }
    };

    utterance.onerror = (event) => {
      const errorType = event.error || 'unknown';
      const isBenignStop = isStoppedRef.current || errorType === 'interrupted' || errorType === 'canceled';

      if (isBenignStop) {
        isStoppedRef.current = false;
        setState((prev) => ({ ...prev, isPlaying: false, isPaused: false }));
        return;
      }

      console.error('TTS error:', errorType, event);
      setState((prev) => ({ ...prev, isPlaying: false, isPaused: false }));

      if (onError) {
        onError(new Error(`Speech synthesis error: ${errorType}`));
      }
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [state.isSupported, currentVoice, state.availableVoices, settings.rate, onSentenceChange, onComplete, onError]);

  // Store the function in ref to avoid closure issues
  useEffect(() => {
    speakSentenceRef.current = speakSentence;
  }, [speakSentence]);

  // Load and prepare text for TTS
  const load = useCallback((text: string) => {
    if (!state.isSupported) return;

    const filteredText = filterCodeBlocks(text);
    const sentences = parseTextIntoSentences(filteredText);
    
    sentencesRef.current = sentences;
    setState((prev) => ({ 
      ...prev, 
      totalSentences: sentences.length,
      currentSentenceIndex: 0 
    }));
  }, [state.isSupported, filterCodeBlocks, parseTextIntoSentences]);

  // Play from current position
  const play = useCallback(() => {
    console.log('[useTTS] Play called:', {
      isSupported: state.isSupported,
      enabled: settings.enabled,
      isPaused: state.isPaused,
      currentIndex: state.currentSentenceIndex,
      totalSentences: sentencesRef.current.length,
      hasVoice: !!currentVoice,
    });

    if (!state.isSupported || !settings.enabled) {
      console.log('[useTTS] Cannot play - not supported or not enabled');
      return;
    }

    if (sentencesRef.current.length === 0) {
      console.log('[useTTS] Cannot play - no sentences loaded yet');
      return;
    }

    if (state.isPaused) {
      // Resume paused speech
      console.log('[useTTS] Resuming paused speech');
      window.speechSynthesis.resume();
      setState((prev) => ({ ...prev, isPlaying: true, isPaused: false }));
    } else {
      // Start from current sentence
      console.log('[useTTS] Starting from sentence:', state.currentSentenceIndex);
      speakSentence(state.currentSentenceIndex);
    }
  }, [state.isSupported, state.isPaused, state.currentSentenceIndex, settings.enabled, speakSentence, currentVoice]);

  // Pause current speech
  const pause = useCallback(() => {
    if (!state.isSupported || !state.isPlaying) return;

    window.speechSynthesis.pause();
    setState((prev) => ({ ...prev, isPlaying: false, isPaused: true }));
  }, [state.isSupported, state.isPlaying]);

  // Stop and reset
  const stop = useCallback(() => {
    if (!state.isSupported) return;

    isStoppedRef.current = true;
    window.speechSynthesis.cancel();
    setState((prev) => ({ 
      ...prev, 
      isPlaying: false, 
      isPaused: false,
      currentSentenceIndex: 0 
    }));
  }, [state.isSupported]);

  // Toggle play/pause
  const toggle = useCallback(() => {
    if (state.isPlaying) {
      pause();
    } else {
      play();
    }
  }, [state.isPlaying, pause, play]);

  // Go to specific sentence
  const goToSentence = useCallback((index: number) => {
    if (index < 0 || index >= sentencesRef.current.length) return;

    const wasPlaying = state.isPlaying;
    stop();
    
    setState((prev) => ({ ...prev, currentSentenceIndex: index }));
    
    if (wasPlaying) {
      // Small delay to ensure stop completes
      setTimeout(() => speakSentence(index), 100);
    }
  }, [state.isPlaying, stop, speakSentence]);

  // Next sentence
  const nextSentence = useCallback(() => {
    goToSentence(state.currentSentenceIndex + 1);
  }, [state.currentSentenceIndex, goToSentence]);

  // Previous sentence
  const previousSentence = useCallback(() => {
    goToSentence(state.currentSentenceIndex - 1);
  }, [state.currentSentenceIndex, goToSentence]);

  // Change voice
  const setVoice = useCallback((voiceName: string) => {
    console.warn('[useTTS] setVoice is deprecated. Please update settings.voice instead. Requested:', voiceName);
    
    // If playing, restart with new voice after settings are updated
    if (state.isPlaying) {
      const currentIndex = state.currentSentenceIndex;
      stop();
      setTimeout(() => speakSentence(currentIndex), 100);
    }
  }, [state.isPlaying, state.currentSentenceIndex, stop, speakSentence]);

  // Get estimated duration for current sentence (for auto-advance sync)
  const getCurrentSentenceDuration = useCallback((): number => {
    if (state.currentSentenceIndex >= sentencesRef.current.length) return 0;
    
    const sentence = sentencesRef.current[state.currentSentenceIndex];
    return estimateSpeechDuration(sentence, settings.rate);
  }, [state.currentSentenceIndex, settings.rate, estimateSpeechDuration]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  return {
    state: {
      ...state,
      currentVoice, // Add computed currentVoice to state for API compatibility
    },
    actions: {
      load,
      play,
      pause,
      stop,
      toggle,
      goToSentence,
      nextSentence,
      previousSentence,
      setVoice,
      getCurrentSentenceDuration,
    },
  };
}
