import { Reading } from "@/types";

const WORDS_PER_MINUTE = 200;

/**
 * Removes common markdown syntax so we can show a clean plain-text excerpt.
 */
export function stripMarkdown(content: string): string {
  return content
    .replace(/```[\s\S]*?```/g, " ") // fenced code blocks
    .replace(/`[^`]*`/g, " ") // inline code
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ") // images
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // links -> text
    .replace(/^#{1,6}\s+/gm, "") // headings
    .replace(/^\s*[-*+]\s+/gm, "") // list bullets
    .replace(/^\s*>\s?/gm, "") // blockquotes
    .replace(/[*_~#>]/g, "") // leftover emphasis marks
    .replace(/\s+/g, " ")
    .trim();
}

export function getExcerpt(content: string, maxLength = 160): string {
  const text = stripMarkdown(content);
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trimEnd()}…`;
}

export function getWordCount(content: string): number {
  const text = stripMarkdown(content);
  if (!text) return 0;
  return text.split(/\s+/).filter(Boolean).length;
}

export function getReadingTimeMinutes(content: string): number {
  const words = getWordCount(content);
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

export type ProjectFilter = "all" | "active" | "completed" | "favorites";

export function filterProjects(params: {
  readings: Reading[];
  completedIds: string[];
  favoriteIds: string[];
  filter: ProjectFilter;
  activeTag: string | null;
  query: string;
}): Reading[] {
  const { readings, completedIds, favoriteIds, filter, activeTag, query } =
    params;

  let base = readings;
  if (filter === "active") {
    base = readings.filter((r) => !completedIds.includes(r.id));
  } else if (filter === "completed") {
    base = readings.filter((r) => completedIds.includes(r.id));
  } else if (filter === "favorites") {
    base = readings.filter((r) => favoriteIds.includes(r.id));
  }

  if (activeTag) {
    base = base.filter((r) => r.tags?.includes(activeTag));
  }

  const q = query.trim().toLowerCase();
  if (q) {
    base = base.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.content.toLowerCase().includes(q) ||
        r.tags?.some((t) => t.toLowerCase().includes(q))
    );
  }

  return base;
}

export function getAllTags(readings: Reading[]): string[] {
  const set = new Set<string>();
  readings.forEach((r) => r.tags?.forEach((t) => set.add(t)));
  return Array.from(set).sort();
}
