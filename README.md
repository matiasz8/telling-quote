# Telling Quote

An interactive reading application that converts markdown content into slide-style presentations, allowing you to read and study in an organized and visually appealing way.

## ✨ Features

### Dashboard & Organization

- **Tab-Based Organization**: Separate "Active" and "Completed" readings with visual counters
- 🟢 **Visual Indicators**: Colored dots on pending readings (green/purple based on theme)
- 🔄 **Auto-Categorization**: Readings move to "Completed" tab when finished
- 💾 **Persistent State**: Tab selection and completion status saved in localStorage

### Reading Experience
- �📝 **Markdown Processing**: Automatically converts markdown content into navigable slides
- 🎨 **Complete Customization**:
  - 4 font families (Serif, Sans-serif, Monospace, System)
  - 4 text sizes (Small, Medium, Large, Extra Large)
  - 2 themes (Light with amber gradient, Dark with purple gradient)
- 💻 **Modern Code Blocks**: Professional rendering with copy button and language detection
- 📊 **Smart Lists**: Full support for bulleted and numbered lists with parent context
- 🔍 **Smooth Navigation**: Navigate between slides with keyboard or buttons
- 🎊 **Completion Celebration**: Confetti animation when finishing a reading

## 🚀 Quick Start

### Local Development

1. Clone the repository:

```bash
git clone git@github.com:matiasz8/telling-quote.git
cd telling-quote
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

## 📦 Deployment

### Vercel (Recommended)

The easiest way to deploy this Next.js application is using [Vercel](https://vercel.com):

1. Push your repository to GitHub
2. Import the project in [Vercel](https://vercel.com/new)
3. Vercel will automatically detect Next.js and configure the build
4. Your app will be deployed with full SSR support and dynamic routing

**Live Demo**: Deploy your own instance in minutes!

**Note**: This app uses client-side localStorage for data persistence, so each user's data stays in their browser.

### GitHub Pages (Not Recommended)

GitHub Pages requires static export, which has limitations with this app:

- Dynamic routes (`/reader/[id]`) require `generateStaticParams()` 
- Since data is in localStorage, pages cannot be pre-generated
- Limited functionality compared to Vercel deployment

If you still want to try GitHub Pages:

1. Uncomment the export settings in `next.config.ts`
2. Add `generateStaticParams()` to dynamic routes
3. Enable the GitHub Actions workflow in `.github/workflows/deploy.yml`

**Recommendation**: Use Vercel for the best experience with full app functionality.

## 🛠️ Technologies

- **Framework**: Next.js 16.0.1 with App Router
- **UI**: React 19.2.0
- **Styling**: Tailwind CSS with custom gradients
- **Typing**: TypeScript
- **Storage**: localStorage with cross-component synchronization
- **Animations**: canvas-confetti for completion celebrations
- **Math Rendering**: KaTeX for mathematical equations

## 📁 Project Structure

```text
telling-quote/
├── app/
│   ├── page.tsx              # Dashboard with tabs and readings grid
│   ├── reader/[id]/page.tsx  # Slide viewer with navigation
│   └── layout.tsx            # Root layout
├── components/
│   ├── CodeBlock.tsx         # Code block rendering with copy
│   ├── SettingsModal.tsx     # Settings modal
│   ├── Header.tsx            # Header with navigation
│   ├── ReadingCard.tsx       # Reading card with status indicator
│   ├── NewReadingModal.tsx   # Modal to create readings
│   ├── EditTitleModal.tsx    # Modal to edit titles
│   └── ConfirmDeleteModal.tsx # Deletion confirmation
├── hooks/
│   ├── useLocalStorage.ts    # Persistence hook with sync
│   └── useSettings.ts        # Settings hook
├── lib/
│   ├── constants/
│   │   ├── settings.ts       # Font, size, theme options
│   │   ├── storage.ts        # localStorage keys
│   │   └── navigation.ts     # Keyboard & touch constants
│   └── utils/
│       ├── textProcessor.ts  # Markdown → slides processing
│       ├── markdownFormatter.ts # Markdown cleanup
│       └── styleHelpers.ts   # Style mapping utilities
├── config/
│   └── theme.ts              # Theme configuration constants
└── types/
    └── index.ts              # Type definitions
```

## 🎯 Usage

1. **Create a reading**: Click "New Reading" on the dashboard
2. **Paste markdown content**: Titles (##), lists, code, etc.
3. **Navigate**: Use keyboard arrows or buttons to move between slides
4. **Customize**: Click the settings icon (⚙️) to adjust font, size and theme
5. **Copy code**: Code blocks have an integrated copy button

## 📝 Supported Markdown Format

### Basic Formatting (Phase 1)

- **Headings**: `## Subtitle` divides content into sections
- **Bold**: `**text**` for strong emphasis
- **Italic**: `*text*` or `_text_` for subtle emphasis
- **Strikethrough**: `~~text~~` for deleted or obsolete text
- **Bulleted lists**: `- Item` or `* Item`
- **Numbered lists**: `1. Item` with parent context
- **Blockquotes**: `> quote` for highlighting important citations
- **Inline code**: `` `code` ``
- **Code blocks**:

  ````markdown
  ```javascript
  console.log('Hello');
  ```
  ````

- **Links**: `[text](url)` with hover effect

### Rich Media (Phase 2)

- **Images**: `![alt text](image-url)` - displayed centered with optimized size
- **Highlighting**: `==highlighted text==` - theme-aware background color for emphasis

### Structured Content (Phase 3)

- **Tables**: Organize data with modern, styled tables

  ```markdown
  | Header 1 | Header 2 |
  |----------|----------|
  | Cell 1   | Cell 2   |
  ```

  - Gradient headers (theme-aware: purple in dark mode, yellow-lime in light)
  - Hover effects on rows
  - Support for inline markdown in cells (bold, italic, code, etc.)
  - Responsive with horizontal scroll on mobile

- **Task Lists**: Interactive checkboxes for todos and progress tracking

  ```markdown
  - [ ] Pending task
  - [x] Completed task
  ```

  - Custom SVG checkmarks
  - Theme-aware colors (purple in dark mode, lime in light)
  - Line-through styling for completed tasks
  - Support for inline markdown in task text

### Academic Content (Phase 4)

- **Footnotes**: Add references and citations with footnote notation

  ```markdown
  Text with reference[^1]
  
  [^1]: Footnote definition text
  ```

  - Superscript references with theme-aware colors
  - Footnote definitions displayed in styled boxes
  - Support for named footnotes (e.g., `[^name]`)
  - Multiple footnotes per slide

- **Math Equations**: Professional mathematical typography powered by KaTeX

  - **Inline math**: `$E = mc^2$` - renders inline with text
  - **Block math**: `$$\int_{a}^{b} f(x)dx$$` - displays centered equations
  - Support for:
    - Greek letters and symbols
    - Fractions and superscripts/subscripts
    - Integrals, summations, products
    - Matrices and cases
    - All standard LaTeX math notation
  - Theme-aware rendering (dark/light backgrounds)
  - Error-tolerant (won't break on invalid syntax)

**Note**: Horizontal rules (`---`, `***`) are recognized but omitted in slide view as they serve as visual separators in source markdown.

## 🤝 Contributions

Contributions are welcome. If you find a bug or have a suggestion, please open an issue.

## 📄 License

MIT

---

Built with ❤️ using Next.js
