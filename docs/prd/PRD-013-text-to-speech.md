# PRD-013: Text-to-Speech (TTS)

**Status:** 📝 Draft  
**Priority:** Medium  
**Target Release:** v0.6.0  
**Created:** February 2, 2026  
**Last Updated:** February 2, 2026  
**Owner:** Development Team  
**Related PRDs:** PRD-012 (Auto-Advance Timer), PRD-004 (Accessibility)

---

## 1. Overview

### Purpose
Add text-to-speech functionality to read content aloud in Spanish and English, enabling hands-free listening and improving accessibility for users with visual impairments or reading difficulties.

### Background
Users have requested audio playback of readings for:
- **Accessibility:** Blind/low-vision users, dyslexia, cognitive disabilities
- **Multitasking:** Listen while driving, exercising, cooking
- **Language learning:** Hear correct pronunciation
- **Auditory learners:** Better retention through hearing

**User Feedback:**
- "Can the app read to me? I have low vision"
- "Would love to listen while commuting"
- "TTS would help me learn Spanish pronunciation"
- "I need audio for accessibility"

### Goals
1. Implement browser-native TTS (Web Speech API)
2. Support Spanish and English voices
3. Provide playback controls (play/pause/stop)
4. Adjustable speech rate
5. Integrate with auto-advance timer (PRD-012)
6. WCAG 2.1 Level AA compliance

---

## 2. Problem Statement

**Who:** Users who need or prefer audio content

**What:** No audio playback available for readings

**Why:** Some users can't read text due to:
- Visual impairments
- Learning disabilities (dyslexia)
- Situational limitations (driving, exercising)
- Preference for auditory learning

**Impact:** App inaccessible to 15-20% of potential users

---

## 3. User Stories

### As a Blind User
- I want TTS so I can consume all content
- I want to control speed so I can understand easily
- I want to pause/resume so I can think about content
- I want keyboard shortcuts so I can navigate without seeing

### As a Language Learner
- I want to hear Spanish pronunciation so I can learn correctly
- I want to adjust speed so I can follow along
- I want to switch voices so I can hear different accents

### As a Commuter
- I want to listen hands-free so I can focus on driving
- I want auto-advance so it flows like a podcast
- I want easy pause/play so I can respond to notifications

### As a Dyslexic User
- I want audio support so I can understand content better
- I want highlighting of spoken text so I can follow along
- I want to adjust speed so I can match my comprehension pace

---

## 4. Requirements

### 4.1 Functional Requirements

#### FR-1: Voice Selection
- **Spanish Voices:**
  - Female: "es-MX-DaliaNeural" (Microsoft Edge)
  - Male: "es-ES-AlvaroNeural" (Microsoft Edge)
  - Fallback: Browser default Spanish voice
- **English Voices:**
  - Female: "en-US-AriaNeural" (Microsoft Edge)
  - Male: "en-US-GuyNeural" (Microsoft Edge)
  - Fallback: Browser default English voice
- **Auto-detect:** Use reading language if specified
- **User preference:** Save voice choice in settings
- **Voice preview:** Test voices before selecting

#### FR-2: Playback Controls
- **Play Button:** Start reading from current slide
- **Pause Button:** Stop mid-sentence, resume from same spot
- **Stop Button:** End playback, return to beginning
- **Previous/Next:** Jump between sentences
- **Skip:** Go to next/previous slide
- Keyboard shortcuts:
  - `Alt + P`: Play/pause
  - `Alt + S`: Stop
  - `Alt + Left/Right`: Previous/next sentence
  - `Esc`: Stop playback

#### FR-3: Speech Rate Control
- Range: 0.5x to 2.0x speed
- Default: 1.0x (normal)
- Increment: 0.25x steps
- Visual indicator: "1.0x" label
- Keyboard shortcuts:
  - `Alt + +`: Increase speed
  - `Alt + -`: Decrease speed
- Persist preference in settings

