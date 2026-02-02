# PRD-010: Interactive Onboarding Tutorial

**Status:** Draft  
**Priority:** P1  
**Target Release:** v0.3.0  
**Created:** 2026-02-02  
**Related Issues:** TBD  
**Related PRDs:** PRD-004 (Accessibility)

## Problem Statement

New users report confusion about how to use the application. There's no guided introduction to core features like creating readings, navigating content, or accessing settings. This leads to increased friction and potential abandonment.

**User Feedback:**
- "I don't understand how to use the app"
- "Where do I create new readings?"
- "What do all these settings do?"

## Goals

1. **Primary:** Reduce time-to-first-value for new users
2. **Secondary:** Educate users about key features contextually
3. **Tertiary:** Increase feature discovery and engagement

## Non-Goals

- Comprehensive documentation (focus on quick start)
- Video tutorials (text-based only)
- Advanced features explanation (basics only)
- Forced tutorial (always skippable)

## Success Metrics

- ✅ 80%+ new users complete tutorial
- ✅ 50% reduction in time to first reading creation
- ✅ Increased settings button clicks (feature discovery)
- ✅ Tutorial can be replayed from settings
- ✅ Respects accessibility settings (reduceMotion)

## User Stories

### Story 1: First-Time User Guidance
**As a** new user visiting the app for the first time  
**I want** a guided walkthrough of main features  
**So that** I understand how to use the app quickly

**Acceptance Criteria:**
- [ ] Tutorial launches automatically on first visit
- [ ] Shows 5-7 steps covering core features
- [ ] Can be skipped at any time
- [ ] Never blocks critical functionality

### Story 2: Tutorial Replay
**As a** returning user who forgot how something works  
**I want** to replay the tutorial  
**So that** I can refresh my knowledge

**Acceptance Criteria:**
- [ ] Tutorial accessible from Settings menu
- [ ] Option labeled "Show Tutorial Again"
- [ ] Resets tutorial state and starts from beginning

### Story 3: Accessible Tutorial
**As a** user with accessibility needs  
**I want** the tutorial to respect my settings  
**So that** it doesn't interfere with my experience

**Acceptance Criteria:**
- [ ] Respects `reduceMotion` setting (no animations)
- [ ] Keyboard navigable (Tab, Enter, Escape)
- [ ] High-contrast compatible
- [ ] Screen reader friendly (ARIA labels)

## Detailed Requirements

### Tutorial Steps

#### Step 0: Welcome Modal (Optional Pre-Tour)
**Type:** Centered modal with overlay  
**Content:**
```
Title: Welcome to Telling! 📖

Body:
Telling is a focused reading tool that helps you read 
line-by-line with minimal distractions.

Let us show you around!

[Button: Start Tour]  [Button: Skip Tutorial]
```

**Behavior:**
- Shows only on first visit
- Can be dismissed with X or Skip button
- Starting tour proceeds to Step 1

#### Step 1: Settings Introduction
**Target:** Settings button (⚙️) in header  
**Position:** Below-left  
**Content:**
```
Title: Customize Your Experience

Body:
Change themes, adjust font size, and choose your 
reading style here.

[← Back]  [1/5]  [Next →]  [Skip]
```

**Highlight:** Settings button with spotlight effect

#### Step 2: Creating New Readings
**Target:** "+ New Reading" button  
**Position:** Below  
**Content:**
```
Title: Add Your Content

Body:
Click here to create a new reading. Paste any text 
or markdown - we'll format it beautifully.

[← Back]  [2/5]  [Next →]  [Skip]
```

**Highlight:** New Reading button

#### Step 3: Reading Cards
**Target:** First reading card (or example reading)  
**Position:** Right (if space) or Below  
**Content:**
```
Title: Your Reading Library

Body:
Your readings appear as cards. Click any card to 
start reading. You can tag, edit, or delete them.

[← Back]  [3/5]  [Next →]  [Skip]
```

**Highlight:** First visible reading card  
**Fallback:** If no readings exist, show example reading card

#### Step 4: Reader Navigation (Conditional)
**Trigger:** User clicks a reading card OR automatic navigation  
**Target:** Navigation controls in reader  
**Position:** Above  
**Content:**
```
Title: Navigate Your Reading

Body:
Use arrow keys (← →) or these buttons to move 
line-by-line. Try "Spotlight Mode" in settings for 
maximum focus!

[← Back]  [4/5]  [Next →]  [Skip]
```

**Highlight:** Navigation button group  
**Behavior:** If user navigates away, tutorial pauses

