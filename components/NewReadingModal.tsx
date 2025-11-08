"use client";

import { useState } from "react";
import { Reading } from "@/types";
import { formatMarkdown } from "@/utils/markdownFormatter";

interface NewReadingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (reading: Reading) => void;
}

export default function NewReadingModal({
  isOpen,
  onClose,
  onSave,
}: NewReadingModalProps) {
  const [text, setText] = useState("");
  const [titleInput, setTitleInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!text.trim()) {
      setError("Please paste the content of the reading.");
      return;
    }

    const trimmedTitle = titleInput.trim();
    if (!trimmedTitle) {
      setError("Title is required.");
      return;
    }

    const derivedTitle = trimmedTitle
      .replace(/^#{1,6}\s+/, "")
      .replace(/\*\*/g, "")
      .replace(/\*/g, "")
      .replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1")
      .trim();

    // Formatear el contenido para eliminar líneas vacías innecesarias
    const formattedContent = formatMarkdown(text.trim());

    const newReading: Reading = {
      id: crypto.randomUUID(),
      title: derivedTitle || "Untitled",
      content: formattedContent,
    };

    onSave(newReading);
    setText("");
    setTitleInput("");
    setError(null);
    onClose();
  };

  const handleCancel = () => {
    setText("");
    setTitleInput("");
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] flex flex-col">
        <h2 className="text-xl font-semibold mb-4 text-gray-600">
          New Reading
        </h2>
        <input
          type="text"
          value={titleInput}
          onChange={(e) => {
            setTitleInput(e.target.value);
            if (error) {
              setError(null);
            }
          }}
          className="w-full mb-4 p-3 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400 text-gray-700"
          placeholder="Add a title"
        />
        {error && <p className="text-sm text-red-600 mb-2">{error}</p>}
        <textarea
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            if (error) {
              setError(null);
            }
          }}
          className="flex-1 w-full p-4 border border-gray-500 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400 text-gray-700"
          placeholder="Paste your article here."
        />
        <div className="flex gap-4 mt-4">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Save Reading
          </button>
          <button
            onClick={handleCancel}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