#### FR-4: Visual Feedback
- **Highlight current sentence:** Yellow/purple background based on theme
- **Progress indicator:** Show current sentence / total sentences
- **Playback state icons:** Play/pause/stop clearly visible
- **Sentence tracking:** Auto-scroll to keep current sentence visible
- **Animation:** Smooth transitions (if reduce motion disabled)

#### FR-5: Integration with Auto-Advance Timer
- **Sync playback:** TTS duration matches auto-advance timer
- **Auto-advance on sentence end:** Move to next slide after speaking
- **Pause timer when paused:** Both systems pause together
- **Manual override:** User can navigate while TTS continues or stops
- **Seamless flow:** No gap between slides when advancing

#### FR-6: Settings Integration
- **Enable/disable TTS:** Toggle in settings
- **Voice selector:** Dropdown with all available voices
- **Default speed:** Slider (0.5x - 2.0x)
- **Auto-play on open:** Start TTS when reading opens
- **Highlight spoken text:** Toggle on/off
- **Continue on navigation:** Keep playing when manually advancing (optional)

#### FR-7: Edge Cases
- **Empty slide:** Skip silently
- **Code blocks:** Read as-is or skip (user preference)
- **Lists:** Pause between items (200ms)
- **Tables:** Read row-by-row with column headers
- **Images:** Read alt text if available
- **Long sentences:** Split at punctuation if >20 words
- **Network issues:** Graceful fallback to browser voices

### 4.2 Non-Functional Requirements

#### NFR-1: Performance
- Instant voice initialization (<500ms)
- No lag during playback
- Smooth sentence transitions
- Minimal CPU usage (<5%)
- Works offline (browser voices)

#### NFR-2: Accessibility
- WCAG 2.1 Level AA compliant
- Screen reader compatible (ARIA live regions)
- Keyboard accessible (all controls)
- High-contrast compatible
- Respects reduce motion
- Focus management (keep focus on current sentence)

#### NFR-3: Browser Compatibility
- **Chrome/Edge:** Full support (Neural voices)
- **Firefox:** Basic support (limited voices)
- **Safari:** Basic support (limited voices)
- **Mobile:** iOS Safari, Chrome Android
- **Fallback:** Always have at least 1 Spanish + 1 English voice

#### NFR-4: Usability
- Intuitive controls (standard icons)
- Clear voice names (no technical IDs)
- Easy to discover (onboarding tooltip)
- Minimal UI clutter (collapsible player)

---

## 5. Technical Implementation

### 5.1 Architecture

**Components:**
- `TTSPlayer` - Main TTS component
- `TTSControls` - Play/pause/stop buttons
- `VoiceSelector` - Voice picker dropdown
- `SpeedControl` - Rate adjustment slider
- `SentenceHighlighter` - Visual tracking component
- `useTTS` - Custom React hook for TTS logic

**State Management:**
```typescript
interface TTSState {
  isPlaying: boolean;
  isPaused: boolean;
  currentSentenceIndex: number;
  totalSentences: number;
  selectedVoice: string;
  rate: number; // 0.5 - 2.0
  autoPlay: boolean;
  highlightText: boolean;
  continueOnNav: boolean;
}
```

### 5.2 Web Speech API Usage

