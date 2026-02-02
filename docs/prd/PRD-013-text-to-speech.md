# PRD-013: Text-to-Speech for Reading Mode

**Status:** 📝 Draft  
**Created:** February 2, 2026  
**Last Updated:** February 2, 2026  
**Owner:** Product Team  
**Priority:** High  
**Related:** PRD-012 (Auto-Advance Timer), PRD-008 (Advanced Accessibility)

---

## 1. Overview

### Purpose
Implement **Text-to-Speech (TTS)** functionality integrated into Reading Mode, allowing users to have slide content read aloud with natural-sounding voices in Spanish and English. When combined with Auto-Advance Timer (PRD-012), slides automatically progress after narration completes, enabling fully hands-free reading experiences.

### Background
Text-to-Speech is critical for:
- **Accessibility**: Blind and low vision users (WCAG 2.1 AA requirement)
- **Multitasking**: Users reading while cooking, exercising, commuting
- **Language Learning**: Hearing pronunciation while reading
- **Cognitive Support**: Users with dyslexia, ADHD, or reading difficulties
- **Efficiency**: Consuming content faster through audio

PRD-008 defines advanced TTS with voice commands and full accessibility suite. This PRD focuses on **core TTS for Reading Mode** with auto-advance integration, as a simpler, faster-to-implement solution.

### Goals
1. Implement natural-sounding Text-to-Speech in Reader
2. Support 2 voices in Spanish (male + female)
3. Support 2 voices in English (male + female)
4. Integrate with Auto-Advance Timer (PRD-012) for synchronized reading
5. Provide play/pause/stop controls
6. Allow speed adjustment (0.5x - 2x)
7. Visual highlighting of currently spoken text

### Non-Goals
- Voice commands (covered in PRD-008)
- Advanced voice customization (pitch, tone, emphasis)
- Offline voice synthesis
- Custom voice uploads
- Multi-language mixing in same reading
- Real-time translation

---

## 2. Problem Statement

### Current Pain Points

1. **No Audio Option**: Users can't listen to readings, only read visually
2. **Manual Advancement Required**: Users must press keys/swipe for each slide
3. **Accessibility Gap**: Blind users depend on generic screen readers (not optimized for app)
4. **Multitasking Impossible**: Can't consume content while doing other activities
5. **Language Learning Limited**: No way to hear pronunciation
6. **Reading Fatigue**: Long readings cause eye strain without audio alternative

### User Impact

**Without TTS:**
- Blind users: Must use generic screen readers (suboptimal experience)
- Multitaskers: Can't read while cooking, exercising, driving
- Language learners: Miss pronunciation and listening practice
- Dyslexic users: Struggle with text-only format

**With TTS:**
- Blind users: Optimized narration of app content
- Multitaskers: Fully hands-free reading (audio + auto-advance)
- Language learners: Hear correct pronunciation while reading
- Dyslexic users: Process content auditorily (often easier)

---

## 3. User Stories

### As a blind user
- I want slides read aloud automatically so I don't need to navigate with keyboard
- I want natural-sounding voices (not robotic) so listening is pleasant
- I want to control speed so I can listen at my comfortable pace

### As a busy professional
- I want to press "Play" and have entire reading narrated while I cook breakfast
- I want slides to auto-advance after narration so it's fully hands-free
- I want to pause/resume easily if I need to focus on something else

### As a language learner
- I want to hear Spanish text read by native-sounding voice
- I want to see words highlighted as they're spoken so I can follow along
- I want to slow down speech to better understand pronunciation

### As a user with dyslexia
- I want to listen to content instead of reading text
- I want visual highlighting synchronized with audio so I can follow along
- I want to adjust speed to match my processing pace

---

## 4. Functional Requirements

### FR-1: Voice Selection

**Supported Voices:**

**Spanish (Español):**
1. **es-ES-Standard-A** (Female, Castilian Spanish)
   - Natural, clear, professional tone
   - Good for formal content, articles, academic papers
   
