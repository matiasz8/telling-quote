'use client';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ConfirmDeleteModal({
  isOpen,
  title,
  onClose,
  onConfirm,
}: ConfirmDeleteModalProps) {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'Enter') {
      handleConfirm();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
      onClick={onClose}
      onKeyDown={handleKeyDown}
    >
      <div
        className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md mx-4 transform transition-all"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-delete-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center mb-4">
          <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
            <svg
              className="w-6 h-6 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h3 id="confirm-delete-title" className="text-xl font-semibold text-gray-900">Delete Reading</h3>
        </div>

        <p className="text-gray-700 mb-6 ml-16">
          Are you sure you want to delete <span className="font-semibold text-gray-900">&ldquo;{title}&rdquo;</span>? This action cannot be undone.
        </p>

        <div className="flex gap-3 justify-end ml-16">
          <button
            onClick={onClose}
            aria-label="Cancel delete operation"
            className="px-5 py-2.5 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-all duration-200 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            aria-label={`Confirm deletion of: ${title}`}
            className="px-5 py-2.5 bg-linear-to-r from-red-600 to-rose-600 text-white rounded-lg hover:from-red-700 hover:to-rose-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

