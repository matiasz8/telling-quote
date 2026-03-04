# TRD-013: Text-to-Speech Implementation

**Status:** Completed  
**Created:** March 2, 2026  
**Last Updated:** March 4, 2026  
**Related PRD:** [PRD-013: Text-to-Speech](../prd/PRD-013-text-to-speech.md)

---

## 1. Overview

This document provides technical implementation details for the Text-to-Speech (TTS) feature introduced in PRD-013. The feature enables users to listen to their readings using the Web Speech API, with support for multiple voices, adjustable playback speed, and seamless integration with the existing auto-advance timer system.

### 1.1 Key Technical Decisions

- **Web Speech API:** Native browser API for speech synthesis (no external dependencies)
- **Sentence-level control:** Parse content into sentences for granular navigation
- **State management:** Custom React hook (`useTTS`) encapsulates all TTS logic
- **Component architecture:** Standalone `TTSPlayer` component with minimal coupling
- **Keyboard shortcuts:** Alt+P, Alt+S, Alt+← / Alt+→ for accessibility

---

## 2. Architecture

### 2.1 Component Structure

```
┌─────────────────────────────────────────┐
│          ReaderPage.tsx                 │
│  ┌───────────────────────────────────┐  │
│  │    Main Reader Content            │  │
│  │    (currentSentence display)      │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │    TTSPlayer Component            │  │
│  │  ┌─────────────────────────────┐  │  │
│  │  │      useTTS Hook            │  │  │
│  │  │  ┌───────────────────────┐  │  │  │
│  │  │  │ Web Speech API        │  │  │  │
│  │  │  │ (window.speechSynthesis)│  │  │
│  │  │  └───────────────────────┘  │  │  │
│  │  └─────────────────────────────┘  │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

### 2.2 Data Flow

```
User Action
    ↓
TTSPlayer UI (Play/Pause/Stop buttons)
    ↓
useTTS Hook
    ↓
Web Speech API (SpeechSynthesisUtterance)
    ↓
Browser Audio Output
    ↓
Callback Events (onStart, onEnd, onError)
    ↓
State Update (isPlaying, currentSentenceIndex)
    ↓
UI Re-render (Progress bar, sentence highlighting)
```

---

## 3. Core Implementation

### 3.1 Type Definitions

**Location:** `types/index.ts`

```typescript
export type TTSSettings = {
  enabled: boolean;
  voice: string; // Voice name (e.g., 'es-MX-DaliaNeural')
  rate: number; // 0.5 - 2.0
  autoPlay: boolean; // Auto-start when opening reading
  highlightText: boolean; // Highlight current sentence
  skipCode: boolean; // Skip code blocks
};

export type Settings = {
  fontSize: FontSize;
  theme: Theme;
  accessibility?: AccessibilitySettings;
  autoAdvance?: AutoAdvanceSettings;
  tts?: TTSSettings; // ← New property
};
```

### 3.2 Default Settings

**Location:** `lib/constants/settings.ts`

```typescript
export const DEFAULT_SETTINGS = {
  // ... existing settings ...
  tts: {
    enabled: false,
    voice: 'es-MX-DaliaNeural',
    rate: 1.0,
    autoPlay: false,
    highlightText: true,
    skipCode: true,
  },
};
```

---

## 4. useTTS Hook

**Location:** `hooks/useTTS.ts`

### 4.1 Hook Interface

```typescript
type UseTTSOptions = {
  settings: TTSSettings;
  onSentenceChange?: (index: number) => void;
  onComplete?: () => void;
  onError?: (error: Error) => void;
};

