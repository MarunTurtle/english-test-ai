'use client';

import { ReactNode } from 'react';
import { MdWarning, MdClose } from 'react-icons/md';

interface AlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  cancelText?: string;
  confirmText?: string;
  variant?: 'danger' | 'warning' | 'info';
  onConfirm: () => void;
  isLoading?: boolean;
}

/**
 * Alert Dialog component for confirmations
 * Replaces browser confirm() with a more polished UI
 */
export function AlertDialog({
  open,
  onOpenChange,
  title,
  description,
  cancelText = 'Cancel',
  confirmText = 'Confirm',
  variant = 'danger',
  onConfirm,
  isLoading = false,
}: AlertDialogProps) {
  if (!open) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isLoading) {
      onOpenChange(false);
    }
  };

  const handleConfirm = () => {
    onConfirm();
    // Don't close automatically - let parent handle it after async operation
  };

  const handleCancel = () => {
    if (!isLoading) {
      onOpenChange(false);
    }
  };

  // Variant colors
  const variantStyles = {
    danger: {
      icon: 'text-red-600 bg-red-100',
      button: 'bg-red-600 hover:bg-red-700 text-white',
    },
    warning: {
      icon: 'text-amber-600 bg-amber-100',
      button: 'bg-amber-600 hover:bg-amber-700 text-white',
    },
    info: {
      icon: 'text-blue-600 bg-blue-100',
      button: 'bg-blue-600 hover:bg-blue-700 text-white',
    },
  };

  const styles = variantStyles[variant];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fadeIn"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 animate-scaleIn">
        {/* Header */}
        <div className="p-6 pb-4">
          <div className="flex items-start gap-4">
            <div className={`flex-shrink-0 w-12 h-12 rounded-full ${styles.icon} flex items-center justify-center`}>
              <MdWarning className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                {title}
              </h3>
              <p className="text-sm text-slate-600">
                {description}
              </p>
            </div>
            <button
              onClick={handleCancel}
              disabled={isLoading}
              className="flex-shrink-0 text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-50"
            >
              <MdClose className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 pb-6 flex gap-3 justify-end">
          <button
            onClick={handleCancel}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2 ${styles.button}`}
          >
            {isLoading && (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
            )}
            {confirmText}
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.15s ease-out;
        }

        .animate-scaleIn {
          animation: scaleIn 0.15s ease-out;
        }
      `}</style>
    </div>
  );
}

