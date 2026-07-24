import { promises as fs } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const IGNORED_DIRS = new Set([".git", ".next", "node_modules", "playwright-report", "test-results"]);
const MD036_TARGETS = new Set([
  "FIREBASE_IMPLEMENTATION.md",
  "IMPLEMENTATION_ANALYSIS.md",
  "docs/prd/PRD-011-internationalization.md",
  "docs/prd/PRD-012-auto-advance-timer.md",
  "docs/prd/PRD-013-text-to-speech.md",
  "docs/prd/PRD-014-reading-reactivation.md",
  "docs/trd/TRD-010-onboarding-tutorial.md",
]);

async function collectMarkdownFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (IGNORED_DIRS.has(entry.name)) {
      continue;
    }

    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectMarkdownFiles(fullPath)));
      continue;
    }

    if (entry.isFile() && entry.name.endsWith(".md")) {
      files.push(fullPath);
    }
  }

  return files;
}

function fixBlockquoteSpacing(lines) {
  for (let index = 1; index < lines.length - 1; index += 1) {
    if (lines[index] === "" && lines[index - 1].startsWith(">") && lines[index + 1].startsWith(">")) {
      lines[index] = ">";
    }
  }
}

function fixHorizontalRules(lines) {
  for (let index = 0; index < lines.length; index += 1) {
    if (/^(\*\s*){3,}$/.test(lines[index]) || /^(_\s*){3,}$/.test(lines[index])) {
      lines[index] = "---";
    }
  }
}

function fixStandaloneBoldHeadings(lines, relativePath) {
  if (!MD036_TARGETS.has(relativePath)) {
    return;
  }

  for (let index = 0; index < lines.length; index += 1) {
    const boldMatch = lines[index].match(/^\*\*(.+)\*\*$/);
    const headingMatch = lines[index].match(/^(#{3,4})\s+(.+)$/);
    if (!boldMatch && !headingMatch) {
      continue;
    }

    const rawText = (boldMatch?.[1] ?? headingMatch?.[2] ?? "").trim();
    if (!rawText || rawText.includes("`") || rawText.startsWith("TODO")) {
      continue;
    }

    const text = rawText.replace(/[:.!?]+$/u, "").trim();
    let previousHeadingLevel = 2;

    for (let cursor = index - 1; cursor >= 0; cursor -= 1) {
      const previousHeading = lines[cursor].match(/^(#{1,6})\s+/);
      if (previousHeading) {
        previousHeadingLevel = previousHeading[1].length;
        break;
      }
    }

    const nextLevel = Math.min(previousHeadingLevel + 1, 6);
    lines[index] = `${"#".repeat(nextLevel)} ${text}`;
  }
}

function fixHeadingSpacing(lines, relativePath) {
  if (!MD036_TARGETS.has(relativePath)) {
    return;
  }

  for (let index = 0; index < lines.length; index += 1) {
    if (!/^(#{1,6})\s+/.test(lines[index])) {
      continue;
    }

    if (index > 0 && lines[index - 1].trim() !== "") {
      lines.splice(index, 0, "");
      index += 1;
    }

    if (index < lines.length - 1 && lines[index + 1].trim() !== "") {
      lines.splice(index + 1, 0, "");
      index += 1;
    }
  }
}

function fixBareCodeFences(lines) {
  let inTripleFence = false;

  for (let index = 0; index < lines.length; index += 1) {
    const trimmed = lines[index].trimStart();
    if (!trimmed.startsWith("```")) {
      continue;
    }

    if (!inTripleFence) {
      if (trimmed === "```") {
        const indentation = lines[index].match(/^\s*/)?.[0] ?? "";
        lines[index] = `${indentation}\`\`\`text`;
      }
      inTripleFence = true;
      continue;
    }

    if (/^```(?:text)?\s*$/.test(trimmed)) {
      const indentation = lines[index].match(/^\s*/)?.[0] ?? "";
      lines[index] = `${indentation}\`\`\``;
    }

    if (trimmed.startsWith("```")) {
      inTripleFence = false;
    }
  }
}

function fixOrderedLists(lines) {
  let inTripleFence = false;
  const counters = new Map();

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const trimmed = line.trimStart();

    if (trimmed.startsWith("```")) {
      inTripleFence = !inTripleFence;
      counters.clear();
      continue;
    }

    if (inTripleFence) {
      continue;
    }

    const orderedMatch = line.match(/^(\s*)(\d+)\.\s+(.*)$/);
    if (!orderedMatch) {
      if (line.trim() === "") {
        const nextNonBlank = lines.slice(index + 1).find((candidate) => candidate.trim() !== "");
        if (!nextNonBlank || !/^(\s*)\d+\.\s+/.test(nextNonBlank)) {
          counters.clear();
        }
      }
      continue;
    }

    const indent = orderedMatch[1].length;
    for (const key of [...counters.keys()]) {
      if (key > indent) {
        counters.delete(key);
      }
    }

    const nextNumber = (counters.get(indent) ?? 0) + 1;
    counters.set(indent, nextNumber);
    lines[index] = `${orderedMatch[1]}${nextNumber}. ${orderedMatch[3]}`;
  }
}

function fixSpecificAuditFile(lines, relativePath) {
  if (relativePath !== "docs/PRD-TRD-STATUS-AUDIT.md") {
    return;
  }

  const content = lines.join("\n")
    .replace("---6/15)", "## 📝 PRDs EN DRAFT (6/15)")
    .replace(
      "| 011 | PRD-011 | Internationalization (i18n) | Futurond Users) | 2.1 | Critical | ❌ No |\n| 011 | PRD-011 | Internationalization (i18n) | Futuro | Medium | ❌ No |\n| 012 | PRD-012 | Auto-Advance Timer | v0.5.0 | Medium | ❌ No |",
      "| 011 | PRD-011 | Internationalization (i18n) | Futuro | Medium | ❌ No |\n| 013 | PRD-013 | Text-to-Speech | v0.6.0 | Medium | ❌ No |\n| 015 | PRD-015 | Visual Testing Playwright | v0.4.0 | Medium | ❌ No |"
    );

  lines.splice(0, lines.length, ...content.split("\n"));
}

async function main() {
  const files = await collectMarkdownFiles(ROOT);

  for (const filePath of files) {
    const relativePath = path.relative(ROOT, filePath).replaceAll(path.sep, "/");
    const original = await fs.readFile(filePath, "utf8");
    const lines = original.replace(/\r\n/g, "\n").split("\n");

    fixBlockquoteSpacing(lines);
    fixHorizontalRules(lines);
    fixStandaloneBoldHeadings(lines, relativePath);
    fixHeadingSpacing(lines, relativePath);
    fixBareCodeFences(lines);
    fixOrderedLists(lines);
    fixSpecificAuditFile(lines, relativePath);

    const updated = `${lines.join("\n").replace(/\n*$/u, "\n")}`;
    if (updated !== original) {
      await fs.writeFile(filePath, updated);
    }
  }
}

await main();