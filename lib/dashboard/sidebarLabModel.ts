import { Reading } from "@/types";

export type SidebarNavItem = {
  id: string;
  label: string;
  count?: number;
};

export type SidebarTagItem = {
  id: string;
  label: string;
  count: number;
};

export type SidebarSavedView = {
  id: string;
  label: string;
  helper: string;
};

export type SidebarLabModel = {
  nav: SidebarNavItem[];
  tags: SidebarTagItem[];
  savedViews: SidebarSavedView[];
  activeReadings: Reading[];
  completedReadings: Reading[];
};

function normalizeTag(tag: string): string {
  return tag.trim().toLowerCase();
}

export function buildSidebarLabModel(
  readings: Reading[],
  completedReadingIds: string[]
): SidebarLabModel {
  const completedSet = new Set(completedReadingIds);
  const activeReadings = readings.filter((reading) => !completedSet.has(reading.id));
  const completedReadings = readings.filter((reading) => completedSet.has(reading.id));

  const tagCounter = new Map<string, { label: string; count: number }>();
  for (const reading of readings) {
    const tags = reading.tags ?? [];
    for (const tag of tags) {
      const key = normalizeTag(tag);
      if (!key) continue;
      const current = tagCounter.get(key);
      if (current) {
        current.count += 1;
      } else {
        tagCounter.set(key, { label: tag, count: 1 });
      }
    }
  }

  const tags = [...tagCounter.entries()]
    .map(([id, item]) => ({ id: `tag:${id}`, label: item.label, count: item.count }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));

  return {
    nav: [
      { id: "home", label: "Home", count: readings.length },
      { id: "active", label: "Active", count: activeReadings.length },
      { id: "completed", label: "Completed", count: completedReadings.length },
      { id: "tags", label: "Tags", count: tags.length },
      { id: "settings", label: "Settings" },
    ],
    tags,
    savedViews: [
      { id: "view:today", label: "Today Focus", helper: "Short list for quick sessions" },
      { id: "view:revisit", label: "Revisit Queue", helper: "Completed items worth revisiting" },
      { id: "view:longform", label: "Longform Deep Work", helper: "Readings with larger content" },
    ],
    activeReadings,
    completedReadings,
  };
}
