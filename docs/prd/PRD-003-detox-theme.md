# PRD-003: Detox Theme Mode

**Status**: 📝 Draft  
**Priority**: Medium  
**Owner**: TBD  
**Created**: November 20, 2025  
**Last Updated**: November 20, 2025

---

## Overview

Add a third theme option called "Detox" that uses minimal, monochromatic colors (white, grays, and black) to reduce visual stimulation and improve focus.

---

## Problem Statement

Current themes (Light and Dark) use vibrant gradients and colors:

- **Light**: Yellow → Lime → Emerald gradients
- **Dark**: Purple → Gray → Black gradients

While visually appealing, some users prefer:

1. **Minimal distraction** for deep reading/studying
2. **Reduced eye strain** from bright colors
3. **Digital wellbeing** practices (screen time reduction)
4. **Professional/minimal aesthetic**
5. **Better printing** (grayscale-friendly)

---

## Goals & Objectives

### Primary Goals

- Provide distraction-free reading experience
- Support digital wellbeing practices
- Offer professional/minimal aesthetic option

### Secondary Goals

- Maintain accessibility (WCAG 2.1 AA contrast ratios)
- Keep consistent UX across all three themes
- Support smooth theme transitions

### Success Metrics

- 15-25% of users try Detox mode
- 10-15% of users make it their default
- Positive feedback on focus/readability

---

## User Stories

**As a student studying**  
I want a distraction-free, monochrome theme  
So that I can focus deeply without visual stimulation

**As a professional**  
I want a clean, minimal interface  
So that my reading app looks professional

**As someone practicing digital wellness**  
I want to reduce colorful stimuli  
So that I can use screens more mindfully

**As a reader with sensory sensitivities**  
I want to avoid bright, saturated colors  
So that reading doesn't cause eye strain or headaches

---

## Requirements

### Functional Requirements

#### FR-1: Theme Option

- Add "Detox" to theme selector in SettingsModal
- Three radio options: Light | Dark | Detox
- Persist selection in localStorage

#### FR-2: Color Palette

**Detox Theme Colors**:

```bash
Background Hierarchy:
  - Page Background: #FFFFFF (white)
  - Card Background: #F9FAFB (gray-50)
  - Hover/Active: #F3F4F6 (gray-100)
  - Borders: #E5E7EB (gray-200)

Text Hierarchy:
  - Primary Text: #111827 (gray-900)
  - Secondary Text: #6B7280 (gray-500)
  - Tertiary Text: #9CA3AF (gray-400)

Accents (minimal, subtle):
  - Focus/Active: #374151 (gray-700)
  - Success: #10B981 (emerald-500) - sparingly
  - Error: #EF4444 (red-500) - sparingly
```

#### FR-3: Component Styling

**Dashboard**:

- White background (#FFFFFF)
- Gray cards (#F9FAFB)
- Gray borders instead of gradients
- Monochrome button (gray-800)

**Reader**:

- White background
- Black text on white (#111827 on #FFFFFF)
- Gray progress bar
- Minimal shadows

**Modals**:

- White background
- Gray borders
- Subtle shadows (grayscale only)

**Code Blocks**:

- Light gray background (#F3F4F6)
- Dark gray text (#1F2937)
- Minimal syntax highlighting (use gray tones)

#### FR-4: Special Elements

**Pending Indicator Dot**:

- Light theme: Lime (🟢)
- Dark theme: Purple (🟣)
- **Detox theme**: Dark gray (⚫) #374151

**Tags** (if implemented):

- All tags use gray tones
- Differentiate by border style (solid/dashed) instead of color

**Confetti** (completion):

- Use grayscale confetti or disable entirely
- Proposal: Keep but use white/gray particles

### Non-Functional Requirements

#### NFR-1: Accessibility

- WCAG 2.1 AA contrast ratios (minimum 4.5:1)
- Test with color blindness simulators
- Maintain keyboard navigation visibility

#### NFR-2: Performance

- No performance impact from theme switching
- CSS-only changes (no JS-heavy computations)

#### NFR-3: Consistency

- All UI elements styled consistently
- No color leaks from other themes

---

## Design Specification

### Color Constants

```typescript
// config/theme.ts
export const detoxTheme = {
  bg: {
    page: 'bg-white',
    card: 'bg-gray-50',
    hover: 'bg-gray-100',
  },
  text: {
    primary: 'text-gray-900',
    secondary: 'text-gray-500',
    tertiary: 'text-gray-400',
  },
  border: 'border-gray-200',
  accent: 'bg-gray-700',
  button: {
    primary: 'bg-gray-800 text-white hover:bg-gray-900',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
  },
  progressBar: {
    background: 'bg-gray-200',
    fill: 'bg-gray-800',
  },
  shadow: 'shadow-md shadow-gray-200',
}
```

### Theme Mapping Update

```typescript
export type Theme = 'light' | 'dark' | 'detox';

export const getThemeClasses = (theme: Theme) => {
  if (theme === 'detox') {
    return detoxTheme;
  }
  if (theme === 'dark') {
    return darkTheme;
  }
  return lightTheme;
}
```

---

## User Experience

### Theme Switching Flow

```bash
User opens Settings
    ↓
Sees three theme options:
  ○ Light (colorful)
  ○ Dark (purple gradient)
  ● Detox (monochrome)
    ↓
Selects Detox
    ↓
Instant theme application
    ↓
All colors fade to grayscale
    ↓
Clean, minimal interface
```

### Visual Comparison

```bash
BEFORE (Light Theme):
┌─────────────────────────────────┐
│  Yellow → Lime gradient bg      │  
│  🟢 Reading Title               │
│  Emerald button                 │
└─────────────────────────────────┘

AFTER (Detox Theme):
┌─────────────────────────────────┐
│  White/Gray bg                  │
│  ⚫ Reading Title                │
│  Gray button                    │
└─────────────────────────────────┘
```

---

## Out of Scope

- ❌ Customizable Detox colors
- ❌ Multiple Detox variants (high contrast, etc.)
- ❌ Auto-switch based on time of day
- ❌ Blue light filter
- ❌ Sepia tone option

---

## Open Questions

1. **Should Detox mode disable confetti?**
   - Proposal: Keep it but use grayscale particles

2. **How to handle images in Detox mode?**
   - Proposal: Keep images colored, don't apply grayscale filter

3. **Should code blocks have any color?**
   - Proposal: Minimal gray-tone syntax highlighting

4. **Should we add a "focus mode" with Detox?**
   - Proposal: Separate feature for future

---

## Success Criteria

### MVP

- ✅ Detox theme option in settings
- ✅ Complete monochrome color palette
- ✅ All components styled for Detox
- ✅ Smooth theme transitions
- ✅ WCAG AA contrast compliance

### Future Enhancements

- Detox theme variants (high contrast)
- Auto-switch to Detox during "focus hours"
- Detox + focus mode combo

---

## Accessibility Considerations

**Contrast Ratios (WCAG 2.1 AA):**

- Gray-900 on White: 19.0:1 ✅
- Gray-500 on White: 4.6:1 ✅
- Gray-700 on White: 10.5:1 ✅

**Focus Indicators:**

- Use gray-700 outline
- 2px solid border
- Visible on all interactive elements

---

## Dependencies

- Theme type update (`types/index.ts`)
- Theme configuration (`config/theme.ts`)
- SettingsModal component update
- All themed components update
- styleHelpers utility update

---

## Risks & Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Users find it too plain | Low | Position as "focus mode" option, not default |
| Accessibility issues | Medium | Thorough contrast testing before launch |
| Incomplete theme coverage | Medium | Comprehensive component audit |

---

## Timeline Estimate

- **Design**: 1 day
- **Development**: 2 days
- **Testing**: 1 day
- **Total**: 4 days

---

## Related Documents

- [TRD-003: Detox Theme Implementation](../trd/TRD-003-detox-theme.md)
- [PRD-004: Accessibility Features](./PRD-004-accessibility.md) (related)
