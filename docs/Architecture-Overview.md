# Architecture Overview

Technical overview of tellingQuote's architecture, design patterns, and component structure.

## System Architecture

```bash
┌─────────────────────────────────────────────┐
│           Next.js App Router                │
├─────────────────────────────────────────────┤
│  Pages:                                     │
│  - app/page.tsx (Dashboard)                 │
│  - app/reader/[id]/page.tsx (Reader)        │
│  - app/layout.tsx (Root Layout)             │
└─────────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────────┐
│          Component Layer                     │
├─────────────────────────────────────────────┤
│  UI Components:                             │
│  - Header, ReadingCard                      │
│  - Modals (Settings, New, Edit, Delete)     │
│  - CodeBlock                                │
└─────────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────────┐
│          Hook Layer                         │
├─────────────────────────────────────────────┤
│  Custom Hooks:                              │
│  - useLocalStorage (persistence)            │
│  - useSettings (configuration)              │
└─────────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────────┐
│          Utility Layer                      │
├─────────────────────────────────────────────┤
│  Processing:                                │
│  - textProcessor (markdown → slides)        │
│  - markdownFormatter (cleanup)              │
│  - styleHelpers (theme utilities)           │
│  Constants:                                 │
│  - settings (defaults, options)             │
│  - storage (keys, events)                   │
│  - navigation (keys, thresholds)            │
│  Configuration:                             │
│  - theme (styling constants)                │
└─────────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────────┐
│       Browser localStorage                  │
│  - readings: Reading[]                      │
│  - settings: Settings                       │
│  - completedReadings: string[]              │
│  - dashboardTab: 'active' | 'completed'     │
└─────────────────────────────────────────────┘
```

## Data Flow

### Creating a Reading

```bash
User Input (Markdown)
    ↓
NewReadingModal
    ↓
markdownFormatter (cleanup)
    ↓
Reading Object
    ↓
useLocalStorage hook
    ↓
localStorage.setItem('readings')
    ↓
Dashboard re-renders with new reading
```

### Viewing a Reading

```bash
User clicks ReadingCard
    ↓
Navigate to /reader/[id]
    ↓
Load reading from localStorage
    ↓
textProcessor.processContent()
    ↓
ProcessedText[] (slides)
    ↓
Render current slide with navigation
```

### Changing Settings

```bash
User opens SettingsModal
    ↓
Select font/size/theme
    ↓
useSettings.setSettings()
    ↓
localStorage.setItem('settings')
    ↓
Custom event 'local-storage-change'
    ↓
All components re-render with new theme
```

## Core Components

### Pages

#### `app/page.tsx` - Dashboard

**Features**:

- Tab-based organization (Active/Completed)
- Lists all saved readings in responsive grid
- Grid layout (responsive 1-4 columns)
- Create, edit, and delete operations
- Theme-aware background gradients
- Persistent tab selection
- Reading counters per tab

**State Management**:

- `readings`: All Reading objects
- `completedReadings`: Array of completed reading IDs
- `activeTab`: Current tab ('active' | 'completed')
- Filters readings based on completion status

#### `app/reader/[id]/page.tsx` - Reader

**Features**:

- Dynamic route for reading content
- Processes markdown into slides
- Keyboard and touch navigation
- Scroll navigation with debounce
- Fullscreen toggle support
- Progress bar with slide counter
- Confetti animation on completion
- Automatic completion tracking

**Navigation Controls**:

- Arrow keys (← → ↑ ↓)
- Touch swipe gestures (mobile)
- Mouse wheel scrolling
- On-screen buttons
- Go to start button
- Finish reading button (on last slide)

#### `app/layout.tsx` - Root Layout

- Global HTML structure
- Metadata configuration
- Font loading (Geist Sans & Mono)
- Favicon setup

### UI Components

#### `Header.tsx`

- Application branding
- GitHub repository link
- Settings button
- Theme-aware styling

#### `ReadingCard.tsx`

**Features**:

- Displays reading in grid
- Visual pending indicator (colored dot)
- Edit/delete hover actions
- Link to reader page
- Theme-adaptive card style
- Completion status display

**Props**:

- `reading`: Reading object
- `onEdit`: Edit callback
- `onDelete`: Delete callback
- `isDark`: Theme flag
- `isCompleted`: Completion status

#### `SettingsModal.tsx`

- Font family selection (4 options)
- Font size selection (4 options)
- Theme toggle (light/dark)
- Instant preview
- Persistent settings

#### `NewReadingModal.tsx`

- Title input
- Markdown content textarea
- Markdown formatting on save
- Validation

#### `EditTitleModal.tsx`

- Simple title editor
- Keyboard shortcuts (Enter/Escape)
- Inline validation

