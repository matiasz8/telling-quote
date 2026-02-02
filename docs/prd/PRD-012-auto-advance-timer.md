# PRD-012: Auto-Advance Timer (Temporizador Automático)

**Status:** 📝 Draft  
**Created:** February 2, 2026  
**Last Updated:** February 2, 2026  
**Owner:** Product Team  
**Priority:** Medium  
**Related:** PRD-013 (Text-to-Speech)

---

## 1. Overview

### Purpose
Implement an **auto-advance timer system** that automatically progresses to the next slide after a calculated duration based on text length, reading speed, and user preferences. This feature enables hands-free reading experiences and paced content consumption.

### Background
Currently, users must manually advance slides using keyboard (→, ↓, Space), mouse/touch (swipe, scroll), or fullscreen navigation. This creates friction for users who want to read at a consistent pace without constant interaction, especially useful for:
- Speed reading practice
- Presentations and demos
- Accessibility (users with motor disabilities)
- Hands-free reading (cooking, exercising, commuting)

### Goals
1. Calculate optimal display time per slide based on text length
2. Provide configurable reading speed (WPM - Words Per Minute)
3. Auto-advance to next slide when timer completes
4. Visual progress indicator showing remaining time
5. Easy pause/resume controls
6. Integrate with Text-to-Speech (PRD-013) for synchronized reading

### Non-Goals
- Video/GIF auto-advance (future enhancement)
- Advanced AI-based reading comprehension analysis
- Eye-tracking integration
- Multi-user synchronized reading sessions

---

## 2. Problem Statement

### Current Pain Points

1. **Manual Interaction Required**: Users must constantly press keys or swipe to advance slides
2. **Inconsistent Reading Pace**: No way to maintain steady reading rhythm
3. **Fatigue from Interaction**: Repetitive key presses tire users during long readings
4. **Accessibility Barrier**: Users with motor disabilities struggle with constant interaction
5. **No Hands-Free Mode**: Can't read while doing other activities
6. **Speed Reading Practice**: No built-in pacing tool for reading training

### User Impact

**Without Auto-Advance:**
- Users reading 50-slide document = 50+ manual interactions
- Breaks reading flow and concentration
- Not accessible for motor disability users
- Can't multitask (cooking, exercising) while reading

**With Auto-Advance:**
- Users set pace once, read entire document hands-free
- Consistent rhythm improves focus and comprehension
- Fully accessible (voice commands to control)
- Enables productive multitasking

---

## 3. User Stories

### As a speed reader
- I want to set my reading pace (e.g., 400 WPM) so slides advance automatically at my optimal speed
- I want visual countdown so I know when the next slide is coming
- I want to pause mid-reading and resume without losing my place

### As a user with motor disabilities
- I want slides to advance automatically so I don't need to press keys constantly
- I want voice commands to control timer (start, pause, adjust speed)
- I want large, accessible pause/resume buttons

### As a busy professional
- I want to start auto-advance and listen/read while preparing breakfast
- I want timer to sync with Text-to-Speech so slides change after narration completes
- I want to adjust speed mid-reading if content gets complex

### As a student practicing speed reading
- I want to gradually increase WPM to train faster reading
- I want statistics showing my average reading speed per session
- I want to reset timer if I need to re-read a slide

---

## 4. Functional Requirements

### FR-1: Reading Speed Calculation

**Formula:**
```
Display Time (seconds) = (Word Count / Reading Speed WPM) × 60
```

**Example Calculations:**
```
Slide: "The quick brown fox jumps over the lazy dog."
Word Count: 9 words
Reading Speed: 250 WPM (average adult)

Display Time = (9 / 250) × 60 = 2.16 seconds

---

Slide: "In the realm of quantum physics, the principle of superposition states that particles can exist in multiple states simultaneously until observed, collapsing into a single definitive state."
Word Count: 28 words
Reading Speed: 250 WPM

Display Time = (28 / 250) × 60 = 6.72 seconds
```

