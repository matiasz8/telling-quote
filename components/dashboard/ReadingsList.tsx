"use client";

import Link from "next/link";
import { Reading } from "@/types";
import { DashboardTheme } from "@/lib/dashboard/theme";
import {
  getExcerpt,
  getReadingTimeMinutes,
  getWordCount,
} from "@/lib/dashboard/projectHelpers";

interface ReadingsListProps {
  readings: Reading[];
  projectId: string;
  completedReadings: string[];
  favoriteReadings: string[];
  dash: DashboardTheme;
  onEdit: (reading: Reading) => void;
  onDelete: (reading: Reading) => void;
  onToggleFavorite: (reading: Reading) => void;
  onToggleComplete: (reading: Reading) => void;
}

function MiniIcon({ path, className = "w-4 h-4" }: { path: string; className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={path} />
    </svg>
  );
}

export default function ReadingsList({
  readings,
  projectId,
  completedReadings,
  favoriteReadings,
  dash,
  onEdit,
  onDelete,
  onToggleFavorite,
  onToggleComplete,
}: ReadingsListProps) {
  const projectReadings = readings.filter((r) => r.projectId === projectId);

  if (projectReadings.length === 0) {
    return (
      <div className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed px-6 py-8 text-center ${dash.border}`}>
        <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-full ${dash.chip}`}>
          <MiniIcon path="M12 6v6m0 0v6m0-6h6m0 0h6M6 12h6m0 0H6" className="w-5 h-5" />
        </div>
        <p className={`text-sm font-medium ${dash.textMuted}`}>
          No hay lecturas aún
        </p>
        <p className={`mt-1 text-xs ${dash.textSubtle}`}>
          Agrega la primera lectura a este proyecto
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {projectReadings.map((reading) => {
        const isCompleted = completedReadings.includes(reading.id);
        const isFavorite = favoriteReadings.includes(reading.id);
        const words = getWordCount(reading.content);
        const minutes = getReadingTimeMinutes(reading.content);

        return (
          <div
            key={reading.id}
            className={`group rounded-lg border p-3 transition-all ${dash.surface} ${dash.border} hover:shadow-md`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                {/* Completion badge */}
                <div className="mb-1 flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
                      isCompleted ? "bg-emerald-100 text-emerald-700" : dash.chip
                    }`}
                  >
                    {isCompleted ? (
                      <>
                        <MiniIcon path="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" className="w-3 h-3" />
                        Completado
                      </>
                    ) : (
                      "Por leer"
                    )}
                  </span>
                </div>

                {/* Title */}
                <h4 className={`line-clamp-1 font-semibold ${dash.textPrimary}`}>
                  {reading.title}
                </h4>

                {/* Excerpt */}
                <p className={`line-clamp-1 text-xs mt-1 ${dash.textMuted}`}>
                  {getExcerpt(reading.content, 100)}
                </p>

                {/* Stats */}
                <div className={`mt-2 flex items-center gap-3 text-xs ${dash.textMuted}`}>
                  <span className="inline-flex items-center gap-1">
                    <MiniIcon path="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" className="w-3 h-3" />
                    {minutes} min
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <MiniIcon path="M4 6h16M4 12h16M4 18h10" className="w-3 h-3" />
                    {words} palabras
                  </span>
                </div>
              </div>

              {/* Favorite indicator */}
              {isFavorite && (
                <svg className="w-4 h-4 text-amber-500 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              )}
            </div>

            {/* Quick action buttons */}
            <div className="mt-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Link
                href={`/reader/${reading.id}`}
                className={`flex-1 inline-flex items-center justify-center gap-1 rounded px-2 py-1 text-xs font-medium transition-colors text-blue-600 hover:bg-blue-50 ${dash.border}`}
              >
                <MiniIcon path="M12 6.253v13m0-13C6.5 6.253 2 10.998 2 17s4.5 10.747 10 10.747c5.5 0 10-4.998 10-10.747S17.5 6.253 12 6.253z" className="w-3 h-3" />
                Abrir
              </Link>
              <button
                onClick={() => onToggleComplete(reading)}
                className={`flex-1 inline-flex items-center justify-center gap-1 rounded px-2 py-1 text-xs font-medium transition-colors ${
                  isCompleted ? "bg-emerald-100 text-emerald-700" : `${dash.ghostBtn} ${dash.border}`
                }`}
              >
                {isCompleted ? (
                  <>
                    <MiniIcon path="M6 18L18 6M6 6l12 12" className="w-3 h-3" />
                    Desmarcar
                  </>
                ) : (
                  <>
                    <MiniIcon path="M9 12l2 2 4-4" className="w-3 h-3" />
                    Completar
                  </>
                )}
              </button>
              <button
                onClick={() => onToggleFavorite(reading)}
                className={`flex-1 inline-flex items-center justify-center gap-1 rounded px-2 py-1 text-xs font-medium transition-colors ${
                  isFavorite ? "bg-amber-100 text-amber-700" : `${dash.ghostBtn} ${dash.border}`
                }`}
              >
                <svg className="w-3 h-3" fill={isFavorite ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                {isFavorite ? "Favorito" : "Fav"}
              </button>
              <button
                onClick={() => onEdit(reading)}
                className={`flex-1 inline-flex items-center justify-center gap-1 rounded px-2 py-1 text-xs font-medium transition-colors ${dash.ghostBtn} ${dash.border}`}
              >
                <MiniIcon path="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" className="w-3 h-3" />
                Editar
              </button>
              <button
                onClick={() => onDelete(reading)}
                className={`flex-1 inline-flex items-center justify-center gap-1 rounded px-2 py-1 text-xs font-medium transition-colors text-red-600 hover:bg-red-50 ${dash.border}`}
              >
                <MiniIcon path="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" className="w-3 h-3" />
                Borrar
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
