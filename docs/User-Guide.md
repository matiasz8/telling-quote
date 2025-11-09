# User Guide

Complete guide for using tellingQuote to create and navigate reading materials.

## Creating Your First Reading

### Step 1: Open the Application

Navigate to the dashboard where you'll see a "New Reading" button.

### Step 2: Create a New Reading

1. Click the **"New Reading"** button
2. Enter a title for your reading
3. Paste or type your markdown content
4. Click **"Save Reading"**

### Step 3: Navigate Your Reading

- Use **arrow keys** (← → or ↑ ↓) to navigate between slides
- On mobile, **swipe left/right** to move between slides
- Click the **navigation buttons** at the bottom for precise control

## Markdown Format Guide

### Titles and Sections

Use `##` for section headings (subtitles):

```markdown
## Introduction

Your content here...

## Main Topic

More content...
```

Each `##` heading creates a new section.

### Lists

**Bulleted Lists:**
```markdown
- First item
- Second item
  - Nested item
  - Another nested item
```

**Numbered Lists:**
```markdown
1. First step
2. Second step
   1. Sub-step
   2. Another sub-step
```

### Text Formatting

- **Bold**: `**text**` → **text**
- *Italic*: `*text*` → *text*
- Inline code: `` `code` `` → `code`

### Code Blocks

Use triple backticks with optional language:

````markdown
```javascript
function hello() {
  console.log("Hello, world!");
}
```
````

### Links

```markdown
[Link text](https://example.com)
```

## Customization

### Accessing Settings

Click the **⚙️ Settings** icon in the top-right corner.

### Font Family Options

Choose from:
- **Serif**: Traditional, readable
- **Sans Serif**: Modern, clean
- **Monospace**: Code-like appearance
- **System**: Your device's default

### Font Size Options

- **Small**: Compact view
- **Medium**: Balanced (default)
- **Large**: Easier reading
- **Extra Large**: Maximum readability

### Theme Options

- **Light**: Amber gradient background
- **Dark**: Purple-to-black gradient

All settings are automatically saved in your browser.

## Navigation Features

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `→` or `↓` | Next slide |
| `←` or `↑` | Previous slide |
| `Esc` | Exit fullscreen (when in fullscreen) |

### Mobile Gestures

- **Swipe Left**: Next slide
- **Swipe Right**: Previous slide

### On-Screen Controls

- **Previous/Next Buttons**: Click to navigate
- **Slide Counter**: Shows current position (e.g., "5 / 20")
- **Progress Indicator**: Visual progress bar

## Managing Readings

### Editing a Title

1. Hover over a reading card in the dashboard
2. Click the **Edit** (pencil) icon
3. Enter the new title
4. Click **"Save"**

### Deleting a Reading

1. Hover over a reading card
2. Click the **Delete** (trash) icon
3. Confirm deletion in the modal

**Note**: Deletion is permanent and cannot be undone.

## Code Block Features

### Copying Code

Every code block has a **"Copy"** button in the top-right corner:

1. Hover over the code block
2. Click the **"Copy"** button
3. Code is copied to your clipboard
4. Button shows "Copied" confirmation

### Supported Languages

The code block renderer automatically detects and displays the language:

- JavaScript/TypeScript
- Python
- Bash/Shell
- HTML/CSS
- And many more!

## Tips and Best Practices

### 💡 Content Organization

- Use clear, descriptive headings
- Keep slides focused on one concept
- Break complex topics into multiple slides

### 💡 List Usage

- Use bullets for unordered items
- Use numbers for sequential steps
- Nest lists for hierarchy

### 💡 Code Display

- Always specify the language for syntax awareness
- Keep code blocks concise and focused
- Use inline code for short references

### 💡 Readability

- Choose font size based on your screen
- Use dark theme in low-light conditions
- Experiment with different font families

## Data Storage

All your readings and settings are stored **locally in your browser** using localStorage:

- ✅ Works offline after first load
- ✅ No server storage needed
- ✅ Private and secure
- ⚠️ Clearing browser data will delete readings
- ⚠️ Data is device-specific (not synced across devices)

### Backing Up Your Data

Currently, there's no export feature. To back up:

1. Open browser DevTools (F12)
2. Go to Application → Local Storage
3. Copy the `readings` key value
4. Save to a text file

To restore:
1. Open DevTools
2. Paste the value back into localStorage
3. Refresh the page

## Troubleshooting

### Reading Not Appearing

- Check if it's saved (should appear in dashboard)
- Try refreshing the page
- Clear browser cache if issues persist

### Theme Not Persisting

- Ensure cookies/localStorage are enabled
- Check browser privacy settings
- Try saving settings again

### Navigation Not Working

- Ensure you're on a reading page (not dashboard)
- Check keyboard focus is on the page
- Try clicking on the page content first

### Code Block Not Rendering

- Check that you're using triple backticks (\`\`\`)
- Ensure backticks are on their own lines
- Verify no extra spaces before/after backticks

## Getting Help

- 📖 Check the [GitHub Wiki](https://github.com/matiasz8/telling-quote/wiki)
- 🐛 [Report a bug](https://github.com/matiasz8/telling-quote/issues)
- 💡 [Request a feature](https://github.com/matiasz8/telling-quote/issues/new)
- ⭐ [Star the project](https://github.com/matiasz8/telling-quote)

---

**Next**: Learn about [Markdown Processing](Markdown-Processing) or check the [Architecture Overview](Architecture-Overview)