2. **es-ES-Standard-B** (Male, Castilian Spanish)
   - Warm, conversational tone
   - Good for narratives, stories, casual content

**English (Inglés):**
3. **en-US-Standard-C** (Female, American English)
   - Clear, neutral accent
   - Good for technical content, tutorials

4. **en-US-Standard-D** (Male, American English)
   - Professional, authoritative tone
   - Good for business content, reports

**Voice Selection UI:**
```tsx
<div className="space-y-2" data-tour="settings-tts-voice">
  <label htmlFor="tts-voice">
    Voz de Lectura
  </label>
  <select id="tts-voice" value={selectedVoice}>
    <optgroup label="Español">
      <option value="es-ES-Standard-A">🇪🇸 Mujer (Castellano)</option>
      <option value="es-ES-Standard-B">🇪🇸 Hombre (Castellano)</option>
    </optgroup>
    <optgroup label="English">
      <option value="en-US-Standard-C">🇺🇸 Woman (American)</option>
      <option value="en-US-Standard-D">🇺🇸 Man (American)</option>
    </optgroup>
  </select>
  
  {/* Preview Button */}
  <button onClick={previewVoice}>
    🔊 Probar Voz
  </button>
</div>
```

**Default Voice:**
- If app language is Spanish: `es-ES-Standard-A` (Female)
- If app language is English: `en-US-Standard-C` (Female)

### FR-2: TTS Settings UI

**Location**: Settings Modal → New "Lectura de Voz" Section

**Settings:**
```tsx
<div className="space-y-4" data-tour="settings-tts">
  <h3>🔊 Lectura de Voz (Text-to-Speech)</h3>
  
  {/* Enable/Disable TTS */}
  <div className="flex items-center justify-between">
    <label htmlFor="tts-enabled">
      Lectura de Voz Automática
    </label>
    <input 
      type="checkbox" 
      id="tts-enabled" 
      checked={ttsEnabled}
    />
  </div>
  
  {/* Voice Selection (from FR-1) */}
  {/* ... */}
  
  {/* Speech Rate */}
  <div className="space-y-2">
    <label htmlFor="tts-rate">
      Velocidad: <strong>{speechRate}x</strong>
    </label>
    <input 
      type="range" 
      id="tts-rate"
      min="0.5" 
      max="2" 
      step="0.1"
      value={speechRate}
    />
    <div className="flex justify-between text-xs text-gray-600">
      <span>Lenta (0.5x)</span>
      <span>Normal (1x)</span>
      <span>Rápida (1.5x)</span>
      <span>Muy Rápida (2x)</span>
    </div>
  </div>
  
  {/* Highlight Spoken Text */}
  <div className="flex items-center justify-between">
    <label htmlFor="tts-highlight">
      Resaltar Texto al Hablar
    </label>
    <input 
      type="checkbox" 
      id="tts-highlight" 
      checked={highlightSpokenText}
    />
  </div>
  
  {/* Auto-Start on Slide Change */}
  <div className="flex items-center justify-between">
    <label htmlFor="tts-auto-start">
      Iniciar Automáticamente en Nueva Slide
    </label>
    <input 
      type="checkbox" 
      id="tts-auto-start" 
      checked={autoStartTTS}
    />
  </div>
  
  {/* Integration with Auto-Advance */}
  {autoAdvanceEnabled && (
    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
      <label className="flex items-center space-x-2">
        <input 
          type="checkbox" 
          id="tts-auto-advance"
          checked={ttsAutoAdvance}
        />
        <span className="text-sm">
          ⚡ Avanzar slide automáticamente después de narración
        </span>
      </label>
      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
        Cuando está activo, las slides avanzan automáticamente al terminar de leer el texto en voz alta.
      </p>
    </div>
  )}
</div>
```

**Default Values:**
- TTS Enabled: `false` (opt-in)
- Voice: `es-ES-Standard-A` (Female Spanish)
- Speech Rate: `1.0` (normal speed)
- Highlight Spoken Text: `true`
- Auto-Start on Slide Change: `true` (if TTS enabled)
- Auto-Advance after Narration: `false` (requires explicit opt-in)