```typescript
function useTTS(sentences: ProcessedText[], settings: Settings) {
  const [state, setState] = useState<TTSState>({
    isPlaying: false,
    isPaused: false,
    currentSentenceIndex: 0,
    totalSentences: sentences.length,
    selectedVoice: settings.tts?.voice || 'es-MX-DaliaNeural',
    rate: settings.tts?.rate || 1.0,
    autoPlay: settings.tts?.autoPlay || false,
    highlightText: settings.tts?.highlightText || true,
    continueOnNav: settings.tts?.continueOnNav || false,
  });

  const synth = window.speechSynthesis;
  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(null);

  // Initialize utterance
  useEffect(() => {
    if (!synth) return;
    
    const newUtterance = new SpeechSynthesisUtterance();
    newUtterance.rate = state.rate;
    newUtterance.voice = getVoiceByName(state.selectedVoice);
    
    newUtterance.onend = () => {
      // Move to next sentence or slide
      if (state.currentSentenceIndex < state.totalSentences - 1) {
        setState(prev => ({ ...prev, currentSentenceIndex: prev.currentSentenceIndex + 1 }));
      } else {
        // Last sentence - advance to next slide or stop
        goToNextSlide();
      }
    };
    
    newUtterance.onerror = (event) => {
      console.error('TTS Error:', event);
      setState(prev => ({ ...prev, isPlaying: false }));
    };
    
    setUtterance(newUtterance);
  }, [state.selectedVoice, state.rate]);

  // Speak current sentence
  useEffect(() => {
    if (!utterance || !state.isPlaying || state.isPaused) return;
    
    const currentSentence = sentences[state.currentSentenceIndex];
    if (!currentSentence) return;
    
    // Skip code blocks if user preference
    if (currentSentence.isCodeBlock && settings.tts?.skipCode) {
      setState(prev => ({ ...prev, currentSentenceIndex: prev.currentSentenceIndex + 1 }));
      return;
    }
    
    utterance.text = currentSentence.sentence;
    synth.speak(utterance);
  }, [state.isPlaying, state.isPaused, state.currentSentenceIndex]);

  return {
    ...state,
    play: () => setState(prev => ({ ...prev, isPlaying: true, isPaused: false })),
    pause: () => {
      synth.pause();
      setState(prev => ({ ...prev, isPaused: true }));
    },
    resume: () => {
      synth.resume();
      setState(prev => ({ ...prev, isPaused: false }));
    },
    stop: () => {
      synth.cancel();
      setState(prev => ({ ...prev, isPlaying: false, isPaused: false, currentSentenceIndex: 0 }));
    },
    next: () => setState(prev => ({ 
      ...prev, 
      currentSentenceIndex: Math.min(prev.currentSentenceIndex + 1, prev.totalSentences - 1) 
    })),
    previous: () => setState(prev => ({ 
      ...prev, 
      currentSentenceIndex: Math.max(prev.currentSentenceIndex - 1, 0) 
    })),
    setRate: (rate: number) => setState(prev => ({ ...prev, rate })),
    setVoice: (voice: string) => setState(prev => ({ ...prev, selectedVoice: voice })),
  };
}
```

### 5.3 Voice Detection

```typescript
function getAvailableVoices() {
  const synth = window.speechSynthesis;
  const voices = synth.getVoices();
  
  const spanishVoices = voices.filter(v => v.lang.startsWith('es'));
  const englishVoices = voices.filter(v => v.lang.startsWith('en'));
  
  return {
    spanish: spanishVoices.length > 0 ? spanishVoices : [fallbackSpanishVoice],
    english: englishVoices.length > 0 ? englishVoices : [fallbackEnglishVoice],
  };
}

function getVoiceByName(name: string): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices();
  return voices.find(v => v.name === name) || voices[0] || null;
}
```

### 5.4 UI Components

