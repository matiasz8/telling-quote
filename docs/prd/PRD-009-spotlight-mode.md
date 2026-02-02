# PRD-009: Spotlight Mode for Reading Transitions

**Status:** Implemented  
**Priority:** P1  
**Target Release:** v0.2.0  
**Created:** 2026-01-31  
**Related Issues:** #5  
**Related PRDs:** PRD-002 (Tags), PRD-003 (Detox), PRD-004 (Accessibility)

## Problem Statement

Users need different reading experiences to match their focus level and environment. A "theatre mode" effect can help readers concentrate by dimming everything except the current line, creating a spotlight effect similar to physical speed reading tools.

## Goals

1. **Primary:** Implement spotlight reading mode that works flawlessly across all 4 themes
2. **Secondary:** Establish visual testing infrastructure to prevent theme regressions
3. **Tertiary:** Document theme-specific visual rules for future maintenance

## Non-Goals

- Implementing new themes
- Customizable spotlight colors (use theme defaults)
- Mobile-specific spotlight adjustments (desktop-first)

## Success Metrics

- ✅ All 4 themes render spotlight correctly (verified via Playwright visual tests)
- ✅ Zero visual regressions in spotlight mode
- ✅ High-contrast theme maintains WCAG 2.1 AA compliance
- ✅ Detox theme remains strictly monochrome

## User Stories

### Story 1: Focused Reading
**As a** user who gets distracted easily  
**I want** a "theatre mode" that highlights only the current sentence  
**So that** I can maintain focus on one line at a time

**Acceptance Criteria:**
- [ ] Spotlight mode available in settings
- [ ] Current element has strong glow/shadow effect
- [ ] Surrounding content is dimmed with overlay
- [ ] Navigation (arrows/swipe) moves spotlight smoothly

### Story 2: Theme Consistency
**As a** user who switches between themes  
**I want** spotlight mode to look appropriate in each theme  
**So that** the experience feels cohesive

**Acceptance Criteria:**
- [ ] Light theme: warm yellow glow on dark text
- [ ] Dark theme: purple mystique glow on light text
- [ ] Detox theme: minimal yellow glow, strictly monochrome
- [ ] High-contrast theme: white glow, pure black/white only

### Story 3: Accessibility Compliance
**As a** user with visual impairments  
**I want** high-contrast spotlight to have zero colors  
**So that** I can read comfortably with maximum contrast

**Acceptance Criteria:**
- [ ] NO colored elements in high-contrast spotlight
- [ ] Tables maintain proper contrast (white headers, black body)
- [ ] Blockquotes visible with white borders
- [ ] Inline code readable (black on white)

## Detailed Requirements

### Theme-Specific Visual Rules

#### 1. Light Theme
**Philosophy:** Natural reading with warm glow

| Element | Specification |
|---------|---------------|
| Overlay | White → semi-transparent → opaque gradient |
| Text color | Dark gray `#1f2937` |
| Glow color | Yellow `250, 204, 21` |
| Glow intensity | 40px drop-shadow, 0.6 opacity |
| Inline code | 0.8 opacity |
| Header | 25% opacity, no glow |
| Buttons | Hidden until finished |

**Constraints:**
- ❌ NO purple colors (reserved for dark)
- ❌ NO pure black backgrounds

#### 2. Dark Theme
**Philosophy:** Cinematic experience with purple mystique

| Element | Specification |
|---------|---------------|
| Overlay | Black → semi-transparent → opaque gradient |
| Text color | Light purple `#e9d5ff` |
| Glow color | Purple `196, 150, 255` |
| Glow intensity | 40px drop-shadow, 0.6 opacity |
| Inline code | 0.7 opacity (dimmer) |
| Header | 25% opacity, no glow |
| Buttons | Gray `#4b5563`, hidden until finished |

**Constraints:**
- ❌ NO yellow/warm colors
- ❌ NO light backgrounds

#### 3. Detox Theme
**Philosophy:** Maximum simplicity, minimal distraction

| Element | Specification |
|---------|---------------|
| Overlay | White (same as light) |
| Text color | Very dark gray `#111827` |
| Glow color | Yellow `250, 204, 21` |
| Glow intensity | Moderate (same as light) |
| Inline code | 0.8 opacity |
| Header | **White/black ONLY, NO purple gradient** |
| Buttons | Light gray `#e5e7eb`, hidden until finished |

**Critical Constraints:**
- ❌ NO colors except black/white/gray + yellow glow
- ❌ NO purple gradients in header
- ❌ NO colored tag backgrounds
- ❌ NO colored borders

**Detox-Specific Checklist:**
- [ ] Header has NO purple gradient ← Critical bug fixed
- [ ] Tags are grayscale
- [ ] No colored borders anywhere
- [ ] Buttons are gray
- [ ] Example badge is gray

#### 4. High-Contrast Theme
**Philosophy:** Maximum accessibility, zero colors

