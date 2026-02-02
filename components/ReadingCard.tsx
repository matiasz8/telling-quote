"use client";

import Link from "next/link";
import { Reading } from "@/types";
import { getTagColor } from "@/lib/utils";

interface ReadingCardProps {
  reading: Reading;
  onEdit: (reading: Reading) => void;
  onDelete: (reading: Reading) => void;
  onReactivate?: (reading: Reading) => void;
  isDark?: boolean;
  isDetox?: boolean;
  isHighContrast?: boolean;
  isCompleted?: boolean;
  isExample?: boolean;
}

export default function ReadingCard({
  reading,
  onEdit,
  onDelete,
  onReactivate,
  isDark = false,
  isDetox = false,
  isHighContrast = false,
  isCompleted = false,
  isExample = false,
}: ReadingCardProps) {
  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onEdit(reading);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete(reading);
  };

  const handleReactivateClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onReactivate) {
      onReactivate(reading);
    }
  };

  return (
    <div
      data-tour="reading-card"
      className={`w-full ${
        isHighContrast
          ? "bg-black border-2 border-white text-white"
          : isDetox
          ? "bg-white border-2 border-gray-300 text-gray-900"
          : isDark
          ? "bg-gray-800 border-gray-700"
          : "bg-white border-gray-200"
      } rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow border relative group`}
    >
      {/* Example badge */}
      {isExample && (
        <div
          className={`absolute top-3 ${
            !isCompleted ? "left-8" : "left-3"
          } px-2 py-0.5 rounded text-xs font-bold ${
            isHighContrast
              ? "bg-white text-black border-2 border-white"
              : isDetox
              ? "bg-gray-200 text-gray-900 border-2 border-gray-400"
              : isDark
              ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
              : "bg-yellow-100 text-yellow-700 border border-yellow-300"
          } shadow-sm`}
          title="Example reading"
        >
          Example
        </div>
      )}

      <Link href={`/reader/${reading.id}`} className="block">
        <h3
          className={`text-lg font-semibold ${
            isHighContrast
              ? "text-white"
              : isDetox
              ? "text-gray-900"
              : isDark
              ? "text-gray-100"
              : "text-gray-900"
          } line-clamp-2 ${
            !isCompleted && isExample
              ? "pl-24" // Pending indicator + badge
              : !isCompleted && !isExample
              ? "pl-6" // Pending indicator only
              : isCompleted && isExample
              ? "pl-20" // Badge only
              : "" // No padding needed
          } pr-8`}
        >
          {reading.title}
        </h3>
        {/* Tags */}
        {reading.tags && reading.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2 mb-2">
            {reading.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  isHighContrast
                    ? "bg-white text-black border border-white"
                    : isDetox
                    ? "bg-gray-200 text-gray-900 border border-gray-300"
                    : isDark
                    ? `${getTagColor(tag, true)} text-white`
                    : `${getTagColor(tag, false)} text-white`
                }`}
              >
                🏷️ {tag}
              </span>
            ))}
            {reading.tags.length > 3 && (
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  isHighContrast
                    ? "bg-white text-black border border-white"
                    : isDetox
                    ? "bg-gray-200 text-gray-700"
                    : isDark
                    ? "bg-gray-700 text-gray-300"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                +{reading.tags.length - 3} more
              </span>
            )}
          </div>
        )}
      </Link>
      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {isCompleted && onReactivate && (
          <button
            onClick={handleReactivateClick}
            className={`p-1.5 rounded transition-all duration-200 shadow-sm ${
              isHighContrast
                ? "bg-white text-black border-2 border-white hover:bg-gray-200"
                : isDetox
                ? "bg-gray-900 text-white border-2 border-gray-900 hover:bg-gray-800"
                : "bg-linear-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600"
            }`}
            aria-label={`Reactivar lectura: ${reading.title}`}
            title="Reactivar lectura"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
        )}
        <button
          onClick={handleEditClick}
          className={`p-1.5 rounded transition-all duration-200 shadow-sm ${
            isHighContrast
              ? "bg-white text-black border-2 border-white hover:bg-gray-200"
              : isDetox
              ? "bg-gray-900 text-white border-2 border-gray-900 hover:bg-gray-800"
              : "bg-linear-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600"
          }`}
          aria-label={`Edit reading title: ${reading.title}`}
          title="Edit title"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
        </button>
        <button
          onClick={handleDeleteClick}
          className={`p-1.5 rounded transition-all duration-200 shadow-sm ${
            isHighContrast
              ? "bg-white text-black border-2 border-white hover:bg-gray-200"
              : isDetox
              ? "bg-gray-900 text-white border-2 border-gray-900 hover:bg-gray-800"
              : "bg-linear-to-r from-red-500 to-rose-500 text-white hover:from-red-600 hover:to-rose-600"
          }`}
          aria-label={`Delete reading: ${reading.title}`}
          title="Delete reading"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
