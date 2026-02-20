# PRD-012: Auto-Advance Timer

**Status:** ✔️ Completed  
**Priority:** Medium  
**Target Release:** v0.5.0  
**Created:** February 2, 2026  
**Last Updated:** February 20, 2026  
**Owner:** Development Team  
**Related PRDs:** PRD-013 (Text-to-Speech), PRD-009 (Spotlight Mode)

---

## 1. Overview

### Purpose
Implement an automatic timer that advances slides based on the amount of text content, allowing hands-free reading with configurable reading speed.

### Background
Users want a "presentation mode" where the app automatically advances through slides at a comfortable reading pace, eliminating the need for manual navigation. This is especially useful for:
- Hands-free reading (while exercising, cooking, etc.)
- Consistent pacing for study/memorization
- Accessibility (motor impairments)
- Passive learning/review sessions

**User Feedback:**
- "Can the app auto-advance like PowerPoint?"
- "I want to read while doing yoga - can it move automatically?"
- "Auto-scroll based on text length would be amazing"

### Goals
1. Calculate optimal reading time per slide based on text length
2. Provide configurable reading speed (WPM)
3. Allow pause/resume functionality
4. Show visual progress indicator
5. Integrate smoothly with existing reading transitions

---

## 2. Problem Statement

**Who:** Users who want hands-free or paced reading experiences

**What:** Need automatic slide advancement based on text content

**Why:** Manual navigation interrupts flow and requires hands

**Impact:** Better accessibility, improved focus, hands-free reading, consistent pacing

---

## 3. User Stories

### As a Student
- I want auto-advance so I can review flashcards hands-free
- I want adjustable speed so I can match my reading pace
- I want to pause when needed so I can think about complex content

### As a User with Motor Impairments
- I want automatic navigation so I don't need to click/tap
- I want visual feedback so I know when it will advance
- I want easy pause controls so I can stop when tired

### As a Casual Reader
- I want to read while cooking so I don't need to touch my device
- I want consistent pacing so I maintain focus
- I want to resume easily after interruptions

---

## 4. Requirements

### 4.1 Functional Requirements

#### FR-1: Time Calculation Algorithm
- Calculate reading time based on text word count
- Formula: `time = (wordCount / WPM) * 60 seconds`
- Default WPM: 200 (average reading speed)
- Configurable WPM range: 100-400
- Minimum time per slide: 3 seconds
- Maximum time per slide: 60 seconds
- Account for content type:
  - Regular text: Standard WPM
  - Code blocks: 0.5x speed (slower)
  - Lists: Standard WPM per item
  - Tables: 0.7x speed (slower)
  - Images: Fixed 5-10 seconds

#### FR-2: Timer Controls
- **Start/Play Button:** Begin auto-advance from current slide
- **Pause Button:** Stop timer, stay on current slide
- **Resume:** Continue from where paused
- **Stop:** End auto-advance, return to manual mode
- **Speed Adjustment:** Change WPM on-the-fly
- Keyboard shortcuts:
  - `Space`: Toggle play/pause
  - `+/-`: Increase/decrease speed
  - `Esc`: Stop auto-advance

#### FR-3: Visual Progress Indicator
- Circular progress ring around timer button
- Shows time remaining for current slide
- Smooth animation (1-second ticks)
- Color matches theme:
  - Light: Orange/yellow
  - Dark: Purple
  - Detox: Gray
  - High-contrast: White
- Visible but not distracting
- Optional: progress bar at bottom of screen

#### FR-4: Settings Integration
- Enable/disable auto-advance in Settings
- WPM speed selector (slider or input)
- Auto-start preference (on/off)
- Show/hide progress indicator
- Sound notification on advance (optional)
- Persist all preferences in localStorage

#### FR-5: Integration with Reading Transitions
- Works with all transition modes:
  - None
  - Fade to theme
  - Swipe
  - Spotlight
  - Line focus
- Timer triggers transition animation
- Seamless visual flow