#### Step 5: Keyboard Shortcuts
**Target:** Keyboard icon or header area  
**Position:** Below-right  
**Content:**
```
Title: Power User Tips ⚡

Body:
Press '?' to see all keyboard shortcuts. Try:
• ← → to navigate
• Esc to exit reading
• ? for shortcuts menu

[← Back]  [5/5]  [Finish]
```

**Highlight:** Keyboard shortcuts button (if visible)

#### Step 6: Completion
**Type:** Centered modal  
**Content:**
```
Title: You're All Set! 🎉

Body:
You can replay this tutorial anytime from Settings → 
"Show Tutorial Again"

Now create your first reading and start focusing!

[Button: Start Reading]
```

**Behavior:**
- Marks tutorial as completed
- Closes modal on button click
- Returns user to home page

### Technical Implementation

#### Library Choice: react-joyride

**Installation:**
```bash
npm install react-joyride
```

**Rationale:**
- Mature library (5k+ GitHub stars)
- Excellent TypeScript support
- Built-in accessibility features
- Customizable styling per theme
- Lightweight (~20KB gzipped)

#### State Management

**localStorage Keys:**
```typescript
'tutorial-completed': 'true' | 'false'
'tutorial-skipped': 'true' | 'false'
'tutorial-current-step': number
```

**Hook: `useTutorial`**
```typescript
interface UseTutorialReturn {
  showTutorial: boolean;
  currentStep: number;
  startTutorial: () => void;
  skipTutorial: () => void;
  nextStep: () => void;
  previousStep: () => void;
  completeTutorial: () => void;
}
```

#### Component Structure

**Files to Create:**
```
components/
  Tutorial/
    index.tsx              # Main tutorial component
    steps.ts               # Step definitions
    WelcomeModal.tsx       # Welcome screen
    CompletionModal.tsx    # Completion screen
    
hooks/
  useTutorial.ts           # Tutorial state management

lib/constants/
  tutorialSteps.ts         # Step configurations
```

#### Theme Integration

**Joyride Styles per Theme:**

```typescript
// Light Theme
{
  backgroundColor: '#ffffff',
  textColor: '#1f2937',
  primaryColor: '#3b82f6',
  spotlightShadow: '0 0 15px rgba(0, 0, 0, 0.5)',
}

// Dark Theme
{
  backgroundColor: '#1f2937',
  textColor: '#f9fafb',
  primaryColor: '#8b5cf6',
  spotlightShadow: '0 0 15px rgba(139, 92, 246, 0.5)',
}

// Detox Theme
{
  backgroundColor: '#ffffff',
  textColor: '#111827',
  primaryColor: '#6b7280',
  spotlightShadow: '0 0 15px rgba(0, 0, 0, 0.3)',
}

// High-Contrast Theme
{
  backgroundColor: '#000000',
  textColor: '#ffffff',
  primaryColor: '#ffffff',
  spotlightShadow: 'none',
  beaconColor: '#ffffff',
}
```

#### Accessibility Requirements

**Keyboard Navigation:**
- Tab: Navigate between buttons
- Enter: Activate focused button
- Escape: Close/skip tutorial
- Arrow keys: Previous/Next steps

**ARIA Labels:**
```typescript
{
  'aria-label': 'Tutorial step 1 of 5',
  'aria-describedby': 'tutorial-content',
  role: 'dialog',
  'aria-modal': 'true',
}
```

**Reduce Motion:**
```typescript
if (settings.reduceMotion) {
  disableAnimation: true,
  disableOverlay: false, // Keep overlay for focus
  spotlightClicks: false,
}
```

**Screen Reader Support:**
- All steps have descriptive titles
- Button labels are explicit ("Next step", not just "Next")
- Progress indicator announced ("Step 1 of 5")

### Integration Points

#### Settings Component
Add new option:
```tsx
<button
  onClick={startTutorial}
  className="settings-option"
>
  <span>Show Tutorial Again</span>
  <QuestionMarkCircleIcon className="h-5 w-5" />
</button>
```

#### App Layout (app/layout.tsx)
```tsx
import Tutorial from '@/components/Tutorial';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Tutorial />
      </body>
    </html>
  );
}
```

#### Data Attributes for Targeting
Add to components:
```tsx
// components/Header.tsx
<button data-tour="settings-button">...</button>

// app/page.tsx
<button data-tour="new-reading-button">...</button>

// components/ReadingCard.tsx
<div data-tour="reading-card">...</div>

// app/reader/[id]/page.tsx
<div data-tour="reader-navigation">...</div>
<button data-tour="keyboard-shortcuts">...</button>
```