**TTS Player:**
```typescript
<div className="tts-player fixed bottom-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
  {/* Voice selector */}
  <select 
    value={selectedVoice} 
    onChange={(e) => setVoice(e.target.value)}
    className="mb-2 w-full"
  >
    <optgroup label="Spanish">
      <option value="es-MX-DaliaNeural">Dalia (Female, Mexico)</option>
      <option value="es-ES-AlvaroNeural">Alvaro (Male, Spain)</option>
    </optgroup>
    <optgroup label="English">
      <option value="en-US-AriaNeural">Aria (Female, US)</option>
      <option value="en-US-GuyNeural">Guy (Male, US)</option>
    </optgroup>
  </select>
  
  {/* Controls */}
  <div className="flex items-center gap-2 mb-2">
    <button 
      onClick={isPlaying ? pause : play}
      className="p-2 rounded-full"
      aria-label={isPlaying ? "Pause" : "Play"}
    >
      {isPlaying ? <PauseIcon /> : <PlayIcon />}
    </button>
    
    <button 
      onClick={stop}
      className="p-2 rounded-full"
      aria-label="Stop"
    >
      <StopIcon />
    </button>
    
    <button onClick={previous} aria-label="Previous sentence">
      <ChevronLeftIcon />
    </button>
    
    <button onClick={next} aria-label="Next sentence">
      <ChevronRightIcon />
    </button>
  </div>
  
  {/* Speed control */}
  <div className="flex items-center gap-2">
    <label className="text-sm">Speed:</label>
    <input
      type="range"
      min="0.5"
      max="2.0"
      step="0.25"
      value={rate}
      onChange={(e) => setRate(Number(e.target.value))}
      className="flex-1"
    />
    <span className="text-sm font-mono">{rate}x</span>
  </div>
  
  {/* Progress */}
  <div className="text-xs text-gray-500 mt-2">
    Sentence {currentSentenceIndex + 1} of {totalSentences}
  </div>
</div>
```

**Sentence Highlighting:**
```typescript
<p className={cn(
  "text-lg leading-relaxed",
  isCurrentSentence && ttsState.highlightText && cn(
    "bg-yellow-200 dark:bg-purple-900/30",
    "transition-colors duration-300"
  )
)}>
  {sentence.sentence}
</p>
```

### 5.5 Settings UI

```typescript
<div className="space-y-4">
  <h3>Text-to-Speech</h3>
  
  {/* Enable toggle */}
  <label className="flex items-center">
    <input
      type="checkbox"
      checked={settings.tts?.enabled}
      onChange={(e) => updateSetting('tts.enabled', e.target.checked)}
    />
    <span>Enable Text-to-Speech</span>
  </label>
  
  {/* Voice selector */}
  <div>
    <label>Default Voice</label>
    <select 
      value={settings.tts?.voice}
      onChange={(e) => updateSetting('tts.voice', e.target.value)}
    >
      <optgroup label="Spanish">
        <option value="es-MX-DaliaNeural">Dalia (Female, Mexico)</option>
        <option value="es-ES-AlvaroNeural">Alvaro (Male, Spain)</option>
      </optgroup>
      <optgroup label="English">
        <option value="en-US-AriaNeural">Aria (Female, US)</option>
        <option value="en-US-GuyNeural">Guy (Male, US)</option>
      </optgroup>
    </select>
  </div>
  
  {/* Speed */}
  <div>
    <label>Speech Rate: {settings.tts?.rate}x</label>
    <input
      type="range"
      min="0.5"
      max="2.0"
      step="0.25"
      value={settings.tts?.rate || 1.0}
      onChange={(e) => updateSetting('tts.rate', Number(e.target.value))}
    />
  </div>
  
  {/* Auto-play */}
  <label className="flex items-center">
    <input
      type="checkbox"
      checked={settings.tts?.autoPlay}
      onChange={(e) => updateSetting('tts.autoPlay', e.target.checked)}
    />
    <span>Auto-play when opening reading</span>
  </label>
  
  {/* Highlight text */}
  <label className="flex items-center">
    <input
      type="checkbox"
      checked={settings.tts?.highlightText}
      onChange={(e) => updateSetting('tts.highlightText', e.target.checked)}
    />
    <span>Highlight spoken text</span>
  </label>
  
  {/* Skip code blocks */}
  <label className="flex items-center">
    <input
      type="checkbox"
      checked={settings.tts?.skipCode}
      onChange={(e) => updateSetting('tts.skipCode', e.target.checked)}
    />
    <span>Skip code blocks</span>
  </label>
</div>
```

---

## 6. Integration with Auto-Advance Timer

