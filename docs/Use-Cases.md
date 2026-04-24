# Use Cases

> This file has been split into individual files for easier reading.
>
> **→ [Go to Use Cases Index](use-cases/README.md)**

---

## Quick Links

| #      | Feature                 | File                                                                                       |
|--------|-------------------------|--------------------------------------------------------------------------------------------|
| UC-001 | Tags System             | [use-cases/UC-001-tags-system.md](use-cases/UC-001-tags-system.md)                         |
| UC-002 | Firebase Authentication | [use-cases/UC-002-firebase-authentication.md](use-cases/UC-002-firebase-authentication.md) |
| UC-003 | Accessibility Suite     | [use-cases/UC-003-accessibility-suite.md](use-cases/UC-003-accessibility-suite.md)         |
| UC-004 | Spotlight Mode          | [use-cases/UC-004-spotlight-mode.md](use-cases/UC-004-spotlight-mode.md)                   |
| UC-005 | Auto-Advance Timer      | [use-cases/UC-005-auto-advance-timer.md](use-cases/UC-005-auto-advance-timer.md)           |
| UC-006 | Text-to-Speech          | [use-cases/UC-006-text-to-speech.md](use-cases/UC-006-text-to-speech.md)                   |
| UC-007 | Onboarding Tutorial     | [use-cases/UC-007-onboarding-tutorial.md](use-cases/UC-007-onboarding-tutorial.md)         |
| UC-008 | Reading Reactivation    | [use-cases/UC-008-reading-reactivation.md](use-cases/UC-008-reading-reactivation.md)       |
| UC-009 | Example Document        | [use-cases/UC-009-example-document.md](use-cases/UC-009-example-document.md)               |
| UC-010 | Theme System            | [use-cases/UC-010-theme-system.md](use-cases/UC-010-theme-system.md)                       |

### Composite Workflows

- [Workflow A – Focused Study Session](use-cases/Workflow-A-focused-study-session.md)
- [Workflow B – Accessible Learning](use-cases/Workflow-B-accessible-learning.md)
- [Workflow C – Content Creator](use-cases/Workflow-C-content-creator.md)

---

## UC-001: Tags System - Organize Readings by Topic

**Related PRD/TRD**: [PRD-002](prd/PRD-002-tags-system.md), [TRD-002](trd/TRD-002-tags-system.md)

**Actors**: Student, Content Creator, Knowledge Worker

**Preconditions**:

- User has created at least one reading
- User is viewing the dashboard (Active or Completed tab)

**Main Flow**:

1. User locates the reading card for which they want to add tags
2. User clicks the edit icon (pencil) on the reading card
3. System displays the edit modal with title and tags fields
4. User clicks on the tags input field
5. User types a tag (1-20 characters, alphanumeric/hyphens)
6. System validates tag format and uniqueness
7. User presses Enter or clicks add
8. Tag appears as a colored badge on the input field
9. User repeats steps 4-8 for up to 5 total tags per reading
10. User clicks "Save Changes"
11. System persists tags to Firestore (if authenticated) or localStorage
12. System updates reading card UI with tag badges

**Postcondition**:

- Reading displays tags as colored badges (color determined by tag hash)
- Tags are persisted across browser sessions (localStorage) or across devices (if authenticated)
- User can see tags on both Active and Completed reading cards

**Related Features**:

- Firebase Auth: Tags sync across devices when authenticated
- Enhanced Tag Filtering (future): Tags enable dashboard filtering by topic

**Variant: Reusing Existing Tags**:

1. User types partial tag name (e.g., "java")
2. System shows autocomplete suggestions of existing tags matching the pattern
3. User clicks suggestion to add existing tag
4. System avoids duplicate tags

**Variant: Editing Existing Tags**:

1. User clicks on reading card already containing tags
2. User clicks edit icon
3. User sees existing tags displayed as badges
4. User can remove tag by clicking X on badge
5. User can add new tags following steps 4-8 above
6. Changes are saved as per step 11-12

---

## UC-002: Firebase Authentication - Enable Cloud Sync