| Element | Specification |
|---------|---------------|
| Overlay | Black opaque gradient |
| Text color | Pure white `#ffffff` |
| Glow color | White `255, 255, 255` |
| Glow intensity | Maximum 40px, 0.6 opacity |
| Inline code | 1.0 opacity (full brightness) |
| Header | 25% opacity, no glow |
| Buttons | Hidden until finished |

**Strict Constraints:**
- ❌ NO colors whatsoever (no yellow, purple, green, blue, red)
- ❌ NO gradients with colors
- ❌ NO gray shades (only pure black/white)

**High-Contrast Specific Rules:**
- ✅ Inline code: Black text on white background
- ✅ Blockquotes: White text on black, white border (NO green)
- ✅ Tables: White headers + black text, black body + white text
- ✅ Highlighted text: White on black (NO yellow background)
- ✅ All borders: White only
- ✅ Checkboxes: White borders, white labels

**Known Limitations:**
- ⚠️ Color emojis (⭐ 🎯) retain native colors (browser limitation)
- Alternative: Use text symbols (★ • ○ ●)

**High-Contrast Checklist (10+ bugs fixed):**
- [ ] NO colored tag backgrounds
- [ ] NO yellow highlights on text
- [ ] NO green/yellow gradients on table headers ← Had Tailwind gradients
- [ ] NO gray text (must be white or black)
- [ ] Tables: headers white bg + black text
- [ ] Tables: body cells black bg + white text
- [ ] Blockquotes: black bg + white text + white border
- [ ] Inline code: white bg + black text
- [ ] Override all `bg-*`, `text-*`, `border-*` Tailwind utilities

## Technical Implementation

### CSS Architecture

**Centralized Variables (7 per theme):**
```css
--spotlight-overlay-center: rgba()
--spotlight-overlay-mid: rgba()
--spotlight-overlay-edge: rgba()
--spotlight-text-color: #hex
--spotlight-glow-color: R, G, B  /* RGB without alpha */
--spotlight-list-color: #hex
--spotlight-inline-code-opacity: 0-1
```

**Location:** `app/globals.css` lines 200-750

**Shared Rules (~150 lines):**
- `.spotlight-mode::before` - Radial gradient overlay
- `.spotlight-content p/h1-h4` - Text color + glow effects
- `.spotlight-content li` - List styling
- `.spotlight-content code` - Inline code opacity
- `.spotlight-header` - Dimmed header
- `.spotlight-actions` - Hidden buttons

**Theme Overrides:**
- Dark: ~20 lines (button colors)
- Detox: ~20 lines (header, buttons)
- High-contrast: ~120 lines (aggressive color removal)

### Visual Testing Strategy

**Playwright Tests:** 25 automated screenshots

| Test Type | Coverage |
|-----------|----------|
| Home page | 4 themes × 1 = 4 screenshots |
| Reader normal | 4 themes × 2 views = 8 screenshots |
| Spotlight | 4 themes × 4 states = 16 screenshots |
| High-contrast tables | 1 screenshot |

**Commands:**
```bash
npm run test:visual          # Compare with baselines
npm run test:visual:update   # Update baselines
npm run test:visual:report   # View HTML diff report
npm run test:visual:ui       # Interactive debugging
```

**Tolerance:**
- Spotlight tests: 500 pixels (~0.05% of 1280×720)
- Home page: 5000 pixels (full page, more variation)
- Reader tests: 500 pixels

### Integration Points

**Settings:**
- `readingTransition: 'spotlight'` in localStorage
- Applied via `useSettings` hook

**Reader Page:**
- `spotlight-mode` class on container
- Dynamic `--spotlight-focus-x/y` CSS variables
- Keyboard/swipe navigation updates focus position

**Reduce Motion:**
- Respects `prefers-reduced-motion`
- Disables spotlight with `display: none`

## Dependencies

- **Blocks:** None
- **Blocked by:** None
- **Requires:** 
  - PRD-003 (Detox Theme) - implemented
  - PRD-004 (Accessibility) - implemented
  - Playwright (@playwright/test) - added

## Risks & Mitigations

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Theme regression when adding new features | High | Medium | Playwright visual tests catch issues automatically |
| High-contrast colors bleeding through | High | Low | 120 lines of specific overrides, tested |
| Performance impact of complex gradients | Medium | Low | Use CSS variables, GPU-accelerated |
| Emoji colors in high-contrast | Low | Certain | Document limitation, suggest text alternatives |

## Open Questions

- [ ] Should spotlight be the default for new users?
- [ ] Add mobile-specific spotlight adjustments?
- [ ] Allow custom spotlight colors per theme?
- [ ] Add CI integration for visual tests?

## Changelog

- **2026-01-31:** Initial PRD created
- **2026-01-31:** Implemented and verified all 4 themes
- **2026-01-31:** Added Playwright visual testing (25 tests)
- **2026-01-31:** Fixed 10+ high-contrast theme issues
- **2026-01-31:** Centralized CSS with variables (~300 lines → 50 lines)
