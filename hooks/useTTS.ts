import { useState, useEffect, useCallback, useRef } from 'react';
import type { TTSSettings } from '@/types';

export type TTSState = {
  isPlaying: boolean;
  isPaused: boolean;
  currentSentenceIndex: number;
  totalSentences: number;
  isSupported: boolean;
  availableVoices: SpeechSynthesisVoice[];
  currentVoice: SpeechSynthesisVoice | null;
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
    currentVoice: null,
  });

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

  // Load available voices
  useEffect(() => {
    if (!state.isSupported) return;

    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      
      // Prefer Neural/Premium voices
      const sortedVoices = voices.sort((a, b) => {
        const aIsNeural = a.name.includes('Neural') || a.name.includes('Premium');
        const bIsNeural = b.name.includes('Neural') || b.name.includes('Premium');
        if (aIsNeural && !bIsNeural) return -1;
        if (!aIsNeural && bIsNeural) return 1;
        return 0;
      });

      setState((prev) => ({ ...prev, availableVoices: sortedVoices }));

      // Set default voice based on settings
      const selectedVoice = sortedVoices.find(
        (voice) => voice.name === settings.voice
      ) || sortedVoices.find(
        (voice) => voice.lang.startsWith('es')
      ) || sortedVoices[0];

      setState((prev) => ({ ...prev, currentVoice: selectedVoice }));
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
  }, [state.isSupported, settings.voice]);

  // Parse text into sentences
  const parseTextIntoSentences = useCallback((text: string): string[] => {
    // Split by sentence endings, preserving the delimiter
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
    if (!state.isSupported || !state.currentVoice || index >= sentencesRef.current.length) {
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const sentence = sentencesRef.current[index];
    const utterance = new SpeechSynthesisUtterance(sentence);
    
    utterance.voice = state.currentVoice;
    utterance.rate = settings.rate;
    utterance.lang = state.currentVoice.lang;

    utterance.onstart = () => {
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
      if (isStoppedRef.current) {
        isStoppedRef.current = false;
        return;
      }

      // Move to next sentence
      const nextIndex = index + 1;
      
      if (nextIndex < sentencesRef.current.length) {
        // Use ref to avoid closure issue
        if (speakSentenceRef.current) {
          speakSentenceRef.current(nextIndex);
        }
      } else {
        // All sentences complete
        setState((prev) => ({ 
          ...prev, 
          isPlaying: false, 
          currentSentenceIndex: 0 
        }));
        
        if (onComplete) {
          onComplete();
        }
      }
    };

    utterance.onerror = (event) => {
      console.error('TTS error:', event);
      setState((prev) => ({ ...prev, isPlaying: false, isPaused: false }));
      
      if (onError) {
        onError(new Error(`Speech synthesis error: ${event.error}`));
      }
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [state.isSupported, state.currentVoice, settings.rate, onSentenceChange, onComplete, onError]);

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
    if (!state.isSupported || !settings.enabled) return;

    if (state.isPaused) {
      // Resume paused speech
      window.speechSynthesis.resume();
      setState((prev) => ({ ...prev, isPlaying: true, isPaused: false }));
    } else {
      // Start from current sentence
      speakSentence(state.currentSentenceIndex);
    }
  }, [state.isSupported, state.isPaused, state.currentSentenceIndex, settings.enabled, speakSentence]);

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
    const voice = state.availableVoices.find((v) => v.name === voiceName);
    if (voice) {
      setState((prev) => ({ ...prev, currentVoice: voice }));
      
      // If playing, restart with new voice
      if (state.isPlaying) {
        const currentIndex = state.currentSentenceIndex;
        stop();
        setTimeout(() => speakSentence(currentIndex), 100);
      }
    }
  }, [state.availableVoices, state.isPlaying, state.currentSentenceIndex, stop, speakSentence]);

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
    state,
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
