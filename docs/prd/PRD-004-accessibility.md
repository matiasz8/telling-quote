# PRD-004: Accessibility Features

**Status**: 📝 Draft  
**Priority**: High  
**Owner**: TBD  
**Created**: November 20, 2025  
**Last Updated**: November 20, 2025

---

## Overview

Implement comprehensive accessibility features to make tellingQuote usable by people with various disabilities, including visual impairments, dyslexia, motor difficulties, and cognitive differences.

---

## Problem Statement

Current application has limited accessibility:

1. **No screen reader optimization**
2. **No dyslexia-friendly fonts**
3. **No adjustable line spacing/letter spacing**
4. **No high contrast mode**
5. **Limited keyboard navigation**
6. **No reduced motion option**
7. **No focus indicators** on some elements

This excludes users with disabilities from effectively using the app.

---

## Goals & Objectives

### Primary Goals
- Achieve WCAG 2.1 Level AA compliance
- Support common assistive technologies
- Provide dyslexia-friendly options
- Enable motor accessibility (keyboard-only use)

### Secondary Goals
- Support screen readers (NVDA, JAWS, VoiceOver)
- Provide customizable reading experience
- Respect OS accessibility preferences
- Build foundation for Level AAA compliance

### Success Metrics
- WCAG 2.1 AA automated test pass rate: 100%
- Screen reader testing: All core flows work
- User testing with accessibility community
- Lighthouse Accessibility score: 95+

---

## Target User Groups

1. **Blind/Low Vision Users**
   - Screen reader users
   - Screen magnification users
   - High contrast needs

2. **Dyslexic Users**
   - Need specialized fonts (OpenDyslexic, Comic Sans)
   - Need increased letter/line spacing
   - Need reduced line length

3. **Motor Impairment Users**
   - Keyboard-only navigation
   - Larger click targets
   - No time-sensitive actions

4. **Cognitive/Neurological Users**
   - ADHD (reduced distractions)
   - Autism (consistent patterns)
   - Seizure disorders (no flashing)

5. **Aging Users**
   - Larger fonts
   - Higher contrast
   - Simpler navigation

---

## Requirements

### Functional Requirements

#### FR-1: Dyslexia-Friendly Font Options

**Feature**: Add dyslexia-friendly fonts to font selector

**Fonts to Add**:
- **OpenDyslexic**: Specifically designed for dyslexia
- **Comic Sans MS**: Proven helpful for dyslexia
- **Atkinson Hyperlegible**: High legibility font

**Implementation**:
- Add to `FONT_FAMILY_OPTIONS`
- Import OpenDyslexic via @font-face
- Update font selector UI

**Settings Location**: Settings Modal → Font Family

#### FR-2: Advanced Text Spacing

**Feature**: Customizable letter spacing, line spacing, and word spacing

**Options**:

```
Letter Spacing:
  ○ Normal (default)
  ○ Wide (+0.05em)
  ○ Extra Wide (+0.1em)

Line Height:
  ○ Compact (1.4)
  ○ Normal (1.6) - default
  ○ Relaxed (1.8)
  ○ Loose (2.0)

Word Spacing:
  ○ Normal (default)
  ○ Wide (+0.1em)
```

**Storage**: Save in settings object
**UI**: Accordion section in Settings Modal

#### FR-3: High Contrast Mode

**Feature**: Ultra-high contrast theme for low vision

