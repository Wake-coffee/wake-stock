"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";
import { api } from "../../utils/api";
import AuthGuard from "../../components/AuthGuard";
import Header from "../../components/Header";

interface Product {
  id: string;
  name: string;
  stock: number;
  unit: string;
  supplier?: {
    name: string;
  } | null;
}

interface Reception {
  id: string;
  productId: string;
  product: Product;
  quantityReceived: number;
  notes: string | null;
  receivedBy: string;
  receivedAt: string;
}

export default function RecepcionPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<Reception[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // Estado del formulario
  const [form, setForm] = useState({
    productId: "",
    quantityReceived: "",
    notes: "",
  });

  const isAdmin = user?.role === "ADMIN";

  // Cargar productos
  useEffect(() => {
    async function loadProducts() {
      try {
        const response = await api.get("/api/products");
        if (!response.ok) {
          throw new Error("Error al cargar productos");
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al cargar productos");
      } finally {
        setIsLoading(false);
      }
    }
    loadProducts();
  }, []);

  // Obtener fecha y hora actual
  const getCurrentDateTime = () => {
    const now = new Date();
    return now.toLocaleString("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  // Manejar envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!form.productId || !form.quantityReceived) {
      setError("Por favor completa los campos requeridos");
      return;
    }

    const quantity = parseFloat(form.quantityReceived);
    if (quantity <= 0) {
      setError("La cantidad debe ser mayor a 0");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await api.post("/api/receptions", {
        productId: form.productId,
        quantityReceived: quantity,
        notes: form.notes || null,
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Error al registrar recepción");
      }

      setSuccess("✅ Recepción registrada correctamente");
      setForm({ productId: "", quantityReceived: "", notes: "" });

      // Limpiar mensaje de éxito después de 3 segundos
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al registrar recepción");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Cargar histórico (solo ADMIN)
  const loadHistory = async () => {
    if (!isAdmin) return;

    setIsLoadingHistory(true);
    try {
      const response = await api.get("/api/receptions");
      if (!response.ok) {
        throw new Error("Error al cargar histórico");
      }
      const data = await response.json();
      setHistory(data.receptions || []);
      setShowHistory(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar histórico");
    } finally {
      setIsLoadingHistory(false);
    }
  };

  if (isLoading) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-white text-zinc-900 flex flex-col font-sans w-full items-center overflow-x-hidden">
          <Header />
          <div className="flex-1 flex items-center justify-center">
            <div className="h-9 w-9 animate-spin rounded-full border-4 border-zinc-100 border-t-[#2B4236]" />
          </div>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-white text-zinc-900 flex flex-col font-sans w-full items-center overflow-x-hidden">
        <Header />

        <main className="flex-1 w-full max-w-[94vw] xl:max-w-350 flex flex-col py-8 mb-24 box-border">
          <div className="flex flex-col gap-2 mb-8 pb-4 border-b border-zinc-105">
            <h1 className="text-3xl font-black tracking-tight text-[#2B4236]">
              Recepción de Productos
            </h1>
            <p className="text-sm font-medium text-zinc-500">
              Registra los productos que llegan al local
            </p>
          </div>

          {/* Alertas */}
          {error && (
            <div className="mb-6 flex items-center gap-2.5 rounded-2xl bg-red-50 border border-red-200 p-4 text-sm font-semibold text-red-700 shadow-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
                />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-6 flex items-center gap-2.5 rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-sm font-semibold text-emerald-700 shadow-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
              <span>{success}</span>
            </div>
          )}

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="bg-white border border-zinc-200 rounded-[28px] p-6 sm:p-8 space-y-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] box-border mb-8">
            <div>
              <label className="block text-xs font-black text-zinc-400 uppercase tracking-widest mb-2 pl-1">
                Buscar Producto *
              </label>
              <select
                value={form.productId}
                onChange={(e) => setForm({ ...form, productId: e.target.value })}
                className="w-full rounded-2xl bg-white border border-zinc-200 py-3 px-4 text-sm font-medium text-zinc-900 outline-none transition-all focus:border-[#2B4236] focus:ring-1 focus:ring-[#2B4236] shadow-sm cursor-pointer"
              >
                <option value="">-- Selecciona un producto --</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} ({product.supplier?.name || "Sin proveedor"})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-black text-zinc-400 uppercase tracking-widest mb-2 pl-1">
                Cantidad Recibida *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="0"
                value={form.quantityReceived}
                onChange={(e) => setForm({ ...form, quantityReceived: e.target.value })}
                className="w-full rounded-2xl bg-white border border-zinc-200 py-3 px-4 text-sm font-medium text-zinc-900 placeholder-zinc-400 outline-none transition-all focus:border-[#2B4236] focus:ring-1 focus:ring-[#2B4236] shadow-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-zinc-400 uppercase tracking-widest mb-2 pl-1">
                Notas (Opcional)
              </label>
              <textarea
                placeholder="Agrega notas sobre la recepción..."
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                rows={3}
                className="w-full rounded-2xl bg-white border border-zinc-200 py-3 px-4 text-sm font-medium text-zinc-900 placeholder-zinc-400 outline-none transition-all focus:border-[#2B4236] focus:ring-1 focus:ring-[#2B4236] shadow-sm resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-zinc-400 uppercase tracking-widest mb-2 pl-1">
                Fecha y Hora
              </label>
              <input
                type="text"
                disabled
                value={getCurrentDateTime()}
                className="w-full rounded-2xl bg-zinc-50 border border-zinc-200 py-3 px-4 text-sm font-medium text-zinc-500 outline-none cursor-not-allowed"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#2B4236] px-6 py-3 text-sm font-bold text-white hover:bg-[#354f41] transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_12px_rgba(43,66,54,0.3)]"
            >
              {isSubmitting ? (
                <>
                  <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
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
                  Registrando...
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2.5}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4.5v15m7.5-7.5h-15"
                    />
                  </svg>
                  Registrar Recepción
                </>
              )}
            </button>
          </form>

          {/* Botón para ver histórico (solo ADMIN) */}
          {isAdmin && (
            <button
              onClick={loadHistory}
              className="w-full flex items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-6 py-3 text-sm font-bold text-zinc-700 hover:bg-zinc-50 transition-all duration-200 cursor-pointer shadow-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v6h4.5m4.5-10.5V4.5a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 4.5v15A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V7.5"
                />
              </svg>
              {showHistory ? "Ocultar Histórico" : "Ver Histórico"}
            </button>
          )}

          {/* Histórico (solo ADMIN) */}
          {showHistory && isAdmin && (
            <div className="mt-8">
              <h2 className="text-xl font-bold text-zinc-800 mb-4">Histórico de Recepciones</h2>

              {isLoadingHistory ? (
                <div className="flex items-center justify-center py-8">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-100 border-t-[#2B4236]" />
                </div>
              ) : history.length === 0 ? (
                <div className="text-center py-8 text-zinc-500">
                  <p>No hay recepciones registradas aún</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {history.map((reception) => (
                    <div
                      key={reception.id}
                      className="border border-zinc-200 rounded-2xl p-4 bg-zinc-50 hover:bg-white transition-colors"
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-zinc-900 text-sm">
                            {reception.product.name}
                          </p>
                          <p className="text-xs text-zinc-500 mt-1">
                            Cantidad: {reception.quantityReceived} {reception.product.unit}
                          </p>
                          {reception.notes && (
                            <p className="text-xs text-zinc-600 mt-2 italic">
                              Nota: {reception.notes}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-zinc-500">
                            {new Date(reception.receivedAt).toLocaleString("es-ES")}
                          </p>
                          <p className="text-xs text-zinc-400 mt-1">
                            Por: {reception.receivedBy}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </AuthGuard>
  );
}
