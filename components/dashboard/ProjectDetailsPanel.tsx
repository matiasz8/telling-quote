"use client";

import Link from "next/link";
import { Reading } from "@/types";
import { DashboardTheme } from "@/lib/dashboard/theme";
import {
  getExcerpt,
  getReadingTimeMinutes,
  getWordCount,
} from "@/lib/dashboard/projectHelpers";

interface ProjectDetailsPanelProps {
  reading: Reading | null;
  dash: DashboardTheme;
  isCompleted: boolean;
  isFavorite: boolean;
  isExample: boolean;
  onEdit: (reading: Reading) => void;
  onDelete: (reading: Reading) => void;
  onToggleFavorite: (reading: Reading) => void;
  onToggleComplete: (reading: Reading) => void;
  onClose: () => void;
}

function Icon({ path, className = "w-5 h-5" }: { path: string; className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={path} />
    </svg>
  );
}

export default function ProjectDetailsPanel({
  reading,
  dash,
  isCompleted,
  isFavorite,
  isExample,
  onEdit,
  onDelete,
  onToggleFavorite,
  onToggleComplete,
  onClose,
}: ProjectDetailsPanelProps) {
  if (!reading) {
    return (
      <div className={`hidden h-full flex-col items-center justify-center px-8 text-center lg:flex`}>
        <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${dash.chip}`}>
          <Icon path="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" className="w-7 h-7" />
        </div>
        <p className={`text-sm font-medium ${dash.textMuted}`}>
          Selecciona un proyecto para ver sus detalles
        </p>
      </div>
    );
  }

  const words = getWordCount(reading.content);
  const minutes = getReadingTimeMinutes(reading.content);

  const secondaryBtn = `flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${dash.ghostBtn} ${dash.border}`;

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className={`flex items-center justify-between border-b px-5 h-16 ${dash.divider}`}>
        <h2 className={`text-sm font-semibold uppercase tracking-wider ${dash.textSubtle}`}>
          Detalles
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
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
              isCompleted ? "bg-emerald-100 text-emerald-700" : dash.chip
            }`}
          >
            {isCompleted ? "Completado" : "Activo"}
          </span>
          {isExample && (
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${dash.chip}`}>
              Ejemplo
            </span>
          )}
        </div>

        <h1 className={`text-xl font-bold text-balance ${dash.textPrimary}`}>{reading.title}</h1>

        {/* Stats */}
        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className={`rounded-xl p-4 ${dash.border}`}>
            <p className={`text-2xl font-bold ${dash.textPrimary}`}>{minutes}</p>
            <p className={`text-xs ${dash.textMuted}`}>min de lectura</p>
          </div>
          <div className={`rounded-xl p-4 ${dash.border}`}>
            <p className={`text-2xl font-bold ${dash.textPrimary}`}>{words}</p>
            <p className={`text-xs ${dash.textMuted}`}>palabras</p>
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

        {/* Preview */}
        <div className="mt-6">
          <p className={`mb-2 text-xs font-semibold uppercase tracking-wider ${dash.textSubtle}`}>
            Vista previa
          </p>
          <p className={`text-sm leading-relaxed ${dash.textMuted}`}>
            {getExcerpt(reading.content, 320) || "Sin contenido"}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className={`border-t px-5 py-4 ${dash.divider}`}>
        <Link
          href={`/reader/${reading.id}`}
          className={`mb-3 flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 font-semibold shadow-sm transition-all ${dash.primaryBtn}`}
        >
          <Icon path="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          Abrir lector
        </Link>

        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => onToggleComplete(reading)} className={secondaryBtn}>
            <Icon path="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" className="w-4 h-4" />
            {isCompleted ? "Reactivar" : "Completar"}
          </button>
          <button onClick={() => onToggleFavorite(reading)} className={secondaryBtn}>
            <svg
              className="w-4 h-4"
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
            {isFavorite ? "Quitar" : "Favorito"}
          </button>
          <button onClick={() => onEdit(reading)} className={secondaryBtn}>
            <Icon path="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" className="w-4 h-4" />
            Editar
          </button>
          <button
            onClick={() => onDelete(reading)}
            className={`flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${dash.dangerBtn} ${dash.border}`}
          >
            <Icon path="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" className="w-4 h-4" />
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}
