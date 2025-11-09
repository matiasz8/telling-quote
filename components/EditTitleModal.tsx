"use client";

import { useState } from "react";

interface EditTitleModalProps {
  isOpen: boolean;
  currentTitle: string;
  onClose: () => void;
  onSave: (newTitle: string) => void;
}

export default function EditTitleModal({
  isOpen,
  currentTitle,
  onClose,
  onSave,
}: EditTitleModalProps) {
  const [title, setTitle] = useState(currentTitle);

  if (!isOpen) return null;

  const handleSave = () => {
    const trimmedTitle = title.trim();
    
    if (!trimmedTitle) {
      // Don't save empty titles
      return;
    }
    
    if (trimmedTitle.length > 200) {
      // Prevent excessively long titles
      return;
    }
    
    onSave(trimmedTitle);
    onClose();
  };

  const handleCancel = () => {
    // Reset to current title on cancel
    setTitle(currentTitle);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-600">Edit Title</h2>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 placeholder:text-gray-400 text-gray-700"
          placeholder="Enter title"
          autoFocus
        />
        <div className="flex gap-4">
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2.5 bg-linear-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
          >
            Save
          </button>
          <button
            onClick={handleCancel}
            className="flex-1 px-4 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-200 font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