**Minimum Display Time**: 2 seconds (even for very short slides)
**Maximum Display Time**: 60 seconds (cap for very long slides)

**Special Cases:**
- **Code Blocks**: Add 50% extra time (code takes longer to read)
- **Tables/Lists**: Add 25% extra time per row/item
- **Images with Captions**: Add 5 seconds per image
- **Mathematical Equations**: Add 3 seconds per equation
- **Headings Only**: Use minimum time (2 seconds)

### FR-2: Timer Settings UI

**Location**: Settings Modal → New "Reading Mode" Section

**Settings:**
```tsx
<div className="space-y-4" data-tour="settings-auto-advance">
  <h3>⏱️ Temporizador Automático</h3>
  
  {/* Enable/Disable */}
  <div className="flex items-center justify-between">
    <label htmlFor="auto-advance">
      Avance Automático
    </label>
    <input 
      type="checkbox" 
      id="auto-advance" 
      checked={autoAdvanceEnabled}
    />
  </div>
  
  {/* Reading Speed (WPM) */}
  <div className="space-y-2">
    <label htmlFor="reading-speed">
      Velocidad de Lectura: <strong>{readingSpeed} WPM</strong>
    </label>
    <input 
      type="range" 
      id="reading-speed"
      min="150" 
      max="600" 
      step="25"
      value={readingSpeed}
    />
    <div className="flex justify-between text-xs text-gray-600">
      <span>Lenta (150)</span>
      <span>Normal (250)</span>
      <span>Rápida (400)</span>
      <span>Muy Rápida (600)</span>
    </div>
  </div>
  
  {/* Show Progress Bar */}
  <div className="flex items-center justify-between">
    <label htmlFor="show-timer-progress">
      Mostrar Barra de Progreso
    </label>
    <input 
      type="checkbox" 
      id="show-timer-progress" 
      checked={showTimerProgress}
    />
  </div>
  
  {/* Pause on Hover (Desktop) */}
  <div className="flex items-center justify-between">
    <label htmlFor="pause-on-hover">
      Pausar al Pasar el Mouse
    </label>
    <input 
      type="checkbox" 
      id="pause-on-hover" 
      checked={pauseOnHover}
    />
  </div>
</div>
```

**Default Values:**
- Auto-Advance Enabled: `false` (opt-in feature)
- Reading Speed: `250 WPM` (average adult reading speed)
- Show Timer Progress: `true`
- Pause on Hover: `true` (prevents accidental advance while reading)

**Reading Speed Presets:**
- 150 WPM: Slow (ESL learners, complex content)
- 250 WPM: Normal (average adult)
- 350 WPM: Fast (experienced readers)
- 450 WPM: Very Fast (speed readers)
- 600 WPM: Ultra Fast (advanced speed readers)

### FR-3: Timer Controls in Reader

**Visual Controls (always visible in Reader):**

```tsx
<div className="auto-advance-controls">
  {/* Play/Pause Button */}
  <button 
    onClick={toggleAutoAdvance}
    aria-label={isPlaying ? "Pausar avance automático" : "Iniciar avance automático"}
  >
    {isPlaying ? '⏸️ Pausar' : '▶️ Iniciar'}
  </button>
  
  {/* Speed Adjustment (Quick) */}
  <div className="speed-controls">
    <button onClick={decreaseSpeed} aria-label="Disminuir velocidad">
      🐢 Más Lento
    </button>
    <span className="current-speed">{readingSpeed} WPM</span>
    <button onClick={increaseSpeed} aria-label="Aumentar velocidad">
      🐇 Más Rápido
    </button>
  </div>
  
  {/* Progress Bar */}
  {showTimerProgress && (
    <div className="timer-progress-bar">
      <div 
        className="progress-fill" 
        style={{ width: `${progress}%` }}
      />
      <span className="time-remaining">{timeRemaining}s</span>
    </div>
  )}
</div>
```

**Keyboard Shortcuts:**
- `P` or `Space`: Pause/Resume auto-advance
- `+` or `]`: Increase speed by 25 WPM
- `-` or `[`: Decrease speed by 25 WPM
- `R`: Reset timer for current slide
- `Esc`: Stop auto-advance entirely