#### `ConfirmDeleteModal.tsx`

- Deletion confirmation
- Visual warning indicators
- Keyboard navigation

#### `CodeBlock.tsx`

- Syntax-aware display
- Copy to clipboard
- Language label
- Terminal-style design

## Custom Hooks

### `useLocalStorage<T>`

**Purpose**: Persist state in browser storage with React integration

**Features**:

- Type-safe localStorage wrapper
- SSR-compatible initialization
- Cross-component synchronization
- Custom event dispatching
- Storage event listening (cross-tab sync)

**Usage**:

```typescript
const [value, setValue] = useLocalStorage<T>('key', defaultValue);
```

**Implementation Details**:

- Lazy initialization for SSR compatibility
- Custom events for same-page sync
- Storage events for cross-tab sync
- Automatic JSON serialization

### `useSettings`

**Purpose**: Manage application settings

**Features**:

- Default settings fallback
- Type-safe settings object
- Built on useLocalStorage

**Default Settings**:

```typescript
{
  fontFamily: 'serif',
  fontSize: 'medium',
  theme: 'light'
}
```

## Utility Functions

### `textProcessor.ts`

**Purpose**: Convert markdown content into navigable slides

**Key Function**: `processContent(title: string, content: string): ProcessedText[]`

**Processing Steps**:

