# UC-005: Auto-Advance Timer - Practice Reading at Controlled Pace

**Related PRD/TRD**: [PRD-012](../prd/PRD-012-auto-advance-timer.md), [TRD-012](../trd/TRD-012-auto-advance-timer.md)

**Actors**: Speed readers, ADHD users, Language learners, Students

---

## Preconditions

- User is actively reading a passage
- User wants to practice reading at a specific pace (e.g., 200 WPM)
- User is not at end of reading

## Main Flow

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

## Postcondition

- Reading progresses at consistent pace
- User learns consistent reading rhythm
- Reading can be paused/resumed without resetting timer
- Settings are saved for future readings (if authenticated)

## Related Features

- Spotlight Mode: Can combine for focused, paced reading experience
- Accessibility Suite: Auto-advance helps users with motor disabilities who cannot click buttons

---

## Variants

### Variant: Resume Previous Settings

1. User opens reading that previously used Auto-Advance at 250 WPM
2. System remembers last used WPM setting (if authenticated)
3. User clicks Auto-Advance button
4. Modal pre-fills with "250" WPM from last session
5. User clicks "Start" to use same pace

---

← [Back to Use Cases Index](README.md)