**Touch Gestures (Mobile):**
- Tap anywhere on screen: Pause/Resume
- Long press: Stop auto-advance
- Two-finger tap: Reset timer

### FR-4: Timer Progress Indicator

**Types of Indicators:**

**1. Linear Progress Bar (Default)**
```
┌────────────────────────────────────────┐
│ ████████████████░░░░░░░░░░░░░  65%  3s │
└────────────────────────────────────────┘
```
- Horizontal bar at top/bottom of slide
- Shows percentage complete
- Displays remaining time in seconds
- Color: Gradient (emerald → yellow → red as time runs out)

**2. Circular Progress (Compact)**
```
    ⏱️ 3s
```
- Small circular indicator in corner
- Minimal visual distraction
- Shows only remaining seconds

**3. Subtle Fade (Minimal)**
- No visible bar
- Slight fade animation on slide edges
- Pulse effect when 3 seconds remaining

**User Choice:** Setting to choose indicator style

### FR-5: Auto-Advance Behavior

**Flow:**
1. User enables auto-advance in Settings
2. User opens a reading
3. Timer starts automatically after 1 second delay
4. Progress bar animates countdown
5. When timer reaches 0:
   - Slide advances to next
   - Timer resets and starts for new slide
   - Smooth transition animation
6. At last slide:
   - Timer completes but doesn't advance
   - Show "End of Reading" indicator
   - Auto-advance stops

**Pause Triggers:**
- User presses pause button or `P` key
- User hovers over slide (if "Pause on Hover" enabled)
- User manually advances/goes back (resets timer)
- User opens a modal (Settings, Keyboard Shortcuts)
- Window loses focus (backgrounded)

**Resume Behavior:**
- Timer resumes from where it paused
- OR resets if "Reset on Resume" setting enabled

**Special Handling:**
- **First Slide**: 3-second delay before starting (user orientation)
- **Last Slide**: Timer completes but shows "Finished" state
- **Going Backwards**: Resets timer for previous slide
- **Manual Advance**: If user manually advances, timer resets for next slide

### FR-6: Integration with Text-to-Speech (PRD-013)

**When both Auto-Advance AND TTS are enabled:**

**Synchronized Mode:**
1. TTS starts reading slide aloud
2. Timer is calculated based on TTS duration (not word count)
3. When TTS finishes narration:
   - Add 2-second buffer (processing time)
   - Auto-advance to next slide
   - TTS starts reading next slide
4. Progress bar shows TTS playback progress (not time-based)

**User Controls:**
- Pause button pauses BOTH timer and TTS
- Resume button resumes BOTH
- Speed adjustment affects BOTH (TTS speed and timer calculation)

**Example Flow:**
```
Slide 1: "Welcome to quantum physics."
├─ TTS Duration: 3.2 seconds
├─ Buffer: 2 seconds
└─ Total Display: 5.2 seconds → Auto-advance

Slide 2: "Particles exist in superposition..."
├─ TTS Duration: 8.5 seconds
├─ Buffer: 2 seconds
└─ Total Display: 10.5 seconds → Auto-advance
```

---

## 5. Technical Specifications

### 5.1 State Management

**New Settings (localStorage):**
```typescript
interface AutoAdvanceSettings {
  enabled: boolean;              // Auto-advance on/off
  readingSpeed: number;          // WPM (150-600)
  showProgress: boolean;         // Show progress bar
  pauseOnHover: boolean;         // Pause when mouse hovers
  progressStyle: 'linear' | 'circular' | 'minimal';
  resetOnResume: boolean;        // Reset timer when resuming
}

// Default values
const defaultAutoAdvanceSettings: AutoAdvanceSettings = {
  enabled: false,
  readingSpeed: 250,
  showProgress: true,
  pauseOnHover: true,
  progressStyle: 'linear',
  resetOnResume: false,
};

// localStorage key
const STORAGE_KEY = 'auto-advance-settings';
```

