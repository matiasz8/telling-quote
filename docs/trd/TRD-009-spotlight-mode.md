# TRD-009: Spotlight Mode Technical Reference

**Related PRD:** [PRD-009: Spotlight Reading Mode](../prd/PRD-009-spotlight-mode.md)  
**Status:** ✔️ Completed  
**Created:** January 31, 2026  
**Last Updated:** February 2, 2026

---

## Overview

This Technical Reference Document provides implementation details for the Spotlight Reading Mode (theater effect) feature. It covers CSS architecture, component integration, theme variables, and troubleshooting.

---

## Architecture

### Component Hierarchy

```
app/reader/[id]/page.tsx
├── Container div (.spotlight-mode)
│   └── ::before pseudo-element (radial gradient overlay)
└── Content div (.spotlight-content)
    ├── Title (h2)
    ├── Subtitle (h3)
    ├── Paragraph (p) - with glow
    ├── Lists (ul/ol) - with glow
    ├── Code blocks (CodeBlock component)
    └── Tables/Images/etc.
```

### CSS Layer Stack (Z-Index)

```
z-index: 10  → .spotlight-content (current reading)
z-index: 5   → .spotlight-mode::before (overlay)
z-index: 1   → .progress-bar, .header
z-index: 0   → Background, historical content
```

---

## Implementation Files

### Primary Files

| File | Purpose | Lines Changed |
|------|---------|---------------|
| `app/globals.css` | CSS variables + spotlight styles | ~400 lines |
| `app/reader/[id]/page.tsx` | Component integration | ~50 lines |
| `lib/constants/settings.ts` | Default settings | ~5 lines |
| `components/SettingsModal.tsx` | UI toggle | ~20 lines |

### CSS Architecture

**File:** `app/globals.css`

#### CSS Variables (Per Theme)

```css
/* Light Theme */
html.light-theme {
  /* Overlay colors */
  --spotlight-overlay-center: rgba(255, 255, 255, 0.05);
  --spotlight-overlay-mid: rgba(255, 255, 255, 0.3);
  --spotlight-overlay-edge: rgba(255, 255, 255, 0.95);
  
  /* Content colors */
  --spotlight-text-color: #1f2937;
  --spotlight-glow-color: 250, 204, 21; /* RGB values */
  --spotlight-list-color: #1f2937;
  --spotlight-inline-code-opacity: 0.8;
}

/* Dark Theme */
html.dark-theme {
  --spotlight-overlay-center: rgba(0, 0, 0, 0.8);
  --spotlight-overlay-mid: rgba(0, 0, 0, 0.94);
  --spotlight-overlay-edge: rgba(0, 0, 0, 0.99);
  --spotlight-text-color: #e9d5ff;
  --spotlight-glow-color: 168, 85, 247;
  --spotlight-list-color: #e9d5ff;
  --spotlight-inline-code-opacity: 1;
}

/* Detox Theme */
html.detox-theme {
  --spotlight-overlay-center: rgba(255, 255, 255, 0.05);
  --spotlight-overlay-mid: rgba(255, 255, 255, 0.3);
  --spotlight-overlay-edge: rgba(255, 255, 255, 0.95);
  --spotlight-text-color: #1f2937;
  --spotlight-glow-color: 250, 204, 21;
  --spotlight-list-color: #1f2937;
  --spotlight-inline-code-opacity: 0.8;
}

/* High-Contrast Theme */
html.high-contrast-theme {
  --spotlight-overlay-center: rgba(0, 0, 0, 0.8);
  --spotlight-overlay-mid: rgba(0, 0, 0, 0.94);
  --spotlight-overlay-edge: rgba(0, 0, 0, 0.99);
  --spotlight-text-color: #ffffff;
  --spotlight-glow-color: 255, 255, 255;
  --spotlight-list-color: #ffffff;
  --spotlight-inline-code-opacity: 1;
}
```

#### Spotlight Overlay