### FR-3: TTS Controls in Reader

**Visual Controls:**

```tsx
<div className="tts-controls">
  {/* Main Play/Pause Button */}
  <button 
    onClick={toggleTTS}
    className="tts-play-button"
    aria-label={isSpeaking ? "Pausar lectura" : "Iniciar lectura"}
  >
    {isSpeaking ? (
      <>
        <PauseIcon className="w-6 h-6" />
        <span>Pausar</span>
      </>
    ) : (
      <>
        <PlayIcon className="w-6 h-6" />
        <span>Reproducir</span>
      </>
    )}
  </button>
  
  {/* Stop Button */}
  <button 
    onClick={stopTTS}
    disabled={!isSpeaking}
    aria-label="Detener lectura"
  >
    <StopIcon className="w-5 h-5" />
    <span>Detener</span>
  </button>
  
  {/* Speed Control */}
  <div className="tts-speed-control">
    <button onClick={decreaseSpeed} aria-label="Disminuir velocidad">
      <ChevronDownIcon className="w-4 h-4" />
    </button>
    <span className="speed-display">{speechRate}x</span>
    <button onClick={increaseSpeed} aria-label="Aumentar velocidad">
      <ChevronUpIcon className="w-4 h-4" />
    </button>
  </div>
  
  {/* Voice Selector (Quick) */}
  <select 
    value={selectedVoice} 
    onChange={changeVoice}
    className="tts-voice-selector"
  >
    <option value="es-ES-Standard-A">🇪🇸 Mujer</option>
    <option value="es-ES-Standard-B">🇪🇸 Hombre</option>
    <option value="en-US-Standard-C">🇺🇸 Woman</option>
    <option value="en-US-Standard-D">🇺🇸 Man</option>
  </select>
  
  {/* Progress Indicator (when speaking) */}
  {isSpeaking && (
    <div className="tts-progress">
      <div className="progress-bar" style={{ width: `${progress}%` }} />
      <span className="progress-text">
        {Math.round(progress)}% completado
      </span>
    </div>
  )}
</div>
```

**Position:**
- Desktop: Bottom-right corner (floating controls)
- Mobile: Bottom sheet (swipe up to reveal)
- Compact mode: Single FAB (Floating Action Button) that expands

**Keyboard Shortcuts:**
- `S`: Start/Stop TTS
- `Space`: Pause/Resume TTS (if TTS active)
- `Shift + →`: Skip to next sentence
- `Shift + ←`: Repeat current sentence
- `]`: Increase speed by 0.1x
- `[`: Decrease speed by 0.1x
- `V`: Change voice (cycles through available voices)

**Touch Gestures (Mobile):**
- Double tap: Start/Stop TTS
- Three-finger swipe right: Skip sentence
- Three-finger swipe left: Repeat sentence
- Pinch: Adjust speed

### FR-4: Text Highlighting During Speech

**Highlighting Behavior:**

**Word-Level Highlighting (Primary):**
```css
.tts-current-word {
  background: linear-gradient(
    to bottom,
    rgba(59, 130, 246, 0.3),  /* Blue highlight */
    rgba(59, 130, 246, 0.2)
  );
  border-radius: 2px;
  padding: 0 2px;
  transition: background 0.1s ease;
}
```

**Sentence-Level Highlighting (Secondary):**
```css
.tts-current-sentence {
  background: rgba(251, 191, 36, 0.1); /* Subtle amber */
  border-left: 3px solid #f59e0b;       /* Amber accent */
  padding-left: 8px;
  margin-left: -11px;
}
```

**Implementation:**
- Use Web Speech API `boundary` events to track word positions
- Highlight current word in blue
- Highlight current sentence with left border
- Smooth transitions between words (0.1s ease)
- Auto-scroll to keep highlighted word visible