**Runtime State (Reader Component):**
```typescript
interface TimerState {
  isActive: boolean;           // Timer is running
  isPaused: boolean;           // Timer is paused
  currentSlideTime: number;    // Total time for current slide (ms)
  elapsedTime: number;         // Time elapsed on current slide (ms)
  remainingTime: number;       // Time remaining (ms)
  progress: number;            // 0-100%
}
```

### 5.2 Word Count Calculation

**Algorithm:**
```typescript
function calculateWordCount(slideContent: string): number {
  // Remove markdown syntax
  const plainText = slideContent
    .replace(/#{1,6}\s/g, '')           // Remove headers
    .replace(/\*\*(.+?)\*\*/g, '$1')    // Remove bold
    .replace(/\*(.+?)\*/g, '$1')        // Remove italic
    .replace(/`(.+?)`/g, '$1')          // Remove inline code
    .replace(/\[(.+?)\]\(.+?\)/g, '$1') // Remove links
    .replace(/!\[.+?\]\(.+?\)/g, '')    // Remove images
    .trim();
  
  // Split by whitespace and count
  const words = plainText.split(/\s+/).filter(word => word.length > 0);
  
  return words.length;
}
```

**Adjustment Factors:**
```typescript
function calculateDisplayTime(
  wordCount: number,
  wpm: number,
  slideType: SlideType
): number {
  // Base calculation
  let baseTime = (wordCount / wpm) * 60 * 1000; // milliseconds
  
  // Apply multipliers
  if (slideType.hasCodeBlock) {
    baseTime *= 1.5; // Code takes 50% longer
  }
  
  if (slideType.hasTable) {
    baseTime *= 1.25; // Tables take 25% longer
  }
  
  if (slideType.hasImage) {
    baseTime += 5000; // Add 5 seconds per image
  }
  
  if (slideType.hasMath) {
    baseTime += 3000; // Add 3 seconds per equation
  }
  
  // Enforce min/max
  const MIN_TIME = 2000;  // 2 seconds
  const MAX_TIME = 60000; // 60 seconds
  
  return Math.max(MIN_TIME, Math.min(MAX_TIME, baseTime));
}
```

### 5.3 Timer Implementation

**React Hook:**
```typescript
function useAutoAdvance(
  slides: string[],
  currentIndex: number,
  goToSlide: (index: number) => void,
  settings: AutoAdvanceSettings
) {
  const [timerState, setTimerState] = useState<TimerState>({
    isActive: settings.enabled,
    isPaused: false,
    currentSlideTime: 0,
    elapsedTime: 0,
    remainingTime: 0,
    progress: 0,
  });
  
  useEffect(() => {
    if (!timerState.isActive || timerState.isPaused) return;
    
    const interval = setInterval(() => {
      setTimerState(prev => {
        const newElapsed = prev.elapsedTime + 100; // Update every 100ms
        const newRemaining = prev.currentSlideTime - newElapsed;
        const newProgress = (newElapsed / prev.currentSlideTime) * 100;
        
        // Time's up → advance
        if (newRemaining <= 0) {
          if (currentIndex < slides.length - 1) {
            goToSlide(currentIndex + 1);
          }
          return { ...prev, elapsedTime: 0, progress: 0 };
        }
        
        return {
          ...prev,
          elapsedTime: newElapsed,
          remainingTime: newRemaining,
          progress: newProgress,
        };
      });
    }, 100);
    
    return () => clearInterval(interval);
  }, [timerState, currentIndex, slides.length, goToSlide]);
  
  return {
    ...timerState,
    pause: () => setTimerState(prev => ({ ...prev, isPaused: true })),
    resume: () => setTimerState(prev => ({ ...prev, isPaused: false })),
    reset: () => setTimerState(prev => ({ ...prev, elapsedTime: 0, progress: 0 })),
  };
}
```

### 5.4 Files to Create/Modify