#### FR-6: Edge Cases
- **Last Slide:** Timer stops, show "Finished" message
- **Pause During Advance:** Interrupt transition, stay on current
- **Manual Navigation:** Pause auto-advance, allow resume
- **Long Content:** Cap at 60 seconds, user can adjust speed
- **Empty Slide:** Minimum 3 seconds
- **Focus Loss:** Pause when tab loses focus (optional)

### 4.2 Non-Functional Requirements

#### NFR-1: Performance
- Minimal CPU usage (timer only, no heavy calculations)
- No lag during transitions
- Accurate timing (±100ms tolerance)
- Battery efficient (use `requestAnimationFrame` wisely)

#### NFR-2: Accessibility
- ARIA labels for timer controls
- Keyboard accessible
- Screen reader announces timer state
- High-contrast compatible
- Respects reduce motion (instant transitions)

#### NFR-3: Usability
- Intuitive controls (standard play/pause icons)
- Clear visual feedback
- Easy to discover (onboarding tooltip)
- Non-intrusive when not in use

---

## 5. Technical Implementation

### 5.1 Architecture

**Components:**
- `AutoAdvanceTimer` - Main timer component
- `TimerProgressRing` - Circular progress indicator
- `TimerControls` - Play/pause/speed buttons
- `useAutoAdvance` - Custom React hook for timer logic

**State Management:**
```typescript
interface AutoAdvanceState {
  isActive: boolean;       // Timer running
  isPaused: boolean;       // Timer paused
  currentTime: number;     // Elapsed time (ms)
  totalTime: number;       // Total time for current slide (ms)
  wpm: number;             // Words per minute
  autoStart: boolean;      // Auto-start on reading open
  showProgress: boolean;   // Show progress ring
}
```

### 5.2 Time Calculation

```typescript
function calculateSlideTime(
  sentence: ProcessedText,
  wpm: number
): number {
  let wordCount = sentence.sentence.split(/\s+/).length;
  
  // Adjust for content type
  if (sentence.isCodeBlock) {
    wordCount *= 2; // Slower for code
  } else if (sentence.isTable) {
    wordCount *= 1.4; // Slower for tables
  } else if (sentence.isImage) {
    return 5000; // Fixed 5 seconds for images
  }
  
  // Calculate time in milliseconds
  const timeMs = (wordCount / wpm) * 60 * 1000;
  
  // Clamp between min/max
  return Math.max(3000, Math.min(60000, timeMs));
}
```

### 5.3 Timer Hook

```typescript
function useAutoAdvance(settings: Settings, currentSlide: number) {
  const [state, setState] = useState<AutoAdvanceState>({
    isActive: false,
    isPaused: false,
    currentTime: 0,
    totalTime: 0,
    wpm: settings.autoAdvance?.wpm || 200,
    autoStart: settings.autoAdvance?.autoStart || false,
    showProgress: settings.autoAdvance?.showProgress || true,
  });
  
  useEffect(() => {
    if (!state.isActive || state.isPaused) return;
    
    const interval = setInterval(() => {
      setState(prev => {
        const newTime = prev.currentTime + 100; // Update every 100ms
        
        if (newTime >= prev.totalTime) {
          // Time's up - advance to next slide
          goToNext();
          return { ...prev, currentTime: 0 };
        }
        
        return { ...prev, currentTime: newTime };
      });
    }, 100);
    
    return () => clearInterval(interval);
  }, [state.isActive, state.isPaused, state.totalTime]);
  
  return {
    ...state,
    start: () => setState(prev => ({ ...prev, isActive: true, isPaused: false })),
    pause: () => setState(prev => ({ ...prev, isPaused: true })),
    resume: () => setState(prev => ({ ...prev, isPaused: false })),
    stop: () => setState(prev => ({ ...prev, isActive: false, isPaused: false, currentTime: 0 })),
    setWPM: (wpm: number) => setState(prev => ({ ...prev, wpm })),
  };
}
```

### 5.4 UI Components