### User Flow Diagram

```
First Visit
    ↓
[Welcome Modal]
    ↓
[Start Tour] → Step 1 (Settings)
    ↓
Step 2 (New Reading)
    ↓
Step 3 (Reading Card)
    ↓
User clicks card → Navigate to Reader
    ↓
Step 4 (Reader Navigation)
    ↓
Step 5 (Keyboard Shortcuts)
    ↓
[Completion Modal]
    ↓
Mark as completed
    ↓
Return to Home


Returning User
    ↓
Settings → "Show Tutorial Again"
    ↓
Reset tutorial state
    ↓
[Start from Welcome Modal]
```

### Edge Cases

#### No Readings Exist
**Scenario:** User has no readings yet  
**Solution:** Show example reading card or tutorial uses placeholder

#### Tutorial Interrupted
**Scenario:** User navigates away mid-tutorial  
**Solution:** Save current step, offer to resume on return

#### Mobile vs Desktop
**Scenario:** Different layouts  
**Solution:** Responsive positioning (above/below/left/right based on space)

#### Browser Refresh
**Scenario:** User refreshes during tutorial  
**Solution:** Resume from last completed step

#### Multiple Tabs
**Scenario:** User opens app in multiple tabs  
**Solution:** Tutorial state synced via localStorage events

## Dependencies

- **Blocks:** None
- **Blocked by:** None
- **Requires:**
  - react-joyride package
  - Data attributes on target elements
  - localStorage access
  - Accessibility settings (PRD-004)

## Risks & Mitigations

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Users skip tutorial immediately | High | Medium | Keep tutorial short (5 steps), show value in first step |
| Tutorial breaks with UI changes | Medium | High | Use data attributes (data-tour), not class names |
| Accessibility issues | High | Low | Thorough testing with screen readers, keyboard-only navigation |
| Tutorial interferes with usage | High | Low | Always skippable, never blocks core features |
| Performance impact | Low | Low | Lazy load Joyride, only render when needed |

## Open Questions

- [ ] Should tutorial auto-navigate to reader page for Step 4?
- [ ] Include GIF animations in tooltips for visual learners?
- [ ] Add advanced tutorial for power users (separate tour)?
- [ ] Track analytics for tutorial completion rate?
- [ ] Offer tutorial in multiple languages?

## Implementation Phases

### Phase 1: Core Tutorial (MVP)
- Install react-joyride
- Create Tutorial component with 5 basic steps
- Add data attributes to target elements
- Implement localStorage persistence
- Basic styling for light/dark themes

### Phase 2: Polish & Accessibility
- Add Welcome and Completion modals
- Full theme integration (4 themes)
- Keyboard navigation
- Screen reader support
- Reduce motion support

### Phase 3: Enhancements
- Tutorial replay from settings
- Resume interrupted tutorial
- Responsive positioning
- Analytics tracking

## Testing Plan

### Manual Testing Checklist

**First-Time User:**
- [ ] Tutorial launches automatically
- [ ] All 5 steps display correctly
- [ ] Tooltips point to correct elements
- [ ] Can skip at any step
- [ ] Completion modal shows
- [ ] Tutorial doesn't reappear on second visit

**Returning User:**
- [ ] Settings option appears
- [ ] "Show Tutorial Again" works
- [ ] Tutorial state resets properly

**Accessibility:**
- [ ] Keyboard navigation works (Tab, Enter, Esc)
- [ ] Screen reader announces steps
- [ ] High-contrast theme displays properly
- [ ] Reduce motion disables animations

**Themes:**
- [ ] Light theme styling correct
- [ ] Dark theme styling correct
- [ ] Detox theme styling correct
- [ ] High-contrast theme styling correct

### Edge Case Testing

- [ ] No readings exist
- [ ] Browser refresh mid-tutorial
- [ ] Multiple tabs open
- [ ] Small screen sizes (mobile)
- [ ] Very large font sizes
- [ ] Navigation during tutorial

## Changelog

- **2026-02-02:** Initial PRD created
- **TBD:** Implementation started
- **TBD:** Testing completed
- **TBD:** Released to production

## Appendix

### Alternative Libraries Considered

**driver.js:**
- Pros: Lighter, vanilla JS
- Cons: Less React integration, fewer features
- Verdict: Good alternative if bundle size critical

**react-tour:**
- Pros: Simpler API
- Cons: Less maintained, fewer stars
- Verdict: Not recommended

**intro.js:**
- Pros: Very popular, mature
- Cons: Paid for commercial use, heavier
- Verdict: react-joyride is better fit
