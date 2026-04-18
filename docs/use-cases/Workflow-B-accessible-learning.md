# Workflow B: Accessible Learning (Blind User with Screen Reader + TTS)

**Goal**: Consume content entirely through audio + keyboard navigation

**Features Used**: Firebase Auth (cross-device) + Text-to-Speech + Keyboard Navigation + Screen Reader Support

**Related Use Cases**: [UC-002 Firebase Auth](UC-002-firebase-authentication.md), [UC-006 Text-to-Speech](UC-006-text-to-speech.md), [UC-003 Accessibility Suite](UC-003-accessibility-suite.md)

**Related PRDs**: [PRD-005](../prd/PRD-005-firebase-auth.md), [PRD-013](../prd/PRD-013-text-to-speech.md), [PRD-004](../prd/PRD-004-accessibility.md)

---

## Flow

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

## Outcome

Blind student can access all content without sight; completely keyboard-navigable experience.

---

← [Back to Use Cases Index](README.md)