**Timer Button with Progress Ring:**
```typescript
<div className="relative inline-flex items-center">
  {/* Progress ring (SVG) */}
  <svg className="absolute -inset-2 w-16 h-16">
    <circle
      cx="32"
      cy="32"
      r="28"
      stroke="currentColor"
      strokeWidth="3"
      fill="none"
      strokeDasharray={`${circumference} ${circumference}`}
      strokeDashoffset={offset}
      className="transition-all duration-100 ease-linear"
    />
  </svg>
  
  {/* Play/Pause button */}
  <button
    onClick={isActive ? pause : start}
    className="relative z-10 p-3 rounded-full"
    aria-label={isActive ? "Pause auto-advance" : "Start auto-advance"}
  >
    {isActive ? <PauseIcon /> : <PlayIcon />}
  </button>
  
  {/* Speed indicator */}
  <span className="ml-2 text-sm">{wpm} WPM</span>
</div>
```

### 5.5 Settings UI

```typescript
<div className="space-y-4">
  <h3>Auto-Advance Timer</h3>
  
  {/* Enable toggle */}
  <label className="flex items-center">
    <input
      type="checkbox"
      checked={settings.autoAdvance?.enabled}
      onChange={(e) => updateSetting('autoAdvance.enabled', e.target.checked)}
    />
    <span>Enable Auto-Advance</span>
  </label>
  
  {/* WPM slider */}
  <div>
    <label>Reading Speed: {wpm} WPM</label>
    <input
      type="range"
      min="100"
      max="400"
      step="25"
      value={wpm}
      onChange={(e) => updateSetting('autoAdvance.wpm', Number(e.target.value))}
    />
    <div className="flex justify-between text-xs">
      <span>Slow (100)</span>
      <span>Average (200)</span>
      <span>Fast (400)</span>
    </div>
  </div>
  
  {/* Auto-start option */}
  <label className="flex items-center">
    <input
      type="checkbox"
      checked={settings.autoAdvance?.autoStart}
      onChange={(e) => updateSetting('autoAdvance.autoStart', e.target.checked)}
    />
    <span>Auto-start when opening reading</span>
  </label>
  
  {/* Progress indicator */}
  <label className="flex items-center">
    <input
      type="checkbox"
      checked={settings.autoAdvance?.showProgress}
      onChange={(e) => updateSetting('autoAdvance.showProgress', e.target.checked)}
    />
    <span>Show progress ring</span>
  </label>
</div>
```

---

## 6. User Experience

### 6.1 First-Time Use
1. User opens reading
2. Tooltip appears: "Try Auto-Advance! Hands-free reading at your pace"
3. User clicks play button
4. Timer starts, progress ring fills
5. Slide advances automatically
6. User adjusts speed if needed

### 6.2 Typical Workflow
1. User opens reading
2. Clicks auto-advance button (or auto-starts if enabled)
3. Reads current slide
4. Timer advances to next automatically
5. User pauses if needed (Space key)
6. Resumes when ready
7. Timer stops on last slide

### 6.3 Visual Feedback
- **Starting:** Play button → Pause button, ring starts filling
- **Running:** Ring progresses smoothly, time remaining visible
- **Pausing:** Ring freezes, button changes back to play
- **Advancing:** Transition animation plays, ring resets
- **Finishing:** Ring completes, "Reading Complete" message

---

## 7. Success Metrics

### Primary Metrics
- **Adoption:** 20-30% of users try auto-advance
- **Retention:** 15% use it regularly
- **Satisfaction:** 4.2/5 average rating
- **Completion rate:** 10% increase in finished readings

### Secondary Metrics
- **Speed distribution:** Most users at 180-220 WPM
- **Pause frequency:** Average 2-3 pauses per reading
- **Session length:** 20% longer with auto-advance
- **Accessibility users:** High adoption (50%+)

---

## 8. Out of Scope

### Not Included
- **Voice control:** "Alexa, next slide" (future)
- **Sync across devices:** Timer state not synced
- **Smart speed:** AI-adjusting WPM based on comprehension
- **Reading analytics:** Track actual reading time vs estimated
- **Multiple timers:** Only one timer at a time
- **Custom time overrides:** Can't set time per specific slide