**Accessibility:**
- ARIA live region announces "Reading word X of Y"
- High contrast mode: Use solid borders instead of backgrounds
- Reduced motion: Disable smooth scrolling

### FR-5: TTS Integration with Auto-Advance Timer

**When BOTH TTS and Auto-Advance are enabled:**

**Synchronized Flow:**
1. User enables TTS in Settings
2. User enables Auto-Advance in Settings
3. User checks "Avanzar slide automáticamente después de narración"
4. User opens reading
5. **Automatic Flow:**
   - TTS starts reading slide aloud
   - Word-by-word highlighting follows narration
   - Auto-Advance timer is synchronized with TTS duration
   - When TTS finishes narration:
     - 2-second buffer pause (processing time)
     - Slide advances automatically to next
     - TTS starts reading next slide immediately
   - Loop continues until last slide

**Timing Calculation:**
```typescript
function calculateTTSDuration(text: string, speechRate: number): number {
  // Average speech: ~150 words per minute at 1x speed
  const baseWPM = 150;
  const adjustedWPM = baseWPM * speechRate;
  
  const wordCount = text.split(/\s+/).length;
  const durationSeconds = (wordCount / adjustedWPM) * 60;
  const bufferSeconds = 2; // Processing buffer
  
  return (durationSeconds + bufferSeconds) * 1000; // milliseconds
}
```

**User Controls (when synchronized):**
- **Pause Button**: Pauses BOTH TTS and Auto-Advance timer
- **Resume Button**: Resumes BOTH
- **Speed Adjustment**: Affects BOTH (TTS speed and timer calculation)
- **Manual Slide Advance**: Stops TTS, resets timer, starts TTS on new slide
- **Stop Button**: Stops TTS entirely, disables Auto-Advance for current session

**Visual Indicator:**
```tsx
{ttsEnabled && autoAdvanceEnabled && ttsAutoAdvance && (
  <div className="sync-indicator">
    <SyncIcon className="animate-spin-slow" />
    <span>Modo Sincronizado: TTS + Avance Automático</span>
  </div>
)}
```

### FR-6: Web Speech API Implementation

**Browser Compatibility:**
- Chrome/Edge: Full support ✅
- Safari: Full support ✅
- Firefox: Partial support (basic voices only) ⚠️
- Opera: Full support ✅

**Fallback Strategy:**
- If Web Speech API unavailable → Show warning message
- Suggest modern browser (Chrome, Edge, Safari)
- Disable TTS controls gracefully

**Code Implementation:**
```typescript
function speakText(text: string, voice: string, rate: number) {
  if (!('speechSynthesis' in window)) {
    console.error('TTS not supported in this browser');
    return;
  }
  
  const utterance = new SpeechSynthesisUtterance(text);
  
  // Select voice
  const voices = window.speechSynthesis.getVoices();
  const selectedVoice = voices.find(v => v.name === voice);
  if (selectedVoice) {
    utterance.voice = selectedVoice;
  }
  
  // Set parameters
  utterance.rate = rate;        // 0.5 to 2
  utterance.pitch = 1.0;        // 0 to 2 (keep at 1 for natural)
  utterance.volume = 1.0;       // 0 to 1
  
  // Event handlers
  utterance.onstart = () => {
    console.log('TTS started');
  };
  
  utterance.onend = () => {
    console.log('TTS finished');
    if (ttsAutoAdvance && currentSlide < totalSlides - 1) {
      setTimeout(() => goToNextSlide(), 2000); // 2s buffer
    }
  };
  
  utterance.onerror = (event) => {
    console.error('TTS error:', event.error);
  };
  
  utterance.onboundary = (event) => {
    // Track word position for highlighting
    const wordIndex = event.charIndex;
    highlightWord(wordIndex);
  };
  
  // Speak
  window.speechSynthesis.speak(utterance);
}
```

---

## 5. Technical Specifications

### 5.1 State Management

