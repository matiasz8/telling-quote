import { Reading, Project } from "@/types";

/**
 * Checks if migration is needed (orphaned readings without projectId).
 */
export function needsMigration(readings: Reading[]): boolean {
  return readings.some((r) => !r.projectId);
}

/**
 * Gets all readings that don't have a projectId.
 */
export function getOrphanedReadings(readings: Reading[]): Reading[] {
  return readings.filter((r) => !r.projectId);
}

/**
 * Assigns all orphaned readings to the default project.
 */
export function assignToDefaultProject(
  readings: Reading[],
  defaultProjectId: string
): Reading[] {
  return readings.map((r) =>
    !r.projectId ? { ...r, projectId: defaultProjectId } : r
  );
}

/**
 * Groups orphaned readings by primary tag and creates projects for them.
 * Falls back to default project if no tags.
 */
export function groupReadingsByTag(
  readings: Reading[],
  existingProjects: Project[],
  defaultProjectId: string
): { projects: Project[]; readings: Reading[] } {
  const orphaned = getOrphanedReadings(readings);

  if (orphaned.length === 0) {
    return { projects: existingProjects, readings };
  }

  // Extract unique primary tags from orphaned readings
  const tagMap = new Map<string, string>(); // tag -> projectId
  const newProjects: Project[] = [];

  orphaned.forEach((reading) => {
    const primaryTag = reading.tags?.[0];

    if (primaryTag && !tagMap.has(primaryTag)) {
      // Check if a project with this tag already exists
      const existingProject = existingProjects.find((p) =>
        p.tags?.some((t) => t.toLowerCase() === primaryTag.toLowerCase())
      );

      if (existingProject) {
        tagMap.set(primaryTag, existingProject.id);
      } else {
        // Create new project for this tag
        const projectId = `project-${primaryTag
          .toLowerCase()
          .replace(/\s+/g, "-")}`;
        tagMap.set(primaryTag, projectId);
        newProjects.push({
          id: projectId,
          title: primaryTag,
          description: `Tema: ${primaryTag}`,
          tags: [primaryTag],
        });
      }
    }
  });

  // Assign readings to tag-based projects or default
  const migratedReadings = readings.map((r) => {
    if (r.projectId) return r; // Already assigned

    const primaryTag = r.tags?.[0];
    const projectId = primaryTag
      ? tagMap.get(primaryTag) || defaultProjectId
      : defaultProjectId;

    return { ...r, projectId };
  });

  return {
    projects: [...existingProjects, ...newProjects],
    readings: migratedReadings,
  };
}

/**
 * Validates data before migration.
 */
export function validateBeforeMigration(readings: Reading[]) {
  return {
    totalReadings: readings.length,
    orphaned: getOrphanedReadings(readings).length,
    alreadyMigrated: readings.filter((r) => r.projectId).length,
    missingFields: readings.filter((r) => !r.title || !r.content),
  };
}

/**
 * Validates data after migration.
 */
export function validateAfterMigration(
  readings: Reading[],
  beforeValidation: ReturnType<typeof validateBeforeMigration>
) {
  const afterValidation = validateBeforeMigration(readings);
  return {
    ...afterValidation,
    allMigrated: readings.every((r) => r.projectId),
    dataLoss: readings.length < beforeValidation.totalReadings,
    orphanedResolved:
      beforeValidation.orphaned > 0 && afterValidation.orphaned === 0,
  };
}

/**
 * Creates a backup of data before migration.
 */
export function backupBeforeMigration() {
  const backup = {
    timestamp: new Date().toISOString(),
    readings: localStorage.getItem("readings"),
    projects: localStorage.getItem("projects"),
  };
  localStorage.setItem("backup_pre_migration", JSON.stringify(backup));
  return backup;
}

/**
 * Restores data from migration backup.
 */
export function restoreFromBackup(): boolean {
  const backup = localStorage.getItem("backup_pre_migration");
  if (!backup) return false;

  try {
    const parsed = JSON.parse(backup);
    if (parsed.readings) localStorage.setItem("readings", parsed.readings);
    if (parsed.projects) localStorage.setItem("projects", parsed.projects);
    return true;
  } catch (error) {
    console.error("Failed to restore from backup:", error);
    return false;
  }
}

/**
 * Gets migration statistics for debugging/logging.
 */
export function getMigrationStats(
  beforeValidation: ReturnType<typeof validateBeforeMigration>,
  afterValidation: ReturnType<typeof validateAfterMigration>
) {
  return {
    timestamp: new Date().toISOString(),
    before: beforeValidation,
    after: afterValidation,
    readingsMigrated: beforeValidation.orphaned,
    successRate:
      beforeValidation.orphaned > 0
        ? Math.round(
            ((beforeValidation.orphaned - afterValidation.orphaned) /
              beforeValidation.orphaned) *
              100
          )
        : 100,
    status:
      afterValidation.orphanedResolved && !afterValidation.dataLoss
        ? "success"
        : "partial",
  };
}
