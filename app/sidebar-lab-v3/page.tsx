"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import ReadingCard from "@/components/ReadingCard";
import ChipBar from "@/components/sidebar-lab-v3/ChipBar";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useSettings } from "@/hooks/useSettings";
import { STORAGE_KEYS } from "@/lib/constants";
import { buildSidebarLabModel } from "@/lib/dashboard/sidebarLabModel";
import { Reading } from "@/types";

export default function SidebarLabV3Page() {
  const [readings] = useLocalStorage<Reading[]>(STORAGE_KEYS.READINGS, []);
  const [completedReadings] = useLocalStorage<string[]>("completedReadings", []);
  const [selectedId, setSelectedId] = useState<string>("home");
  const [search, setSearch] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const { settings } = useSettings();

  const model = useMemo(
    () => buildSidebarLabModel(readings, completedReadings),
    [readings, completedReadings]
  );

  const isDark = settings.theme === "dark";
  const isDetox = settings.theme === "detox";
  const isHighContrast = settings.theme === "high-contrast";

  // `/` shortcut focuses search
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement;
      const isEditable =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;

      if (event.key === "/" && !isEditable) {
        event.preventDefault();
        searchRef.current?.focus();
      }
      if (event.key === "Escape") {
        searchRef.current?.blur();
        setIsSearchFocused(false);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // Build flat chip list: nav items + top tags
  const chips = useMemo(() => {
    const navChips = model.nav
      .filter((item) => item.id !== "settings" && item.id !== "tags")
      .map((item) => ({ id: item.id, label: item.label, count: item.count }));

    const tagChips = model.tags.slice(0, 12).map((tag) => ({
      id: tag.id,
      label: `#${tag.label}`,
      count: tag.count,
    }));

    return [...navChips, ...tagChips];
  }, [model.nav, model.tags]);

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

  const activeChipLabel =
    chips.find((c) => c.id === selectedId)?.label?.replace(/^#/, "") ?? "All";

  return (
    <div
      className={`chip-lab-shell min-h-screen ${
        isHighContrast
          ? "bg-black text-white"
          : isDetox
          ? "bg-white text-gray-900"
          : isDark
          ? "bg-linear-to-br from-gray-950 via-slate-900 to-zinc-900 text-gray-100"
          : "bg-linear-to-br from-rose-50 via-orange-50 to-yellow-50 text-gray-900"
      }`}
    >
      <Header />

      {/* Sticky chip + search bar */}
      <div className={`chip-lab-sticky-bar ${isSearchFocused ? "chip-lab-sticky-bar-focused" : ""}`}>
        <div className="chip-lab-sticky-inner">
          <div className="chip-lab-search-wrap">
            <label htmlFor="chip-lab-search" className="sr-only">
              Search readings (press / to focus)
            </label>
            <input
              ref={searchRef}
              id="chip-lab-search"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className="chip-lab-search"
              placeholder="Search… (press / to focus)"
              aria-label="Search readings"
            />
            {search && (
              <button
                type="button"
                className="chip-lab-search-clear"
                onClick={() => setSearch("")}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          <ChipBar chips={chips} selectedId={selectedId} onSelect={setSelectedId} />
        </div>
      </div>

      {/* Main content */}
      <main id="main-content" className="chip-lab-main" aria-label="Chip lab content">
        <section className="chip-lab-hero">
          <div>
            <p className="chip-lab-eyebrow">Experimental Route · V3</p>
            <h1 className="chip-lab-title">Chip Bar Navigation Lab</h1>
            <p className="chip-lab-subtitle">
              Content-first layout — no persistent sidebar. Filter and search from a sticky top bar.
            </p>
          </div>
          <div className="chip-lab-hero-meta" role="status" aria-live="polite">
            <span className="chip-lab-active-filter">Viewing: {activeChipLabel}</span>
            <span>{filtered.length} items</span>
            <span>Active {model.activeReadings.length}</span>
            <span>Done {model.completedReadings.length}</span>
          </div>
        </section>

        <section className="chip-lab-grid" aria-label="Readings results">
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
          <section className="chip-lab-empty">
            <h2>Nothing here</h2>
            <p>Select a different chip or clear the search to see all readings.</p>
            <div className="chip-lab-empty-links">
              <Link href="/" className="chip-lab-back-link">Back to dashboard</Link>
              <Link href="/sidebar-lab" className="chip-lab-back-link">← V1 Sidebar</Link>
              <Link href="/sidebar-lab-v2" className="chip-lab-back-link">← V2 Rail</Link>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
