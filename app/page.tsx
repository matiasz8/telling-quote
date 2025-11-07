'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import NewReadingModal from '@/components/NewReadingModal';
import EditTitleModal from '@/components/EditTitleModal';
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal';
import ReadingCard from '@/components/ReadingCard';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Reading } from '@/types';

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingReading, setEditingReading] = useState<Reading | null>(null);
  const [deletingReading, setDeletingReading] = useState<Reading | null>(null);
  const [readings, setReadings] = useLocalStorage<Reading[]>('readings', []);

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

  return (
    <div className="min-h-screen bg-gray-50">
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
          <div className="flex w-full space-x-4 p-4 overflow-x-auto">
            {readings.map((reading) => (
              <ReadingCard
                key={reading.id}
                reading={reading}
                onEdit={handleEdit}
                onDelete={handleDelete}
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