```css
/* Radial gradient overlay */
.spotlight-mode::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(
    ellipse 600px 400px at center,
    var(--spotlight-overlay-center) 0%,
    var(--spotlight-overlay-mid) 30%,
    var(--spotlight-overlay-mid) 60%,
    var(--spotlight-overlay-edge) 100%
  );
  backdrop-filter: blur(2px);
  pointer-events: none;
  z-index: 5;
  transition: opacity 0.3s ease;
}

/* Content container */
.spotlight-content {
  position: relative;
  z-index: 10;
}
```

#### Content Glow Effects

```css
/* Paragraphs */
.spotlight-content p {
  color: var(--spotlight-text-color);
  filter: brightness(1.2);
  text-shadow: 0 0 20px rgba(var(--spotlight-glow-color), 0.6);
  transition: all 0.3s ease;
}

/* Titles */
.spotlight-content h1,
.spotlight-content h2,
.spotlight-content h3 {
  color: var(--spotlight-text-color);
  filter: brightness(1.3);
  text-shadow: 0 0 25px rgba(var(--spotlight-glow-color), 0.7);
}

/* Lists */
.spotlight-content ul,
.spotlight-content ol {
  color: var(--spotlight-list-color);
  filter: brightness(1.15);
}

.spotlight-content li {
  text-shadow: 0 0 15px rgba(var(--spotlight-glow-color), 0.5);
}

/* Inline code */
.spotlight-content code:not(pre code) {
  opacity: var(--spotlight-inline-code-opacity);
  filter: brightness(1.1);
}
```

#### Special Elements

```css
/* Hide action buttons during reading */
.spotlight-content .spotlight-actions {
  display: none !important;
}

/* Show buttons when finished */
.spotlight-content .spotlight-actions.spotlight-finished {
  display: flex !important;
  opacity: 0.8;
}

/* Dim historical/previous content */
.spotlight-content .text-gray-400,
.spotlight-content .text-gray-500 {
  filter: none !important;
  text-shadow: none !important;
  opacity: 0.3 !important;
}

/* Hide bullet history */
.spotlight-content .spotlight-history {
  display: none !important;
}
```

#### Accessibility: Reduce Motion

```css
/* Disable for users who prefer reduced motion */
@media (prefers-reduced-motion: reduce) {
  .spotlight-mode::before {
    display: none !important;
  }
  
  .spotlight-content {
    filter: none !important;
    transition: none !important;
  }
}

/* Also check settings flag */
html.reduce-motion .spotlight-mode::before {
  display: none !important;
}

html.reduce-motion .spotlight-content {
  filter: none !important;
  transition: none !important;
}
```

---

## Component Integration

### Reader Page Component

**File:** `app/reader/[id]/page.tsx`

```typescript
export default function ReaderPage() {
  const { settings } = useSettings();
  const readingTransition = settings.readingTransition || 'none';
  
  return (
    <>
      {/* Main content container */}
      <div 
        id="reader-main-content" 
        className={`container mx-auto px-4 py-12 ${
          readingTransition === 'spotlight' && !settings.accessibility?.reduceMotion
            ? 'spotlight-mode'
            : ''
        }`}
      >
        {/* Content wrapper */}
        <div 
          key={currentIndex}
          className={`mx-auto ${
            readingTransition === 'spotlight' && !settings.accessibility?.reduceMotion
              ? 'spotlight-content'
              : ''
          }`}
          style={{ maxWidth: contentWidthStyle }}
        >
          {/* Title */}
          <div className="mb-8 text-center spotlight-header">
            <h2 className={`${fontSizeClasses.title} font-semibold`}>
              {formatText(currentSentence.title, isDark)}
            </h2>
            {currentSentence.subtitle && (
              <h3 className={`${fontSizeClasses.subtitle} font-medium`}>
                {formatText(currentSentence.subtitle, isDark)}
              </h3>
            )}
          </div>
          
          {/* Current content */}
          <p className="text-center reading-line-focused">
            {formatText(currentSentence.sentence, isDark)}
          </p>
          
          {/* Actions (hidden during spotlight, shown on finish) */}
          <div className={`flex items-center justify-center gap-4 mt-6 spotlight-actions ${
            isFinished ? 'spotlight-finished' : ''
          }`}>
            {/* Navigation buttons */}
          </div>
        </div>
      </div>
    </>
  );
}
```

