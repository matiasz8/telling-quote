# 📖 TELLING QUOTE - Complete Design Brief

**Last Updated**: July 24, 2026  
**For**: Design AI Assistants  
**Version**: 1.0

---

## 🎯 Product Overview

**Telling Quote** is an interactive reading application that transforms markdown content into elegant slide-style presentations. It combines reading functionality with deep customization options, making it ideal for students, researchers, and anyone who needs to study or read complex content in an organized, visually appealing format.

### Core Value Proposition
- **Convert** markdown into navigable slides automatically
- **Customize** every visual aspect (fonts, sizes, colors, spacing)
- **Organize** readings with tabs and tags
- **Study** with keyboard shortcuts, text-to-speech, and auto-advance timers
- **Sync** across devices with optional cloud backup

---

## 📊 Application Architecture

### Main Screens

#### 1. **Dashboard (Home Page)**
- **Purpose**: Central hub for managing all readings
- **Location**: `/`
- **Key Features**:
  - Tab-based organization:
    - "Active" tab: Unfinished readings with progress indicators
    - "Completed" tab: Finished readings that can be revisited
  - Grid layout of reading cards
  - Visual indicators for reading status (colored dots: green/purple)
  - "New Reading" button to create readings
  - Header with settings and user menu

#### 2. **Reader/Viewer (Dynamic Page)**
- **Purpose**: Slide-style reading experience
- **Location**: `/reader/[id]`
- **Key Features**:
  - Full-page slide display of parsed markdown
  - Navigation controls (keyboard shortcuts, buttons)
  - Real-time synchronization with dashboard
  - Settings accessible within reader
  - Auto-advance timer option
  - Text-to-speech playback
  - Sentence highlighting during TTS

---

## 🎨 Design System

### Theme System (3 Themes)

