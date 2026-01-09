# Complete Markdown Example - tellingQuote

## Introduction to Formatting

In this demonstration you'll see all the markdown formats supported by **tellingQuote**. Each format has a specific purpose to improve how your content is presented.

---

## Inline Text Formats

### Emphasis and Style

Text can have *subtle emphasis* using italics, or **strong emphasis** with bold. You can also ~~strike through text~~ when you want to indicate something is obsolete or incorrect.

You can combine them: ***text in bold and italics***, or **bold with ~~strikethrough~~**, or even *italics with `inline code`*.

### Code

To mention commands or inline code, use `backticks`. For example: run `npm install` to install dependencies.

---

## Lists and Structure

### Bullet List

- First important point
- Second point with *emphasis*
- Third point with **bold**
- Fourth point with ~~strikethrough~~
- Fifth point with `inline code`

### Numbered List

1. Step one: Install dependencies with `npm install`
2. Step two: Configure the `.env` file
3. Step three: Run `npm run dev` to start
4. Step four: Open `http://localhost:3000` in your browser

---

## Blockquotes and Highlights

> "Education is the most powerful weapon which you can use to change the world."
> — Nelson Mandela

> This is an important quote that contains **bold text**, *italics*, and even `inline code`.

> Blockquotes are perfect for highlighting key concepts or memorable phrases.

---

## Code Blocks

### JavaScript Example

```javascript
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10));
```

### Python Example

```python
def factorial(n):
    if n == 0 or n == 1:
        return 1
    return n * factorial(n - 1)

print(factorial(5))
```

### Bash Example

```bash
#!/bin/bash
echo "Hello from tellingQuote"
npm run build
npm start
```

---

## Advanced Combinations

### List with Multiple Formats

- **Bold**: To *highlight* critical information
- *Italics*: To ~~emphasize~~ subtly
- `Code`: To mention commands like `git commit`
- ~~Strikethrough~~: To indicate changes or **obsolescence**

### Links and References

Visit the [GitHub repository](https://github.com/matiasz8/telling-quote) to see the source code.

Learn more about [Markdown](https://www.markdownguide.org/) and its capabilities.

---

## Visual Separators

Horizontal separators help divide thematic sections:

***

## Images and Highlights (Phase 2)

### Images

You can include images using standard markdown syntax:

![tellingQuote Logo](https://picsum.photos/600/400)

Images are displayed centered and with optimized size for reading.

![Flow Diagram](https://picsum.photos/600/400)

### Highlighted Text

You can ==highlight important text== using highlighting syntax.

This format is perfect for ==highlighting key concepts== or ==important terms== that you want readers to remember.

You can also combine: **bold with ==highlight==** or *italics with ==highlighting==*.



---

## Final Section

### Summary of Supported Formats

1. **Headings** - For titles and subtitles
2. *Italics* - For subtle emphasis
3. **Bold** - For strong emphasis
4. ~~Strikethrough~~ - For obsolete text
5. `Inline code` - For technical mentions
6. Code blocks - For complete examples
7. > Blockquotes - For important quotes
8. Separators - To divide sections
9. [Links](https://example.com) - For external references

---

## 📊 Tables

Tables allow you to organize information in rows and columns with a professional and modern layout.

### Simple Table

| Language | Popularity | Type |
|----------|-------------|------|
| JavaScript | ⭐⭐⭐⭐⭐ | Multiparadigm |
| Python | ⭐⭐⭐⭐⭐ | Interpreted |
| TypeScript | ⭐⭐⭐⭐ | Statically typed |
| Rust | ⭐⭐⭐ | Systems |

### Formatted Table

| Feature | Description | Status |
|---------|-------------|--------|
| **Markdown** | Full support | ==Active== |
| *Tables* | Modern design | ✅ Ready |
| `Code` | Syntax highlighting | 🚀 Enhanced |

---

## ✅ Task Lists

Create task lists with custom and animated checkboxes.

### Completed Tasks

- [x] Implement markdown support
- [x] Add light and dark themes
- [x] Create navigation system

### Pending Tasks

- [ ] Add footnotes support
- [ ] Implement mathematical equations
- [ ] Improve loading performance

### Mixed List

- [x] Design user interface
- [x] Implement business logic
- [ ] Write unit tests
- [ ] Document API

---

## 📚 Footnotes and References

Footnotes allow you to add notes at the end and academic references.

### Basic Example

This text has a reference[^1] that appears at the end.

You can also have multiple references[^2] in the same paragraph.

[^1]: This is the first footnote with additional information.
[^2]: Second note explaining an important concept.

### Academic Example

The theory of relativity[^einstein] revolutionized modern physics.

The principles of quantum computing[^quantum] enable new paradigms.

[^einstein]: Einstein, A. (1905). "Zur Elektrodynamik bewegter Körper". Annalen der Physik.
[^quantum]: Nielsen, M. & Chuang, I. (2010). Quantum Computation and Quantum Information.

---

## 🧮 Mathematical Equations

Render professional mathematical equations with KaTeX.

### Inline Mathematics

Euler's formula is $e^{i\pi} + 1 = 0$, one of the most beautiful in mathematics.

The Pythagorean theorem: $a^2 + b^2 = c^2$.

### Block Equations

$$E = mc^2$$

$$\int_{a}^{b} f(x)dx = F(b) - F(a)$$

$$\sum_{i=1}^{n} i = \frac{n(n+1)}{2}$$

### Matrices and Systems

$$\begin{bmatrix} a & b \\ c & d \end{bmatrix}$$

$$f(x) = \begin{cases} x^2 & \text{if } x \geq 0 \\ -x & \text{if } x < 0 \end{cases}$$

---

> Now you can create rich and visually attractive content in tellingQuote!

**Tip**: Combine these formats to create professional and educational presentations.

*Enjoy creating amazing content!* 🚀