### Settings Integration

**File:** `components/SettingsModal.tsx`

```typescript
<div className="space-y-2">
  <label className="block text-sm font-medium">
    Reading Transition
  </label>
  <select
    value={localSettings.readingTransition || 'none'}
    onChange={(e) => handleChange('readingTransition', e.target.value)}
    className="w-full px-3 py-2 rounded-lg"
  >
    <option value="none">None</option>
    <option value="fade-theme">Fade to Theme Color</option>
    <option value="swipe">Swipe</option>
    <option value="spotlight">Spotlight (Theater Effect)</option>
    <option value="line-focus">Line Focus (Blur Surroundings)</option>
  </select>
</div>
```

**File:** `lib/constants/settings.ts`

```typescript
export const DEFAULT_SETTINGS: Settings = {
  theme: 'light',
  readingTransition: 'spotlight', // Default transition
  accessibility: {
    reduceMotion: false,
    focusMode: false,
    // ...
  },
  // ...
};
```

---

## Performance Optimization

### GPU Acceleration

All effects use GPU-accelerated properties:
- `transform` (for positioning)
- `opacity` (for fading)
- `filter` (for brightness/blur)
- `backdrop-filter` (for overlay blur)

### Avoiding Repaints

- Use `position: fixed` for overlay (no reflow on scroll)
- Use `::before` pseudo-element (no extra DOM nodes)
- CSS variables for theme switching (no recalculation)
- Avoid JavaScript calculations per frame

### Memory Usage

- Single overlay element (::before pseudo)
- No canvas/SVG (just CSS gradients)
- Minimal memory footprint (~1MB)

---

## Theme Color Reference

### RGB Values for Glow

```typescript
// For text-shadow: rgba(var(--spotlight-glow-color), alpha)

Light/Detox Theme:
  Yellow: 250, 204, 21
  
Dark Theme:
  Purple: 168, 85, 247
  
High-Contrast Theme:
  White: 255, 255, 255
```

### Overlay Opacity Ranges

```
Light/Detox:
  Center: 0.05 (95% transparent)
  Mid: 0.3 (70% transparent)
  Edge: 0.95 (5% transparent)

Dark/High-Contrast:
  Center: 0.8 (20% transparent)
  Mid: 0.94 (6% transparent)
  Edge: 0.99 (1% transparent)
```

---

## Testing

### Manual Testing Checklist

**Visual:**
- [ ] Overlay appears smoothly
- [ ] Glow matches theme color
- [ ] Gradient has no banding
- [ ] Historical content dimmed
- [ ] Buttons hidden during reading
- [ ] Buttons appear on finish

**Interaction:**
- [ ] Keyboard navigation works
- [ ] Click navigation works
- [ ] Settings toggle instant
- [ ] Preference persists
- [ ] Exits cleanly

**Accessibility:**
- [ ] Reduce motion disables effect
- [ ] High-contrast maintains 21:1
- [ ] Screen readers work
- [ ] Focus indicators visible

**Performance:**
- [ ] 60fps animations
- [ ] No jank on scroll
- [ ] Low CPU usage
- [ ] Works on mobile

### Browser Testing

```bash
# Desktop
Chrome 90+ ✅
Firefox 88+ ✅
Safari 14+ ✅
Edge 90+ ✅

# Mobile
iOS Safari 14+ ✅
Chrome Android 90+ ✅
Samsung Internet 14+ ✅
```

### Performance Benchmarks

```
Target Metrics:
- FPS: 60fps constant
- CPU: <5% during transition
- Memory: <1MB overhead
- Paint time: <16ms per frame
```

---

## Troubleshooting

### Issue 1: Glow Not Visible

**Symptoms:** Text shadow doesn't show  
**Causes:**
- CSS variable not defined
- Wrong color format (needs RGB not hex)
- Filter conflicts

