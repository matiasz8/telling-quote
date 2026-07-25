"use client";

import { Reading } from "@/types";
import { DashboardTheme } from "@/lib/dashboard/theme";
import { getExcerpt, getReadingTimeMinutes } from "@/lib/dashboard/projectHelpers";

interface ReadingCardV2Props {
  reading: Reading;
  isCompleted: boolean;
  isFavorite: boolean;
  dash: DashboardTheme;
  onComplete: () => void;
  onFavorite: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onOpen: () => void;
  onSelect?: () => void;
}

function Icon({ path, className = "w-5 h-5" }: { path: string; className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={path} />
    </svg>
  );
}

export default function ReadingCardV2({
  reading,
  isCompleted,
  isFavorite,
  dash,
  onComplete,
  onFavorite,
  onEdit,
  onDelete,
  onOpen,
  onSelect,
}: ReadingCardV2Props) {
  const excerpt = getExcerpt(reading.content, 120);
  const readingTime = getReadingTimeMinutes(reading.content);

  return (
    <div
      onClick={onSelect}
      className={`group rounded-xl border p-4 transition-all duration-200 cursor-pointer ${dash.surface} ${dash.border} hover:shadow-lg hover:scale-105`}
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <h3 
          onClick={(e) => {
            e.stopPropagation();
            onOpen();
          }}
          className={`flex-1 font-semibold line-clamp-2 cursor-pointer hover:text-blue-500 transition-colors ${dash.textPrimary}`}
        >
          {reading.title}
        </h3>
        {isFavorite && (
          <svg className="w-5 h-5 text-amber-500 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        )}
      </div>

      <p className={`text-sm line-clamp-2 mb-3 ${dash.textMuted}`}>
        {excerpt}
      </p>

      {reading.tags && reading.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {reading.tags.slice(0, 2).map((tag, i) => (
            <span key={i} className={`text-xs px-2 py-0.5 rounded-full ${dash.chip}`}>
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className={`flex items-center justify-between pt-3 border-t ${dash.divider}`}>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-medium ${dash.textMuted}`}>
            {readingTime} min
          </span>
          {isCompleted && (
            <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold text-white bg-emerald-500`}>
              ✓
            </span>
          )}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpen();
          }}
          className="text-sm font-medium text-blue-500 hover:text-blue-600 transition-colors"
        >
          Abrir →
        </button>
      </div>

      {/* Quick actions (hidden by default) */}
      <div className="mt-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={onComplete}
          className={`flex-1 px-2 py-1.5 text-xs font-medium rounded transition-colors ${
            isCompleted
              ? "bg-emerald-100 text-emerald-700"
              : `${dash.ghostBtn} ${dash.border}`
          }`}
          title={isCompleted ? "Desmarcar como completada" : "Marcar como completada"}
        >
          <Icon path="M9 12l2 2 4-4" className="w-3 h-3 mx-auto" />
        </button>
        <button
          onClick={onFavorite}
          className={`flex-1 px-2 py-1.5 text-xs font-medium rounded transition-colors ${
            isFavorite
              ? "bg-amber-100 text-amber-700"
              : `${dash.ghostBtn} ${dash.border}`
          }`}
          title={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
        >
          <svg className="w-3 h-3 mx-auto" fill={isFavorite ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        </button>
        <button
          onClick={onEdit}
          className={`flex-1 px-2 py-1.5 text-xs font-medium rounded transition-colors ${dash.ghostBtn} ${dash.border}`}
          title="Editar lectura"
        >
          <Icon path="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" className="w-3 h-3 mx-auto" />
        </button>
        <button
          onClick={onDelete}
          className="flex-1 px-2 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded transition-colors"
          title="Eliminar lectura"
        >
          <Icon path="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" className="w-3 h-3 mx-auto" />
        </button>
      </div>
    </div>
  );
}