**New Files:**
```
hooks/
  useAutoAdvance.ts          // Timer logic hook
  useWordCount.ts            // Word counting utility

components/
  AutoAdvanceControls.tsx    // Play/pause/speed controls
  TimerProgressBar.tsx       // Progress indicator component

lib/utils/
  timerCalculations.ts       // WPM calculations
  slideAnalysis.ts           // Detect code blocks, tables, etc.
```

**Modified Files:**
```
components/SettingsModal.tsx // Add Auto-Advance section
app/reader/[id]/page.tsx     // Integrate timer controls
lib/constants/settings.ts    // Add timer defaults
types/index.ts               // Add AutoAdvanceSettings type
```

---

## 6. User Experience

### 6.1 First-Time User Flow

1. User opens Settings
2. Sees new "⏱️ Temporizador Automático" section
3. Enables "Avance Automático" checkbox
4. Adjusts slider to desired reading speed (e.g., 300 WPM)
5. Clicks "Guardar"
6. Opens a reading
7. Timer automatically starts after 1-second delay
8. Progress bar shows countdown at top of screen
9. Slide advances automatically when timer completes
10. User can pause anytime with `P` key or pause button

### 6.2 Power User Flow

1. User enables auto-advance in Settings
2. Sets reading speed to 400 WPM (fast reader)
3. Enables "Pausar al Pasar el Mouse"
4. Sets progress style to "Minimal" (less distraction)
5. Opens long article (50 slides)
6. Timer starts automatically
7. User reads hands-free for 25 slides
8. Hovers mouse on complex slide → timer pauses automatically
9. Reads carefully, then moves mouse away → timer resumes
10. Presses `]` key to increase speed to 425 WPM mid-reading
11. Completes entire article without manual advancement

### 6.3 Accessibility Flow

1. User with motor disability opens Settings via voice command
2. Says "Enable auto-advance"
3. Says "Set reading speed to 200 words per minute"
4. Opens reading
5. Timer starts, slides advance automatically
6. Says "Pause" when needing more time
7. Says "Resume" to continue
8. Completes reading without keyboard/mouse interaction

---

## 7. Design Specifications

### 7.1 Progress Bar Design

**Linear Progress Bar (Default):**
```css
.timer-progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: rgba(0, 0, 0, 0.1);
  z-index: 100;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(
    to right,
    #10b981,  /* Emerald (start) */
    #f59e0b,  /* Amber (middle) */
    #ef4444   /* Red (ending) */
  );
  transition: width 0.1s linear;
}

.time-remaining {
  position: absolute;
  right: 16px;
  top: 8px;
  font-size: 12px;
  font-weight: 600;
  color: #374151;
  background: rgba(255, 255, 255, 0.9);
  padding: 2px 8px;
  border-radius: 12px;
}
```

**Dark Mode Adjustments:**
```css
.dark .timer-progress-bar {
  background: rgba(255, 255, 255, 0.1);
}

.dark .time-remaining {
  color: #e5e7eb;
  background: rgba(0, 0, 0, 0.7);
}
```

### 7.2 Control Buttons Design

**Play/Pause Button:**
- Size: 48px × 48px (touch-friendly)
- Position: Bottom-right corner (fixed)
- Background: Semi-transparent backdrop
- Icon: ▶️ (play) or ⏸️ (pause)
- Hover: Scale 1.1, increase opacity
- Active state: Pulse animation

**Speed Controls:**
- Position: Next to play/pause button
- Quick adjustment: ±25 WPM per click
- Display current speed prominently
- Accessible: Large touch targets (44px minimum)

---

## 8. Success Metrics

### Launch Criteria
- ✅ Timer calculates duration based on word count
- ✅ Auto-advance works for all slide types
- ✅ Progress bar displays correctly
- ✅ Pause/resume works reliably
- ✅ Speed adjustment reflects immediately
- ✅ Keyboard shortcuts functional
- ✅ Mobile gestures work
- ✅ Accessibility: Voice commands control timer
- ✅ No bugs or crashes

### Post-Launch Metrics