**Solution:**
```css
/* Check CSS variable */
--spotlight-glow-color: 250, 204, 21; /* RGB, not #FAC415 */

/* Verify text-shadow syntax */
text-shadow: 0 0 20px rgba(var(--spotlight-glow-color), 0.6);
```

### Issue 2: Overlay Too Dark/Light

**Symptoms:** Can't see content or overlay not visible  
**Causes:**
- Wrong opacity values
- Theme variable not applied

**Solution:**
```css
/* Adjust opacity in theme variables */
--spotlight-overlay-center: rgba(0, 0, 0, 0.8); /* Increase 0.8 to 0.9 */
```

### Issue 3: Performance Issues

**Symptoms:** Janky animations, low FPS  
**Causes:**
- Too many elements
- Non-GPU accelerated properties
- JavaScript running per frame

**Solution:**
- Use `transform` instead of `left/top`
- Use `opacity` instead of `visibility`
- Remove any JavaScript animation loops

### Issue 4: Backdrop Filter Not Working

**Symptoms:** No blur effect on overlay  
**Causes:**
- Browser doesn't support `backdrop-filter`
- GPU acceleration disabled

**Solution:**
```css
/* Feature detection */
@supports (backdrop-filter: blur(2px)) {
  .spotlight-mode::before {
    backdrop-filter: blur(2px);
  }
}

/* Fallback: add regular filter to content */
@supports not (backdrop-filter: blur(2px)) {
  .spotlight-content {
    filter: blur(0px); /* No blur, just glow */
  }
}
```

### Issue 5: Buttons Not Hiding

**Symptoms:** Navigation buttons visible during reading  
**Causes:**
- CSS specificity issue
- Class not applied

**Solution:**
```css
/* Increase specificity */
.spotlight-content .spotlight-actions {
  display: none !important;
}

/* Check class is applied */
<div className={`spotlight-actions ${isFinished ? 'spotlight-finished' : ''}`}>
```

---

## Debugging Tools

### Chrome DevTools

```javascript
// Check if spotlight mode is active
document.querySelector('.spotlight-mode') !== null

// Check CSS variables
getComputedStyle(document.documentElement).getPropertyValue('--spotlight-glow-color')

// Monitor FPS
// Performance > Rendering > FPS Meter
```

### Console Commands

```javascript
// Toggle spotlight mode manually
const container = document.querySelector('#reader-main-content');
container.classList.toggle('spotlight-mode');

// Check reduce motion setting
window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Force theme
document.documentElement.className = 'dark-theme';
```

---

## Browser Support Matrix

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| Radial Gradient | ✅ 90+ | ✅ 88+ | ✅ 14+ | ✅ 90+ |
| Backdrop Filter | ✅ 76+ | ✅ 103+ | ✅ 9+ | ✅ 79+ |
| CSS Variables | ✅ 49+ | ✅ 31+ | ✅ 9.1+ | ✅ 15+ |
| ::before Pseudo | ✅ All | ✅ All | ✅ All | ✅ All |
| Text Shadow | ✅ All | ✅ All | ✅ All | ✅ All |

---

## Future Enhancements

### Planned Features
- [ ] Custom spotlight size (user adjustable)
- [ ] Spotlight follows scroll position
- [ ] Multiple spotlight zones
- [ ] Animated glow pulse effect
- [ ] Color picker for glow
- [ ] Spotlight intensity slider

### Technical Debt
- [ ] Optimize gradient performance further
- [ ] Add more granular theme controls
- [ ] Create reusable spotlight component
- [ ] Add unit tests for CSS classes

---

## Related Files

**CSS:**
- `app/globals.css` - Main styles (lines 504-920)

**Components:**
- `app/reader/[id]/page.tsx` - Reader integration (lines 677-920)
- `components/SettingsModal.tsx` - Settings UI (lines 120-150)

**Config:**
- `lib/constants/settings.ts` - Default settings (line 8)

**Types:**
- `types/index.ts` - Settings type (line 45)

---

**Document Version:** 1.0  
**Last Updated:** February 2, 2026  
**Maintained By:** Development Team
