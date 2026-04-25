"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import ReadingCard from "@/components/ReadingCard";
import RailNav from "@/components/sidebar-lab-v2/RailNav";
import RailPanel from "@/components/sidebar-lab-v2/RailPanel";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useSettings } from "@/hooks/useSettings";
import { STORAGE_KEYS } from "@/lib/constants";
import { buildSidebarLabModel } from "@/lib/dashboard/sidebarLabModel";
import { Reading } from "@/types";

type RailSection = "nav" | "tags" | "views";

const RAIL_SECTIONS = [
  { id: "nav" as const, label: "Navigation" },
  { id: "tags" as const, label: "Tags" },
  { id: "views" as const, label: "Views" },
];

export default function SidebarLabV2Page() {
  const [readings] = useLocalStorage<Reading[]>(STORAGE_KEYS.READINGS, []);
  const [completedReadings] = useLocalStorage<string[]>("completedReadings", []);
  const [selectedId, setSelectedId] = useState<string>("home");
  const [search, setSearch] = useState("");
  const [activeSection, setActiveSection] = useState<RailSection>("nav");
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const { settings } = useSettings();

  const model = useMemo(
    () => buildSidebarLabModel(readings, completedReadings),
    [readings, completedReadings]
  );

  const isDark = settings.theme === "dark";
  const isDetox = settings.theme === "detox";
  const isHighContrast = settings.theme === "high-contrast";

  function handleRailSelect(id: RailSection) {
    if (activeSection === id && isPanelOpen) {
      setIsPanelOpen(false);
    } else {
      setActiveSection(id);
      setIsPanelOpen(true);
    }
  }

  function handleFilterSelect(id: string) {
    setSelectedId(id);
    setIsPanelOpen(false);
  }

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsPanelOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    function onClickOutside(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsPanelOpen(false);
      }
    }
    if (isPanelOpen) {
      document.addEventListener("mousedown", onClickOutside);
    }
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [isPanelOpen]);

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

  const activeLabel =
    RAIL_SECTIONS.find((s) => s.id === activeSection)?.label ?? activeSection;
  const selectedLabel =
    model.nav.find((n) => n.id === selectedId)?.label ??
    model.tags.find((t) => t.id === selectedId)?.label ??
    model.savedViews.find((v) => v.id === selectedId)?.label ??
    "All";

  return (
    <div
      className={`rail-lab-shell min-h-screen ${
        isHighContrast
          ? "bg-black text-white"
          : isDetox
          ? "bg-white text-gray-900"
          : isDark
          ? "bg-linear-to-br from-gray-950 via-slate-900 to-zinc-900 text-gray-100"
          : "bg-linear-to-br from-violet-50 via-indigo-50 to-blue-50 text-gray-900"
      }`}
    >
      <Header />

      <div className="rail-lab-layout">
        {/* Icon Rail */}
        <div ref={panelRef} className="rail-lab-rail-wrap">
          <RailNav
            sections={RAIL_SECTIONS}
            activeSection={activeSection}
            onSelect={(id) => handleRailSelect(id as RailSection)}
          />

          {/* Slide-out Panel */}
          <div className={`rail-lab-panel-wrap ${isPanelOpen ? "rail-lab-panel-open" : ""}`}>
            <RailPanel
              section={activeSection}
              model={model}
              selectedId={selectedId}
              onSelect={handleFilterSelect}
            />
          </div>
        </div>

        {/* Main Content */}
        <main id="main-content" className="rail-lab-main" aria-label="Rail lab content">
          <section className="rail-lab-header">
            <div>
              <p className="rail-lab-eyebrow">Experimental Route · V2</p>
              <h1 className="rail-lab-title">Icon Rail Navigation Lab</h1>
              <p className="rail-lab-subtitle">
                A compact icon rail that expands an inline panel — minimal footprint, fast access.
              </p>
            </div>
            <div className="rail-lab-breadcrumb" aria-label="Active filter">
              <span>{activeLabel}</span>
              <span aria-hidden="true">›</span>
              <span className="rail-lab-breadcrumb-active">{selectedLabel}</span>
            </div>
          </section>

          <section className="rail-lab-toolbar">
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="rail-lab-search"
              placeholder="Search by title or tag"
              aria-label="Search readings"
            />
            <div className="rail-lab-counts" role="status" aria-live="polite">
              <span>{filtered.length} items</span>
              <span>Active {model.activeReadings.length}</span>
              <span>Completed {model.completedReadings.length}</span>
            </div>
          </section>

          <section className="rail-lab-grid" aria-label="Readings results">
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
            <section className="rail-lab-empty">
              <h2>No readings match this view</h2>
              <p>Try a different filter, or create a new reading from the main dashboard.</p>
              <div className="rail-lab-empty-links">
                <Link href="/" className="rail-lab-back-link">Back to dashboard</Link>
                <Link href="/sidebar-lab" className="rail-lab-back-link">← V1 Sidebar Lab</Link>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