**Adoption:**
- % of users who enable auto-advance
- Average reading speed (WPM) selected
- % of readings completed with auto-advance active

**Engagement:**
- Increase in average reading session length
- Increase in readings completed per user
- Reduction in manual slide advances

**Performance:**
- Timer accuracy (± 100ms tolerance)
- No performance degradation (60 FPS maintained)

**Target Goals:**
- 30%+ users try auto-advance within first month
- 15%+ users adopt it as default reading mode
- 90%+ accuracy in timer calculations
- 50%+ reduction in manual slide interactions for auto-advance users

---

## 9. Implementation Plan

### Phase 1: Core Timer Logic (Week 1)
- [ ] Create `useAutoAdvance` hook
- [ ] Implement word count calculation
- [ ] Add display time calculation with adjustments
- [ ] Test timer accuracy across slide types

### Phase 2: UI Components (Week 2)
- [ ] Design and implement progress bar
- [ ] Create control buttons (play/pause/speed)
- [ ] Add keyboard shortcuts
- [ ] Add touch gestures for mobile

### Phase 3: Settings Integration (Week 3)
- [ ] Add Auto-Advance section to SettingsModal
- [ ] Create reading speed slider (150-600 WPM)
- [ ] Add progress style selector
- [ ] Add pause-on-hover toggle
- [ ] Save settings to localStorage

### Phase 4: Reader Integration (Week 4)
- [ ] Integrate timer into Reader page
- [ ] Add visual indicators
- [ ] Handle edge cases (first/last slide)
- [ ] Test with various content types

### Phase 5: TTS Integration (Week 5)
- [ ] Coordinate with PRD-013 implementation
- [ ] Sync timer with TTS duration
- [ ] Test synchronized auto-advance + narration
- [ ] Handle pause/resume for both systems

### Phase 6: Testing & Polish (Week 6)
- [ ] Manual testing all flows
- [ ] Accessibility testing
- [ ] Performance testing (long readings)
- [ ] Bug fixes and refinements
- [ ] Create TRD-012

---

## 10. Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Timer inaccurate for complex slides | High | Test with real content, adjust multipliers |
| Performance issues with animation | Medium | Use requestAnimationFrame, optimize rendering |
| User confusion about controls | Medium | Clear UI, onboarding tutorial step |
| Timer conflicts with TTS timing | High | Coordinate implementations, shared state |
| Accessibility regression | High | Test with screen readers, voice commands |

---

## 11. Open Questions

1. **Should timer pause when window loses focus?**
   - **Decision**: Yes, pause when backgrounded (user not reading)

2. **Should timer reset or continue on manual slide change?**
   - **Decision**: Reset (user intentionally broke rhythm)

3. **Should we show statistics (average WPM, reading sessions)?**
   - **Decision**: Yes, future enhancement (PRD-014)

4. **Should timer work during tutorial?**
   - **Decision**: No, disable during tutorial mode

5. **Should we support negative speed (slow motion)?**
   - **Decision**: No, minimum 150 WPM (slower becomes unusable)

---

## 12. Future Enhancements

### V2 Features
- [ ] Reading statistics dashboard
- [ ] Variable speed per slide type (slower for code, faster for text)
- [ ] AI-based complexity detection (adjust time automatically)
- [ ] Break reminders (e.g., pause every 20 minutes)
- [ ] Reading goals (e.g., "Read 30 minutes daily")

### V3 Features
- [ ] Multi-user synchronized reading rooms
- [ ] Presenter mode (controlled auto-advance for demos)
- [ ] Eye-tracking integration (adjust speed based on gaze)
- [ ] Adaptive learning (adjust speed based on user comprehension)

---

## 13. Related Documents

- [PRD-013: Text-to-Speech for Reading Mode](./PRD-013-text-to-speech.md)
- [PRD-004: Accessibility Features](./PRD-004-accessibility.md)
- [PRD-008: Advanced Accessibility (Voice Commands)](./PRD-008-advanced-accessibility-blind-users.md)

---

**End of PRD-012**