1. Split content by headings (`##`)
2. Identify code blocks (```)
3. Process lists (bullets and numbers)
4. Track parent context for nested lists
5. Split paragraphs into sentences
6. Generate unique IDs for each slide

**Output**: Array of `ProcessedText` objects with:

- `id`: Unique identifier
- `title`: Main title
- `subtitle`: Section heading
- `sentence`: Content text
- `isBullet`: Is this a bullet point?
- `isNumbered`: Is this a numbered item?
- `isCodeBlock`: Is this a code block?
- `parentBullet`: Parent bullet text
- `indentLevel`: Nesting level
- ... and more

### `markdownFormatter.ts`

**Purpose**: Clean markdown before storage

**Features**:

- Remove empty lines within lists
- Preserve paragraph spacing
- Clean up extra whitespace

### `styleHelpers.ts`

**Purpose**: Map settings to Tailwind classes

**Functions**:

- `getFontFamilyClass()`: Font to CSS class
- `getFontSizeClasses()`: Size to responsive classes
- `getThemeClasses()`: Theme to color classes

## Configuration & Constants

### `config/theme.ts`

**Purpose**: Centralized theme configuration for consistent styling

**Configuration Sections**:

```typescript
export const theme = {
  inlineCode: {
    background: 'bg-gray-800',
    text: 'text-green-400',
    font: 'font-mono',
    // ... more styles
  },
  bullets: {
    level0: { /* Parent bullet styles */ },
    level1: { /* Sub-bullet styles */ },
    history: { /* Previous bullets */ },
    parent: { /* Parent context */ }
  },
  subtitleIntro: {
    size: 'text-5xl',
    weight: 'font-bold',
    style: 'italic',
  },
  progressBar: {
    background: 'bg-gray-200',
    fill: 'bg-linear-to-r from-blue-500 to-blue-600',
  }
}
```

### `lib/constants/`

#### `settings.ts`

- `FONT_FAMILY_OPTIONS`: Available font families
- `FONT_SIZE_OPTIONS`: Available font sizes
- `THEME_OPTIONS`: Light/Dark themes
- `DEFAULT_SETTINGS`: Default user preferences

#### `storage.ts`

- `STORAGE_KEYS`: localStorage key names
  - `READINGS`: 'readings'
  - `SETTINGS`: 'settings'
- `STORAGE_EVENTS`: Custom event names
  - `CHANGE`: 'local-storage-change'

#### `navigation.ts`

- `NAVIGATION_KEYS`: Keyboard shortcuts
  - `NEXT`: ['ArrowRight', 'ArrowDown']
  - `PREVIOUS`: ['ArrowLeft', 'ArrowUp']
  - `ESCAPE`: 'Escape' (fullscreen exit)
  - `ENTER`: 'Enter' (modals)
- `TOUCH_SWIPE_THRESHOLD`: 50px (mobile swipe detection)
- `SCROLL_DEBOUNCE_TIME`: 100ms (scroll navigation delay)

## Type System

### Core Types (`types/index.ts`)

```typescript
export interface Reading {
  id: string;
  title: string;
  content: string;
}

export interface ProcessedText {
  id: number;
  title: string;
  subtitle: string | null;
  sentence: string;
  isSubtitleIntro?: boolean;      // Marks if this is the subtitle introduction slide
  isBulletPoint?: boolean;         // Marks if it's a list item
  bulletHistory?: string[];        // Previous bullets in this list
  isNumberedList?: boolean;        // Marks if it's a numbered list
  indentLevel?: number;            // Indentation level (0 = root, 1 = sub-bullet, etc.)
  parentBullet?: string;           // Parent bullet if this is a sub-bullet
  parentIsNumbered?: boolean;      // If parent is a numbered list
  parentNumberIndex?: number;      // Numeric index of parent if numbered list
  isCodeBlock?: boolean;           // Marks if it's a code block
  codeLanguage?: string;           // Code language (bash, javascript, etc.)
  isBlockquote?: boolean;          // Marks if it's a quote/blockquote
  isHorizontalRule?: boolean;      // Marks if it's a horizontal separator
  isImage?: boolean;               // Marks if it's an image
  imageUrl?: string;               // Image URL
  imageAlt?: string;               // Image alt text
  isTable?: boolean;               // Marks if it's a table
  tableHeaders?: string[];         // Table headers
  tableRows?: string[][];          // Table data rows
  isCheckbox?: boolean;            // Marks if it's a task checkbox
  isChecked?: boolean;             // If checkbox is checked
  isFootnoteRef?: boolean;         // Marks if it's a footnote reference [^1]
  footnoteId?: string;             // Footnote ID
  isFootnoteDef?: boolean;         // Marks if it's a footnote definition [^1]: text
  footnoteText?: string;           // Footnote text
  isMathInline?: boolean;          // Marks if it's inline math $...$
  isMathBlock?: boolean;           // Marks if it's block math $$...$$
  mathContent?: string;            // Math equation content
}

export type FontFamily = 'serif' | 'sans' | 'mono' | 'system';
export type FontSize = 'small' | 'medium' | 'large' | 'xlarge';
export type Theme = 'light' | 'dark';

export interface Settings {
  fontFamily: FontFamily;
  fontSize: FontSize;
  theme: Theme;
}
```

## State Management

### localStorage Schema

```json
{
  "readings": [
    {
      "id": "uuid-v4",
      "title": "Reading Title",
      "content": "## Section\n\nContent..."
    }
  ],
  "settings": {
    "fontFamily": "serif",
    "fontSize": "medium",
    "theme": "dark"
  },
  "completedReadings": [
    "uuid-v4-1",
    "uuid-v4-2"
  ],
  "dashboardTab": "active"
}
```

**Storage Keys:**

- `readings`: Array of Reading objects
- `settings`: User preferences (font, size, theme)
- `completedReadings`: Array of reading IDs marked as completed
- `dashboardTab`: Active tab on dashboard ("active" | "completed")

### State Synchronization

1. **Same Page**: Custom events via `window.dispatchEvent()`
2. **Cross Tab**: Native Storage events
3. **SSR**: Lazy initialization with `useState(() => ...)`

## Styling Architecture

### Tailwind Configuration

- Custom gradients for themes
- Responsive breakpoints (sm, md, lg, xl)
- Dark mode via class strategy
- Custom font families

### Theme System

**Light Theme**:

- Background: Yellow → Lime → Emerald gradient
- Text: Gray-900
- Cards: White with light borders
- Header: Yellow-100 → Lime-100 gradient

**Dark Theme**:

- Background: Purple → Gray → Black gradient
- Text: Gray-100
- Cards: Gray-800 with dark borders
- Header: Purple-900 → Black gradient

**Color Philosophy**: The light theme uses yellow-green tones (complementary to purple) creating a vibrant, energetic feel that contrasts beautifully with the dark theme's deep purples.

### Responsive Design

- **Mobile**: Single column, touch gestures
- **Tablet**: 2-3 columns grid
- **Desktop**: Up to 4 columns grid
- **Touch Devices**: Swipe navigation enabled

## Performance Considerations

### Optimization Strategies

1. **Lazy Initialization**: useState with function
2. **Memoization**: useMemo for processed content
3. **Event Batching**: Single re-render per settings change
4. **Client-Side Only**: No unnecessary SSR overhead

### Bundle Size

- Next.js automatic code splitting
- Component-level lazy loading
- Tailwind CSS purging unused styles

## Security

### Data Privacy

- All data stored locally (no server)
- No external API calls
- No user tracking or analytics
- No cookies required

### XSS Prevention

- React automatic escaping
- No dangerouslySetInnerHTML (except necessary)
- Sanitized markdown processing

## Browser Compatibility

### Minimum Requirements

- Modern browsers (Chrome 90+, Firefox 88+, Safari 14+)
- localStorage support
- ES6+ JavaScript
- CSS Grid support

### Progressive Enhancement

- Fallback to default theme if localStorage fails
- Graceful degradation for older browsers
- Touch events with mouse fallback

---

**Next**: See [Component Documentation](Component-Documentation) for detailed API reference
