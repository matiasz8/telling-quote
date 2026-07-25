"use client";

import { Reading } from "@/types";
import { DashboardTheme } from "@/lib/dashboard/theme";
import {
  getExcerpt,
  getReadingTimeMinutes,
  getWordCount,
} from "@/lib/dashboard/projectHelpers";

interface ProjectCardV2Props {
  reading: Reading;
  dash: DashboardTheme;
  isSelected: boolean;
  isCompleted: boolean;
  isFavorite: boolean;
  isExample: boolean;
  onSelect: (reading: Reading) => void;
  onToggleFavorite: (reading: Reading) => void;
}

function MiniIcon({ path, className = "w-4 h-4" }: { path: string; className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={path} />
    </svg>
  );
}

export default function ProjectCardV2({
  reading,
  dash,
  isSelected,
  isCompleted,
  isFavorite,
  isExample,
  onSelect,
  onToggleFavorite,
}: ProjectCardV2Props) {
  const words = getWordCount(reading.content);
  const minutes = getReadingTimeMinutes(reading.content);

  return (
    <button
      type="button"
      onClick={() => onSelect(reading)}
      data-tour="reading-card"
      aria-pressed={isSelected}
      className={`
        group relative flex w-full flex-col rounded-xl p-5 text-left transition-all
        ${dash.surface} ${dash.border} ${dash.surfaceHover}
        ${isSelected ? dash.selected : ""}
      `}
    >
      {/* Top row: badges + favorite */}
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
              isCompleted ? "bg-emerald-100 text-emerald-700" : dash.chip
            }`}
          >
            {isCompleted ? (
              <>
                <MiniIcon path="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" className="w-3.5 h-3.5" />
                Completado
              </>
            ) : (
              "Activo"
            )}
          </span>
          {isExample && (
            <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${dash.chip}`}>
              Ejemplo
            </span>
          )}
        </div>
        <span
          role="button"
          tabIndex={0}
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(reading);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              e.stopPropagation();
              onToggleFavorite(reading);
            }
          }}
          aria-label={isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}
          className={`cursor-pointer rounded-md p-1 transition-colors ${
            isFavorite ? dash.accent : `${dash.textSubtle} ${dash.accentHover}`
          }`}
        >
          <svg
            className="w-5 h-5"
            fill={isFavorite ? "currentColor" : "none"}
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
            />
          </svg>
        </span>
      </div>

      {/* Title */}
      <h3 className={`line-clamp-2 text-base font-semibold text-pretty ${dash.textPrimary}`}>
        {reading.title}
      </h3>

      {/* Excerpt */}
      <p className={`mt-2 line-clamp-2 text-sm leading-relaxed ${dash.textMuted}`}>
        {getExcerpt(reading.content) || "Sin contenido"}
      </p>

      {/* Tags */}
      {reading.tags && reading.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {reading.tags.slice(0, 3).map((tag, i) => (
            <span key={i} className={`rounded-md px-2 py-0.5 text-xs font-medium ${dash.chip}`}>
              {tag}
            </span>
          ))}
          {reading.tags.length > 3 && (
            <span className={`text-xs font-medium ${dash.textSubtle}`}>
              +{reading.tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Footer stats */}
      <div className={`mt-4 flex items-center gap-4 border-t pt-3 text-xs ${dash.divider} ${dash.textMuted}`}>
        <span className="inline-flex items-center gap-1">
          <MiniIcon path="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" className="w-3.5 h-3.5" />
          {minutes} min
        </span>
        <span className="inline-flex items-center gap-1">
          <MiniIcon path="M4 6h16M4 12h16M4 18h10" className="w-3.5 h-3.5" />
          {words} palabras
        </span>
      </div>
    </button>
  );
}
