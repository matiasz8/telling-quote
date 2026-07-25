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
  completedReadings: string[];
  favoriteReadings: string[];
  dash: DashboardTheme;
  onEdit: (reading: Reading) => void;
  onDelete: (reading: Reading) => void;
  onToggleFavorite: (reading: Reading) => void;
  onToggleComplete: (reading: Reading) => void;
  onNewReading: () => void;
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
  completedReadings,
  favoriteReadings,
  dash,
  onEdit,
  onDelete,
  onToggleFavorite,
  onToggleComplete,
  onNewReading,
  onClose,
}: ProjectDetailViewProps) {
  const readingCount = getProjectReadingCount(readings, project.id);
  const completedCount = getProjectCompletedCount(readings, completedReadings, project.id);
  const completionPercent = getProjectCompletionPercent(readings, completedReadings, project.id);
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
            completedReadings={completedReadings}
            favoriteReadings={favoriteReadings}
            dash={dash}
            onEdit={onEdit}
            onDelete={onDelete}
            onToggleFavorite={onToggleFavorite}
            onToggleComplete={onToggleComplete}
          />
        </div>
      </div>

      {/* Actions */}
      <div className={`border-t px-5 py-4 space-y-2 ${dash.divider}`}>
        <button
          onClick={onNewReading}
          className={`w-full flex items-center justify-center gap-2 rounded-lg px-4 py-3 font-semibold shadow-sm transition-all ${dash.primaryBtn}`}
        >
          <Icon path="M12 4v16m8-8H4" />
          Nueva Lectura
        </button>
      </div>
    </div>
  );
}
