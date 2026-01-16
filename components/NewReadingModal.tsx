"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Reading } from "@/types";
import { formatMarkdown, normalizeTags } from "@/lib/utils";
import { useSettings } from "@/hooks/useSettings";
import { useFocusTrap } from "@/hooks/useFocusTrap";

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
  const { settings } = useSettings();
  const isDark = settings.theme === "dark";
  const isDetox = settings.theme === "detox";
  const isHighContrast = settings.theme === "high-contrast";
  
  const [text, setText] = useState("");
  const [titleInput, setTitleInput] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Focus trap
  useFocusTrap(modalRef, isOpen);

  const handleCancel = useCallback(() => {
    setText("");
    setTitleInput("");
    setTagsInput("");
    setError(null);
    onClose();
  }, [onClose]);

  // Escape key handler
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleCancel();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, handleCancel]);

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div 
        ref={modalRef}
        className={`rounded-lg p-6 w-full max-w-2xl max-h-[80vh] flex flex-col ${
        isHighContrast
          ? "bg-black border-2 border-white"
          : isDetox
          ? "bg-white border border-gray-300"
          : isDark
          ? "bg-gray-800"
          : "bg-white"
      }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-reading-title"
      >
        <h2 id="new-reading-title" className={`text-xl font-semibold mb-4 ${
          isHighContrast
            ? "text-white"
            : isDetox
            ? "text-gray-900"
            : isDark
            ? "text-gray-200"
            : "text-gray-600"
        }`}>
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
          className={`w-full mb-4 p-3 border rounded-lg focus:outline-none focus:ring-2 ${
            isHighContrast
              ? "bg-black text-white border-white focus:ring-white placeholder:text-gray-400"
              : isDetox
              ? "bg-white text-gray-900 border-gray-500 focus:ring-gray-700 placeholder:text-gray-400"
              : isDark
              ? "bg-gray-700 text-gray-200 border-gray-600 focus:ring-purple-500 placeholder:text-gray-400"
              : "bg-white text-gray-700 border-gray-500 focus:ring-blue-500 placeholder:text-gray-400"
          }`}
          placeholder="Add a title"
        />
        <div className="mb-4">
          <label className={`block text-sm font-medium mb-2 ${
            isHighContrast
              ? "text-white"
              : isDetox
              ? "text-gray-900"
              : isDark
              ? "text-gray-300"
              : "text-gray-700"
          }`}>
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
            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
              isHighContrast
                ? "bg-black text-white border-white focus:ring-white placeholder:text-gray-400"
                : isDetox
                ? "bg-white text-gray-900 border-gray-500 focus:ring-gray-700 placeholder:text-gray-400"
                : isDark
                ? "bg-gray-700 text-gray-200 border-gray-600 focus:ring-purple-500 placeholder:text-gray-400"
                : "bg-white text-gray-700 border-gray-500 focus:ring-blue-500 placeholder:text-gray-400"
            }`}
          />
          <p className={`text-xs mt-1 ${
            isHighContrast
              ? "text-gray-400"
              : isDetox
              ? "text-gray-600"
              : isDark
              ? "text-gray-400"
              : "text-gray-500"
          }`}>
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
          className={`flex-1 w-full p-4 border rounded-lg resize-none focus:outline-none focus:ring-2 ${
            isHighContrast
              ? "bg-black text-white border-white focus:ring-white placeholder:text-gray-400"
              : isDetox
              ? "bg-white text-gray-900 border-gray-500 focus:ring-gray-700 placeholder:text-gray-400"
              : isDark
              ? "bg-gray-700 text-gray-200 border-gray-600 focus:ring-purple-500 placeholder:text-gray-400"
              : "bg-white text-gray-700 border-gray-500 focus:ring-blue-500 placeholder:text-gray-400"
          }`}
          placeholder="Paste your article here."
        />
        <div className="flex gap-4 mt-4">
          <button
            onClick={handleSave}
            className={`px-6 py-2.5 rounded-lg transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:scale-105 ${
              isHighContrast
                ? "bg-white text-black hover:bg-gray-200"
                : isDetox
                ? "bg-gray-900 text-white hover:bg-gray-800"
                : isDark
                ? "bg-gradient-to-r from-purple-600 to-violet-600 text-white hover:from-purple-700 hover:to-violet-700"
                : "bg-gradient-to-r from-lime-500 to-emerald-500 text-white hover:from-lime-600 hover:to-emerald-600"
            }`}
          >
            Save Reading
          </button>
          <button
            onClick={handleCancel}
            className={`px-6 py-2.5 rounded-lg transition-all duration-200 font-medium ${
              isHighContrast
                ? "bg-gray-800 text-white hover:bg-gray-700 border border-white"
                : isDetox
                ? "bg-gray-200 text-gray-900 hover:bg-gray-300"
                : isDark
                ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