**Specifications**:
- Background: Pure black (#000000)
- Text: Pure white (#FFFFFF)
- Contrast ratio: 21:1
- No gradients, no shadows
- Bold text by default
- Thicker borders (2px)

**Activation**:
- Toggle in Settings: "High Contrast Mode"
- Respect OS preference: `prefers-contrast: high`

#### FR-4: Screen Reader Optimization

**ARIA Labels** - Add to all interactive elements:
```html
<!-- Buttons -->
<button aria-label="Create new reading">New Reading</button>
<button aria-label="Edit reading title">✏️</button>
<button aria-label="Delete reading">🗑️</button>

<!-- Navigation -->
<nav aria-label="Main navigation">...</nav>

<!-- Modals -->
<div role="dialog" aria-labelledby="modal-title" aria-modal="true">

<!-- Progress -->
<div role="progressbar" aria-valuenow="5" aria-valuemin="1" 
     aria-valuemax="20" aria-label="Slide 5 of 20">
```

**Live Regions** - Announce dynamic changes:
```html
<!-- When slide changes -->
<div aria-live="polite" aria-atomic="true">
  Slide 5 of 20: Introduction to React
</div>

<!-- When reading completes -->
<div aria-live="assertive">
  Reading completed! Returning to dashboard.
</div>
```

**Semantic HTML**:
- Use `<article>` for readings
- Use `<h1>`, `<h2>` properly
- Use `<nav>` for navigation
- Use `<main>` for main content

#### FR-5: Keyboard Navigation Enhancement

**Current**: Arrow keys work in reader

**Enhance with**:
- `Tab` / `Shift+Tab`: Focus navigation
- `Enter` / `Space`: Activate buttons
- `Esc`: Close modals
- `?`: Show keyboard shortcut help
- `/`: Focus search (when implemented)

**Visual Focus Indicators**:
- 2px solid outline
- High contrast color
- Visible on all focusable elements
- Skip link for screen readers

**Skip Links**:
```html
<a href="#main-content" class="skip-link">
  Skip to main content
</a>
```

#### FR-6: Reduced Motion

**Feature**: Respect `prefers-reduced-motion`

**Implementation**:
```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Affected Elements**:
- Disable confetti animation
- Disable theme transition animations
- Disable modal slide-ins
- Keep instant state changes

**Toggle**: "Reduce Motion" in Settings

#### FR-7: Color Blind Support

**Feature**: Ensure all information isn't color-only

**Current Issues**:
- Pending indicator (colored dot) - color-only

**Solution**:
- Add icon/pattern in addition to color
- Pending: 🟢 → ◉ (dot + ring)
- Completed: ✓ icon

**Testing**: Test with color blindness simulators
- Protanopia (red-blind)
- Deuteranopia (green-blind)
- Tritanopia (blue-blind)

#### FR-8: Adjustable Content Width

**Feature**: Limit line length for readability

**Options**:
```
Content Width:
  ○ Narrow (45ch) - optimal for dyslexia
  ○ Medium (65ch) - default
  ○ Wide (80ch)
  ○ Full Width (100%)
```

**Applies to**: Reader page only

#### FR-9: Focus Mode Enhancements

**Feature**: Dim everything except current slide

**Implementation**:
- Optional "Focus Mode" toggle
- Dims header, nav, buttons (opacity: 0.3)
- Brightens current slide
- Reduces distractions for ADHD/autism

---

### Non-Functional Requirements

#### NFR-1: WCAG 2.1 Compliance

**Level AA Requirements**:
- ✅ 1.4.3 Contrast (Minimum): 4.5:1 for text
- ✅ 2.1.1 Keyboard: All functionality keyboard-accessible
- ✅ 2.4.7 Focus Visible: Clear focus indicators
- ✅ 4.1.2 Name, Role, Value: All UI components identified

**Testing Tools**:
- axe DevTools
- WAVE
- Lighthouse Accessibility
- Manual screen reader testing

#### NFR-2: Performance

**Image Descriptions**:
- Auto-generate alt text using image filename
- Allow user to edit alt text
- Never leave alt="" unless decorative

#### NFR-3: Documentation

**Accessibility Statement Page**:
- Document all accessibility features
- Provide contact for accessibility issues
- List keyboard shortcuts
- Link to WCAG 2.1 compliance report

---

## Settings UI Design

### Accessibility Settings Section

```
┌────────────────────────────────────────┐
│  ⚙️ Settings                           │
├────────────────────────────────────────┤
│                                        │
│  📖 Reading                            │
│  ├─ Font Family: [Serif ▼]            │
│  ├─ Font Size: [Medium ▼]             │
│  └─ Content Width: [Medium ▼]         │
│                                        │
│  🎨 Appearance                         │
│  ├─ Theme: [Light|Dark|Detox]         │
│  └─ High Contrast: [   ] OFF          │
│                                        │
│  ♿ Accessibility                      │
│  ├─ Letter Spacing: [Normal ▼]        │
│  ├─ Line Height: [Normal ▼]           │
│  ├─ Word Spacing: [Normal ▼]          │
│  ├─ Reduce Motion: [✓] ON             │
│  └─ Focus Mode: [   ] OFF             │
│                                        │
│  ⌨️ Keyboard Shortcuts: [View All]     │
│                                        │
│         [Reset to Defaults]            │
└────────────────────────────────────────┘
```

---

## Out of Scope (v1)

- ❌ Custom color schemes
- ❌ Text-to-speech (browser TTS exists)
- ❌ Braille display support
- ❌ Sign language videos
- ❌ Multi-language UI
- ❌ Cognitive mode (simplified UI)

---

## Future Enhancements (v2+)

### Phase 2:
- AI-generated image descriptions
- Reading progress persistence per slide
- Bookmarks/annotations
- Text-to-speech integration

### Phase 3:
- Customizable color palettes
- Multiple reading modes (speed reading, etc.)
- Integration with accessibility tools

---

## Open Questions

1. **Should we include Bionic Reading mode?**
   - Bold first part of each word
   - Proposal: Phase 2

2. **Should we add reading ruler/guide?**
   - Horizontal line following text
   - Proposal: Yes, as optional feature

3. **Should we support voice commands?**
   - "Next slide", "Go home"
   - Proposal: Phase 3 (requires Web Speech API)

---

## Testing Plan

### Automated Testing
- Run axe DevTools on all pages
- Run Lighthouse Accessibility audit
- Use WAVE browser extension

### Manual Testing
- **Screen Readers**:
  - NVDA (Windows)
  - JAWS (Windows)
  - VoiceOver (macOS/iOS)
  - TalkBack (Android)

- **Keyboard Only**:
  - Navigate entire app without mouse
  - Verify all features accessible

- **Color Blindness**:
  - Use color blind simulators
  - Verify no color-only information

### User Testing
- Recruit users with disabilities
- Test core user flows
- Gather qualitative feedback

---

## Success Criteria

### MVP
- ✅ WCAG 2.1 AA compliance
- ✅ Dyslexia-friendly fonts added
- ✅ Screen reader optimized
- ✅ Keyboard navigation complete
- ✅ High contrast mode
- ✅ Reduced motion support
- ✅ Lighthouse Accessibility 95+

### Future
- WCAG 2.1 AAA compliance
- User testimonials from accessibility community

---

## Dependencies

- Settings type update (new accessibility options)
- Font files (OpenDyslexic import)
- All components update (ARIA labels)
- CSS update (focus indicators, reduced motion)

---

## Risks & Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Incomplete screen reader support | High | Thorough testing with real users |
| Performance impact from settings | Low | Efficient CSS, no JS-heavy features |
| Complex settings UI | Medium | Good defaults, progressive disclosure |
| Font licensing (OpenDyslexic) | Low | Use open-source license (OFL) |

---

## Timeline Estimate

- **Audit & Planning**: 2 days
- **Development**: 5-7 days
- **Testing**: 3 days
- **Remediation**: 2 days
- **Total**: 12-14 days

---

## Related Documents

- [TRD-004: Accessibility Implementation](../trd/TRD-004-accessibility.md)
- [PRD-003: Detox Theme](./PRD-003-detox-theme.md) (related)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

## References

- [OpenDyslexic Font](https://opendyslexic.org/)
- [Atkinson Hyperlegible](https://brailleinstitute.org/freefont)
- [WCAG 2.1](https://www.w3.org/TR/WCAG21/)
- [axe DevTools](https://www.deque.com/axe/devtools/)