### 6.1 Sync Mechanism

```typescript
// When TTS is playing, sync timer duration with speech duration
function syncTimerWithTTS(utterance: SpeechSynthesisUtterance) {
  const estimatedDuration = estimateSpeechDuration(utterance.text, utterance.rate);
  
  // Update auto-advance timer
  autoAdvanceTimer.setDuration(estimatedDuration);
  autoAdvanceTimer.start();
  
  // Pause timer if TTS pauses
  utterance.onpause = () => autoAdvanceTimer.pause();
  utterance.onresume = () => autoAdvanceTimer.resume();
  
  // Advance slide when both complete
  utterance.onend = () => {
    if (autoAdvanceTimer.isComplete) {
      goToNextSlide();
    }
  };
}

function estimateSpeechDuration(text: string, rate: number): number {
  const wordsPerMinute = 150 * rate; // Average speaking rate
  const wordCount = text.split(/\s+/).length;
  return (wordCount / wordsPerMinute) * 60 * 1000; // milliseconds
}
```

### 6.2 User Experience Flow

1. User enables both TTS and auto-advance
2. Opens reading
3. TTS starts reading first sentence
4. Timer shows progress (visual ring)
5. Sentence ends → TTS moves to next sentence
6. All sentences on slide complete → Advance to next slide
7. Seamless flow throughout reading
8. User can pause both with single Space key

---

## 7. Accessibility

### 7.1 WCAG 2.1 Compliance

**Level A:**
- ✅ Keyboard accessible (all controls)
- ✅ Focus visible
- ✅ Screen reader compatible

**Level AA:**
- ✅ ARIA labels on all buttons
- ✅ Live regions for state changes
- ✅ Sufficient color contrast (4.5:1)
- ✅ Resize text up to 200%

### 7.2 Screen Reader Support

```typescript
<div role="region" aria-label="Text-to-Speech Player">
  <button 
    aria-label={isPlaying ? "Pause reading" : "Start reading"}
    aria-pressed={isPlaying}
  >
    {isPlaying ? "Pause" : "Play"}
  </button>
  
  <div aria-live="polite" aria-atomic="true">
    {isPlaying ? `Reading sentence ${currentSentenceIndex + 1} of ${totalSentences}` : "Paused"}
  </div>
  
  <select aria-label="Select voice">
    <option>Dalia (Spanish, Female)</option>
    <option>Alvaro (Spanish, Male)</option>
  </select>
</div>
```

### 7.3 Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Alt + P` | Play/Pause |
| `Alt + S` | Stop |
| `Alt + Left` | Previous sentence |
| `Alt + Right` | Next sentence |
| `Alt + Up` | Next slide |
| `Alt + Down` | Previous slide |
| `Alt + +` | Increase speed |
| `Alt + -` | Decrease speed |
| `Tab` | Cycle through controls |
| `Space` | Play/Pause (when focused) |
| `Esc` | Stop and close player |

---

## 8. Success Metrics

### Primary Metrics
- **Adoption:** 25-35% of users try TTS
- **Retention:** 20% use it regularly
- **Satisfaction:** 4.5/5 average rating
- **Accessibility users:** 80%+ adoption

### Secondary Metrics
- **Speed distribution:** Most at 0.75x - 1.25x
- **Voice preference:** Track Spanish vs English usage
- **Session length:** 30% longer with TTS
- **Completion rate:** 15% increase in finished readings

### A11y Metrics
- **Screen reader users:** 95% can use TTS
- **Keyboard-only users:** 100% can control playback
- **Blind users:** Report app is fully accessible

---

## 9. Out of Scope

### Not Included
- **Offline voices:** Download voices for offline use
- **Voice customization:** Pitch, volume, emphasis
- **Multiple languages:** Beyond Spanish/English
- **Voice cloning:** Custom AI voices
- **Background playback:** Continue when tab closed
- **Annotations while listening:** Highlight/note-taking during playback

