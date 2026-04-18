# UC-010: Theme System - Customize Visual Experience

**Related PRD/TRD**: Theme system integrated into Settings

**Actors**: All users

---

## Preconditions

- User is on dashboard or reading page
- User has accessed Settings modal

## Main Flow - Light vs. Dark Theme

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

## Postcondition

- User's preferred theme is active
- Theme persists across browser sessions
- All future readings display in selected theme
- If authenticated, theme syncs across devices

## Related Features

- Accessibility Suite: High-Contrast theme pairs with dyslexia/vision accessibility settings
- Firebase Auth: Theme preference syncs across devices when authenticated

---

## Variants

### Variant: Detox Theme - For Evening Reading (Blue Light Reduction)

1. User selects "Detox" theme
2. System applies warm, muted colors:
   - Amber/sepia background tones
   - Reduced blue light from screen
   - Lower contrast (easier on eyes at night)
3. User can read comfortably in evening without eye strain

### Variant: High Contrast - For Visually Impaired

1. User selects "High-Contrast" theme
2. System applies stark colors:
   - Pure black/pure white (or customizable high-contrast pair)
   - No gradients or subtle shading
   - All text edges crisp and visible
   - Focus indicators are bold and unmissable
3. Pairs well with large font size for maximum visibility

---

← [Back to Use Cases Index](README.md)
