'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState, useMemo } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useSettings } from '@/hooks/useSettings';
import { Reading, Project } from '@/types';
import { STORAGE_KEYS } from '@/lib/constants';
import {
  getProjectReadings,
  getProjectCompletionPercent,
  getProjectTags,
  filterProjectReadings,
} from '@/lib/dashboard/projectHelpers';
import { getExcerpt, getReadingTimeMinutes } from '@/lib/dashboard/projectHelpers';

const DEFAULT_PROJECT: Project = {
  id: 'default',
  title: 'Mis Lecturas',
  description: 'Proyecto por defecto para lecturas existentes',
  tags: [],
};

export default function ProjectPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  // Data storage
  const [projects] = useLocalStorage<Project[]>('projects', []);
  const [readings] = useLocalStorage<Reading[]>(STORAGE_KEYS.READINGS, []);
  const [completedReadings] = useLocalStorage<string[]>(
    'completedReadings',
    []
  );
  const [favoriteReadings] = useLocalStorage<string[]>(
    'favoriteReadings',
    []
  );

  // UI state
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  const { settings } = useSettings();

  // Get project and its readings
  const project = useMemo(
    () => projects.find((p) => p.id === projectId) || DEFAULT_PROJECT,
    [projectId, projects]
  );

  const projectReadings = useMemo(
    () => getProjectReadings(readings, projectId),
    [readings, projectId]
  );

  const projectTags = useMemo(
    () => getProjectTags(readings, projectId),
    [readings, projectId]
  );

  const filteredReadings = useMemo(
    () =>
      filterProjectReadings({
        readings,
        completedIds: completedReadings,
        favoriteIds: favoriteReadings,
        projectId,
        status: 'all',
        activeTag,
        query,
      }),
    [readings, completedReadings, favoriteReadings, projectId, activeTag, query]
  );

  const completionPercent = useMemo(
    () =>
      getProjectCompletionPercent(readings, completedReadings, projectId),
    [readings, completedReadings, projectId]
  );

  // Theme
  const isDark = settings.theme === 'dark' || settings.theme === 'detox';
  const bgColor = isDark ? 'bg-gray-900' : 'bg-white';
  const textColor = isDark ? 'text-gray-100' : 'text-gray-900';
  const borderColor = isDark ? 'border-gray-700' : 'border-gray-200';
  const hoverBg = isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-50';

  return (
    <div className={`min-h-screen ${bgColor} ${textColor}`}>
      {/* Header */}
      <header className={`border-b ${borderColor} sticky top-0 z-40 backdrop-blur`}>
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => router.back()}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${hoverBg} transition-colors`}
            >
              <span className="text-xl">←</span>
              <span className="font-medium">Volver</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
                className={`px-4 py-2 rounded-lg ${hoverBg} transition-colors`}
                title={viewMode === 'list' ? 'Ver en grid' : 'Ver en lista'}
              >
                {viewMode === 'list' ? '⊞' : '☰'}
              </button>
            </div>
          </div>

          {/* Project Info */}
          <div className="mb-4">
            <h1 className="text-4xl font-bold mb-2">{project.title}</h1>
            {project.description && (
              <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                {project.description}
              </p>
            )}

            {/* Progress Bar */}
            <div className="mt-4 w-full bg-gray-300 rounded-full h-2 overflow-hidden">
              <div
                className="bg-blue-500 h-full transition-all duration-300"
                style={{ width: `${completionPercent}%` }}
              />
            </div>
            <p className={`text-sm mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {projectReadings.filter((r) => completedReadings.includes(r.id)).length} /{' '}
              {projectReadings.length} lecturas completadas
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <input
            type="text"
            placeholder="Buscar lecturas..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={`w-full px-4 py-2 rounded-lg border ${borderColor} ${bgColor} ${textColor} focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />

          {/* Tags */}
          {projectTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveTag(null)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  activeTag === null
                    ? 'bg-blue-500 text-white'
                    : isDark
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Todas ({projectReadings.length})
              </button>
              {projectTags.map((tag) => {
                const count = projectReadings.filter((r) =>
                  r.tags?.includes(tag)
                ).length;
                return (
                  <button
                    key={tag}
                    onClick={() => setActiveTag(tag)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      activeTag === tag
                        ? 'bg-blue-500 text-white'
                        : isDark
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {tag} ({count})
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Readings */}
        {filteredReadings.length === 0 ? (
          <div className={`text-center py-12 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            <p className="text-lg">No se encontraron lecturas</p>
          </div>
        ) : viewMode === 'list' ? (
          // List View
          <div className="space-y-4">
            {filteredReadings.map((reading) => {
              const isCompleted = completedReadings.includes(reading.id);
              const isFavorite = favoriteReadings.includes(reading.id);

              return (
                <Link
                  key={reading.id}
                  href={`/reader/${reading.id}`}
                  className={`block p-4 rounded-lg border ${borderColor} ${hoverBg} transition-all group`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-semibold group-hover:text-blue-500 transition-colors truncate">
                          {reading.title}
                        </h3>
                        {isFavorite && <span className="text-lg">★</span>}
                        {isCompleted && (
                          <span
                            className={`text-sm px-2 py-1 rounded ${isDark ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800'}`}
                          >
                            ✓ Completada
                          </span>
                        )}
                      </div>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
                        {getExcerpt(reading.content, 200)}
                      </p>
                      {reading.tags && reading.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {reading.tags.map((tag) => (
                            <span
                              key={tag}
                              className={`text-xs px-2 py-1 rounded ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col items-end gap-2 text-sm">
                      <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                        {getReadingTimeMinutes(reading.content)} min
                      </span>
                      <span className="text-blue-500 font-medium group-hover:underline">
                        Leer →
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          // Grid View
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReadings.map((reading) => {
              const isCompleted = completedReadings.includes(reading.id);
              const isFavorite = favoriteReadings.includes(reading.id);

              return (
                <Link
                  key={reading.id}
                  href={`/reader/${reading.id}`}
                  className={`block p-6 rounded-lg border ${borderColor} ${hoverBg} transition-all group`}
                >
                  <div className="flex flex-col h-full">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <h3 className="text-lg font-semibold group-hover:text-blue-500 transition-colors line-clamp-2">
                        {reading.title}
                      </h3>
                      {isFavorite && <span className="text-xl flex-shrink-0">★</span>}
                    </div>

                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-3 flex-1 line-clamp-3`}>
                      {getExcerpt(reading.content, 150)}
                    </p>

                    {reading.tags && reading.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {reading.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className={`text-xs px-2 py-0.5 rounded ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-3 border-t">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          {getReadingTimeMinutes(reading.content)} min
                        </span>
                        {isCompleted && (
                          <span
                            className={`text-xs px-2 py-0.5 rounded ${isDark ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800'}`}
                          >
                            ✓
                          </span>
                        )}
                      </div>
                      <span className="text-blue-500 font-medium text-sm group-hover:underline">
                        Leer →
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