**Related PRD/TRD**: [PRD-005](prd/PRD-005-firebase-auth.md), [TRD-005](trd/TRD-005-firebase-auth.md)

**Actors**: All users (optional feature)

**Preconditions**:

- User is on dashboard or reader page
- User has not yet signed in (or is currently signed out)
- Internet connection available

**Main Flow**:

1. User clicks "Sign In" button in header or sees sign-in prompt
2. System displays SignInModal with "Sign in with Google" option
3. User clicks Google sign-in button
4. Browser redirects to Google authentication flow
5. User completes Google authentication
6. Firebase verifies credentials and creates/updates user profile
7. System stores auth token in secure local storage
8. System syncs all existing localStorage readings to Firestore under user's UID
9. System updates header UI to show user profile photo and email
10. System persists all future changes (readings, tags, settings) to Firestore automatically

**Postcondition**:

- User is authenticated and can access readings across devices
- User profile is visible in header (avatar + email)
- All readings and settings are synced to cloud
- User can sign out and sign back in to recover data

**Related Features**:

- Tags System: Tag changes sync across devices
- Settings: User preferences (fonts, theme, accessibility) sync across devices
- Auto-Advance Timer: Bookmarks and timer state sync across devices

**Variant: Already Signed In, Switching Devices**:

1. User opens app on different device
2. User clicks Sign In
3. User signs in with same Google account
4. System fetches all readings and settings from Firestore
5. Dashboard displays all readings from previous device(s)

**Variant: Sign Out Flow**:

1. User clicks user menu in header
2. User selects "Sign Out"
3. System clears auth token and local user profile
4. System keeps localStorage readings but marks as "unsynced"
5. User can sign back in later to re-sync

---

## UC-003: Accessibility Suite - Customize for Dyslexia & Reading Comfort

**Related PRD/TRD**: [PRD-004](prd/PRD-004-accessibility.md), [TRD-004](trd/TRD-004-accessibility.md)

**Actors**: Dyslexic readers, Motor-impaired users, Visually impaired users, ADHD users

**Preconditions**:

- User is on dashboard or actively reading a passage
- User has opened the Settings modal or accessibility shortcuts

**Main Flow - Dyslexia-Friendly Setup**:

1. User clicks Settings icon (gear) in header
2. System displays SettingsModal with multiple options
3. User locates "Accessibility" section
4. User clicks font family dropdown
5. System shows options: Serif, Sans-serif, Monospace, **OpenDyslexic**, Comic Sans Dyslexic variant
6. User selects OpenDyslexic font
7. User adjusts letter spacing slider (normal → increased)
8. User adjusts line height slider (normal → increased for more breathing room)
9. User views reading preview in real-time as settings change
10. User clicks "Apply Settings"
11. System persists settings to localStorage (or Firestore if authenticated)
12. System applies settings across all readings immediately

**Postcondition**:

- Reading text displays in OpenDyslexic font with increased letter/line spacing
- Settings persist across browser sessions
- User can return to settings anytime to adjust further

**Related Features**:

- Theme System: Can combine with High-Contrast or Dark theme for better visibility
- Spotlight Mode: Pairs well with dyslexia settings to reduce visual stress
- Text-to-Speech: Can use TTS alongside visual text for reinforcement

**Variant: High Contrast + Vision Settings**:

1. User selects "High Contrast" theme in Theme dropdown
2. User enables "Reduce Motion" toggle (stops animations)
3. User adjusts font size to "Extra Large" (4 size options)
4. User checks "Use High Contrast Colors for All Elements"
5. System applies stark black/white or high-saturation color scheme
6. All UI elements (buttons, modals, text) use high contrast

**Variant: Motor Accessibility - Keyboard Only**:

1. User opens Settings → Keyboard Shortcuts modal
2. System displays all possible keyboard shortcuts (Arrow keys, Space, Enter, Ctrl+S, etc.)
3. User learns that entire app is navigable via keyboard
4. User enables "Focus Ring Enhancement" toggle (makes focus indicators more visible)
5. User navigates dashboard using Tab + Arrow keys to select readings
6. User opens reading and uses ← → to advance slides without mouse/trackpad needed