**New Settings (localStorage):**
```typescript
interface TTSSettings {
  enabled: boolean;                  // TTS on/off
  voice: string;                     // Voice ID
  speechRate: number;                // 0.5 to 2.0
  highlightText: boolean;            // Highlight words as spoken
  autoStart: boolean;                // Auto-start on slide change
  autoAdvance: boolean;              // Auto-advance after narration
}

const defaultTTSSettings: TTSSettings = {
  enabled: false,
  voice: 'es-ES-Standard-A',
  speechRate: 1.0,
  highlightText: true,
  autoStart: true,
  autoAdvance: false,
};

const STORAGE_KEY = 'tts-settings';
```

**Runtime State (Reader Component):**
```typescript
interface TTSState {
  isSpeaking: boolean;              // Currently narrating
  isPaused: boolean;                // Paused mid-narration
  currentWordIndex: number;         // Index of current word
  currentSentenceIndex: number;     // Index of current sentence
  progress: number;                 // 0-100%
  duration: number;                 // Total duration (ms)
  elapsed: number;                  // Elapsed time (ms)
}
```

### 5.2 Files to Create/Modify

**New Files:**
```
hooks/
  useTTS.ts                    // TTS logic hook
  useSpeechHighlight.ts        // Text highlighting logic

components/
  TTSControls.tsx              // Play/pause/speed controls
  TTSProgressIndicator.tsx     // Progress bar for narration
  VoiceSelector.tsx            // Voice selection dropdown

lib/utils/
  speechSynthesis.ts           // Web Speech API wrapper
  textProcessing.ts            // Sentence/word boundary detection
```

**Modified Files:**
```
components/SettingsModal.tsx   // Add TTS section
app/reader/[id]/page.tsx       // Integrate TTS controls
lib/constants/settings.ts      // Add TTS defaults
types/index.ts                 // Add TTSSettings type
hooks/useAutoAdvance.ts        // Integrate TTS duration
```

### 5.3 TTS + Auto-Advance Integration

**Shared State Management:**
```typescript
interface SynchronizedReadingState {
  ttsEnabled: boolean;
  autoAdvanceEnabled: boolean;
  synchronized: boolean;          // Both enabled + auto-advance after narration
  currentMode: 'tts' | 'timer' | 'synced' | 'manual';
}

function useSynchronizedReading(
  ttsSettings: TTSSettings,
  autoAdvanceSettings: AutoAdvanceSettings
) {
  const mode = useMemo(() => {
    if (ttsSettings.enabled && autoAdvanceSettings.enabled && ttsSettings.autoAdvance) {
      return 'synced';
    } else if (ttsSettings.enabled) {
      return 'tts';
    } else if (autoAdvanceSettings.enabled) {
      return 'timer';
    } else {
      return 'manual';
    }
  }, [ttsSettings, autoAdvanceSettings]);
  
  return {
    mode,
    isSynchronized: mode === 'synced',
    // ... control methods
  };
}
```

---

## 6. User Experience

### 6.1 First-Time User Flow (TTS Only)

1. User opens Settings
2. Sees "🔊 Lectura de Voz" section
3. Enables "Lectura de Voz Automática" checkbox
4. Selects preferred voice (e.g., "🇪🇸 Mujer (Castellano)")
5. Clicks "Probar Voz" → Hears sample narration
6. Adjusts speed if needed (e.g., 1.2x for slightly faster)
7. Saves settings
8. Opens reading
9. Clicks ▶️ Play button
10. Hears slide read aloud with word highlighting
11. Slide finishes → User manually advances to next slide
12. Repeats for entire reading

### 6.2 Synchronized Flow (TTS + Auto-Advance)

1. User opens Settings
2. Enables "Lectura de Voz Automática"
3. Enables "Avance Automático" in Timer section
4. Checks "Avanzar slide automáticamente después de narración"
5. Saves settings
6. Opens reading
7. **Fully Automated Flow:**
   - TTS starts automatically (1-second delay)
   - Narrates first slide with word highlighting
   - Finishes narration → 2-second pause
   - Slide advances automatically to next
   - TTS starts narrating next slide immediately
   - Continues until last slide
