# Telling Quote

An interactive reading application that converts markdown content into slide-style presentations, allowing you to read and study in an organized and visually appealing way.

## ✨ Features

- 📝 **Markdown Processing**: Automatically converts markdown content into navigable slides
- 🎨 **Complete Customization**:
  - 4 font families (Serif, Sans-serif, Monospace, System)
  - 4 text sizes (Small, Medium, Large, Extra Large)
  - 2 themes (Light with amber gradient, Dark with purple gradient)
- 💻 **Modern Code Blocks**: Professional rendering with copy button and language detection
- 📊 **Smart Lists**: Full support for bulleted and numbered lists with parent context
- 🔍 **Smooth Navigation**: Navigate between slides with keyboard or buttons
- 💾 **Local Persistence**: All your readings and settings are saved in localStorage

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

## 📁 Project Structure

```text
telling-quote/
├── app/
│   ├── page.tsx              # Dashboard with readings grid
│   ├── reader/[id]/page.tsx  # Slide viewer
│   └── layout.tsx
├── components/
│   ├── CodeBlock.tsx         # Code block rendering
│   ├── SettingsModal.tsx     # Settings modal
│   ├── Header.tsx            # Header with navigation
│   ├── ReadingCard.tsx       # Reading card in dashboard
│   ├── NewReadingModal.tsx   # Modal to create readings
│   └── EditTitleModal.tsx    # Modal to edit titles
├── hooks/
│   ├── useLocalStorage.ts    # Persistence hook
│   └── useSettings.ts        # Settings hook
├── utils/
│   ├── textProcessor.ts      # Markdown processing
│   ├── markdownFormatter.ts  # Markdown cleanup
│   └── styleHelpers.ts       # Style mapping
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

**Note**: Horizontal rules (`---`, `***`) are recognized but omitted in slide view as they serve as visual separators in source markdown.

## 🤝 Contributions

Contributions are welcome. If you find a bug or have a suggestion, please open an issue.

## 📄 License

MIT

---

Built with ❤️ using Next.js