### Future Enhancements
- **Smart pause:** Detect questions, pause longer
- **Emotion detection:** Adjust tone based on content
- **Pronunciation dictionary:** Custom word pronunciations
- **Export audio:** Download MP3 of reading
- **Synchronized transcript:** Show full text with live highlighting

---

## 10. Testing Checklist

### Functionality
- [ ] TTS speaks all text correctly
- [ ] Play/pause/stop work as expected
- [ ] Speed adjustment affects playback
- [ ] Voice selection changes voice
- [ ] Auto-advance syncs with TTS
- [ ] Sentence highlighting tracks accurately
- [ ] Keyboard shortcuts functional
- [ ] Settings persist correctly

### Browser Testing
- [ ] Chrome/Edge (full Neural voices)
- [ ] Firefox (basic voices)
- [ ] Safari macOS (basic voices)
- [ ] Safari iOS (mobile voices)
- [ ] Chrome Android (mobile voices)

### Accessibility
- [ ] Keyboard navigation complete
- [ ] Screen reader announces states
- [ ] ARIA labels present
- [ ] Focus management correct
- [ ] High-contrast compatible
- [ ] Reduce motion respected

### Edge Cases
- [ ] Empty slides skip correctly
- [ ] Code blocks handled per preference
- [ ] Long sentences don't timeout
- [ ] Network issues fallback gracefully
- [ ] Tab switching pauses playback
- [ ] Multiple tabs don't conflict

---

## 11. Implementation Plan

### Phase 1: Core TTS (5 days)
- [ ] Implement `useTTS` hook
- [ ] Web Speech API integration
- [ ] Basic play/pause/stop controls
- [ ] Voice selection
- [ ] Test in Chrome/Edge

### Phase 2: UI Components (4 days)
- [ ] Build TTS player component
- [ ] Speed control slider
- [ ] Sentence highlighting
- [ ] Progress indicator
- [ ] Style for all themes

### Phase 3: Settings & Persistence (2 days)
- [ ] Add TTS settings UI
- [ ] Persist preferences
- [ ] Keyboard shortcuts
- [ ] Test settings sync

### Phase 4: Auto-Advance Integration (3 days)
- [ ] Sync timer with TTS duration
- [ ] Unified pause/resume
- [ ] Seamless slide transitions
- [ ] Test combined workflow

### Phase 5: Accessibility & Polish (3 days)
- [ ] ARIA labels and live regions
- [ ] Screen reader testing
- [ ] Keyboard navigation
- [ ] High-contrast compatibility
- [ ] Final user testing

**Total: 17 days**

---

## 12. Risks & Mitigations

### Risk 1: Browser Voice Availability
**Impact:** High  
**Mitigation:**
- Always provide fallback voices
- Test on all major browsers
- Document voice availability per browser
- Graceful degradation

### Risk 2: Performance on Long Readings
**Impact:** Medium  
**Mitigation:**
- Lazy load sentences
- Optimize rendering
- Test with 100+ slide readings
- Monitor memory usage

### Risk 3: Pronunciation Errors
**Impact:** Low  
**Mitigation:**
- Use high-quality Neural voices when available
- Document known issues
- Future: pronunciation dictionary

### Risk 4: User Confusion (Too Many Controls)
**Impact:** Medium  
**Mitigation:**
- Simple default UI (play/pause only)
- Advanced controls collapsible
- Onboarding tutorial
- Clear labels and tooltips

---

## 13. Related Documentation

- [PRD-012: Auto-Advance Timer](./PRD-012-auto-advance-timer.md)
- [PRD-004: Accessibility Features](./PRD-004-accessibility.md)
- [TRD-004: Accessibility Implementation](../trd/TRD-004-accessibility.md)

---

**Document Version:** 1.0  
**Status:** Draft (Not Implemented)  
**Last Review:** February 2, 2026  
**Next Review:** March 2, 2026
