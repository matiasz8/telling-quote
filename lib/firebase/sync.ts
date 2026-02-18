import { Reading } from '@/types';
import { 
  getUserReadings, 
  createReading, 
  updateReading 
} from './firestore';

/**
 * Migrate localStorage data to Firestore
 */
export const migrateLocalStorageToFirestore = async (
  uid: string,
  localReadings: Reading[]
) => {
  try {
    // Upload all readings
    const uploadPromises = localReadings.map(reading => 
      createReading(uid, {
        title: reading.title,
        content: reading.content,
        tags: reading.tags || [],
        createdAt: reading.createdAt || Date.now(),
        updatedAt: reading.updatedAt || Date.now(),
        isCompleted: reading.isCompleted || false,
      })
    );
    
    await Promise.all(uploadPromises);

    // Settings sync would be handled separately through settings sync functions
    // For now, we focus on readings sync

    return { success: true };
  } catch (error) {
    console.error('Migration error:', error);
    throw error;
  }
};

/**
 * Sync offline changes to cloud
 */
export const syncOfflineChanges = async (
  uid: string,
  localReadings: Reading[]
) => {
  try {
    const cloudReadings = await getUserReadings(uid);

    // Find new/updated readings
    for (const reading of localReadings) {
      const cloudReading = cloudReadings.find(r => r.id === reading.id);
      
      // Convert dates to numbers for comparison
      const localUpdatedAt = typeof reading.updatedAt === 'number' 
        ? reading.updatedAt 
        : reading.updatedAt?.getTime() || Date.now();
      
      const cloudUpdatedAt = cloudReading && typeof cloudReading.updatedAt === 'number'
        ? cloudReading.updatedAt
        : cloudReading?.updatedAt instanceof Date 
        ? cloudReading.updatedAt.getTime()
        : 0;

      if (!cloudReading) {
        // New reading
        await createReading(uid, {
          title: reading.title,
          content: reading.content,
          tags: reading.tags || [],
          createdAt: reading.createdAt,
          updatedAt: reading.updatedAt,
          isCompleted: reading.isCompleted,
        });
      } else if (localUpdatedAt > cloudUpdatedAt) {
        // Updated reading
        await updateReading(uid, reading.id, {
          title: reading.title,
          content: reading.content,
          tags: reading.tags,
          updatedAt: reading.updatedAt,
          isCompleted: reading.isCompleted,
        });
      }
    }

    // Settings sync would be handled separately
    // For now, we focus on readings

    return { success: true, syncedAt: Date.now() };
  } catch (error) {
    console.error('Sync error:', error);
    throw error;
  }
};

/**
 * Detect and resolve conflicts (last-write-wins)
 */
export const resolveConflict = (
  localVersion: Reading,
  cloudVersion: Reading
): Reading => {
  // Convert dates to numbers for comparison
  const localUpdatedAt = typeof localVersion.updatedAt === 'number'
    ? localVersion.updatedAt
    : localVersion.updatedAt?.getTime() || 0;
  
  const cloudUpdatedAt = typeof cloudVersion.updatedAt === 'number'
    ? cloudVersion.updatedAt
    : cloudVersion.updatedAt?.getTime() || 0;

  // Use the version with the latest updatedAt
  return localUpdatedAt > cloudUpdatedAt 
    ? localVersion 
    : cloudVersion;
};
