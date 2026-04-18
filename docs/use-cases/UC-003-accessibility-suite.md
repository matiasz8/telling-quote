# UC-003: Accessibility Suite - Customize for Dyslexia & Reading Comfort

**Related PRD/TRD**: [PRD-004](../prd/PRD-004-accessibility.md), [TRD-004](../trd/TRD-004-accessibility.md)

**Actors**: Dyslexic readers, Motor-impaired users, Visually impaired users, ADHD users

---

## Preconditions

- User is on dashboard or actively reading a passage
- User has opened the Settings modal or accessibility shortcuts

## Main Flow - Dyslexia-Friendly Setup

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

## Postcondition

- Reading text displays in OpenDyslexic font with increased letter/line spacing
- Settings persist across browser sessions
- User can return to settings anytime to adjust further

## Related Features

- Theme System: Can combine with High-Contrast or Dark theme for better visibility
- Spotlight Mode: Pairs well with dyslexia settings to reduce visual stress
- Text-to-Speech: Can use TTS alongside visual text for reinforcement

---

## Variants

### Variant: High Contrast + Vision Settings

1. User selects "High Contrast" theme in Theme dropdown
2. User enables "Reduce Motion" toggle (stops animations)
3. User adjusts font size to "Extra Large" (4 size options)
4. User checks "Use High Contrast Colors for All Elements"
5. System applies stark black/white or high-saturation color scheme
6. All UI elements (buttons, modals, text) use high contrast

### Variant: Motor Accessibility - Keyboard Only

1. User opens Settings → Keyboard Shortcuts modal
2. System displays all possible keyboard shortcuts (Arrow keys, Space, Enter, Ctrl+S, etc.)
3. User learns that entire app is navigable via keyboard
4. User enables "Focus Ring Enhancement" toggle (makes focus indicators more visible)
5. User navigates dashboard using Tab + Arrow keys to select readings
6. User opens reading and uses ← → to advance slides without mouse/trackpad needed

---

← [Back to Use Cases Index](README.md)
