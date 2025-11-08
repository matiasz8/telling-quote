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
import { getThemeClasses } from '@/utils/styleHelpers';

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingReading, setEditingReading] = useState<Reading | null>(null);
  const [deletingReading, setDeletingReading] = useState<Reading | null>(null);
  const [readings, setReadings] = useLocalStorage<Reading[]>('readings', []);
  const { settings } = useSettings();
  const themeClasses = getThemeClasses(settings.theme);

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
    <div className={`min-h-screen ${isDark ? 'bg-linear-to-br from-purple-900 via-gray-900 to-black' : themeClasses.bg}`}>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-center mb-8">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Start a New Reading
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
