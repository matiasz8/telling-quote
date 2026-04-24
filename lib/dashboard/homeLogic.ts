import { Reading } from '@/types';
import { EXAMPLE_READING_ID } from '@/lib/constants/exampleReading';

export function shouldPromptMigration(params: {
  mounted: boolean;
  hasUser: boolean;
  hasSyncedFromCloud: boolean;
  readingsLength: number;
  hasMigratedToCloud: boolean;
}) {
  const { mounted, hasUser, hasSyncedFromCloud, readingsLength, hasMigratedToCloud } = params;

  if (!mounted || !hasUser || hasSyncedFromCloud) {
    return false;
  }

  return readingsLength > 0 && !hasMigratedToCloud;
}

export function shouldInitializeExampleReading(params: {
  readings: Reading[];
  exampleDismissed: boolean;
}) {
  const { readings, exampleDismissed } = params;

  if (readings.length > 0 || exampleDismissed) {
    return false;
  }

  return !readings.some((reading) => reading.id === EXAMPLE_READING_ID);
}

export function mergeCloudAndLocalReadings(
  cloudReadings: Reading[],
  currentLocalReadings: Reading[]
): Reading[] {
  const cloudIds = new Set(cloudReadings.map((reading) => reading.id));
  const localOnlyReadings = currentLocalReadings.filter((reading) => !cloudIds.has(reading.id));
  return [...cloudReadings, ...localOnlyReadings];
}

export function getDashboardReadings(params: {
  readings: Reading[];
  completedReadingIds: string[];
  activeTab: 'active' | 'completed';
}) {
  const { readings, completedReadingIds, activeTab } = params;

  const activeReadings = readings.filter((reading) => !completedReadingIds.includes(reading.id));
  const completedReadingsList = readings.filter((reading) => completedReadingIds.includes(reading.id));

  return {
    activeReadings,
    completedReadingsList,
    displayedReadings: activeTab === 'active' ? activeReadings : completedReadingsList,
  };
}