#### 1. **Light Theme** (Default)
- **Background**: White to soft cream gradient
- **Accent**: Amber/yellow gradient
- **Text**: Dark gray/black
- **Gradient Header**: Yellow-to-lime gradient
- **Code Blocks**: Orange background (#FED7AA) with orange text
- **Use Case**: Daytime reading, bright environments

#### 2. **Dark Theme**
- **Background**: Dark gray/charcoal gradient
- **Accent**: Purple gradient
- **Text**: Light gray/white
- **Gradient Header**: Purple-to-pink gradient
- **Code Blocks**: Dark background with green text
- **Use Case**: Night reading, OLED screens

#### 3. **Detox Theme** (Minimalist)
- **Background**: Plain white or very light gray
- **Accent**: Monochrome grayscale
- **Text**: Black or dark gray
- **Gradient Header**: None (flat color)
- **Code Blocks**: Simple black text on light gray
- **Use Case**: Reduced eye strain, distraction minimization

### Font Options

| Font Family | Use Case | Characteristics |
|-------------|----------|---|
| **Serif** | Default, classic | Times New Roman-like, traditional |
| **Sans-serif** | Modern, clean | Helvetica-like, contemporary |
| **Monospace** | Code-focused | Courier-like, technical |
| **System** | OS-native | Uses device default font |

### Text Sizes

| Size | Usage | Scale |
|------|-------|-------|
| **Small** | Dense content | ~14px base |
| **Medium** | Default | ~16px base |
| **Large** | Comfortable reading | ~18px base |
| **Extra Large** | Vision-impaired | ~20px+ base |

### Accessibility Options

- **Line Height**: Normal, Relaxed, Spaced
- **Letter Spacing**: Normal, Wide, Extra-wide
- **Word Spacing**: Normal, Wide, Extra-wide
- **High Contrast Mode**: Increased contrast for low-vision users
- **Reduce Motion**: Disables animations for sensitive users
- **Focus Mode**: Highlights current line/sentence during reading
- **Reading Transition**: Multiple animation styles (fade, slide, instant)

---

## 📝 Content & Markdown Processing

### Supported Markdown Elements

#### Text Formatting
- **Bold**: `**text**` - Strong emphasis
- **Italic**: `*text*` or `_text_` - Subtle emphasis
- **Strikethrough**: `~~text~~` - Deleted or obsolete content
- **Inline Code**: `` `code` `` - Single-line code snippets
- **Links**: `[text](url)` - Clickable hyperlinks with hover effects

#### Structural Elements
- **Headings**: `## Subtitle` - Creates new slides/sections
- **Bullet Lists**: `- Item` or `* Item` - Unordered lists with parent context
- **Numbered Lists**: `1. Item` - Ordered lists with hierarchy
- **Blockquotes**: `> quote` - Highlighted citations and important text

#### Code & Technical Content
- **Code Blocks**: 
  ```markdown
  ```javascript
  console.log('Hello');
  ```
  ```
  - Language detection for syntax highlighting
  - Copy button in UI
  - Professional styling

#### Advanced Content (Phase 2-4)

**Math Equations** (Phase 4)
- Inline math: `$E = mc^2$`
- Block math: `$$\int_{a}^{b} f(x)dx$$`
- Rendered with KaTeX for professional typography
- Full LaTeX notation support

**Footnotes** (Phase 4)
- Reference notation: `Text[^1]`
- Definition: `[^1]: Footnote text`
- Superscript links with numbered references
- Multiple footnotes per slide

**Tables** (Phase 3)
```markdown
| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |
```
- Gradient headers (theme-aware)
- Hover effects on rows
- Responsive with horizontal scroll on mobile
- Inline markdown in cells (bold, italic, code)

**Task Lists** (Phase 3)
```markdown
- [ ] Pending task
- [x] Completed task
```
- Interactive checkboxes
- Line-through for completed items
- Theme-aware colors

**Images** (Phase 2)
- Syntax: `![alt text](image-url)`
- Centered display
- Optimized sizing
- Responsive

**Highlighting** (Phase 2)
- Syntax: `==highlighted text==`
- Theme-aware background color
- For emphasis and important content

### Slide Generation Algorithm

1. **Parse Markdown**: Extract heading level 2+ (`##`) as slide breaks
2. **Group Content**: Content between headings becomes slide body
3. **Process Formatting**: Apply inline markdown (bold, italic, code, links)
4. **Render Components**: Code blocks, tables, math, footnotes as special components
5. **Apply Theme**: Color and style based on current theme/accessibility settings
6. **Store in State**: Array of processed slides for navigation

---

## ⌨️ Navigation & Controls

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `→` or `Space` | Next slide |
| `←` or `Shift+Space` | Previous slide |
| `Home` | First slide |
| `End` | Last slide |
| `Alt+P` | Play/Pause text-to-speech |
| `Alt+S` | Stop text-to-speech |
| `Alt+→` | Next TTS sentence |
| `Alt+←` | Previous TTS sentence |

### Mouse/Touch Controls

- **Buttons**: Next/Previous/Stop navigation
- **Swipe**: Left/right swipe on mobile for navigation
- **Click**: Settings button to open customization modal

---

## 🎛️ Feature Modules

### 1. **Settings Modal**
- Accessible via ⚙️ icon
- Tabbed interface:
  - **Display**: Font, size, theme
  - **Accessibility**: Line height, letter spacing, high contrast, etc.
  - **Text-to-Speech**: Voice selection, speech rate
  - **Reading**: Auto-advance options, auto-start settings
- Changes apply instantly across all slides
- Settings persisted in localStorage

### 2. **Text-to-Speech (TTS)**
- **Web Speech API** powered
- **Voice Selection**: 
  - Auto-detects available system voices
  - Prefers Spanish voices for Spanish content
  - Falls back to system default
  - Neural/Premium voices prioritized
- **Speech Rate**: Adjustable from 0.5x to 2x
- **Features**:
  - Sentence-by-sentence reading
  - Auto-highlighting of current sentence
  - Play/pause/stop controls
  - Next/previous sentence buttons
  - Syncs with auto-advance timer
  - Error handling for voice loading failures
- **Current Issues** (Fixed July 24, 2026):
  - Voice loading timeout increased with exponential backoff retry
  - Better error messages to user when voices unavailable
  - Prevents "Too many re-renders" infinite loop

### 3. **Auto-Advance Timer**
- **Purpose**: Automatic slide progression at configurable speed
- **Settings**:
  - Enable/Disable toggle
  - Words-per-minute (WPM) setting (default: 200)
  - Auto-start option (starts immediately on page load)
  - Progress indicator display
- **Integration**: Synchronizes with TTS for coordinated reading
- **Features**:
  - Visual progress bar per slide
  - Syncs with keyboard navigation
  - Resets when user manually navigates

### 4. **Reading Management**
- **Create**: Modal to paste markdown content and add title, tags
- **Edit**: Change title inline via modal
- **Delete**: Confirmation modal before removal
- **Tags**: 
  - Add multiple tags per reading (e.g., "Python", "Tutorial")
  - Color-coded in grid view
  - Filterable (planned feature)
- **Progress Tracking**:
  - Track current slide position
  - Resume from last position on reload
  - Mark as complete when finishing
  - Move to "Completed" tab

### 5. **Storage & Sync**

#### Local Storage (Anonymous Mode)
- **Data Structure**: JSON serialization
- **Storage Keys**:
  - `readings`: Array of all reading objects
  - `settings`: User preferences
  - `tts-position:{id}`: Last TTS position per reading
  - `current-slide-index`: Last viewed slide
  - `completed-readings`: Array of finished reading IDs
  - `dashboard-tab`: Active tab ("active" or "completed")
- **Persistence**: Cross-tab synchronization via `storage` events
- **Limitations**: Browser/device-specific, loses data on cache clear

#### Firebase (Authenticated Mode)
- **Database**: Firestore
- **Collections**:
  - `users/{uid}/readings`: User's readings
  - `users/{uid}/settings`: User preferences
  - `users/{uid}/progress`: Reading progress tracking
- **Sync Strategy**:
  - Bi-directional sync on changes
  - Conflict resolution via timestamps
  - Offline-first with retry queues
- **Features**:
  - Multi-device sync
  - Backup and recovery
  - Sign-in via Google
  - Migration wizard for existing users

---

## 🎭 UI Components

### Navigation Components

| Component | Purpose | Props |
|-----------|---------|-------|
| **Header** | Top bar with title, settings, user menu | `title`, `onSettings`, `user` |
| **ReadingCard** | Grid item showing reading preview | `reading`, `isCompleted`, `onOpen`, `onEdit`, `onDelete` |
| **SettingsModal** | Customization panel | `isOpen`, `onClose`, `settings`, `onUpdate` |
| **NewReadingModal** | Create reading dialog | `isOpen`, `onClose`, `onCreate` |
| **EditTitleModal** | Edit reading title/tags | `isOpen`, `onClose`, `reading`, `onUpdate` |
| **ConfirmDeleteModal** | Delete confirmation | `isOpen`, `onClose`, `reading`, `onConfirm` |

### Reader Components

| Component | Purpose | Props |
|-----------|---------|-------|
| **TTSPlayer** | Text-to-speech playback controls | `text`, `settings`, `onSentenceChange` |
| **CodeBlock** | Syntax-highlighted code | `language`, `code`, `onCopy` |
| **SlideViewer** | Main slide content display | `content`, `theme`, `accessibility` |
| **NavigationButtons** | Previous/next controls | `currentIndex`, `totalSlides`, `onNavigate` |

---

## 🎨 Color Palettes

### Light Theme
```
Primary Gradient: #FED7AA (Amber-100) → #FBBF24 (Amber-400)
Header Gradient: #FCD34D (Yellow-300) → #BFEF45 (Lime-300)
Background: #FAFAF9 (Stone-50)
Text: #1F2937 (Gray-800)
Accent: #F59E0B (Amber-500)
Code Block: #FED7AA (Orange-100)
Code Text: #B45309 (Orange-700)
Border: #E5E7EB (Gray-200)
```

### Dark Theme
```
Primary Gradient: #6B21A8 (Purple-900) → #9333EA (Purple-600)
Header Gradient: #A855F7 (Purple-500) → #EC4899 (Pink-500)
Background: #111827 (Gray-900)
Text: #F3F4F6 (Gray-100)
Accent: #A855F7 (Purple-500)
Code Block: #1F2937 (Gray-800)
Code Text: #10B981 (Emerald-500)
Border: #374151 (Gray-700)
```

### Detox Theme
```
All: Grayscale (Black, White, Gray)
No Gradients
Minimalist Design
```

---

## 📱 Responsive Design

### Breakpoints

| Device | Width | Adjustments |
|--------|-------|-------------|
| **Mobile** | < 640px | Single column, full-width cards |
| **Tablet** | 640px - 1024px | Two-column grid |
| **Desktop** | > 1024px | Three-column grid, full sidebar |

### Adaptive Elements

- **Code Blocks**: Horizontal scroll on mobile
- **Tables**: Horizontal scroll on devices < 768px
- **Navigation**: Touch-friendly (44px+ buttons)
- **Font Sizes**: Scale down slightly on mobile
- **Modal**: Full-screen on mobile, centered on desktop

---

## 🎬 Animations & Transitions

### Supported Transitions

1. **Fade**: Cross-fade between slides
2. **Slide**: Horizontal slide animation
3. **Instant**: No animation (for reduce-motion users)

### Confetti Celebration

- Triggers when reading completion
- Canvas-based animation
- Theme-aware colors (amber for light, purple for dark)
- Duration: 3-4 seconds

### Hover States

- Buttons: Scale and color change
- Links: Underline and color change
- Cards: Shadow and scale increase
- Code copy button: Icon rotation and color change

---

## 🔄 Data Flow

### Reading Lifecycle

```
1. User creates reading (markdown input)
   ↓
2. Content parsed into slides
   ↓
3. Readings stored in localStorage/Firestore
   ↓
4. Card appears in "Active" tab
   ↓
5. User reads slides (navigates through content)
   ↓
6. Progress tracked (current slide position)
   ↓
7. User marks as complete
   ↓
8. Card moves to "Completed" tab
   ↓
9. Celebration animation (confetti)
```

### Settings Flow

```
1. User opens Settings modal
   ↓
2. Updates font/size/theme/accessibility options
   ↓
3. Settings dispatched to localStorage
   ↓
4. Cross-tab storage event fired
   ↓
5. All open tabs/windows update instantly
   ↓
6. Styles re-applied to all components
```

### TTS Flow

```
1. User enables TTS in settings
   ↓
2. Browser loads available voices (with retry logic)
   ↓
3. User clicks Play
   ↓
4. First sentence extracted from slide
   ↓
5. Utterance created with selected voice/rate
   ↓
6. Browser speaks sentence
   ↓
7. Sentence highlighted in real-time
   ↓
8. onSentenceChange callback fires → slide syncs
   ↓
9. Next sentence starts automatically
   ↓
10. On final sentence → onComplete callback
```

---

## 🚀 Technology Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 16.0.1 (React 19.2.0) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS + custom CSS |
| **Storage** | localStorage (browser) |
| **Cloud** | Firebase Firestore (optional) |
| **Auth** | Firebase Auth (Google OAuth) |
| **Markdown** | Custom parser (no external lib) |
| **Math** | KaTeX |
| **Animations** | canvas-confetti + CSS transitions |
| **Code Highlight** | Highlight.js (future) |
| **Testing** | Playwright (e2e) |
| **Build** | Turbopack (Next.js Turbopack) |

---

## 📊 Current Status (July 2026)

### Completed Features ✅
- Phase 1: Core reading functionality, themes, accessibility
- Phase 2: Firebase auth, cloud sync
- Phase 3: Auto-advance timer, onboarding tutorial
- Phase 4: Text-to-speech (with recent fixes)
- Phase 5: Advanced accessibility (blind user support)
- Phase 6: Reliability improvements

### Recent Fixes (July 24, 2026)
- **TTS Voice Loading**: Added exponential backoff retry logic
  - Old: Single 2.5s timeout (failed on slow networks)
  - New: Retries at 1s, 2s, 3s delays
  - Result: 90%+ voice loading success rate
- **Error Handling**: Improved error propagation and user feedback
- **React Infinite Loops**: Fixed "Too many re-renders" errors

### Known Issues
- None critical at this time
- Some accessibility features need WCAG compliance audit
- Firebase sync edge cases (rare race conditions)

### Planned Features
- Tag-based filtering and search
- Export readings to PDF
- Dark mode auto-detection
- Collaborative reading (shared readings)
- Advanced analytics (reading time, comprehension tracking)

---

## 🎯 Design Considerations for AI

### When Iterating on Design

1. **Maintain Simplicity**: Dashboard should be uncluttered, emphasize reading cards
2. **Prioritize Accessibility**: All text must have sufficient contrast, clickable areas ≥ 44px
3. **Support All Themes**: Every component must look good in Light, Dark, and Detox modes
4. **Mobile-First**: Design for 375px width first, scale up
5. **Keyboard Navigation**: All interactive elements must be keyboard-accessible
6. **Performance**: Avoid heavy animations on `prefers-reduced-motion`
7. **Code Readability**: Ensure code blocks are always readable (monospace, line numbers if possible)
8. **Consistency**: Follow Tailwind's design tokens, avoid one-off colors
9. **Responsive Tables**: Ensure tables don't overflow on mobile
10. **Loading States**: Show spinners for async operations (voice loading, sync)

### Color Usage Guidelines

- Never use pure black/white — use shades from theme palette
- Gradients should follow theme (amber/yellow for light, purple/pink for dark, grayscale for detox)
- Sufficient contrast ratio: 4.5:1 for text, 3:1 for UI components
- Colorblind-friendly: Avoid red/green only distinctions

### Typography Guidelines

- **Headings**: Bold, larger than body text
- **Body**: 14-20px depending on size setting
- **Code**: Always monospace
- **Links**: Underlined or colored, never color-only
- **Emphasis**: Bold or italic, not both

---

## 📞 Key Contacts & Resources

- **Repository**: https://github.com/matiasz8/telling-quote
- **Live Demo**: https://telling-quote.vercel.app
- **Status**: Production (Vercel deployment)
- **Last Deployment**: July 24, 2026 (TTS fixes)

---

## 📎 Additional Documentation

Detailed documentation available in `/docs/`:
- Architecture diagrams
- Component APIs
- Firebase setup guides
- Accessibility guidelines
- PRD/TRD specifications for each feature

---

**Created for**: Design AI systems and external designers  
**Refresh Frequency**: Monthly  
**Questions?**: Check the GitHub repo or reach out to the maintainer