### Future Enhancements
- Integration with PRD-013 (TTS)
- Analytics dashboard (reading patterns)
- Speed presets (study mode, review mode, speed reading)
- Gesture controls (swipe to adjust speed)

---

## 9. Testing Checklist

### Functionality
- [ ] Timer calculates correct time for various text lengths
- [ ] Timer advances slides automatically
- [ ] Pause/resume works correctly
- [ ] Speed adjustment updates in real-time
- [ ] Keyboard shortcuts functional
- [ ] Last slide stops timer
- [ ] Manual navigation pauses timer

### Visual
- [ ] Progress ring animates smoothly
- [ ] Colors match all 4 themes
- [ ] Button states clear (play/pause)
- [ ] Speed indicator visible
- [ ] Works on mobile (touch-friendly)

### Accessibility
- [ ] Keyboard navigation works
- [ ] Screen reader announces timer state
- [ ] ARIA labels present
- [ ] High-contrast compatible
- [ ] Reduce motion respected

### Performance
- [ ] No lag during transitions
- [ ] Accurate timing (±100ms)
- [ ] Low CPU usage (<3%)
- [ ] Battery efficient

---

## 10. Implementation Plan

### Phase 1: Core Timer (5 days)
- [ ] Create `useAutoAdvance` hook
- [ ] Implement time calculation algorithm
- [ ] Add play/pause functionality
- [ ] Test accuracy

### Phase 2: UI Components (3 days)
- [ ] Build timer button component
- [ ] Create progress ring (SVG)
- [ ] Add speed controls
- [ ] Style for all themes

### Phase 3: Settings Integration (2 days)
- [ ] Add settings UI
- [ ] Persist preferences
- [ ] Add keyboard shortcuts
- [ ] Test settings sync

### Phase 4: Polish & Testing (2 days)
- [ ] Animations and transitions
- [ ] Accessibility testing
- [ ] Performance optimization
- [ ] User testing

**Total: 12 days**

---

## 11. Related Documentation

- [PRD-013: Text-to-Speech](./PRD-013-text-to-speech.md)
- [PRD-009: Spotlight Mode](./PRD-009-spotlight-mode.md)
- [PRD-004: Accessibility](./PRD-004-accessibility.md)

---

**Document Version:** 1.1  
**Status:** ✔️ Completed (Implemented)  
**Implementation Date:** February 20, 2026  
**Last Review:** February 20, 2026

---

## Implementation Summary

### Completed Features ✅
- ✅ Time calculation algorithm based on word count and content type
- ✅ Configurable WPM speed (100-400)
- ✅ Play/Pause/Resume controls
- ✅ Visual progress ring indicator
- ✅ Settings integration (enable/disable, WPM slider, auto-start)
- ✅ Integration with all reading transitions
- ✅ Theme-aware styling (4 themes supported)
- ✅ Keyboard shortcuts:
  - `Space`: Toggle play/pause auto-advance
  - `+/-`: Increase/decrease WPM speed (±25)
  - `Esc`: Stop auto-advance
- ✅ Accessibility: ARIA labels, reduce motion support
- ✅ Automatic stop on last slide
- ✅ Auto-start option when opening reading

### Implementation Files
- `app/reader/[id]/page.tsx` - Main auto-advance logic and keyboard shortcuts
- `components/SettingsModal.tsx` - Settings UI controls
- `types/index.ts` - AutoAdvanceSettings type definition
- `lib/constants/settings.ts` - Default settings

### Technical Details
- Timer precision: 100ms intervals
- Min slide duration: 3 seconds
- Max slide duration: 60 seconds
- Content adjustments:
  - Code blocks: 2x slower
  - Tables: 1.4x slower
  - Images: Fixed 5 seconds
  - Subtitle intros: Minimum 8 words

### Not Implemented (Optional)
- ❌ Audio notification on advance (marked as optional in PRD)
- ❌ Pause on tab focus loss (marked as optional in PRD)
