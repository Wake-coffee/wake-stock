"use client";

import React, { useState } from "react";

interface NotesModalProps {
  isOpen: boolean;
  selectedCount: number;
  onConfirm: (notes: string) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function NotesModal({
  isOpen,
  selectedCount,
  onConfirm,
  onCancel,
  isLoading = false,
}: NotesModalProps) {
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onConfirm(notes);
      setNotes("");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setNotes("");
    onCancel();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/15 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white/95 rounded-2xl w-[90vw] max-w-md p-6 sm:p-7 animate-in zoom-in-95 duration-200 border border-zinc-100 shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
        {/* Header */}
        <div className="mb-6 text-center">
          <h2 className="text-lg font-bold text-zinc-900 mb-1">
            Agregar notas al reporte
          </h2>
          <p className="text-xs font-medium text-zinc-500">
            {selectedCount === 1
              ? "1 producto seleccionado"
              : `${selectedCount} productos seleccionados`}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Textarea */}
          <div className="space-y-2.5">
            <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider">
              Observaciones
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Agrega cualquier nota importante..."
              maxLength={500}
              rows={4}
              className="w-full rounded-2xl border border-zinc-150 bg-zinc-50/50 px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition-all duration-200 focus:border-[#2B4236]/30 focus:ring-1 focus:ring-[#2B4236]/20 focus:bg-white resize-none"
            />
            <div className="flex justify-between items-center">
              <span className="text-[11px] text-zinc-400 font-medium">
                Opcional
              </span>
              <span className="text-[11px] text-zinc-400">
                {notes.length}/500
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2.5 pt-2">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSubmitting || isLoading}
              className="flex-1 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-xs font-bold text-zinc-700 hover:bg-zinc-50 transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-sm"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-[#2B4236] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#354f41] transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-[0_4px_12px_rgba(43,66,54,0.2)]"
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="h-3.5 w-3.5 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Enviando...
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2.5}
                    stroke="currentColor"
                    className="w-3.5 h-3.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
                    />
                  </svg>
                  Enviar
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
