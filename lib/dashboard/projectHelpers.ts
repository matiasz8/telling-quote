import { Reading, Project } from "@/types";

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

/**
 * Get all readings for a specific project.
 */
export function getProjectReadings(
  readings: Reading[],
  projectId: string
): Reading[] {
  return readings.filter((r) => r.projectId === projectId);
}

/**
 * Get reading count for a project.
 */
export function getProjectReadingCount(
  readings: Reading[],
  projectId: string
): number {
  return getProjectReadings(readings, projectId).length;
}

/**
 * Get completed reading count for a project.
 */
export function getProjectCompletedCount(
  readings: Reading[],
  completedIds: string[],
  projectId: string
): number {
  const projectReadings = getProjectReadings(readings, projectId);
  return projectReadings.filter((r) => completedIds.includes(r.id)).length;
}

/**
 * Get completion percentage for a project.
 */
export function getProjectCompletionPercent(
  readings: Reading[],
  completedIds: string[],
  projectId: string
): number {
  const total = getProjectReadingCount(readings, projectId);
  if (total === 0) return 0;
  const completed = getProjectCompletedCount(readings, completedIds, projectId);
  return Math.round((completed / total) * 100);
}

/**
 * Get all unique tags across a project's readings.
 */
export function getProjectTags(
  readings: Reading[],
  projectId: string
): string[] {
  const tags = new Set<string>();
  getProjectReadings(readings, projectId).forEach((r) =>
    r.tags?.forEach((t) => tags.add(t))
  );
  return Array.from(tags).sort();
}

/**
 * Filter readings within a project by query, tag, and completion status.
 */
export function filterProjectReadings(params: {
  readings: Reading[];
  completedIds: string[];
  favoriteIds: string[];
  projectId: string;
  status: "all" | "active" | "completed" | "favorites";
  activeTag: string | null;
  query: string;
}): Reading[] {
  const {
    readings,
    completedIds,
    favoriteIds,
    projectId,
    status,
    activeTag,
    query,
  } = params;

  let filtered = getProjectReadings(readings, projectId);

  // Filter by status
  if (status === "active") {
    filtered = filtered.filter((r) => !completedIds.includes(r.id));
  } else if (status === "completed") {
    filtered = filtered.filter((r) => completedIds.includes(r.id));
  } else if (status === "favorites") {
    filtered = filtered.filter((r) => favoriteIds.includes(r.id));
  }

  // Filter by tag
  if (activeTag) {
    filtered = filtered.filter((r) => r.tags?.includes(activeTag));
  }

  // Filter by query
  const q = query.trim().toLowerCase();
  if (q) {
    filtered = filtered.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.content.toLowerCase().includes(q) ||
        r.tags?.some((t) => t.toLowerCase().includes(q))
    );
  }

  return filtered;
}

/**
 * Filter projects by query and tag.
 */
export function filterProjectsList(params: {
  projects: Project[];
  query: string;
  activeTag: string | null;
}): Project[] {
  const { projects, query, activeTag } = params;

  let filtered = projects;

  // Filter by tag
  if (activeTag) {
    filtered = filtered.filter((p) => p.tags?.includes(activeTag));
  }

  // Filter by query
  const q = query.trim().toLowerCase();
  if (q) {
    filtered = filtered.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags?.some((t) => t.toLowerCase().includes(q))
    );
  }

  return filtered;
}

/**
 * Get all unique tags from all projects.
 */
export function getAllProjectTags(projects: Project[]): string[] {
  const tags = new Set<string>();
  projects.forEach((p) => p.tags?.forEach((t) => tags.add(t)));
  return Array.from(tags).sort();
}

/**
 * Cleans up orphaned IDs that no longer exist in readings.
 */
export function cleanOrphanedIds(
  ids: string[],
  readings: Reading[]
): string[] {
  const readingIds = new Set(readings.map((r) => r.id));
  return ids.filter((id) => readingIds.has(id));
}
