"use client";

import { useState, useEffect, useRef } from "react";
import NewReadingModal from "@/components/NewReadingModal";
import EditTitleModal from "@/components/EditTitleModal";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";
import ConfirmReactivateModal from "@/components/ConfirmReactivateModal";
import MigrationModal from "@/components/MigrationModal";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import ProjectCardV2 from "@/components/dashboard/ProjectCardV2";
import ReadingCardV2 from "@/components/dashboard/ReadingCardV2";
import ProjectDetailView from "@/components/dashboard/ProjectDetailView";
import ReadingDetailView from "@/components/dashboard/ReadingDetailView";
import NewProjectModal from "@/components/dashboard/NewProjectModal";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useSettings } from "@/hooks/useSettings";
import { useAuth } from "@/hooks/useAuth";
import { useReadingSync } from "@/hooks/useReadingSync";
import { Reading, Project } from "@/types";
import { STORAGE_KEYS } from "@/lib/constants";
import {
  EXAMPLE_READING,
  EXAMPLE_READING_ID,
} from "@/lib/constants/exampleReading";
import {
  mergeCloudAndLocalReadings,
  shouldInitializeExampleReading,
  shouldPromptMigration,
} from "@/lib/dashboard/homeLogic";
import { getDashboardTheme } from "@/lib/dashboard/theme";
import {
  getProjectReadingCount,
  getProjectCompletionPercent,
  getAllProjectTags,
} from "@/lib/dashboard/projectHelpers";
import {
  needsMigration,
  getOrphanedReadings,
  assignToDefaultProject,
} from "@/lib/dashboard/migrationHelpers";

const isDev = process.env.NODE_ENV === "development";
const dlog = (...args: unknown[]) => {
  if (isDev) console.log(...args);
};

// Filter type for projects
type ProjectFilter = "all" | "active" | "completed" | "favorites";

// Default project for existing readings (migration)
const DEFAULT_PROJECT: Project = {
  id: "default",
  title: "Mis Lecturas",
  description: "Proyecto por defecto para lecturas existentes",
  tags: [],
};

