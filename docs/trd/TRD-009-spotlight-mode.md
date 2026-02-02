# TRD-009: Spotlight Mode Technical Reference

**Status:** Implemented  
**Related PRD:** PRD-009  
**Created:** 2026-01-31  
**Last Updated:** 2026-01-31

## Overview

Technical implementation details for spotlight reading mode across all themes. This document serves as a reference for maintaining theme consistency and debugging visual issues.

## Architecture

### CSS Variable System

Each theme defines 7 spotlight-specific CSS variables in `app/globals.css`:

**Variable Definitions:**
```css
/* Light Theme (:root) */
--spotlight-overlay-center: rgba(255, 255, 255, 0);
--spotlight-overlay-mid: rgba(255, 255, 255, 0.3);
--spotlight-overlay-edge: rgba(255, 255, 255, 0.95);
--spotlight-text-color: #1f2937;
--spotlight-glow-color: 250, 204, 21;  /* RGB without alpha for rgba() usage */
--spotlight-list-color: #1f2937;
--spotlight-inline-code-opacity: 0.8;

/* Dark Theme (html.dark-theme) */
--spotlight-overlay-center: rgba(0, 0, 0, 0);
--spotlight-overlay-mid: rgba(0, 0, 0, 0.5);
--spotlight-overlay-edge: rgba(0, 0, 0, 0.98);
--spotlight-text-color: #e9d5ff;
--spotlight-glow-color: 196, 150, 255;  /* Purple */
--spotlight-list-color: #e9d5ff;
--spotlight-inline-code-opacity: 0.7;

/* Detox Theme (html.detox-theme) */
--spotlight-overlay-center: rgba(255, 255, 255, 0);
--spotlight-overlay-mid: rgba(255, 255, 255, 0.3);
--spotlight-overlay-edge: rgba(255, 255, 255, 0.95);
--spotlight-text-color: #111827;
--spotlight-glow-color: 250, 204, 21;  /* Yellow, same as light */
--spotlight-list-color: #111827;
--spotlight-inline-code-opacity: 0.8;

/* High-Contrast Theme (html.high-contrast-theme) */
--spotlight-overlay-center: rgba(0, 0, 0, 0.3);
--spotlight-overlay-mid: rgba(0, 0, 0, 0.7);
--spotlight-overlay-edge: rgba(0, 0, 0, 1);
--spotlight-text-color: #ffffff;
--spotlight-glow-color: 255, 255, 255;  /* White */
--spotlight-list-color: #ffffff;
--spotlight-inline-code-opacity: 1;
```

### Centralized Rules

**Location:** `app/globals.css` lines ~510-630

#### Overlay Effect
```css
.spotlight-mode::before {
  background: radial-gradient(
    600px 400px at var(--spotlight-focus-x, 50%) var(--spotlight-focus-y, 20%),
    var(--spotlight-overlay-center),
    var(--spotlight-overlay-mid) 40%,
    var(--spotlight-overlay-edge) 100%
  );
}
```

#### Current Element Styling
```css
.spotlight-content p,
.spotlight-content h1,
.spotlight-content h2,
.spotlight-content h3,
.spotlight-content h4 {
  color: var(--spotlight-text-color) !important;
  filter: drop-shadow(0 0 40px rgba(var(--spotlight-glow-color), 0.6))
          drop-shadow(0 0 20px rgba(var(--spotlight-glow-color), 0.4))
          drop-shadow(0 0 10px rgba(var(--spotlight-glow-color), 0.2));
  text-shadow: 0 0 30px rgba(var(--spotlight-glow-color), 0.5),
               0 0 15px rgba(var(--spotlight-glow-color), 0.3),
               0 0 5px rgba(var(--spotlight-glow-color), 0.2);
}
```

#### List Items (Moderate Glow)
```css
.spotlight-content li {
  color: var(--spotlight-list-color) !important;
  filter: drop-shadow(0 0 30px rgba(var(--spotlight-glow-color), 0.4))
          drop-shadow(0 0 15px rgba(var(--spotlight-glow-color), 0.3))
          drop-shadow(0 0 8px rgba(var(--spotlight-glow-color), 0.2));
}

.spotlight-content li span {
  text-shadow: 0 0 20px rgba(var(--spotlight-glow-color), 0.4),
               0 0 10px rgba(var(--spotlight-glow-color), 0.2);
}
```