8. User can pause anytime with Space or pause button
9. User can resume and continue hands-free reading

### 6.3 Accessibility Flow (Blind User)

1. Blind user opens app (screen reader active)
2. Navigates to Settings with keyboard
3. Screen reader announces "Lectura de Voz Automática, checkbox, not checked"
4. User presses Space to enable
5. Navigates to voice selector
6. Selects preferred voice
7. Saves settings
8. Opens reading with Enter
9. Presses `S` key to start TTS
10. Listens to entire reading hands-free
11. TTS narrates all content naturally
12. Auto-advances to next slide after narration
13. Completes reading without visual interaction

---

## 7. Design Specifications

### 7.1 TTS Controls Design

**Floating Controls (Desktop):**
```css
.tts-controls {
  position: fixed;
  bottom: 24px;
  right: 24px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  display: flex;
  gap: 12px;
  align-items: center;
  z-index: 50;
}

.tts-play-button {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #10b981, #06b6d4);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
  transition: transform 0.2s;
}

.tts-play-button:hover {
  transform: scale(1.05);
}

.tts-play-button:active {
  transform: scale(0.95);
}
```

**Dark Mode:**
```css
.dark .tts-controls {
  background: rgba(0, 0, 0, 0.95);
  box-shadow: 0 8px 32px rgba(255, 255, 255, 0.1);
}
```

**Mobile Bottom Sheet:**
```css
@media (max-width: 768px) {
  .tts-controls {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    border-radius: 24px 24px 0 0;
    padding: 24px;
    transform: translateY(calc(100% - 80px));
    transition: transform 0.3s ease;
  }
  
  .tts-controls.expanded {
    transform: translateY(0);
  }
}
```

### 7.2 Highlight Styling

**Current Word:**
```css
.tts-highlight-word {
  background: linear-gradient(
    to bottom,
    rgba(59, 130, 246, 0.3),
    rgba(59, 130, 246, 0.2)
  );
  border-radius: 2px;
  padding: 0 2px;
  animation: pulse 0.3s ease;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}
```

**High Contrast Mode:**
```css
.high-contrast .tts-highlight-word {
  background: #000;
  color: #fff;
  font-weight: bold;
  outline: 3px solid #ffff00;
}
```

---

## 8. Success Metrics

### Launch Criteria
- ✅ TTS works in Chrome, Safari, Edge
- ✅ 4 voices available (2 Spanish, 2 English)
- ✅ Play/pause/stop controls functional
- ✅ Speed adjustment works (0.5x - 2x)
- ✅ Word highlighting synchronized with speech
- ✅ Auto-advance integration works seamlessly
- ✅ Mobile controls accessible
- ✅ Keyboard shortcuts functional
- ✅ No accessibility regressions

### Post-Launch Metrics

**Adoption:**
- % of users who enable TTS
- % of users who enable synchronized mode (TTS + Auto-Advance)
- Most popular voice selections
- Average speech rate selected

**Engagement:**
- Increase in readings completed with TTS
- Average session length with TTS vs. without
- % of readings completed hands-free (synchronized mode)

**Accessibility:**
- Usage by screen reader users
- Feedback from blind/low vision users
- WCAG 2.1 AA compliance maintained

**Target Goals:**
- 40%+ users try TTS within first month
- 20%+ users adopt TTS as default reading mode
- 10%+ users use synchronized mode (TTS + Auto-Advance)
- 95%+ positive feedback from accessibility users
- 0 reported accessibility regressions

---

## 9. Implementation Plan

### Phase 1: Core TTS Logic (Week 1)
- [ ] Create `useTTS` hook
- [ ] Implement Web Speech API wrapper
- [ ] Add voice loading and selection
- [ ] Test basic narration functionality

### Phase 2: UI Components (Week 2)
- [ ] Design and implement TTS controls
- [ ] Create voice selector component
- [ ] Add speed adjustment controls
- [ ] Implement progress indicator

