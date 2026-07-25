"use client";

import { Project } from "@/types";
import { DashboardTheme } from "@/lib/dashboard/theme";

interface ProjectCardV2Props {
  project: Project;
  readingCount: number;
  completionPercent: number;
  dash: DashboardTheme;
  isSelected: boolean;
  onSelect: () => void;
  onOpen?: () => void;
}

function MiniIcon({ path, className = "w-4 h-4" }: { path: string; className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={path} />
    </svg>
  );
}

export default function ProjectCardV2({
  project,
  readingCount,
  completionPercent,
  dash,
  isSelected,
  onSelect,
  onOpen,
}: ProjectCardV2Props) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={isSelected}
      className={`
        group relative flex w-full flex-col rounded-xl p-5 text-left transition-all
        ${dash.surface} ${dash.border} ${dash.surfaceHover}
        ${isSelected ? dash.selected : ""}
      `}
    >
      {/* Title */}
      <h3 
        onClick={(e) => {
          e.stopPropagation();
          onOpen?.();
        }}
        className={`line-clamp-2 text-base font-semibold text-pretty cursor-pointer hover:text-blue-500 transition-colors ${dash.textPrimary}`}
      >
        {project.title}
      </h3>

      {/* Description */}
      {project.description && (
        <p className={`mt-2 line-clamp-2 text-sm leading-relaxed ${dash.textMuted}`}>
          {project.description}
        </p>
      )}

      {/* Tags */}
      {project.tags && project.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {project.tags.slice(0, 3).map((tag, i) => (
            <span key={i} className={`rounded-md px-2 py-0.5 text-xs font-medium ${dash.chip}`}>
              {tag}
            </span>
          ))}
          {project.tags.length > 3 && (
            <span className={`text-xs font-medium ${dash.textSubtle}`}>
              +{project.tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Progress bar */}
      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between">
          <span className={`text-xs font-medium ${dash.textMuted}`}>
            Progreso
          </span>
          <span className={`text-xs font-semibold ${dash.accent}`}>
            {completionPercent}%
          </span>
        </div>
        <div className={`h-2 w-full rounded-full ${dash.chip} overflow-hidden`}>
          <div
            className={`h-full ${dash.accent} transition-all duration-300`}
            style={{ width: `${completionPercent}%` }}
          />
        </div>
      </div>

      {/* Footer stats */}
      <div className={`mt-4 flex items-center gap-4 border-t pt-3 text-xs ${dash.divider} ${dash.textMuted}`}>
        <span className="inline-flex items-center gap-1">
          <MiniIcon path="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" className="w-3.5 h-3.5" />
          {readingCount} lectura{readingCount === 1 ? "" : "s"}
        </span>
      </div>
    </button>
  );
}
