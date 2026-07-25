"use client";

import { useState } from "react";
import { Project } from "@/types";
import { DashboardTheme } from "@/lib/dashboard/theme";

interface NewProjectModalProps {
  dash: DashboardTheme;
  isOpen: boolean;
  onClose: () => void;
  onSave: (project: Project) => void;
}

function Icon({ path }: { path: string }) {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={path} />
    </svg>
  );
}

export default function NewProjectModal({
  dash,
  isOpen,
  onClose,
  onSave,
}: NewProjectModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newProject: Project = {
      id: `project-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };

    onSave(newProject);

    // Reset form
    setTitle("");
    setDescription("");
    setTags("");

    // Close modal after saving
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center">
      <div
        className={`w-full max-w-md rounded-t-2xl sm:rounded-2xl shadow-xl sm:shadow-2xl ${dash.surface}`}
      >
        {/* Header */}
        <div className={`flex items-center justify-between border-b px-6 py-4 ${dash.divider}`}>
          <h2 className={`text-lg font-bold ${dash.textPrimary}`}>Nuevo Proyecto</h2>
          <button
            onClick={onClose}
            className={`rounded-lg p-2 transition-colors ${dash.ghostBtn}`}
            aria-label="Cerrar"
          >
            <Icon path="M6 18L18 6M6 6l12 12" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-4">
          {/* Title */}
          <div>
            <label className={`block text-sm font-medium ${dash.textPrimary}`}>
              Título del Proyecto *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="ej: Física Introductoria"
              className={`mt-1 w-full rounded-lg px-3 py-2 transition-colors ${dash.input}`}
              autoFocus
            />
          </div>

          {/* Description */}
          <div>
            <label className={`block text-sm font-medium ${dash.textPrimary}`}>
              Descripción
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe brevemente este proyecto..."
              rows={3}
              className={`mt-1 w-full rounded-lg px-3 py-2 transition-colors ${dash.input}`}
            />
            <p className={`mt-1 text-xs ${dash.textMuted}`}>
              {description.length}/200 caracteres
            </p>
          </div>

          {/* Tags */}
          <div>
            <label className={`block text-sm font-medium ${dash.textPrimary}`}>
              Etiquetas
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="ej: ciencia, study, 2024"
              className={`mt-1 w-full rounded-lg px-3 py-2 transition-colors ${dash.input}`}
            />
            <p className={`mt-1 text-xs ${dash.textMuted}`}>
              Separa las etiquetas con comas
            </p>
          </div>
        </form>

        {/* Actions */}
        <div className={`flex gap-2 border-t px-6 py-4 ${dash.divider}`}>
          <button
            onClick={onClose}
            className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${dash.ghostBtn}`}
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={!title.trim()}
            className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition-all shadow-sm ${dash.primaryBtn} disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            Crear Proyecto
          </button>
        </div>
      </div>
    </div>
  );
}