export function useTTS(options: UseTTSOptions) {
  // Returns: { state, actions }
}
```

### 4.2 State Management

```typescript
export type TTSState = {
  isPlaying: boolean;
  isPaused: boolean;
  currentSentenceIndex: number;
  totalSentences: number;
  isSupported: boolean; // Web Speech API availability
  availableVoices: SpeechSynthesisVoice[];
  currentVoice: SpeechSynthesisVoice | null;
};
```

### 4.3 Key Methods

#### load(text: string)
Parses content into sentences and prepares for playback:

```typescript
const load = useCallback((text: string) => {
  // 1. Filter code blocks if skipCode is enabled
  const filteredText = filterCodeBlocks(text);
  
  // 2. Split text into sentences
  const sentences = parseTextIntoSentences(filteredText);
  
  // 3. Store sentences and reset state
  sentencesRef.current = sentences;
  setState({ totalSentences: sentences.length, currentSentenceIndex: 0 });
}, [settings.skipCode]);
```

#### play()
Starts or resumes speech synthesis:

```typescript
const play = useCallback(() => {
  if (state.isPaused) {
    // Resume paused speech
    window.speechSynthesis.resume();
  } else {
    // Start from current sentence
    speakSentence(state.currentSentenceIndex);
  }
}, [state.isPaused, state.currentSentenceIndex]);
```

#### speakSentence(index: number)
Core speech synthesis method:

```typescript
const speakSentence = useCallback((index: number) => {
  const sentence = sentencesRef.current[index];
  const utterance = new SpeechSynthesisUtterance(sentence);
  
  // Configure utterance
  utterance.voice = state.currentVoice;
  utterance.rate = settings.rate;
  utterance.lang = state.currentVoice.lang;
  
  // Event handlers
  utterance.onstart = () => {
    setState({ isPlaying: true, currentSentenceIndex: index });
    onSentenceChange?.(index);
  };
  
  utterance.onend = () => {
    const nextIndex = index + 1;
    if (nextIndex < sentences.length) {
      speakSentence(nextIndex); // Continue to next sentence
    } else {
      setState({ isPlaying: false });
      onComplete?.(); // All sentences finished
    }
  };
  
  utterance.onerror = (event) => {
    onError?.(new Error(`Speech error: ${event.error}`));
  };
  
  window.speechSynthesis.speak(utterance);
}, [state.currentVoice, settings.rate]);
```

### 4.4 Text Parsing

#### Sentence Splitting
Splits text by sentence delimiters while preserving structure:

```typescript
const parseTextIntoSentences = (text: string): string[] => {
  // Split by: . ! ? followed by space or end-of-string
  const rawSentences = text.split(/([.!?]+(?:\s+|$))/);
  const sentences: string[] = [];
  
  // Combine text with its delimiter
  for (let i = 0; i < rawSentences.length; i += 2) {
    const sentence = rawSentences[i];
    const delimiter = rawSentences[i + 1] || '';
    const combined = (sentence + delimiter).trim();
    if (combined.length > 0) sentences.push(combined);
  }
  
  return sentences;
};
```

#### Code Block Filtering
Removes code blocks when `skipCode` is enabled:

```typescript
const filterCodeBlocks = (text: string): string => {
  if (!settings.skipCode) return text;
  
  // Remove fenced code blocks (```)
  let filtered = text.replace(/```[\s\S]*?```/g, '[código omitido]');
  
  // Remove long inline code (likely not actual code)
  filtered = filtered.replace(/`[^`]{20,}`/g, '[código omitido]');
  
  return filtered;
};
```

### 4.5 Voice Management

```typescript
useEffect(() => {
  const loadVoices = () => {
    const voices = window.speechSynthesis.getVoices();
    
    // Prefer Neural/Premium voices (higher quality)
    const sortedVoices = voices.sort((a, b) => {
      const aIsNeural = a.name.includes('Neural') || a.name.includes('Premium');
      const bIsNeural = b.name.includes('Neural') || b.name.includes('Premium');
      return aIsNeural && !bIsNeural ? -1 : 1;
    });
    
    // Find selected voice or fallback to Spanish or first available
    const selectedVoice = sortedVoices.find(v => v.name === settings.voice)
      || sortedVoices.find(v => v.lang.startsWith('es'))
      || sortedVoices[0];
    
    setState({ availableVoices: sortedVoices, currentVoice: selectedVoice });
  };
  
  loadVoices();
  
  // Voices load asynchronously in some browsers
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }
}, [settings.voice]);
```

---

## 5. TTSPlayer Component

**Location:** `components/TTSPlayer.tsx`

### 5.1 Component Props

```typescript
type TTSPlayerProps = {
  text: string; // Current sentence text
  settings: TTSSettings;
  onSentenceChange?: (index: number) => void;
  onComplete?: () => void; // Called when sentence finishes
  className?: string;
};
```

### 5.2 UI Structure

```
┌───────────────────────────────────────────────────┐
│  TTSPlayer (fixed bottom center)                  │
│  ┌────┬──────────────────┬──────┬──────┬───────┐ │
│  │Play│ Progress Bar     │ Prev │ Next │ Stop  │ │
│  │/   │ "Leyendo 3/12"   │  ◄   │  ►   │  ■    │ │
│  │Pause                                          │ │
│  └────┴──────────────────┴──────┴──────┴───────┘ │
└───────────────────────────────────────────────────┘
```

### 5.3 Keyboard Shortcuts

```typescript
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
```

### 5.4 Auto-Play Logic

```typescript
useEffect(() => {
  if (text && settings.autoPlay && settings.enabled) {
    // Small delay to ensure voices are loaded
    setTimeout(() => actions.play(), 300);
  }
}, [text, settings.autoPlay, settings.enabled]);
```

---

## 6. Settings Integration

**Location:** `components/SettingsModal.tsx`

### 6.1 UI Section

Added complete TTS settings section after Auto-Advance:

- **Enable Toggle:** Master switch for TTS feature
- **Voice Selector:** Dropdown with Spanish/English voices
- **Speed Slider:** 0.5x - 2.0x (default: 1.0x)
- **Auto-play Toggle:** Start reading on page load
- **Highlight Text Toggle:** Visual feedback during speech
- **Skip Code Toggle:** Omit code blocks from speech

### 6.2 State Management

```typescript
// Update TTS settings
const newTTS = { ...settings.tts, enabled: !settings.tts?.enabled };
updateSettings({ tts: newTTS });

// Disable dependent controls when TTS is off
disabled={!settings.tts?.enabled}
```

---

## 7. Reader Integration

**Location:** `app/reader/[id]/page.tsx`

### 7.1 Import

```typescript
import { TTSPlayer } from '@/components/TTSPlayer';
```

### 7.2 Render

```tsx
{/* Text-to-Speech Player */}
{settings.tts && settings.tts.enabled && (
  <TTSPlayer
    text={currentSentence.sentence}
    settings={settings.tts}
    onComplete={() => {
      // Auto-advance to next sentence when TTS finishes
      if (!isFinished) {
        handleNext();
      }
    }}
  />
)}
```

### 7.3 Integration with Auto-Advance

TTS and Auto-Advance can work together:

1. User enables both features
2. TTS reads current sentence
3. When sentence ends → `onComplete()` → `handleNext()`
4. New sentence loads → TTS starts reading
5. Auto-advance timer runs in parallel (for fallback timing)

---

## 8. Browser Compatibility

### 8.1 Web Speech API Support

| Browser | Support | Voice Quality |
|---------|---------|---------------|
| Chrome/Edge 33+ | ✅ Full | ⭐⭐⭐ (Neural voices) |
| Firefox 49+ | ✅ Full | ⭐⭐ (Basic voices) |
| Safari 14.1+ | ✅ Full | ⭐⭐ (Basic voices) |
| iOS Safari 7+ | ✅ Full | ⭐⭐ (Mobile voices) |
| Chrome Android | ✅ Full | ⭐⭐⭐ (Neural voices) |

### 8.2 Feature Detection

```typescript
useEffect(() => {
  const isSupported = 'speechSynthesis' in window;
  setState({ isSupported });
  
  if (!isSupported) {
    onError(new Error('Web Speech API not supported'));
  }
}, []);
```

### 8.3 Voice Availability

**Chrome/Edge (Best):**
- Neural voices (Microsoft, Google)
- Spanish: `es-MX-DaliaNeural`, `es-ES-AlvaroNeural`
- English: `en-US-AriaNeural`, `en-GB-SoniaNeural`

**Firefox/Safari (Good):**
- Basic system voices
- Spanish: Standard system voices
- English: Standard system voices

**Fallback Strategy:**
```typescript
const selectedVoice = sortedVoices.find(v => v.name === settings.voice)
  || sortedVoices.find(v => v.lang.startsWith('es')) // Spanish fallback
  || sortedVoices[0]; // Any available voice
```

---

## 9. Accessibility

### 9.1 ARIA Annotations

```tsx
<div role="region" aria-label="Text-to-Speech Player">
  <button
    aria-label={isPlaying ? "Pause reading" : "Start reading"}
    aria-pressed={isPlaying}
  >
    {/* Icon */}
  </button>
  
  <div aria-live="polite" aria-atomic="true" className="sr-only">
    {isPlaying 
      ? `Reading sentence ${currentSentenceIndex + 1} of ${totalSentences}` 
      : "Paused"}
  </div>
</div>
```

### 9.2 Keyboard Navigation

All controls are keyboard accessible:
- `Tab`: Navigate between controls
- `Space`: Activate focused button
- `Alt + P/S/←/→`: Global shortcuts (work anywhere on page)

### 9.3 Screen Reader Support

- Live regions announce state changes
- Button labels describe current action
- Progress is announced as sentence numbers
- Error messages are spoken

---

## 10. Performance Considerations

### 10.1 Memory Management

```typescript
// Cleanup on component unmount
useEffect(() => {
  return () => {
    window.speechSynthesis.cancel(); // Stop all speech
    utteranceRef.current = null; // Release utterance
  };
}, []);
```

### 10.2 Text Parsing Optimization

- Parse sentences only once on `load()`
- Store in `useRef` (no re-renders on sentence change)
- Filter code blocks before splitting (single pass)

### 10.3 Voice Loading

- Cache voices after first load
- Async loading handled via `onvoiceschanged` event
- Preference for Neural voices sorted once

---

## 11. Testing Checklist

### Functionality
- [x] TTS speaks all sentences correctly
- [x] Play/pause/stop buttons work
- [x] Speed adjustment (0.5x - 2.0x) affects playback
- [x] Voice selection changes voice
- [x] Auto-play starts on page load
- [x] Keyboard shortcuts functional (Alt+P, Alt+S, Alt+←/→)
- [x] Settings persist in localStorage
- [x] Code blocks are skipped when enabled

### Browser Testing
- [x] Chrome/Edge (Neural voices)
- [x] Firefox (basic voices)
- [x] Safari macOS
- [ ] Safari iOS (pending mobile testing)
- [ ] Chrome Android (pending mobile testing)

### Accessibility
- [x] Keyboard navigation complete
- [x] Screen reader compatibility
- [x] ARIA labels present
- [x] Focus management correct
- [x] High-contrast theme compatible
- [x] Reduce motion respected (no animations in player)

### Edge Cases
- [x] Empty text handled gracefully
- [x] Long sentences don't timeout
- [x] Multiple rapid clicks handled correctly
- [x] Settings changes mid-playback respected
- [x] Page navigation stops speech

---

## 12. Known Issues & Limitations

### 12.1 Browser Limitations

1. **Voice Quality:** Neural voices only in Chrome/Edge, basic in other browsers
2. **Voice Loading:** Asynchronous in some browsers (300ms delay on first play)
3. **Concurrent Speech:** Only one SpeechSynthesisUtterance can play at a time (by design)

### 12.2 Feature Limitations

1. **No Offline Support:** Requires internet for some Neural voices
2. **No Background Playback:** Tab must remain open (browser limitation)
3. **No Sentence Highlighting:** Current implementation doesn't highlight text in reader (future enhancement)

### 12.3 Workarounds

- **Slow Voice Loading:** 300ms timeout before playing ensures voices are ready
- **Voice Unavailable:** Automatic fallback to Spanish or first available voice
- **Browser Unsupported:** Feature gracefully hidden if Web Speech API unavailable

---

## 13. Future Enhancements

### Phase 2 (Potential)
- **Sentence Highlighting:** Visual feedback in reader (highlight spoken sentence)
- **Pause on Questions:** Detect questions and pause longer (NLP)
- **Export Audio:** Download MP3 of reading (using MediaRecorder API)
- **Custom Pronunciations:** Dictionary for proper nouns and technical terms
- **Background Playback:** Service Worker for tab-independent playback

### Phase 3 (Advanced)
- **Emotion Detection:** Adjust tone based on punctuation and context
- **Multi-language Auto-detection:** Switch voices based on content language
- **Voice Cloning:** Custom AI voices (via external API)
- **Synchronized Scrolling:** Auto-scroll reader to match speech position

---

## 14. Maintenance

### 14.1 Updating Voices

To add new voices to the dropdown:

```typescript
// In components/SettingsModal.tsx
<optgroup label="Español">
  <option value="es-MX-DaliaNeural">Dalia (Femenino, México)</option>
  <option value="es-AR-ElenaNeural">Elena (Femenino, Argentina)</option>
  {/* Add new voice here */}
</optgroup>
```

### 14.2 Adjusting Speech Rate Range

To change speed limits:

```typescript
// In types/index.ts
rate: number; // Change comment: 0.5 - 2.0 → 0.25 - 3.0

// In components/SettingsModal.tsx
<input
  type="range"
  min={0.25}  // Update min
  max={3.0}   // Update max
  step={0.25}
  value={settings.tts?.rate || 1.0}
/>
```

### 14.3 Debugging TTS Issues

Enable verbose logging:

```typescript
// In useTTS.ts
utterance.onstart = () => {
  console.log('[TTS] Started sentence:', index, sentence);
  // ... existing code
};

utterance.onerror = (event) => {
  console.error('[TTS] Error:', event.error, event);
  // ... existing code
};
```

---

## 15. March 4, 2026 Enhancements (Post-Release)

### 15.1 Playback & Navigation Coordination

- **TTS is now the source of truth for page progression when enabled** to prevent timer desynchronization.
- Auto-advance timer remains available as UI control, but does not advance pages while TTS flow is active.
- Reader shows active mode chip: `Avance: Voz`, `Avance: Timer`, or `Avance: Manual`.

### 15.2 Autoplay Reliability and Browser Policy Handling

- Added explicit handling for browser autoplay policy blocks (`not-allowed`).
- If autoplay is blocked, player displays a non-intrusive toast and retries on first user interaction (`pointerdown`/`keydown`).
- Player status now explicitly shows `Bloqueado por navegador`.

### 15.3 Title Parsing and Sentence Chunking

- TTS input now preserves processed reading chunks using newline delimiters.
- `useTTS` parser prioritizes newline-delimited chunks before punctuation splitting fallback.
- Fix prevents titles with question marks (e.g., `¿...? ...`) from being split into incorrect chunks.

### 15.4 Stop/Error Behavior

- `utterance.onerror` now treats `interrupted`/`canceled` and manual stop as benign events.
- This removes noisy console errors when user presses stop.

### 15.5 UI Improvements

- Added visual emphasis for active spoken content when `highlightText` is enabled and TTS is playing.
- Improved mobile control ergonomics (larger touch targets for previous/next/stop controls).
- Added explicit playback status states in player UI.

### 15.6 Reading Position Persistence

- Reader now persists and restores TTS/reading position per reading via localStorage key `tts-position:<readingId>`.
- Position restoration is clamped to current processed length for safety.

---

## 16. Related Files

### Core Implementation
- `types/index.ts` - Type definitions
- `hooks/useTTS.ts` - TTS hook (300+ lines)
- `components/TTSPlayer.tsx` - Player UI (250+ lines)

### Integration
- `app/reader/[id]/page.tsx` - Reader integration
- `components/SettingsModal.tsx` - Settings UI

### Constants
- `lib/constants/settings.ts` - Default values

### Documentation
- `docs/prd/PRD-013-text-to-speech.md` - Product requirements

---

**Document Version:** 1.1  
**Last Review:** March 4, 2026  
**Next Review:** April 4, 2026  
**Implementation Status:** ✅ Completed
