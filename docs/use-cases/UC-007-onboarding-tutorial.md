# UC-007: Onboarding Tutorial - Learn Keyboard Shortcuts & Features

**Related PRD/TRD**: [PRD-010](../prd/PRD-010-onboarding-tutorial.md), [TRD-010](../trd/TRD-010-onboarding-tutorial.md)

**Actors**: First-time users, All new users

---

## Preconditions

- User is opening app for the first time (no localStorage history)
- User has not dismissed the tutorial before
- User is on dashboard page

## Main Flow

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

## Postcondition

- First-time user understands core features and UI layout
- User can dismiss tutorial and proceed independently
- Tutorial can be re-triggered from Help menu if needed
- No tutorial appears on subsequent visits (unless user requests)

## Related Features

- Settings: Tutorial highlights Settings for customization discovery
- Tags: Tutorial introduces tagging as organizational tool
- Firebase Auth: Tutorial mentions cloud sync benefits

---

← [Back to Use Cases Index](README.md)