#### Inline Code
```css
.spotlight-content code {
  opacity: var(--spotlight-inline-code-opacity) !important;
}
```

#### Header & Buttons
```css
.spotlight-header {
  opacity: 0.25 !important;
  filter: none !important;
  text-shadow: none !important;
}

.spotlight-actions {
  display: none;
}

.spotlight-finished .spotlight-actions {
  display: flex;
}
```

### Theme-Specific Overrides

**Location:** `app/globals.css` lines ~630-750

#### Dark Theme (~20 lines)
```css
html.dark-theme .spotlight-mode .spotlight-actions button {
  background-color: #4b5563;
}

html.dark-theme .spotlight-mode .spotlight-actions svg {
  color: #9ca3af;
}
```

#### Detox Theme (~20 lines)
```css
html.detox-theme .spotlight-mode .spotlight-actions button {
  background-color: #e5e7eb;
}

html.detox-theme .spotlight-mode .spotlight-actions svg {
  color: #374151;
}
```

#### High-Contrast Theme (~120 lines)

**Inline Code:**
```css
html.high-contrast-theme .spotlight-content code {
  background: #ffffff !important;
  color: #000000 !important;
  border: 1px solid #ffffff !important;
}
```

**Tables:**
```css
/* Headers: white background, black text */
html.high-contrast-theme .spotlight-content table thead th,
html.high-contrast-theme .spotlight-content table thead {
  background: #ffffff !important;
  background-image: none !important;
  background-color: #ffffff !important;
  color: #000000 !important;
  border-color: #ffffff !important;
}

/* Override Tailwind gradient classes */
html.high-contrast-theme .spotlight-content table thead.bg-linear-to-r,
html.high-contrast-theme .spotlight-content table thead [class*="from-"],
html.high-contrast-theme .spotlight-content table thead [class*="to-"] {
  background: #ffffff !important;
  background-image: none !important;
}

/* Body cells: black background, white text */
html.high-contrast-theme .spotlight-content table tbody td {
  background: #000000 !important;
  color: #ffffff !important;
  border-color: #ffffff !important;
}
```

**Blockquotes:**
```css
html.high-contrast-theme .spotlight-content blockquote {
  background: #000000 !important;
  color: #ffffff !important;
  border-left-color: #ffffff !important;
}
```

**Highlighted Text:**
```css
html.high-contrast-theme .spotlight-content mark {
  background: #000000 !important;
  color: #ffffff !important;
  border: 2px solid #ffffff !important;
}
```

### Reduce Motion Support

**Location:** `app/globals.css` end of file

```css
@media (prefers-reduced-motion: reduce) {
  .spotlight-mode::before {
    display: none;
  }
}
```

Also respects manual `reduceMotion` setting from localStorage.

## Testing

### Visual Tests

**Files:**
- `tests/visual/spotlight.spec.ts` - Spotlight-specific tests
- `tests/visual/themes.spec.ts` - General theme tests
- `playwright.config.ts` - Test configuration

**Coverage:**
- 25 total tests
- 16 spotlight-specific screenshots (4 themes × 4 states)
- 8 reader page screenshots
- 4 home page screenshots

**Commands:**
```bash
npm run test:visual          # Run tests
npm run test:visual:update   # Update baselines
npm run test:visual:report   # View HTML report
npm run test:visual:ui       # Interactive mode
```

**Test Selectors:**
```typescript
// data-testid added to ReadingCard
await page.click('[data-testid="reading-card"]');
```

### Tolerance Levels

```typescript
// Spotlight tests: 500 pixels
maxDiffPixels: 500  // ~0.05% of 1280×720

// Home page: 5000 pixels (full page)
maxDiffPixels: 5000

// Reader tests: 500 pixels
maxDiffPixels: 500
```

## Debugging Guide

### Common Issues

#### 1. Theme Colors Bleeding Through

**Symptom:** Wrong color glow in a theme  
**Check:** CSS variable values in browser DevTools  
**Fix:** Verify `--spotlight-glow-color` in theme-specific selector

#### 2. High-Contrast Has Colors

**Symptom:** Colored elements visible in high-contrast  
**Root Causes:**
- Tailwind utility classes overriding custom CSS
- Missing `!important` on color overrides
- New element type not covered by overrides

**Fix Process:**
1. Inspect element in DevTools
2. Note classes applied (e.g., `bg-linear-to-r`, `from-yellow-400`)
3. Add specific override in high-contrast section
4. Use ultra-specific selector: `html.high-contrast-theme .spotlight-content table thead th`
5. Add `!important` to color properties
6. Run visual tests to verify

