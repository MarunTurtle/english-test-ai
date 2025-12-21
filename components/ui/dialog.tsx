'use client';

import { ReactNode, useEffect, useRef } from 'react';
import { FiX } from 'react-icons/fi';

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
}

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        onOpenChange(false);
      }
    };

    if (open) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onOpenChange(false);
        }
      }}
    >
      <div
        ref={dialogRef}
        className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

export function DialogContent({ children }: { children: ReactNode }) {
  return <div className="p-6">{children}</div>;
}

export function DialogHeader({ children }: { children: ReactNode }) {
  return <div className="mb-4">{children}</div>;
}

export function DialogTitle({ children }: { children: ReactNode }) {
  return <h2 className="text-2xl font-bold text-slate-900">{children}</h2>;
}

export function DialogDescription({ children }: { children: ReactNode }) {
  return <p className="text-sm text-slate-600 mt-2">{children}</p>;
}

export function DialogClose({ onClose }: { onClose: () => void }) {
  return (
    <button
      onClick={onClose}
      className="absolute top-4 right-4 p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
      aria-label="Close dialog"
    >
      <FiX className="w-5 h-5" />
    </button>
  );
}

export function DialogFooter({ children }: { children: ReactNode }) {
  return <div className="mt-6 flex gap-3 justify-end">{children}</div>;
}
