'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import NewReadingModal from '@/components/NewReadingModal';
import EditTitleModal from '@/components/EditTitleModal';
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal';
import ReadingCard from '@/components/ReadingCard';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useSettings } from '@/hooks/useSettings';
import { Reading } from '@/types';
import { STORAGE_KEYS } from '@/lib/constants';

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingReading, setEditingReading] = useState<Reading | null>(null);
  const [deletingReading, setDeletingReading] = useState<Reading | null>(null);
  const [readings, setReadings] = useLocalStorage<Reading[]>(STORAGE_KEYS.READINGS, []);
  const { settings } = useSettings();

  const handleSave = (reading: Reading) => {
    setReadings((prev) => [...prev, reading]);
  };

  const handleEdit = (reading: Reading) => {
    setEditingReading(reading);
    setIsEditModalOpen(true);
  };

  const handleEditSave = (newTitle: string) => {
    if (!editingReading) return;
    setReadings((prev) =>
      prev.map((r) => (r.id === editingReading.id ? { ...r, title: newTitle } : r))
    );
    setIsEditModalOpen(false);
    setEditingReading(null);
  };

  const handleDelete = (reading: Reading) => {
    setDeletingReading(reading);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!deletingReading) return;
    setReadings((prev) => prev.filter((r) => r.id !== deletingReading.id));
    setIsDeleteModalOpen(false);
    setDeletingReading(null);
  };

  const isDark = settings.theme === 'dark';

  return (
    <div suppressHydrationWarning className={`min-h-screen ${isDark ? 'bg-linear-to-br from-purple-900 via-gray-900 to-black' : 'bg-linear-to-br from-yellow-50 via-lime-100 to-emerald-50'}`}>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-center mb-8">
          <button
            onClick={() => setIsModalOpen(true)}
            className={`
              group relative px-8 py-4 rounded-xl font-semibold text-lg
              transform transition-all duration-300 ease-out
              hover:scale-105 active:scale-95
              ${isDark 
                ? 'bg-linear-to-r from-purple-600 via-violet-600 to-fuchsia-600 text-white shadow-lg shadow-purple-500/50 hover:shadow-xl hover:shadow-purple-500/70' 
                : 'bg-linear-to-r from-lime-500 via-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/50 hover:shadow-xl hover:shadow-emerald-500/70'
              }
            `}
          >
            <span className="relative z-10 flex items-center gap-2">
              <svg 
                className="w-5 h-5 transform group-hover:rotate-12 transition-transform duration-300" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Reading
            </span>
            <div className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${isDark ? 'bg-linear-to-r from-purple-400 via-violet-400 to-fuchsia-400' : 'bg-linear-to-r from-lime-400 via-emerald-400 to-teal-400'} blur-xl -z-10`}></div>
          </button>
        </div>
        {readings.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
            {readings.map((reading) => (
              <ReadingCard
                key={reading.id}
                reading={reading}
                onEdit={handleEdit}
                onDelete={handleDelete}
                isDark={settings.theme === 'dark'}
              />
            ))}
          </div>
        )}
      </main>
      <NewReadingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />
      {editingReading && (
        <EditTitleModal
          key={editingReading.id}
          isOpen={isEditModalOpen}
          currentTitle={editingReading.title}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingReading(null);
          }}
          onSave={handleEditSave}
        />
      )}
      {deletingReading && (
        <ConfirmDeleteModal
          isOpen={isDeleteModalOpen}
          title={deletingReading.title}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setDeletingReading(null);
          }}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </div>
  );
}
