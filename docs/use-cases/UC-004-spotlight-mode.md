# UC-004: Spotlight Mode - Reduce Cognitive Overload During Reading

**Related PRD/TRD**: [PRD-009](../prd/PRD-009-spotlight-mode.md), [TRD-009](../trd/TRD-009-spotlight-mode.md)

**Actors**: Students with ADHD, Autistic readers, Focus-seekers

---

## Preconditions

- User is actively reading a passage (in reader page)
- User has multiple sentences visible on current slide
- User wants to focus on one sentence at a time

## Main Flow

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

## Postcondition

- Spotlight mode persists for current reading session
- User can read without visual distractions
- Navigation is smooth, one sentence at a time
- Eye strain and cognitive load are reduced

## Related Features

- Accessibility Suite: Pairs well with dyslexia or ADHD accessibility settings
- Auto-Advance Timer: Can enable both Spotlight AND auto-advance for fully hands-off experience
- Keyboard Shortcuts: All navigation is keyboard-accessible

---

## Variants

### Variant: Spotlight + Auto-Advance Combined

1. User enables Spotlight mode (steps 1-3)
2. User opens Auto-Advance Timer settings
3. User sets WPM (words per minute) to 250
4. User clicks "Start Auto-Advance"
5. System automatically advances sentence-by-sentence at timed intervals
6. Spotlight follows each sentence without user input
7. User can manually pause/resume with Space key

---

← [Back to Use Cases Index](README.md)
