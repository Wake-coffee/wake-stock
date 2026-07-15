"use client";

import React from "react";

interface ReportModalProps {
  isOpen: boolean;
  isLoading?: boolean;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
}

export default function ReportModal({
  isOpen,
  isLoading = false,
  onConfirm,
  onCancel,
}: ReportModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/15 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-[90vw] max-w-md p-6 sm:p-7 animate-in zoom-in-95 duration-200 border border-zinc-100 shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
        {/* Header */}
        <div className="mb-6 text-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 border border-green-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6 text-[#2B4236]"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75L11.25 10.5m0 0l2.25 2.25m-2.25-2.25v8.5m6-13.5H5.625c-1.036 0-1.875.84-1.875 1.875v12.75c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V3.375c0-1.036-.84-1.875-1.875-1.875z"
              />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-zinc-900">
            Enviar Reporte Mensual
          </h2>
          <p className="text-xs font-medium text-zinc-500 mt-1">
            Confirma para enviar el snapshot del estado de inventario
          </p>
        </div>

        {/* Información - Estilo Wake Verde */}
        <div className="mb-6 flex items-start gap-3 rounded-2xl bg-green-100 border border-green-600 p-4 text-sm text-green-950 shadow-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5 shrink-0 mt-0.5 text-green-950"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
            />
          </svg>
          <div>
            <p className="font-bold">Se reportarán todos los productos</p>
            <p className="text-xs text-green-950 mt-0.5">
              Stocks actuales y cambios registrados este mes serán enviados al historial.
            </p>
          </div>
        </div>

        {/* Botones */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-xs font-bold text-zinc-700 hover:bg-zinc-50 transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-sm"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-[#2B4236] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#354f41] transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-[0_4px_12px_rgba(43,66,54,0.2)]"
          >
            {isLoading ? (
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
      </div>
    </div>
  );
}