---

## UC-004: Spotlight Mode - Reduce Cognitive Overload During Reading

**Related PRD/TRD**: [PRD-009](prd/PRD-009-spotlight-mode.md), [TRD-009](trd/TRD-009-spotlight-mode.md)

**Actors**: Students with ADHD, Autistic readers, Focus-seekers

**Preconditions**:

- User is actively reading a passage (in reader page)
- User has multiple sentences visible on current slide
- User wants to focus on one sentence at a time

**Main Flow**:

1. User clicks "Transition" dropdown in reader controls
2. System displays options: None, Fade (theme color), Swipe, Line Focus, **Spotlight**
3. User selects "Spotlight"
4. System applies effect: Remaining text on slide dims/fades, one sentence at a time is highlighted in bright circle (spotlight effect)
5. User presses right arrow (or space) to advance to next sentence
6. Current sentence fades, next sentence is spotlighted
7. Spotlight circle follows each sentence as user navigates
8. User reaches end of slide
9. User presses right arrow to go to next slide
10. System maintains Spotlight effect on new slide's first sentence
11. User can toggle effect off anytime by selecting "None" from Transition dropdown

**Postcondition**:

- Spotlight mode persists for current reading session
- User can read without visual distractions
- Navigation is smooth, one sentence at a time
- Eye strain and cognitive load are reduced

**Related Features**:

- Accessibility Suite: Pairs well with dyslexia or ADHD accessibility settings
- Auto-Advance Timer: Can enable both Spotlight AND auto-advance for fully hands-off experience
- Keyboard Shortcuts: All navigation is keyboard-accesible

**Variant: Spotlight + Auto-Advance Combined**:

1. User enables Spotlight mode (steps 1-3)
2. User opens Auto-Advance Timer settings
3. User sets WPM (words per minute) to 250
4. User clicks "Start Auto-Advance"
5. System automatically advances sentence-by-sentence at timed intervals
6. Spotlight follows each sentence without user input
7. User can manually pause/resume with Space key

---

## UC-005: Auto-Advance Timer - Practice Reading at Controlled Pace

**Related PRD/TRD**: [PRD-012](prd/PRD-012-auto-advance-timer.md), [TRD-012](trd/TRD-012-auto-advance-timer.md)

**Actors**: Speed readers, ADHD users, Language learners, Students

**Preconditions**:

- User is actively reading a passage
- User wants to practice reading at a specific pace (e.g., 200 WPM)
- User is not at end of reading

**Main Flow**:

1. User clicks "Auto-Advance" button or timer icon in reader controls
2. System displays AutoAdvanceSettings modal
3. Modal shows:
   - Checkbox: "Enable Auto-Advance"
   - Input: "Target WPM" (words per minute, default 250)
   - Checkbox: "Auto-Start on Next Reading"
   - Checkbox: "Show Progress Bar"
4. User checks "Enable Auto-Advance"
5. User adjusts WPM slider to desired pace (e.g., 200 WPM for language learning)
6. User optionally checks "Show Progress Bar" to see timer countdown
7. User clicks "Start" or closes modal
8. System calculates time per slide based on word count and WPM
9. System displays countdown (if progress bar enabled) showing time remaining on slide
10. When timer expires, system automatically advances to next slide
11. User can pause by pressing Space
12. User can skip ahead with right arrow key
13. At end of reading, system stops auto-advance and displays completion animation

**Postcondition**:

- Reading progresses at consistent pace
- User learns consistent reading rhythm
- Reading can be paused/resumed without resetting timer
- Settings are saved for future readings (if authenticated)

**Related Features**:

- Spotlight Mode: Can combine for focused, paced reading experience
- Accessibility Suite: Auto-advance helps users with motor disabilities who cannot click buttons

**Variant: Resume Previous Settings**:

1. User opens reading that previously used Auto-Advance at 250 WPM
2. System remembers last used WPM setting (if authenticated)
3. User clicks Auto-Advance button
4. Modal pre-fills with "250" WPM from last session
5. User clicks "Start" to use same pace

