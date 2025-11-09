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
4. Your app will be deployed with full SSR support

**Note**: The `next.config.ts` is already configured for Vercel deployment by default.

### GitHub Pages (Alternative)

To deploy on GitHub Pages with static export, you need to modify the configuration:

1. Uncomment the export settings in `next.config.ts`:

```typescript
const nextConfig = {
  output: 'export',
  basePath: '/telling-quote', // Your repository name
  images: {
    unoptimized: true,
  },
};
```

2. The GitHub Actions workflow in `.github/workflows/deploy.yml` is already configured

3. In GitHub, go to Settings → Pages → Source and select "GitHub Actions"

4. Push to main branch and the deployment will run automatically

**Note**: With static export, all data is stored in browser localStorage only. For Vercel deployment, you can keep the dynamic routing without modifications.

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

- **Titles**: `## Subtitle` divides content into sections
- **Bulleted lists**: `- Item` or `* Item`
- **Numbered lists**: `1. Item` with parent context
- **Inline code**: `` `code` ``
- **Code blocks**: 
  ````markdown
  ```javascript
  console.log('Hello');
  ```
  ````
- **Bold**: `**text**`
- **Links**: `[text](url)`

## 🤝 Contributions

Contributions are welcome. If you find a bug or have a suggestion, please open an issue.

## 📄 License

MIT

---

Built with ❤️ using Next.js
