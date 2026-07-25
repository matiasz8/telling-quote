"use client";

import { Reading, Project } from "@/types";
import { DashboardTheme } from "@/lib/dashboard/theme";

interface ReadingDetailViewProps {
  reading: Reading;
  project: Project;
  isCompleted: boolean;
  isFavorite: boolean;
  dash: DashboardTheme;
  onEdit: (reading: Reading) => void;
  onDelete: (reading: Reading) => void;
  onToggleFavorite: (reading: Reading) => void;
  onToggleComplete: (reading: Reading) => void;
  onClose: () => void;
  onOpen: () => void;
}

function Icon({ path, className = "w-5 h-5" }: { path: string; className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={path} />
    </svg>
  );
}

export default function ReadingDetailView({
  reading,
  project,
  isCompleted,
  isFavorite,
  dash,
  onEdit,
  onDelete,
  onToggleFavorite,
  onToggleComplete,
  onClose,
  onOpen,
}: ReadingDetailViewProps) {
  // Calculate reading time estimate
  const wordCount = reading.excerpt?.split(/\s+/).length || reading.content?.split(/\s+/).length || 0;
  const readingTimeMinutes = Math.ceil(wordCount / 200); // Assume 200 words per minute

  // Truncate excerpt for preview
  const displayExcerpt = reading.excerpt || reading.content || "Sin descripción";
  const truncatedExcerpt =
    displayExcerpt.length > 200 ? displayExcerpt.substring(0, 200) + "…" : displayExcerpt;

  const statusLabel = isCompleted ? "Completado" : "Por leer";
  const statusColor = isCompleted
    ? "text-green-600 dark:text-green-400"
    : "text-amber-600 dark:text-amber-400";

  const secondaryBtn = `flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${dash.ghostBtn} ${dash.border}`;

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className={`flex items-center justify-between border-b px-5 h-16 ${dash.divider}`}>
        <h2 className={`text-sm font-semibold uppercase tracking-wider ${dash.textSubtle}`}>
          Lectura
        </h2>
        <button
          onClick={onClose}
          className={`rounded-lg p-2 transition-colors ${dash.ghostBtn}`}
          aria-label="Cerrar detalles"
        >
          <Icon path="M6 18L18 6M6 6l12 12" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-6">
        {/* Status Badge */}
        <div className={`inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold mb-4 ${dash.chip}`}>
          <span className={`w-2 h-2 rounded-full ${statusColor.split(" ")[0]}`} />
          <span className={statusColor}>{statusLabel}</span>
        </div>

        {/* Project Info */}
        <div className={`mb-4 rounded-lg p-3 ${dash.border}`}>
          <p className={`text-xs font-semibold uppercase tracking-wider ${dash.textSubtle}`}>
            Proyecto
          </p>
          <p className={`text-sm font-medium mt-1 ${dash.textPrimary}`}>{project.title}</p>
        </div>

        {/* Title */}
        <h1 className={`text-2xl font-bold text-balance ${dash.textPrimary}`}>{reading.title}</h1>

        {/* Excerpt/Preview */}
        <p className={`mt-4 text-sm leading-relaxed ${dash.textMuted}`}>{truncatedExcerpt}</p>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className={`rounded-xl p-4 ${dash.border}`}>
            <p className={`text-2xl font-bold ${dash.textPrimary}`}>{readingTimeMinutes}</p>
            <p className={`text-xs ${dash.textMuted}`}>minuto{readingTimeMinutes === 1 ? "" : "s"}</p>
          </div>
          <div className={`rounded-xl p-4 ${dash.border}`}>
            <p className={`text-2xl font-bold ${dash.textPrimary}`}>{wordCount}</p>
            <p className={`text-xs ${dash.textMuted}`}>palabra{wordCount === 1 ? "" : "s"}</p>
          </div>
        </div>

        {/* Tags */}
        {reading.tags && reading.tags.length > 0 && (
          <div className="mt-6">
            <p className={`mb-2 text-xs font-semibold uppercase tracking-wider ${dash.textSubtle}`}>
              Etiquetas
            </p>
            <div className="flex flex-wrap gap-2">
              {reading.tags.map((tag, i) => (
                <span key={i} className={`rounded-md px-2.5 py-1 text-xs font-medium ${dash.chip}`}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className={`border-t px-5 py-4 space-y-2 ${dash.divider}`}>
        <button
          onClick={onOpen}
          className={`w-full flex items-center justify-center gap-2 rounded-lg px-4 py-3 font-semibold shadow-sm transition-all ${dash.primaryBtn}`}
        >
          <Icon path="M13 5l7 7-7 7M5 5l7 7-7 7" />
          Abrir
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onToggleComplete(reading)}
            className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              isCompleted ? dash.primaryBtn : secondaryBtn
            }`}
          >
            <Icon path="M5 13l4 4L19 7" className="w-4 h-4" />
            Completar
          </button>
          <button
            onClick={() => onToggleFavorite(reading)}
            className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              isFavorite ? dash.primaryBtn : secondaryBtn
            }`}
          >
            <Icon path="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" className="w-4 h-4" />
            Fav
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onEdit(reading)}
            className={secondaryBtn}
          >
            <Icon path="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" className="w-4 h-4" />
            Editar
          </button>
          <button
            onClick={() => onDelete(reading)}
            className={secondaryBtn}
          >
            <Icon path="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" className="w-4 h-4" />
            Borrar
          </button>
        </div>
      </div>
    </div>
  );
}
