"use client";

import { useState, useEffect, useRef } from "react";
import Header from "@/components/Header";
import NewReadingModal from "@/components/NewReadingModal";
import EditTitleModal from "@/components/EditTitleModal";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";
import ConfirmReactivateModal from "@/components/ConfirmReactivateModal";
import MigrationModal from "@/components/MigrationModal";
import ReadingCard from "@/components/ReadingCard";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useSettings } from "@/hooks/useSettings";
import { useAuth } from "@/hooks/useAuth";
import { useReadingSync } from "@/hooks/useReadingSync";
import { Reading } from "@/types";
import { STORAGE_KEYS } from "@/lib/constants";
import {
  EXAMPLE_READING,
  EXAMPLE_READING_ID,
} from "@/lib/constants/exampleReading";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isReactivateModalOpen, setIsReactivateModalOpen] = useState(false);
  const [isMigrationModalOpen, setIsMigrationModalOpen] = useState(false);
  const [migrationReadingCount, setMigrationReadingCount] = useState(0);
  const [editingReading, setEditingReading] = useState<Reading | null>(null);
  const [deletingReading, setDeletingReading] = useState<Reading | null>(null);
  const [reactivatingReading, setReactivatingReading] = useState<Reading | null>(null);
  const [readings, setReadings] = useLocalStorage<Reading[]>(
    STORAGE_KEYS.READINGS,
    []
  );
  const [completedReadings, setCompletedReadings] = useLocalStorage<string[]>(
    "completedReadings",
    []
  );
  const [activeTab, setActiveTab] = useLocalStorage<"active" | "completed">(
    "dashboardTab",
    "active"
  );
  const { settings } = useSettings();
  const { user } = useAuth();
  const { syncReading, syncUpdateReading, syncDeleteReading, subscribeReadings } = useReadingSync();
  const hasInitializedExample = useRef(false);
  const hasSyncedFromCloud = useRef(false);
  const localReadingsToMigrate = useRef<Reading[]>([]);
  const hasAutoSynced = useRef(false);
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by only rendering client-side features after mount
  useEffect(() => {
    setTimeout(() => setMounted(true), 0);
  }, []);

  // DEBUG: Log whenever readings change
  useEffect(() => {
    console.log('[DEBUG readings changed] readings.length:', readings.length);
    console.log('[DEBUG readings changed] readings:', readings.map(r => ({ id: r.id, title: r.title })));
  }, [readings]);

  // Check for migration on first user sign-in
  useEffect(() => {
    console.log('[Migration check effect] mounted:', mounted, 'user:', !!user, 'hasSyncedFromCloud:', hasSyncedFromCloud.current);
    if (!mounted || !user || hasSyncedFromCloud.current) return;

    const hasLocalReadings = readings.length > 0;
    const hasMigrated = localStorage.getItem('hasMigratedToCloud') === 'true';
    console.log('[Migration check effect] hasLocalReadings:', hasLocalReadings, 'readings.length:', readings.length);
    console.log('[Migration check effect] hasMigrated:', hasMigrated);

    if (hasLocalReadings && !hasMigrated) {
      // Save local readings before they get overwritten
      localReadingsToMigrate.current = [...readings];
      console.log('[Migration check effect] Saved', readings.length, 'readings to migrate');
      setTimeout(() => {
        setMigrationReadingCount(readings.length);
        setIsMigrationModalOpen(true);
        console.log('[Migration check effect] Showing migration modal');
      }, 0);
      hasSyncedFromCloud.current = true; // Prevent re-triggering
    } else {
      console.log('[Migration check effect] No migration needed');
    }
  }, [mounted, user, readings]);

  // Auto-create example reading on first load
  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return;

    // Only run once, even if readings changes
    if (hasInitializedExample.current) return;

    // Check if readings is empty and example hasn't been dismissed
    const hasReadings = readings.length > 0;
    const exampleDismissed =
      localStorage.getItem(STORAGE_KEYS.EXAMPLE_DISMISSED) === "true";

    if (!hasReadings && !exampleDismissed) {
      // Check if example already exists (shouldn't happen, but safety check)
      const exampleExists = readings.some((r) => r.id === EXAMPLE_READING_ID);
      if (!exampleExists) {
        setReadings([EXAMPLE_READING]);
      }
    }

    hasInitializedExample.current = true;
  }, [readings, setReadings]);

  // Sync with Firestore when user signs in (after migration handled)
  useEffect(() => {
    console.log('[Firestore sync effect] mounted:', mounted, 'user:', !!user, 'isMigrationModalOpen:', isMigrationModalOpen);
    if (!mounted || !user || isMigrationModalOpen) {
      console.log('[Firestore sync effect] SKIPPING - conditions not met');
      return;
    }

    const hasMigrated = localStorage.getItem('hasMigratedToCloud') === 'true';
    console.log('[Firestore sync effect] hasMigrated:', hasMigrated);
    if (!hasMigrated) {
      console.log('[Firestore sync effect] SKIPPING - not migrated yet');
      return; // Wait for migration to complete
    }

    // Subscribe to real-time updates only after migration completes
    console.log('[Firestore sync effect] SUBSCRIBING to Firestore...');
    const unsubscribe = subscribeReadings((cloudReadings) => {
      console.log('[Firestore sync effect] Received cloudReadings:', cloudReadings.length, 'readings');
      console.log('[Firestore sync effect] Current local readings:', readings.length);
      console.log('[Firestore sync effect] hasAutoSynced.current:', hasAutoSynced.current);
      
      // If Firestore is empty but we have local readings, sync them automatically (once)
      if (cloudReadings.length === 0 && readings.length > 0 && !hasAutoSynced.current) {
        console.log('[Firestore sync effect] Firestore is empty but we have', readings.length, 'local readings - syncing them now');
        hasAutoSynced.current = true;
        
        // Sync local readings to Firestore
        const syncPromises = readings.map(async (reading) => {
          try {
            await syncReading(reading);
            console.log('[Firestore sync effect] Auto-synced:', reading.title);
          } catch (error) {
            console.error('[Firestore sync effect] Error auto-syncing:', error);
          }
        });
        
        Promise.all(syncPromises).then(() => {
          console.log('[Firestore sync effect] Auto-sync complete');
        });
        
        // Don't overwrite local readings with empty array - wait for Firestore to return synced data
        return;
      }
      
      setReadings(cloudReadings);
    });

    return () => {
      console.log('[Firestore sync effect] CLEANUP - unsubscribing');
      unsubscribe();
    };
  }, [mounted, user, isMigrationModalOpen, subscribeReadings, setReadings, readings, syncReading]);

  const handleMigrateToCloud = async (shouldMigrate: boolean) => {
    console.log('[handleMigrateToCloud] shouldMigrate:', shouldMigrate);
    console.log('[handleMigrateToCloud] user:', !!user);
    console.log('[handleMigrateToCloud] current readings.length:', readings.length);
    console.log('[handleMigrateToCloud] localReadingsToMigrate.length:', localReadingsToMigrate.current.length);
    
    if (!user) return;

    if (shouldMigrate) {
      // Use saved local readings, not current state (which might have been overwritten)
      const readingsToSync = localReadingsToMigrate.current;
      
      console.log(`[handleMigrateToCloud] Migrating ${readingsToSync.length} readings to Firestore...`);
      
      // Sync all local readings to Firestore
      for (const reading of readingsToSync) {
        try {
          await syncReading(reading);
          console.log(`[handleMigrateToCloud] ✓ Migrated: ${reading.title}`);
        } catch (error) {
          console.error(`[handleMigrateToCloud] ✗ Error migrating "${reading.title}":`, error);
        }
      }
      
      console.log('[handleMigrateToCloud] Migration complete!');
    } else {
      console.log('[handleMigrateToCloud] User chose to start fresh, skipping migration');
      // Clear local readings if user wants to start fresh
      setReadings([]);
    }

    // Mark as migrated to prevent showing modal again
    console.log('[handleMigrateToCloud] Setting hasMigratedToCloud = true');
    localStorage.setItem('hasMigratedToCloud', 'true');
    console.log('[handleMigrateToCloud] Closing migration modal');
    setIsMigrationModalOpen(false);
    setMigrationReadingCount(0);
    console.log('[handleMigrateToCloud] DONE - readings.length now:', readings.length);
    
    // Clear the saved readings
    localReadingsToMigrate.current = [];
  };

  // Filter readings based on active tab
  const activeReadings = readings.filter(
    (r) => !completedReadings.includes(r.id)
  );
  const completedReadingsList = readings.filter((r) =>
    completedReadings.includes(r.id)
  );
  const displayedReadings =
    activeTab === "active" ? activeReadings : completedReadingsList;

  const handleSave = async (reading: Reading) => {
    console.log(`[page.tsx handleSave] CALLED with reading:`, reading.id, reading.title);
    console.log(`[page.tsx handleSave] Stack trace:`, new Error().stack);
    setReadings((prev) => {
      console.log(`[page.tsx handleSave] setReadings: prev.length =`, prev.length);
      const newReadings = [...prev, reading];
      console.log(`[page.tsx handleSave] setReadings: new.length =`, newReadings.length);
      return newReadings;
    });
    
    // Sync to Firestore if user is signed in
    if (user) {
      try {
        console.log(`[page.tsx handleSave] Syncing to Firestore...`);
        await syncReading(reading);
        console.log(`[page.tsx handleSave] Sync complete`);
      } catch (error) {
        console.error('Error syncing new reading:', error);
      }
    }
  };

  const handleEdit = (reading: Reading) => {
    setEditingReading(reading);
    setIsEditModalOpen(true);
  };

  const handleEditSave = async (newTitle: string, newTags: string[] = []) => {
    if (!editingReading) return;
    setReadings((prev) =>
      prev.map((r) =>
        r.id === editingReading.id
          ? { ...r, title: newTitle, tags: newTags }
          : r
      )
    );
    
    // Sync update to Firestore
    if (user) {
      try {
        await syncUpdateReading(editingReading.id, { title: newTitle, tags: newTags });
      } catch (error) {
        console.error('Error syncing reading update:', error);
      }
    }
    
    setIsEditModalOpen(false);
    setEditingReading(null);
  };

  const handleDelete = (reading: Reading) => {
    setDeletingReading(reading);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingReading) return;

    // If deleting the example reading, mark it as dismissed
    if (deletingReading.id === EXAMPLE_READING_ID) {
      localStorage.setItem(STORAGE_KEYS.EXAMPLE_DISMISSED, "true");
    }

    setReadings((prev) => prev.filter((r) => r.id !== deletingReading.id));
    
    // Sync deletion to Firestore
    if (user) {
      try {
        await syncDeleteReading(deletingReading.id);
      } catch (error) {
        console.error('Error syncing reading deletion:', error);
      }
    }
    
    setIsDeleteModalOpen(false);
    setDeletingReading(null);
  };

  const handleReactivate = (reading: Reading) => {
    setReactivatingReading(reading);
    setIsReactivateModalOpen(true);
  };

  const handleReactivateConfirm = () => {
    if (!reactivatingReading) return;

    // Remove from completedReadings array
    setCompletedReadings((prev) => 
      prev.filter((id) => id !== reactivatingReading.id)
    );
    
    setIsReactivateModalOpen(false);
    setReactivatingReading(null);
  };

  const isDark = settings.theme === "dark";
  const isDetox = settings.theme === "detox";
  const isHighContrast = settings.theme === "high-contrast";

  return (
    <div
      suppressHydrationWarning
      className={`min-h-screen ${
        isHighContrast
          ? "bg-black text-white"
          : isDetox
          ? "bg-white text-gray-900"
          : isDark
          ? "bg-linear-to-br from-purple-900 via-gray-900 to-black"
          : "bg-linear-to-br from-yellow-50 via-lime-100 to-emerald-50"
      }`}
    >
      {/* Skip link for keyboard navigation */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:bg-black focus:text-white focus:p-4 focus:rounded-b"
      >
        Skip to main content
      </a>

      <Header />
      <main id="main-content" className="container mx-auto px-4 py-8">
        <div className="flex justify-center mb-8">
          <button
            onClick={() => setIsModalOpen(true)}
            data-tour="new-reading-button"
            className={`
              group relative px-8 py-4 rounded-xl font-semibold text-lg
              transform transition-all duration-300 ease-out
              ${
                isHighContrast
                  ? "bg-white text-black border-2 border-white hover:bg-gray-200 shadow-lg shadow-gray-900/50 hover:shadow-xl hover:shadow-gray-900/70"
                  : isDetox
                  ? "bg-gray-900 text-white border-2 border-gray-900 hover:bg-gray-800 shadow-lg shadow-gray-500/50 hover:shadow-xl hover:shadow-gray-500/70"
                  : "hover:scale-105 active:scale-95"
              }
              ${
                isDark
                  ? "bg-linear-to-r from-purple-600 via-violet-600 to-fuchsia-600 text-white shadow-lg shadow-purple-500/50 hover:shadow-xl hover:shadow-purple-500/70"
                  : !isDetox && !isHighContrast
                  ? "bg-linear-to-r from-lime-500 via-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/50 hover:shadow-xl hover:shadow-emerald-500/70"
                  : ""
              }
            `}
          >
            <span className="relative z-10 flex items-center gap-2">
              <svg
                className="w-5 h-5 transform group-hover:rotate-12 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              New Reading
            </span>
            <div
              className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                isDark
                  ? "bg-linear-to-r from-purple-400 via-violet-400 to-fuchsia-400"
                  : "bg-linear-to-r from-lime-400 via-emerald-400 to-teal-400"
              } blur-xl -z-10`}
            ></div>
          </button>
        </div>

        {/* Tabs */}
        {mounted && readings.length > 0 && (
          <div className="mb-6">
            <div className="flex gap-2 justify-center border-b border-gray-300 dark:border-gray-700">
              <button
                onClick={() => setActiveTab("active")}
                className={`
                  relative px-6 py-3 font-semibold text-base transition-all duration-200
                  ${
                    activeTab === "active"
                      ? isHighContrast
                        ? "text-white"
                        : isDetox
                        ? "text-gray-900"
                        : isDark
                        ? "text-purple-400"
                        : "text-lime-600"
                      : isHighContrast
                      ? "text-gray-400 hover:text-white"
                      : isDetox
                      ? "text-gray-500 hover:text-gray-700"
                      : isDark
                      ? "text-gray-400 hover:text-gray-300"
                      : "text-gray-500 hover:text-gray-700"
                  }
                `}
              >
                <span className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                  Active
                  <span
                    className={`
                    ml-1 px-2 py-0.5 rounded-full text-xs font-bold
                    ${
                      activeTab === "active"
                        ? isHighContrast
                          ? "bg-white text-black"
                          : isDetox
                          ? "bg-gray-200 text-gray-900"
                          : isDark
                          ? "bg-purple-500/20 text-purple-300"
                          : "bg-lime-500/20 text-lime-700"
                        : isHighContrast
                        ? "bg-gray-700 text-gray-300"
                        : "bg-gray-500/20 text-gray-500"
                    }
                  `}
                  >
                    {activeReadings.length}
                  </span>
                </span>
                {activeTab === "active" && (
                  <div
                    className={`absolute bottom-0 left-0 right-0 h-0.5 ${
                      isHighContrast
                        ? "bg-white"
                        : isDetox
                        ? "bg-gray-900"
                        : isDark
                        ? "bg-purple-500"
                        : "bg-lime-500"
                    }`}
                  />
                )}
              </button>

              <button
                onClick={() => setActiveTab("completed")}
                className={`
                  relative px-6 py-3 font-semibold text-base transition-all duration-200
                  ${
                    activeTab === "completed"
                      ? isHighContrast
                        ? "text-white"
                        : isDetox
                        ? "text-gray-900"
                        : isDark
                        ? "text-purple-400"
                        : "text-lime-600"
                      : isHighContrast
                      ? "text-gray-400 hover:text-white"
                      : isDetox
                      ? "text-gray-500 hover:text-gray-700"
                      : isDark
                      ? "text-gray-400 hover:text-gray-300"
                      : "text-gray-500 hover:text-gray-700"
                  }
                `}
              >
                <span className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Completed
                  <span
                    className={`
                    ml-1 px-2 py-0.5 rounded-full text-xs font-bold
                    ${
                      activeTab === "completed"
                        ? isHighContrast
                          ? "bg-white text-black"
                          : isDetox
                          ? "bg-gray-200 text-gray-900"
                          : isDark
                          ? "bg-purple-500/20 text-purple-300"
                          : "bg-lime-500/20 text-lime-700"
                        : isHighContrast
                        ? "bg-gray-700 text-gray-300"
                        : "bg-gray-500/20 text-gray-500"
                    }
                  `}
                  >
                    {completedReadingsList.length}
                  </span>
                </span>
                {activeTab === "completed" && (
                  <div
                    className={`absolute bottom-0 left-0 right-0 h-0.5 ${
                      isHighContrast
                        ? "bg-white"
                        : isDetox
                        ? "bg-gray-900"
                        : isDark
                        ? "bg-purple-500"
                        : "bg-lime-500"
                    }`}
                  />
                )}
              </button>
            </div>
          </div>
        )}

        {/* Reading Cards */}
        {mounted && readings.length > 0 && displayedReadings.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
            {displayedReadings.map((reading) => (
              <ReadingCard
                key={reading.id}
                reading={reading}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onReactivate={handleReactivate}
                isDark={settings.theme === "dark"}
                isDetox={settings.theme === "detox"}
                isHighContrast={settings.theme === "high-contrast"}
                isCompleted={completedReadings.includes(reading.id)}
                isExample={reading.id === EXAMPLE_READING_ID}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {mounted && readings.length > 0 && displayedReadings.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div
              className={`text-center ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}
            >
              <svg
                className="w-16 h-16 mx-auto mb-4 opacity-50"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {activeTab === "active" ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                )}
              </svg>
              <p className="text-lg font-medium mb-2">
                {activeTab === "active"
                  ? "All readings completed!"
                  : "No completed readings yet"}
              </p>
              <p className="text-sm">
                {activeTab === "active"
                  ? "Create a new reading to get started."
                  : "Finish a reading to see it here."}
              </p>
            </div>
          </div>
        )}
      </main>
      <NewReadingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />
      {editingReading && (
        <EditTitleModal
          key={editingReading.id}
          isOpen={isEditModalOpen}
          currentTitle={editingReading.title}
          currentTags={editingReading.tags}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingReading(null);
          }}
          onSave={handleEditSave}
        />
      )}
      {deletingReading && (
        <ConfirmDeleteModal
          isOpen={isDeleteModalOpen}
          title={deletingReading.title}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setDeletingReading(null);
          }}
          onConfirm={handleDeleteConfirm}
        />
      )}
      {reactivatingReading && (
        <ConfirmReactivateModal
          isOpen={isReactivateModalOpen}
          title={reactivatingReading.title}
          onClose={() => {
            setIsReactivateModalOpen(false);
            setReactivatingReading(null);
          }}
          onConfirm={handleReactivateConfirm}
        />
      )}
      
      <MigrationModal
        isOpen={isMigrationModalOpen}
        onConfirm={handleMigrateToCloud}
        readingCount={migrationReadingCount}
      />
    </div>
  );
}
