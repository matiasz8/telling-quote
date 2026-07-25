"use client";

import { Project, Reading } from "@/types";
import { DashboardTheme } from "@/lib/dashboard/theme";
import {
  getProjectCompletionPercent,
  getProjectReadingCount,
  getProjectCompletedCount,
  getProjectTags,
} from "@/lib/dashboard/projectHelpers";
import ReadingsList from "./ReadingsList";

interface ProjectDetailViewProps {
  project: Project;
  readings: Reading[];
  completedIds: string[];
  favoriteIds: string[];
  dash: DashboardTheme;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
  onToggleFavorite: (project: Project) => void;
  onAddReading: (projectId: string) => void;
  onClose: () => void;
}

function Icon({ path, className = "w-5 h-5" }: { path: string; className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={path} />
    </svg>
  );
}

export default function ProjectDetailView({
  project,
  readings,
  completedIds,
  favoriteIds,
  dash,
  onEdit,
  onDelete,
  onToggleFavorite,
  onAddReading,
  onClose,
}: ProjectDetailViewProps) {
  const readingCount = getProjectReadingCount(readings, project.id);
  const completedCount = getProjectCompletedCount(readings, completedIds, project.id);
  const completionPercent = getProjectCompletionPercent(readings, completedIds, project.id);
  const tags = getProjectTags(readings, project.id);

  const secondaryBtn = `flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${dash.ghostBtn} ${dash.border}`;

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className={`flex items-center justify-between border-b px-5 h-16 ${dash.divider}`}>
        <h2 className={`text-sm font-semibold uppercase tracking-wider ${dash.textSubtle}`}>
          Proyecto
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
        <h1 className={`text-2xl font-bold text-balance ${dash.textPrimary}`}>{project.title}</h1>

        <p className={`mt-2 text-sm leading-relaxed ${dash.textMuted}`}>
          {project.description || "Sin descripción"}
        </p>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className={`rounded-xl p-4 ${dash.border}`}>
            <p className={`text-2xl font-bold ${dash.textPrimary}`}>{readingCount}</p>
            <p className={`text-xs ${dash.textMuted}`}>lectura{readingCount === 1 ? "" : "s"}</p>
          </div>
          <div className={`rounded-xl p-4 ${dash.border}`}>
            <p className={`text-2xl font-bold ${dash.textPrimary}`}>{completionPercent}%</p>
            <p className={`text-xs ${dash.textMuted}`}>completado</p>
          </div>
        </div>

        {/* Progress bar */}
        {readingCount > 0 && (
          <div className="mt-4">
            <div className="mb-2 flex items-center justify-between">
              <span className={`text-xs font-semibold ${dash.textMuted}`}>
                {completedCount} de {readingCount} lecturas
              </span>
            </div>
            <div className={`h-3 w-full rounded-full ${dash.chip}`}>
              <div
                className={`h-3 rounded-full transition-all ${dash.primaryBtn.split(" ")[0]}`}
                style={{ width: `${completionPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <div className="mt-6">
            <p className={`mb-2 text-xs font-semibold uppercase tracking-wider ${dash.textSubtle}`}>
              Etiquetas
            </p>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, i) => (
                <span key={i} className={`rounded-md px-2.5 py-1 text-xs font-medium ${dash.chip}`}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Readings List */}
        <div className="mt-8">
          <p className={`mb-4 text-xs font-semibold uppercase tracking-wider ${dash.textSubtle}`}>
            Lecturas en este proyecto
          </p>
          <ReadingsList
            readings={readings}
            projectId={project.id}
            completedIds={completedIds}
            favoriteIds={favoriteIds}
            dash={dash}
          />
        </div>
      </div>

      {/* Actions */}
      <div className={`border-t px-5 py-4 space-y-2 ${dash.divider}`}>
        <button
          onClick={() => onAddReading(project.id)}
          className={`w-full flex items-center justify-center gap-2 rounded-lg px-4 py-3 font-semibold shadow-sm transition-all ${dash.primaryBtn}`}
        >
          <Icon path="M12 4v16m8-8H4" />
          Nueva Lectura
        </button>

        <div className="grid grid-cols-3 gap-2">
          <button onClick={() => onToggleFavorite(project)} className={secondaryBtn}>
            <svg
              className="w-4 h-4"
              fill={favoriteIds.includes(project.id) ? "currentColor" : "none"}
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
            Favorito
          </button>
          <button onClick={() => onEdit(project)} className={secondaryBtn}>
            <Icon path="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" className="w-4 h-4" />
            Editar
          </button>
          <button
            onClick={() => onDelete(project)}
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