### Phase 3: Text Highlighting (Week 3)
- [ ] Implement word-level highlighting
- [ ] Add sentence-level highlighting
- [ ] Sync highlighting with speech boundary events
- [ ] Test with various content types

### Phase 4: Settings Integration (Week 4)
- [ ] Add TTS section to SettingsModal
- [ ] Create voice preview functionality
- [ ] Add all TTS settings (rate, highlight, auto-start)
- [ ] Save settings to localStorage

### Phase 5: Auto-Advance Integration (Week 5)
- [ ] Coordinate with PRD-012 implementation
- [ ] Create synchronized reading mode
- [ ] Implement auto-advance after narration
- [ ] Add sync indicator and controls

### Phase 6: Mobile Optimization (Week 6)
- [ ] Implement bottom sheet controls for mobile
- [ ] Add touch gestures
- [ ] Test on various mobile devices
- [ ] Optimize performance

### Phase 7: Testing & Polish (Week 7)
- [ ] Manual testing all flows
- [ ] Accessibility testing with screen readers
- [ ] Cross-browser testing
- [ ] Performance optimization
- [ ] Bug fixes
- [ ] Create TRD-013

---

## 10. Accessibility Considerations

### WCAG 2.1 Compliance

**Success Criteria:**
- ✅ **1.3.1 Info and Relationships**: TTS controls properly labeled
- ✅ **2.1.1 Keyboard**: All TTS controls keyboard accessible
- ✅ **2.4.7 Focus Visible**: Focus indicators on all controls
- ✅ **4.1.3 Status Messages**: ARIA live regions announce TTS state

**Screen Reader Integration:**
```tsx
<div role="region" aria-label="Controles de lectura de voz">
  <button 
    aria-label={isSpeaking ? "Pausar lectura" : "Iniciar lectura"}
    aria-pressed={isSpeaking}
  >
    {/* Icon */}
  </button>
  
  <div aria-live="polite" aria-atomic="true">
    {isSpeaking && `Leyendo, ${progress}% completado`}
  </div>
</div>
```

---

## 11. Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Browser compatibility issues | High | Test on all major browsers, provide fallback message |
| Voice quality inconsistent | Medium | Select high-quality voices, allow user preview |
| Performance issues with long texts | Medium | Chunk large texts, implement streaming |
| Sync issues with auto-advance | High | Coordinate implementations, extensive testing |
| Highlighting lag on slow devices | Low | Optimize rendering, use CSS transforms |

---

## 12. Open Questions

1. **Should we support voice customization (pitch, tone)?**
   - **Decision**: No for MVP, add in V2 if requested

2. **Should we cache TTS audio for offline use?**
   - **Decision**: No for MVP (Web Speech API is real-time only)

3. **Should we support multiple languages in same reading?**
   - **Decision**: No, single voice per reading (auto-detect in V2)

4. **Should we add voice command to control TTS?**
   - **Decision**: Covered in PRD-008, separate feature

5. **Should we show transcript of narration?**
   - **Decision**: Future enhancement (PRD-014)

---

## 13. Future Enhancements

### V2 Features
- [ ] AI voice cloning (custom voices)
- [ ] Emotion/emphasis control
- [ ] Automatic language detection per slide
- [ ] Voice command control ("Read this", "Stop")
- [ ] Offline TTS (cached audio)

### V3 Features
- [ ] Multi-voice narration (different voices for quotes, headings)
- [ ] Background music/ambiance
- [ ] Export narration as audio file (MP3)
- [ ] Podcast-style narration with intro/outro

---

## 14. Related Documents

- [PRD-012: Auto-Advance Timer](./PRD-012-auto-advance-timer.md)
- [PRD-008: Advanced Accessibility (Voice Commands)](./PRD-008-advanced-accessibility-blind-users.md)
- [PRD-004: Accessibility Features](./PRD-004-accessibility.md)
- [PRD-011: Internationalization](./PRD-011-internationalization.md)

---

**End of PRD-013**