#### 3. Detox Theme Has Purple

**Symptom:** Purple gradient in header  
**Cause:** Header component using theme-based gradient  
**Fix:** Override in `components/Header.tsx` line ~42:
```tsx
className={`${isDetox ? 'text-gray-900' : ''}`}
```

#### 4. Visual Test Fails

**Symptom:** Playwright test shows pixel differences  
**Debugging:**
1. Run `npm run test:visual:report`
2. Open HTML report in browser
3. View side-by-side comparison
4. Check diff image for problem areas
5. If intentional change: `npm run test:visual:update`
6. If bug: Fix CSS and re-run tests

### DevTools Inspection

**Check CSS Variables:**
```javascript
// In browser console
getComputedStyle(document.documentElement).getPropertyValue('--spotlight-glow-color')
// Should return: "250, 204, 21" (light/detox) or "196, 150, 255" (dark)
```

**Check Applied Theme:**
```javascript
document.documentElement.className
// Should return: "light-theme" | "dark-theme" | "detox-theme" | "high-contrast-theme"
```

## Performance Considerations

### GPU Acceleration

- Radial gradients use GPU acceleration
- `will-change: opacity` on dimmed elements
- CSS variables are performant (no JavaScript calculations)

### Optimizations

- Single `:before` pseudo-element for overlay (not multiple divs)
- Centralized CSS (~50 lines) instead of duplicated (~300 lines)
- CSS custom properties cached by browser

## Known Limitations

### Color Emojis

**Issue:** Color emojis (⭐ 🎯 🎨) cannot be styled with CSS `color` property  
**Reason:** Browsers render them as images with fixed colors  
**Impact:** High-contrast theme shows colored emojis  
**Workaround:** Replace in content with text symbols (★ • ○ ●)

**Documentation Location:** `app/globals.css` line ~740
```css
/* NOTE: Color emojis (like ⭐) cannot be styled with CSS color property.
 * They will retain their native colors (yellow stars remain yellow).
 * This is a browser limitation - emojis are rendered as images.
 * For true high-contrast, consider using text symbols instead: ★ • ○ ●
 * or replacing colored emojis in markdown content for high-contrast theme. */
```

### Font Rendering Variations

**Issue:** Screenshots may differ by ~400-500 pixels between runs  
**Reason:** Font anti-aliasing, subpixel rendering differences  
**Impact:** Visual tests configured with `maxDiffPixels: 500` tolerance  
**Solution:** Normal behavior, tolerance handles it

## Maintenance Checklist

### When Adding New Markdown Element

- [ ] Add styling to centralized section (`app/globals.css` ~510-630)
- [ ] Use CSS variables for colors
- [ ] Test in all 4 themes
- [ ] Add high-contrast overrides if needed
- [ ] Run `npm run test:visual`
- [ ] Update baselines if intentional

### When Modifying Theme Colors

- [ ] Update CSS variable in theme-specific section
- [ ] Test spotlight mode in that theme
- [ ] Run visual tests
- [ ] Check for color bleeding in other themes
- [ ] Update baselines

### When Fixing High-Contrast Bug

- [ ] Identify problematic element/class in DevTools
- [ ] Add specific override with `!important`
- [ ] Use ultra-specific selector (3-4 levels)
- [ ] Override both `background` and `background-color`
- [ ] Test table headers and body cells separately
- [ ] Run visual tests to verify
- [ ] Document in PRD-009 checklist if new issue type

## File Locations

| File | Purpose | Lines |
|------|---------|-------|
| `app/globals.css` | All spotlight CSS | 200-750 |
| `app/reader/[id]/page.tsx` | Spotlight mode logic | ~800-920 |
| `components/Header.tsx` | Detox header fix | ~42 |
| `components/ReadingCard.tsx` | data-testid attribute | ~40 |
| `tests/visual/spotlight.spec.ts` | Spotlight visual tests | All |
| `tests/visual/themes.spec.ts` | Theme visual tests | All |
| `playwright.config.ts` | Test configuration | All |
| `docs/prd/PRD-009-spotlight-mode.md` | Product requirements | All |

## Related Documentation

- PRD-009: Product requirements and user stories
- PRD-003: Detox theme philosophy
- PRD-004: Accessibility requirements
- `tests/README.md`: Visual testing guide