---

## UC-006: Text-to-Speech (TTS) - Audio Alternative for Content

**Related PRD/TRD**: [PRD-013](prd/PRD-013-text-to-speech.md)

**Actors**: Visually impaired users, Multi-taskers, Language learners

**Preconditions**:

- User is viewing a reading passage
- User's browser supports Web Audio API and Web Speech API
- User has audio enabled on device

**Main Flow**:

1. User clicks TTS Player button (speaker icon) in reader controls
2. System displays TTSPlayer component with:
   - Play/Pause button
   - Voice selector dropdown (e.g., "Spanish Female", "English Male", etc.)
   - Speed slider (0.5x to 2.0x rate)
   - Auto-Play toggle
3. User selects desired voice from dropdown
4. User adjusts speed slider if desired
5. User clicks Play or enables Auto-Play
6. System extracts current slide text and constructs speech queue
7. Browser Web Speech API begins synthesizing text to audio
8. Audio plays through device speakers; system highlights current sentence being spoken
9. User can follow along visually and/or listen passively
10. User hears entire slide read aloud
11. When slide complete, system either stops or auto-advances (if that's enabled) and reads next slide
12. User can pause, resume, or skip by pressing buttons

**Postcondition**:

- Content is accessible via audio
- User can consume content without relying on visual reading
- Voice and speed preferences are remembered (if authenticated)
- Sentence highlighting helps users follow along

**Related Features**:

- Auto-Advance Timer: Can pause auto-advance while TTS is speaking to avoid conflicts
- Accessibility Suite: Pairs with screen readers for fully accessible experience
- Language: TTS voice selection includes multiple languages (supports i18n roadmap)

**Variant: Multi-language Support**:

1. User opens reading with original Spanish text
2. User opens TTS Player
3. User selects "Spanish Female (Castilian)" from voice dropdown
4. System plays Spanish text in Spanish voice
5. Reading can include translated sections; user selects appropriate voice for each section

---

## UC-007: Onboarding Tutorial - Learn Keyboard Shortcuts & Features

**Related PRD/TRD**: [PRD-010](prd/PRD-010-onboarding-tutorial.md), [TRD-010](trd/TRD-010-onboarding-tutorial.md)

**Actors**: First-time users, All new users

**Preconditions**:

- User is opening app for the first time (no localStorage history)
- User has not dismissed the tutorial before
- User is on dashboard page

**Main Flow**:

1. System detects first-time visit (no localStorage readings)
2. System automatically starts tutorial (using driver.js)
3. Tutorial displays step 1: Highlighted "New Reading" button with tooltip
4. Tooltip text: "Create a new reading from markdown content"
5. User clicks "New Reading" or presses Next button on tooltip
6. Tutorial advances to step 2: Highlighted reading card area
7. Tooltip: "Your readings appear here. Click to view or edit."
8. User clicks Next or dismissed by clicking elsewhere
9. Tutorial step 3: Highlights Settings icon
10. Tooltip: "Customize fonts, themes, and accessibility options"
11. Tutorial step 4: Highlights Tags section (if visible)
12. Tooltip: "Organize readings with tags"
13. Tutorial step 5: Highlights Sign In button
14. Tooltip: "Sign in to sync readings across devices"
15. Tutorial completes with "You're all set!" message
16. System offers "Take Tutorial Again" button if needed

**Postcondition**:

- First-time user understands core features and UI layout
- User can dismiss tutorial and proceed independently
- Tutorial can be re-triggered from Help menu if needed
- No tutorial appears on subsequent visits (unless user requests)

**Related Features**:

- Settings: Tutorial highlights Settings for customization discovery
- Tags: Tutorial introduces tagging as organizational tool
- Firebase Auth: Tutorial mentions cloud sync benefits

---

## UC-008: Reading Reactivation - Undo Accidental Completion

**Related PRD/TRD**: [PRD-014](prd/PRD-014-reading-reactivation.md)

**Actors**: All users

**Preconditions**:

- User has just completed a reading (it moved to "Completed" tab)
- User realizes they want to resume or made a mistake marking it complete
- Completion happened within current session or recently (timestamp tracked)

**Main Flow**:

1. User navigates to "Completed" tab on dashboard
2. User sees reading they accidentally marked complete
3. User clicks the reactivate icon (redo/refresh icon) on completed reading card
4. System displays ConfirmReactivateModal asking "Move reading back to Active?"
5. User clicks "Confirm"
6. System moves reading from Completed back to Active tab
7. System resets completion status in Firestore/localStorage
8. System updates reading's localStorage flag: `completed = false`
9. Completed reading card disappears from Completed tab
10. Reading reappears in Active tab in its original position
11. User can resume reading from where they left off

**Postcondition**:

- Reading is marked as Active again
- Completion state is fully reversed
- User can continue from their last slide position
- Change persists across sessions (if authenticated)

**Related Features**:

- Firebase Auth: Reactivation state syncs across devices
- Tags: Reactivated reading retains all tags and metadata

---

## UC-009: Example Document - First-Time Onboarding Content

**Related PRD/TRD**: [PRD-001](prd/PRD-001-example-document.md)

**Actors**: First-time users

**Preconditions**:

- User is opening app for the very first time
- No existing readings in localStorage
- User is on dashboard page

**Main Flow**:

1. System detects empty dashboard (no readings)
2. System automatically creates "Welcome to tellingQuote" example reading
3. Example reading content is a markdown tutorial showing:
   - How to format markdown (headers, bold, italics, lists)
   - How to navigate slides (keyboard, arrows, buttons)
   - How to customize settings (fonts, themes, accessibility)
   - How to create your own reading
4. Example reading appears in dashboard "Active" tab
5. User sees breadcrumb or label: "📚 Example Reading"
6. User can click to open and view the example
7. User reads through example slides which explain the app
8. Example reading explains how to add tags, search settings, etc.
9. User completes example reading (optional, no pressure)
10. User can delete example reading anytime without consequence
11. User now understands app and can create their own readings

**Postcondition**:

- First-time user has seen functional example of app capabilities
- User understands markdown formatting and navigation
- Example reading can be deleted by user to create fresh start
- New user feels guided rather than confused by empty interface

**Related Features**:

- Onboarding Tutorial: Complements formal tutorial with hands-on example
- Tags: Example reading includes tags showing how feature works
- Markdown Processing: Showcases all supported markdown syntax

---

## UC-010: Theme System - Customize Visual Experience

**Related PRD/TRD**: Theme system integrated into Settings

**Actors**: All users

**Preconditions**:

- User is on dashboard or reading page
- User has accessed Settings modal

**Main Flow - Light vs. Dark Theme**:

1. User clicks Settings (gear icon) in header
2. System displays SettingsModal
3. User locates "Theme" section
4. User sees buttons: Light | Dark | Detox | High-Contrast
5. User clicks "Dark" theme
6. System immediately applies dark theme:
   - Background changes to dark gray/black
   - Text changes to light gray/white
   - Primary accent colors adjust (purple gradient for dark)
   - UI components (buttons, cards) recolor for dark mode
7. User can see real-time preview of theme changes
8. User can switch themes back and forth without saving
9. When satisfied, user clicks "Apply" or simply closes modal
10. System persists theme choice to localStorage (or Firestore if authenticated)
11. Theme applies across all subsequent visits and all readings

**Postcondition**:

- User's preferred theme is active
- Theme persists across browser sessions
- All future readings display in selected theme
- If authenticated, theme syncs across devices

**Variant: Detox Theme - For Evening Reading (Blue Light Reduction)**:

1. User selects "Detox" theme
2. System applies warm, muted colors:
   - Amber/sepia background tones
   - Reduced blue light from screen
   - Lower contrast (easier on eyes at night)
3. User can read comfortably in evening without eye strain

**Variant: High Contrast - For Visually Impaired**:

1. User selects "High-Contrast" theme
2. System applies stark colors:
   - Pure black/pure white (or customizable high-contrast pair)
   - No gradients or subtle shading
   - All text edges crisp and visible
   - Focus indicators are bold and unmissable
3. Pairs well with large font size for maximum visibility

---

## 🔗 Composite Workflows

These workflows combine multiple features for real-world use cases:

---

## Workflow A: Focused Study Session (Student with ADHD)

**Goal**: Study long article without distractions, at controlled pace

**Features Used**: Spotlight Mode + Auto-Advance Timer + Accessibility (increased spacing) + Dark Theme

**Flow**:

1. Student opens reading about calculus
2. Clicks Settings → selects "Dark" theme + increases line height for comfort
3. Selects Transition → "Spotlight" mode
4. Clicks Auto-Advance → sets to 200 WPM, enables "Show Progress Bar"
5. Clicks "Start" → article begins advancing sentence-by-sentence in spotlight
6. None of the text below spotlight is visible; only current sentence is highlighted
7. Student watches progress bar; slides auto-advance every 3-5 seconds
8. Student can pause with Space to reflect longer on difficult concepts
9. Student completes reading with celebration animation
10. Switches to Completed tab, sees reading with completion timestamp

**Outcome**: Student read full article with minimal distractions and no manual clicking needed.

**Related PRDs**: PRD-004, PRD-009, PRD-012

---

## Workflow B: Accessible Learning (Blind User with Screen Reader + TTS)

**Goal**: Consume content entirely through audio + keyboard navigation

**Features Used**: Firebase Auth (cross-device) + Text-to-Speech + Keyboard Navigation + Screen Reader Support

**Flow**:

1. Visually impaired student signs in with Google (Firebase Auth)
2. System loads all their readings from cloud
3. Student uses NVDA screen reader + Tab key to navigate dashboard
4. Student selects reading with Tab/Enter
5. Reader page opens; screen reader announces slide count and current text
6. Student clicks TTS Player button or presses keyboard shortcut for audio
7. Selects English Female voice
8. Sets TTS speed to 1.5x (student's preferred rate)
9. Clicks Play
10. Web Speech API reads entire slide aloud while student follows (optional visual)
11. Screen reader also announces text, giving double confirmation
12. Student can press Arrow keys to navigate or let auto-play continue
13. At end of reading, can sign back in on different device (phone, tablet) and continue with same settings

**Outcome**: Blind student can access all content without sight; completely keyboard-navigable experience.

**Related PRDs**: PRD-005, PRD-013, PRD-004

---

## Workflow C: Content Creator Publishing Tutorial

**Goal**: Create markdown documentation as interactive slides, share with team

**Features Used**: Tags + Onboarding Tutorial + Settings Customization + Sign In for sharing

**Flow**:

1. Creator opens tellingQuote and starts "New Reading"
2. Pastes markdown for "Git Workflow Tutorial" in content field
3. Adds tags: "Git", "Development", "Tutorial", "Internal" (4 tags)
4. Saves reading
5. Reading appears on dashboard with tag badges
6. Creator opens Settings to set default "Sans-serif" font + "Light" theme for professional look
7. Creator tests reading by clicking through slides (sees code blocks formatted nicely)
8. Creator clicks Share button (generates public URL via Vercel)
9. Creator sends link to team via Slack
10. Team members open link, see interactive tutorial
11. Team members can apply their own Settings customization without affecting creator's version
12. Creator can enable/disable tutorial for team members via Settings
13. Later, creator signs in with Google to save their settings across devices

**Outcome**: Technical tutorial becomes interactive learning tool that team can consume at their own pace.

**Related PRDs**: PRD-002, PRD-010, PRD-005

---

## How to Navigate These Use Cases

1. **What feature am I interested in?** → Find UC-001 through UC-010 by feature name (Tags, TTS, Spotlight, etc.)
2. **What's my user scenario?** → Jump to "Composite Workflows" to see multi-feature workflows
3. **Need PRD details?** → Click Related PRD/TRD link to read full product specification
4. **Want to try it?** → Follow "Main Flow" steps exactly
5. **Edge case?** → Check "Variant" sections for alternate scenarios (e.g., reusing tags, editing existing tags)