export default function Home() {
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [isNewReadingModalOpen, setIsNewReadingModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isReactivateModalOpen, setIsReactivateModalOpen] = useState(false);
  const [isMigrationModalOpen, setIsMigrationModalOpen] = useState(false);
  const [migrationReadingCount, setMigrationReadingCount] = useState(0);
  const [editingReading, setEditingReading] = useState<Reading | null>(null);
  const [deletingReading, setDeletingReading] = useState<Reading | null>(null);
  const [reactivatingReading, setReactivatingReading] = useState<Reading | null>(null);

  // Data storage
  const [projects, setProjects] = useLocalStorage<Project[]>(
    "projects",
    []
  );
  const [readings, setReadings] = useLocalStorage<Reading[]>(
    STORAGE_KEYS.READINGS,
    []
  );
  const [completedReadings, setCompletedReadings] = useLocalStorage<string[]>(
    "completedReadings",
    []
  );
  const [favoriteReadings, setFavoriteReadings] = useLocalStorage<string[]>(
    "favoriteReadings",
    []
  );
  const [filter, setFilter] = useLocalStorage<ProjectFilter>(
    "dashboardFilter",
    "all"
  );

  // UI-only state
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedReadingId, setSelectedReadingId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"projects" | "readings">("projects");
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(null);

  const { settings } = useSettings();
  const { user } = useAuth();
  const { syncReading, syncUpdateReading, syncDeleteReading, subscribeReadings } =
    useReadingSync();

  const hasInitializedExample = useRef(false);
  const hasSyncedFromCloud = useRef(false);
  const localReadingsToMigrate = useRef<Reading[]>([]);
  const hasAutoSynced = useRef(false);
  const readingsRef = useRef<Reading[]>(readings);
  const projectsRef = useRef<Project[]>(projects);
  const [mounted, setMounted] = useState(false);

  const dash = getDashboardTheme(settings.theme);

  useEffect(() => {
    setTimeout(() => setMounted(true), 0);
  }, []);

  useEffect(() => {
    readingsRef.current = readings;
    projectsRef.current = projects;
  }, [readings, projects]);

  useEffect(() => {
    hasSyncedFromCloud.current = false;
    hasAutoSynced.current = false;
  }, [user?.uid]);

  // Auto-create default project if none exists on first load
  useEffect(() => {
    if (!mounted || projects.length > 0) return;
    setProjects([DEFAULT_PROJECT]);
  }, [mounted, projects.length, setProjects]);

  // Ensure example reading is assigned to a project
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (hasInitializedExample.current) return;

    const exampleDismissed =
      localStorage.getItem(STORAGE_KEYS.EXAMPLE_DISMISSED) === "true";

    if (shouldInitializeExampleReading({ readings, exampleDismissed })) {
      // Add to default project
      const exampleWithProject = {
        ...EXAMPLE_READING,
        projectId: DEFAULT_PROJECT.id,
      };
      setReadings([exampleWithProject]);
      // Ensure default project exists
      if (!projects.some((p) => p.id === DEFAULT_PROJECT.id)) {
        setProjects((prev) => [DEFAULT_PROJECT, ...prev]);
      }
    }

    hasInitializedExample.current = true;
  }, [readings, projects, setReadings, setProjects]);

  // Auto-migrate orphaned readings (readings without projectId) to default project
  useEffect(() => {
    if (!mounted || readings.length === 0) return;

    // Check if there are any orphaned readings
    if (!needsMigration(readings)) return;

    const orphaned = getOrphanedReadings(readings);
    dlog(`[Migration] Found ${orphaned.length} orphaned reading(s)`);

    // Migrate to default project
    const migratedReadings = assignToDefaultProject(readings, DEFAULT_PROJECT.id);
    setReadings(migratedReadings);

    dlog(`[Migration] Migrated ${orphaned.length} reading(s) to default project`);
  }, [mounted, readings, setReadings]);

  // Check for migration on first user sign-in
  useEffect(() => {
    const hasMigrated = localStorage.getItem("hasMigratedToCloud") === "true";
    const shouldMigrate = shouldPromptMigration({
      mounted,
      hasUser: Boolean(user),
      hasSyncedFromCloud: hasSyncedFromCloud.current,
      readingsLength: readings.length,
      hasMigratedToCloud: hasMigrated,
    });

    if (shouldMigrate) {
      localReadingsToMigrate.current = [...readings];
      setTimeout(() => {
        setMigrationReadingCount(readings.length);
        setIsMigrationModalOpen(true);
      }, 0);
      hasSyncedFromCloud.current = true;
    }
  }, [mounted, user, readings]);

  // Sync with Firestore when user signs in (after migration handled)
  useEffect(() => {
    if (!mounted || !user || isMigrationModalOpen) return;

    const hasMigrated = localStorage.getItem("hasMigratedToCloud") === "true";
    if (!hasMigrated) return;

    const localReadingsSnapshot = [...readingsRef.current];

    const unsubscribe = subscribeReadings((cloudReadings) => {
      if (
        cloudReadings.length === 0 &&
        localReadingsSnapshot.length > 0 &&
        !hasAutoSynced.current
      ) {
        hasAutoSynced.current = true;
        const syncPromises = localReadingsSnapshot.map(async (reading) => {
          try {
            await syncReading(reading);
          } catch (error) {
            console.error("[Firestore sync effect] Error auto-syncing:", error);
          }
        });
        Promise.all(syncPromises).then(() => {
          dlog("[Firestore sync effect] Auto-sync complete");
        });
        return;
      }

      setReadings((currentLocal) =>
        mergeCloudAndLocalReadings(cloudReadings, currentLocal)
      );
    });

    return () => unsubscribe();
  }, [mounted, user, isMigrationModalOpen, subscribeReadings, setReadings, syncReading]);

  const handleMigrateToCloud = async (shouldMigrate: boolean) => {
    if (!user) return;

    if (shouldMigrate) {
      const readingsToSync = localReadingsToMigrate.current;
      for (const reading of readingsToSync) {
        try {
          await syncReading(reading);
        } catch (error) {
          console.error(`Error migrating "${reading.title}":`, error);
        }
      }
    } else {
      setReadings([]);
    }

    localStorage.setItem("hasMigratedToCloud", "true");
    setIsMigrationModalOpen(false);
    setMigrationReadingCount(0);
    localReadingsToMigrate.current = [];
  };

  // Derived data
  const projectTags = getAllProjectTags(projects);
  const displayedProjects = (() => {
    let base = projects;

    // Apply tag filter
    if (activeTag) {
      base = base.filter((p) => p.tags?.includes(activeTag));
    }

    // Apply query filter
    const q = query.trim().toLowerCase();
    if (q) {
      base = base.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Apply status filter
    if (filter === "completed" || filter === "active" || filter === "favorites") {
      base = base.filter((p) => {
        const projectReadings = readings.filter((r) => r.projectId === p.id);
        const completedCount = projectReadings.filter((r) =>
          completedReadings.includes(r.id)
        ).length;
        const isFavorite = favoriteReadings.some((fid) =>
          projectReadings.some((r) => r.id === fid)
        );

        if (filter === "completed") {
          return completedCount === projectReadings.length && projectReadings.length > 0;
        } else if (filter === "active") {
          return completedCount < projectReadings.length;
        } else if (filter === "favorites") {
          return isFavorite;
        }
        return true;
      });
    }

    return base;
  })();

  const selectedProject =
    (selectedProjectId && projects.find((p) => p.id === selectedProjectId)) ||
    null;

  const handleSaveNewProject = (newProject: Project) => {
    setProjects((prev) => [...prev, newProject]);
    setSelectedProjectId(newProject.id);
  };

  const handleSaveNewReading = async (reading: Reading) => {
    // Ensure we have a project selected or use the reading's projectId
    let projectId = reading.projectId; // Use projectId from the reading
    
    // If no projectId in reading, use selected project or default
    if (!projectId) {
      projectId = selectedProject?.id || DEFAULT_PROJECT.id;
    }
    
    const readingWithProject = { ...reading, projectId };
    
    // Ensure project is selected so user can see the reading
    if (!selectedProjectId || selectedProjectId !== projectId) {
      setSelectedProjectId(projectId);
    }

    setReadings((prev) => [...prev, readingWithProject]);

    if (user) {
      try {
        await syncReading(readingWithProject);
      } catch (error) {
        console.error("Error syncing new reading:", error);
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
    if (user) {
      try {
        await syncUpdateReading(editingReading.id, {
          title: newTitle,
          tags: newTags,
        });
      } catch (error) {
        console.error("Error syncing reading update:", error);
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

    if (deletingReading.id === EXAMPLE_READING_ID) {
      localStorage.setItem(STORAGE_KEYS.EXAMPLE_DISMISSED, "true");
    }

    setReadings((prev) => prev.filter((r) => r.id !== deletingReading.id));

    if (user) {
      try {
        await syncDeleteReading(deletingReading.id);
      } catch (error) {
        console.error("Error syncing reading deletion:", error);
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
    setCompletedReadings((prev) =>
      prev.filter((id) => id !== reactivatingReading.id)
    );
    setIsReactivateModalOpen(false);
    setReactivatingReading(null);
  };

  const handleToggleComplete = (reading: Reading) => {
    if (completedReadings.includes(reading.id)) {
      handleReactivate(reading);
    } else {
      setCompletedReadings((prev) => [...prev, reading.id]);
    }
  };

  const handleToggleFavorite = (reading: Reading) => {
    setFavoriteReadings((prev) =>
      prev.includes(reading.id)
        ? prev.filter((id) => id !== reading.id)
        : [...prev, reading.id]
    );
  };

  const filterLabels: Record<ProjectFilter, string> = {
    all: "Todos los proyectos",
    active: "Proyectos activos",
    completed: "Proyectos completados",
    favorites: "Favoritos",
  };

  // Calculate project counts for sidebar
  const allProjectsCount = projects.length;
  const activeProjectsCount = projects.filter((p) => {
    const projectReadings = readings.filter((r) => r.projectId === p.id);
    const completedCount = projectReadings.filter((r) =>
      completedReadings.includes(r.id)
    ).length;
    return completedCount < projectReadings.length && projectReadings.length > 0;
  }).length;
  const completedProjectsCount = projects.filter((p) => {
    const projectReadings = readings.filter((r) => r.projectId === p.id);
    return projectReadings.length > 0 && projectReadings.every((r) =>
      completedReadings.includes(r.id)
    );
  }).length;
  const favoritesProjectsCount = projects.filter((p) => {
    return readings.filter((r) => r.projectId === p.id)
      .some((r) => favoriteReadings.includes(r.id));
  }).length;

  return (
    <div className={`flex h-screen overflow-hidden ${dash.shell}`} suppressHydrationWarning>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:bg-black focus:text-white focus:p-4 focus:rounded-b"
      >
        Skip to main content
      </a>

      <DashboardSidebar
        dash={dash}
        filter={filter}
        onFilterChange={(f) => {
          setFilter(f);
          setSidebarOpen(false);
        }}
        counts={{
          all: allProjectsCount,
          active: activeProjectsCount,
          completed: completedProjectsCount,
          favorites: favoritesProjectsCount,
        }}
        tags={projectTags}
        activeTag={activeTag}
        onTagChange={setActiveTag}
        query={query}
        onQueryChange={setQuery}
        onNewProject={() => setIsNewProjectModalOpen(true)}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main + details */}
      <div className="flex flex-1 overflow-hidden">
        <main
          id="main-content"
          className="flex flex-1 flex-col overflow-hidden"
        >
          {/* Top bar */}
          <div className={`flex items-center gap-3 border-b px-4 sm:px-6 h-16 ${dash.divider}`}>
            <button
              onClick={() => setSidebarOpen(true)}
              className={`rounded-lg p-2 transition-colors lg:hidden ${dash.ghostBtn}`}
              aria-label="Abrir menú"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="min-w-0 flex-1">
              <h1 className={`truncate text-lg font-bold ${dash.textPrimary}`}>
                {viewMode === "readings" && expandedProjectId
                  ? projects.find((p) => p.id === expandedProjectId)?.title || "Proyecto"
                  : filterLabels[filter]}
                {activeTag ? ` · ${activeTag}` : ""}
              </h1>
              <p className={`text-xs ${dash.textMuted}`}>
                {mounted ? (
                  viewMode === "readings" && expandedProjectId
                    ? (() => {
                        const projectReadings = readings.filter((r) => r.projectId === expandedProjectId);
                        return `${projectReadings.length} lectura${projectReadings.length === 1 ? "" : "s"}`;
                      })()
                    : `${displayedProjects.length} proyecto${displayedProjects.length === 1 ? "" : "s"}`
                ) : (
                  "\u00a0"
                )}
              </p>
            </div>
            {viewMode === "readings" && expandedProjectId && (
              <button
                onClick={() => {
                  setViewMode("projects");
                  setExpandedProjectId(null);
                }}
                className={`hidden items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold shadow-sm transition-all sm:flex ${dash.ghostBtn}`}
              >
                ← Volver a Proyectos
              </button>
            )}
            {viewMode === "projects" && (
              <button
                onClick={() => setIsNewProjectModalOpen(true)}
                className={`hidden items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold shadow-sm transition-all sm:flex ${dash.primaryBtn}`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Nuevo proyecto
              </button>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            {viewMode === "readings" && expandedProjectId ? (
              // Grid de Lecturas
              !mounted ? null : (() => {
                const projectReadings = readings.filter((r) => r.projectId === expandedProjectId);
                return projectReadings.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {projectReadings.map((reading) => (
                      <ReadingCardV2
                        key={reading.id}
                        reading={reading}
                        isCompleted={completedReadings.includes(reading.id)}
                        isFavorite={favoriteReadings.includes(reading.id)}
                        dash={dash}
                        onComplete={() => handleToggleComplete(reading)}
                        onFavorite={() => handleToggleFavorite(reading)}
                        onEdit={() => handleEdit(reading)}
                        onDelete={() => handleDelete(reading)}
                        onOpen={() => {
                          window.location.href = `/reader/${reading.id}`;
                        }}
                        onSelect={() => setSelectedReadingId(reading.id)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className={`mb-4 flex h-16 w-16 items-center justify-center rounded-2xl ${dash.chip}`}>
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <p className={`text-lg font-semibold ${dash.textPrimary}`}>
                      Sin lecturas aún
                    </p>
                    <p className={`mt-1 max-w-sm text-sm ${dash.textMuted}`}>
                      Agrega la primera lectura a este proyecto desde el panel.
                    </p>
                  </div>
                );
              })()
            ) : (
              // Grid de Proyectos
              !mounted ? null : displayedProjects.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {displayedProjects.map((project) => (
                    <ProjectCardV2
                      key={project.id}
                      project={project}
                      readingCount={getProjectReadingCount(readings, project.id)}
                      completionPercent={getProjectCompletionPercent(
                        readings,
                        completedReadings,
                        project.id
                      )}
                      dash={dash}
                      isSelected={selectedProjectId === project.id}
                      onSelect={() => setSelectedProjectId(project.id)}
                      onOpen={() => {
                        setViewMode("readings");
                        setExpandedProjectId(project.id);
                      }}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className={`mb-4 flex h-16 w-16 items-center justify-center rounded-2xl ${dash.chip}`}>
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <p className={`text-lg font-semibold ${dash.textPrimary}`}>
                    {query || activeTag
                      ? "Sin resultados"
                      : "Aún no tienes proyectos aquí"}
                  </p>
                  <p className={`mt-1 max-w-sm text-sm ${dash.textMuted}`}>
                    {query || activeTag
                      ? "Prueba con otra búsqueda o quita los filtros."
                      : "Crea tu primer proyecto para empezar a leer de forma cómoda."}
                  </p>
                  <button
                    onClick={() => setIsNewProjectModalOpen(true)}
                    className={`mt-5 flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold shadow-sm transition-all ${dash.primaryBtn}`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Nuevo proyecto
                  </button>
                </div>
              )
            )}
          </div>
        </main>

        {/* Details panel - static on large screens */}
        <div
          className={`hidden w-full lg:w-1/2 xl:w-2/5 shrink-0 border-l lg:block overflow-hidden ${dash.divider} ${dash.sidebar}`}
        >
          {selectedReadingId && expandedProjectId ? (
            (() => {
              const reading = readings.find((r) => r.id === selectedReadingId);
              const project = projects.find((p) => p.id === expandedProjectId);
              return reading && project ? (
                <ReadingDetailView
                  reading={reading}
                  project={project}
                  isCompleted={completedReadings.includes(reading.id)}
                  isFavorite={favoriteReadings.includes(reading.id)}
                  dash={dash}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onToggleFavorite={handleToggleFavorite}
                  onToggleComplete={handleToggleComplete}
                  onClose={() => setSelectedReadingId(null)}
                  onOpen={() => {
                    window.location.href = `/reader/${reading.id}`;
                  }}
                />
              ) : null;
            })()
          ) : selectedProject ? (
            <ProjectDetailView
              project={selectedProject}
              readings={readings.filter((r) => r.projectId === selectedProject.id)}
              completedReadings={completedReadings}
              favoriteReadings={favoriteReadings}
              dash={dash}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggleFavorite={handleToggleFavorite}
              onToggleComplete={handleToggleComplete}
              onNewReading={() => setIsNewReadingModalOpen(true)}
              onClose={() => setSelectedProjectId(null)}
              onOpenProject={() => {
                setViewMode("readings");
                setExpandedProjectId(selectedProject.id);
                setSelectedProjectId(null);
              }}
            />
          ) : (
            <div className={`flex h-full items-center justify-center ${dash.sidebar}`}>
              <p className={`text-center ${dash.textMuted}`}>
                {viewMode === "readings"
                  ? "Selecciona una lectura para ver detalles"
                  : "Selecciona un proyecto para ver detalles"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Details panel - overlay on small screens */}
      {(selectedProject || (selectedReadingId && expandedProjectId)) && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => {
              setSelectedProjectId(null);
              setSelectedReadingId(null);
            }}
            aria-hidden="true"
          />
          <div className={`absolute inset-y-0 right-0 w-full max-w-sm border-l overflow-y-auto ${dash.divider} ${dash.sidebar}`}>
            {selectedReadingId && expandedProjectId ? (
              (() => {
                const reading = readings.find((r) => r.id === selectedReadingId);
                const project = projects.find((p) => p.id === expandedProjectId);
                return reading && project ? (
                  <ReadingDetailView
                    reading={reading}
                    project={project}
                    isCompleted={completedReadings.includes(reading.id)}
                    isFavorite={favoriteReadings.includes(reading.id)}
                    dash={dash}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onToggleFavorite={handleToggleFavorite}
                    onToggleComplete={handleToggleComplete}
                    onClose={() => setSelectedReadingId(null)}
                    onOpen={() => {
                      window.location.href = `/reader/${reading.id}`;
                    }}
                  />
                ) : null;
              })()
            ) : selectedProject ? (
              <ProjectDetailView
                project={selectedProject}
                readings={readings.filter((r) => r.projectId === selectedProject.id)}
                completedReadings={completedReadings}
                favoriteReadings={favoriteReadings}
                dash={dash}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggleFavorite={handleToggleFavorite}
                onToggleComplete={handleToggleComplete}
                onNewReading={() => setIsNewReadingModalOpen(true)}
                onClose={() => setSelectedProjectId(null)}
                onOpenProject={() => {
                  setViewMode("readings");
                  setExpandedProjectId(selectedProject.id);
                  setSelectedProjectId(null);
                }}
              />
            ) : null}
          </div>
        </div>
      )}

      {/* Modals */}
      <NewProjectModal
        isOpen={isNewProjectModalOpen}
        onClose={() => setIsNewProjectModalOpen(false)}
        onSave={handleSaveNewProject}
        dash={dash}
      />
      <NewReadingModal
        isOpen={isNewReadingModalOpen}
        onClose={() => setIsNewReadingModalOpen(false)}
        onSave={handleSaveNewReading}
        projectId={selectedProject?.id}
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
