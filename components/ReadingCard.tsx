'use client';

import Link from 'next/link';
import { Reading } from '@/types';

interface ReadingCardProps {
  reading: Reading;
  onEdit: (reading: Reading) => void;
  onDelete: (reading: Reading) => void;
  isDark?: boolean;
  isCompleted?: boolean;
}

export default function ReadingCard({ reading, onEdit, onDelete, isDark = false, isCompleted = false }: ReadingCardProps) {
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

  return (
    <div className={`w-full ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow border relative group`}>
      {/* Pending indicator - shown when reading is NOT completed */}
      {!isCompleted && (
        <div 
          className={`absolute top-3 left-3 w-3 h-3 rounded-full ${
            isDark ? 'bg-purple-500' : 'bg-lime-500'
          } shadow-sm`}
          title="Pending reading"
        />
      )}
      
      <Link href={`/reader/${reading.id}`} className="block">
        <h3 className={`text-lg font-semibold ${isDark ? 'text-gray-100' : 'text-gray-900'} line-clamp-2 ${!isCompleted ? 'pl-6' : ''} pr-8`}>{reading.title}</h3>
      </Link>
      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={handleEditClick}
          className="p-1.5 bg-linear-to-r from-emerald-500 to-teal-500 text-white rounded hover:from-emerald-600 hover:to-teal-600 transition-all duration-200 shadow-sm"
          title="Edit title"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button
          onClick={handleDeleteClick}
          className="p-1.5 bg-linear-to-r from-red-500 to-rose-500 text-white rounded hover:from-red-600 hover:to-rose-600 transition-all duration-200 shadow-sm"
          title="Delete reading"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
}

