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
  const { syncReading, syncUpdateReading, syncDeleteReading, subscribeReadings, fetchReadings } = useReadingSync();
  const hasInitializedExample = useRef(false);
  const hasSyncedFromCloud = useRef(false);

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

  // Sync with Firestore when user signs in
  useEffect(() => {
    if (!user) {
      hasSyncedFromCloud.current = false;
      return;
    }

    // Check if we should show migration modal
    const hasLocalReadings = readings.length > 0;
    const hasMigrated = localStorage.getItem('hasMigratedToCloud') === 'true';

    if (hasLocalReadings && !hasMigrated && !hasSyncedFromCloud.current) {
      setTimeout(() => setIsMigrationModalOpen(true), 0);
      return;
    }

    // Load readings from Firestore if not migrated
    if (!hasSyncedFromCloud.current) {
      fetchReadings().then((cloudReadings) => {
        if (cloudReadings.length > 0) {
          setReadings(cloudReadings);
        }
        hasSyncedFromCloud.current = true;
      });
    }

    // Subscribe to real-time updates
    const unsubscribe = subscribeReadings((cloudReadings) => {
      setReadings(cloudReadings);
    });

    return () => unsubscribe();
  }, [user, readings.length, fetchReadings, subscribeReadings, setReadings]);

  const handleMigrateToCloud = async (shouldMigrate: boolean) => {
    if (!user) return;

    if (shouldMigrate) {
      // Sync all local readings to Firestore
      for (const reading of readings) {
        try {
          await syncReading(reading);
        } catch (error) {
          console.error('Error migrating reading:', error);
        }
      }
    }

    // Mark as migrated to prevent showing modal again
    localStorage.setItem('hasMigratedToCloud', 'true');
    setIsMigrationModalOpen(false);
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
    setReadings((prev) => [...prev, reading]);
    
    // Sync to Firestore if user is signed in
    if (user) {
      try {
        await syncReading(reading);
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
        {readings.length > 0 && (
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
        {readings.length > 0 && displayedReadings.length > 0 && (
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
        {readings.length > 0 && displayedReadings.length === 0 && (
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
        readingCount={readings.length}
      />
    </div>
  );
}
