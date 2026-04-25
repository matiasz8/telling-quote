"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import ReadingCard from "@/components/ReadingCard";
import SidebarLab from "@/components/sidebar-lab/SidebarLab";
import SidebarDrawer from "@/components/sidebar-lab/SidebarDrawer";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useSettings } from "@/hooks/useSettings";
import { STORAGE_KEYS } from "@/lib/constants";
import { buildSidebarLabModel } from "@/lib/dashboard/sidebarLabModel";
import { Reading } from "@/types";

type ViewMode = "dense" | "minimal";

export default function SidebarLabPage() {
  const [readings] = useLocalStorage<Reading[]>(STORAGE_KEYS.READINGS, []);
  const [completedReadings] = useLocalStorage<string[]>("completedReadings", []);
  const [selectedId, setSelectedId] = useState<string>("home");
  const [search, setSearch] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("dense");
  const { settings } = useSettings();

  const model = useMemo(
    () => buildSidebarLabModel(readings, completedReadings),
    [readings, completedReadings]
  );

  const isDark = settings.theme === "dark";
  const isDetox = settings.theme === "detox";
  const isHighContrast = settings.theme === "high-contrast";

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsDrawerOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    const baseList =
      selectedId === "active"
        ? model.activeReadings
        : selectedId === "completed"
        ? model.completedReadings
        : selectedId.startsWith("tag:")
        ? readings.filter((reading) =>
            (reading.tags ?? []).some((tag) => `tag:${tag.trim().toLowerCase()}` === selectedId)
          )
        : readings;

    if (!query) return baseList;

    return baseList.filter((reading) => {
      const title = reading.title.toLowerCase();
      const tags = (reading.tags ?? []).join(" ").toLowerCase();
      return title.includes(query) || tags.includes(query);
    });
  }, [model.activeReadings, model.completedReadings, readings, search, selectedId]);

  return (
    <div
      className={`sidebar-lab-shell min-h-screen ${
        isHighContrast
          ? "bg-black text-white"
          : isDetox
          ? "bg-white text-gray-900"
          : isDark
          ? "bg-linear-to-br from-gray-950 via-slate-900 to-zinc-900 text-gray-100"
          : "bg-linear-to-br from-amber-50 via-lime-100 to-emerald-50 text-gray-900"
      }`}
    >
      <Header />

      <div className="mx-auto flex w-full max-w-[1500px] gap-6 px-3 pb-8 pt-4 md:px-6">
        <aside className="hidden w-80 shrink-0 lg:block">
          <SidebarLab model={model} selectedId={selectedId} onSelect={setSelectedId} />
        </aside>

        <SidebarDrawer
          open={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          model={model}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />

        <main id="main-content" className="flex-1" aria-label="Sidebar lab content">
          <section className="sidebar-lab-hero">
            <div>
              <p className="sidebar-lab-hero-eyebrow">Experimental Route</p>
              <h1 className="sidebar-lab-hero-title">Sidebar Navigation Lab</h1>
              <p className="sidebar-lab-hero-subtitle">
                A scalable reading workspace with hybrid navigation for high-volume libraries.
              </p>
            </div>

            <div className="sidebar-lab-hero-actions">
              <button
                type="button"
                className="sidebar-lab-mobile-trigger lg:hidden"
                onClick={() => setIsDrawerOpen(true)}
                aria-label="Open sidebar menu"
              >
                Menu
              </button>

              <button
                type="button"
                className={`sidebar-lab-view-toggle ${viewMode === "dense" ? "sidebar-lab-view-toggle-active" : ""}`}
                onClick={() => setViewMode("dense")}
              >
                Dense
              </button>
              <button
                type="button"
                className={`sidebar-lab-view-toggle ${viewMode === "minimal" ? "sidebar-lab-view-toggle-active" : ""}`}
                onClick={() => setViewMode("minimal")}
              >
                Minimal
              </button>
            </div>
          </section>

          <section className="sidebar-lab-toolbar">
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="sidebar-lab-search"
              placeholder="Search by title or tag"
              aria-label="Search readings"
            />
            <div className="sidebar-lab-counts" role="status" aria-live="polite">
              <span>{filtered.length} items</span>
              <span>Active {model.activeReadings.length}</span>
              <span>Completed {model.completedReadings.length}</span>
            </div>
          </section>

          <section
            className={`sidebar-lab-grid ${viewMode === "minimal" ? "sidebar-lab-grid-minimal" : ""}`}
            aria-label="Readings results"
          >
            {filtered.map((reading) => {
              const isCompleted = completedReadings.includes(reading.id);
              return (
                <ReadingCard
                  key={reading.id}
                  reading={reading}
                  onEdit={() => {}}
                  onDelete={() => {}}
                  isDark={isDark}
                  isDetox={isDetox}
                  isHighContrast={isHighContrast}
                  isCompleted={isCompleted}
                />
              );
            })}
          </section>

          {filtered.length === 0 && (
            <section className="sidebar-lab-empty-state">
              <h2>No readings match this view</h2>
              <p>Try a different filter, or create a new reading from the main dashboard.</p>
              <Link href="/" className="sidebar-lab-back-link">
                Back to current dashboard
              </Link>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
