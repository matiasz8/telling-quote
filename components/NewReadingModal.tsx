"use client";

import { useState, useEffect, useRef } from "react";
import { Reading } from "@/types";
import { formatMarkdown, normalizeTags } from "@/lib/utils";

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
  const [tagsInput, setTagsInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);

  // Auto-focus title input when modal opens
  useEffect(() => {
    if (isOpen && titleInputRef.current) {
      // Small delay to ensure modal is fully rendered
      setTimeout(() => {
        titleInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    // Validate content
    const trimmedText = text.trim();
    if (!trimmedText) {
      setError("Please paste the content of the reading.");
      return;
    }

    // Validate title
    const trimmedTitle = titleInput.trim();
    if (!trimmedTitle) {
      setError("Title is required.");
      return;
    }

    // Validate minimum content length
    if (trimmedText.length < 10) {
      setError("Content is too short. Please add more text.");
      return;
    }

    const derivedTitle = trimmedTitle
      .replace(/^#{1,6}\s+/, "")
      .replace(/\*\*/g, "")
      .replace(/\*/g, "")
      .replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1")
      .trim();

    // Formatear el contenido para eliminar líneas vacías innecesarias
    const formattedContent = formatMarkdown(trimmedText);

    const newReading: Reading = {
      id: crypto.randomUUID(),
      title: derivedTitle || "Untitled",
      content: formattedContent,
      tags: normalizeTags(tagsInput),
    };

    onSave(newReading);
    setText("");
    setTitleInput("");
    setTagsInput("");
    setError(null);
    onClose();
  };

  const handleCancel = () => {
    setText("");
    setTitleInput("");
    setTagsInput("");
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
          ref={titleInputRef}
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
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tags (optional)
          </label>
          <input
            type="text"
            value={tagsInput}
            onChange={(e) => {
              setTagsInput(e.target.value);
              if (error) {
                setError(null);
              }
            }}
            placeholder="javascript, react, tutorial"
            className="w-full p-3 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400 text-gray-700"
          />
          <p className="text-xs text-gray-500 mt-1">
            Separate tags with commas. Max 5 tags, 20 characters each.
          </p>
        </div>
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
            className="px-6 py-2.5 bg-linear-to-r from-purple-600 to-violet-600 text-white rounded-lg hover:from-purple-700 hover:to-violet-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:scale-105"
          >
            Save Reading
          </button>
          <button
            onClick={handleCancel}
            className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-200 font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
