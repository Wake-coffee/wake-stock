"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";
import { api } from "../../utils/api";
import AuthGuard from "../../components/AuthGuard";
import Header from "../../components/Header";

interface Supplier {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  notes: string | null;
  website: string | null;
  createdAt: string;
  updatedAt: string;
}

interface Product {
  id: string;
  name: string;
  stock: number;
  minQuantity: number;
  maxQuantity: number;
  status: "DISPONIBLE" | "AGOTADO" | "BAJO_STOCK";
  imageUrl: string | null;
  supplierId: string | null;
}

export default function ProveedoresPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(
    null,
  );

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const suppliersRes = await api.get("/api/suppliers");
        if (!suppliersRes.ok) {
          throw new Error("Error al cargar la lista de proveedores");
        }
        const suppliersData = await suppliersRes.json();
        setSuppliers(suppliersData);

        const productsRes = await api.get("/api/products");
        if (productsRes.ok) {
          const productsData = await productsRes.json();
          setProducts(productsData);
        }
      } catch (err: unknown) {
        setError(
          err instanceof Error
            ? err.message
            : "Error al obtener los proveedores",
        );
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const handleDeleteSupplier = async (id: string, name: string) => {
    if (
      !window.confirm(
        `¿Estás seguro de que deseas eliminar al proveedor "${name}"?\nEsta acción es irreversible.`,
      )
    ) {
      return;
    }

    setError(null);
    setSuccess(null);

    try {
      const response = await api.delete(`/api/suppliers/${id}`);
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || "Error al eliminar el proveedor");
      }

      setSuppliers((prev) => prev.filter((s) => s.id !== id));
      setSuccess(`El proveedor "${name}" ha sido eliminado exitosamente.`);
      setSelectedSupplier(null);

      setTimeout(() => setSuccess(null), 3000);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Error al eliminar el proveedor",
      );
    }
  };

  const filteredSuppliers = suppliers.filter((supplier) => {
    const matchesSearch =
      supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (supplier.email &&
        supplier.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (supplier.notes &&
        supplier.notes.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  const isAdmin = user?.role === "ADMIN";

  const supplierProducts = selectedSupplier
    ? products.filter((p) => p.supplierId === selectedSupplier.id)
    : [];

  return (
    <AuthGuard>
      <div className="min-h-screen bg-white text-zinc-900 flex flex-col font-sans w-full items-center overflow-x-hidden">
        <div className="w-full">
          <Header />
        </div>

        {/* main con max-w-[94vw] para simular la rejilla perfecta alineada con la Home */}
        <main className="flex-1 w-full max-w-[94vw] xl:max-w-350 flex flex-col py-8! mb-24! box-border">
          {/* Cabecera */}
          <div className="flex flex-col gap-4 mb-8! pb-4! border-b border-zinc-105">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-black tracking-tight text-[#2B4236]">
                  Directorio de Proveedores
                </h1>
                <p className="mt-1.5 text-sm font-medium text-zinc-500">
                  Consulta y gestiona los contactos de distribuidores y notas de
                  entrega.
                </p>
              </div>

              {/* Crear Proveedor (Solo Admin) */}
              {isAdmin && (
                <div className="flex mb-2.5! mt-3! shrink-0">
                  <button
                    onClick={() => router.push("/editar?type=supplier")}
                    className="px-5! py-4! rounded-xl border border-zinc-200 bg-[#2B4236] hover:bg-[#354f41] text-white text-xs font-bold flex items-center gap-2 transition-all duration-200 cursor-pointer shadow-sm active:scale-95"
                  >
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
                    Nuevo Proveedor
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Notificaciones */}
          {error && (
            <div className="mb-6! flex items-center gap-2.5 rounded-2xl bg-red-50 border border-red-200 p-4! text-sm font-semibold text-red-700 shadow-sm animate-in fade-in duration-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5 shrink-0"
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
            <div className="mb-6! flex items-center gap-2.5 rounded-2xl bg-emerald-50 border border-emerald-200 p-4! text-sm font-semibold text-emerald-700 shadow-sm animate-in fade-in duration-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5 shrink-0"
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

          {/* Stats Bar Premium Rediseñado */}
          <div className="grid grid-cols-3 gap-3 mb-6! box-border">
            <div className="bg-white border border-zinc-200 rounded-2xl p-4! shadow-[0_4px_10px_rgba(0,0,0,0.01)]">
              <span className="text-zinc-400 text-[10px] font-black uppercase tracking-widest block">
                Total Proveedores
              </span>
              <span className="text-2xl font-black text-[#2B4236] mt-1! block">
                {suppliers.length}
              </span>
            </div>
            <div className="bg-white border border-zinc-200 rounded-2xl p-4! shadow-[0_4px_10px_rgba(0,0,0,0.01)]">
              <span className="text-zinc-400 text-[10px] font-black uppercase tracking-widest block">
                Con Notas
              </span>
              <span className="text-2xl font-black text-emerald-700 mt-1! block">
                {
                  suppliers.filter((s) => s.notes && s.notes.trim() !== "")
                    .length
                }
              </span>
            </div>
            <div className="bg-white border border-zinc-200 rounded-2xl p-4! shadow-[0_4px_10px_rgba(0,0,0,0.01)]">
              <span className="text-zinc-400 text-[10px] font-black uppercase tracking-widest block">
                Productos Asig.
              </span>
              <span className="text-2xl font-black text-zinc-700 mt-1! block">
                {products.filter((p) => p.supplierId !== null).length}
              </span>
            </div>
          </div>

          {/* Buscador */}
          <div className="relative mb-6! p-2! box-border">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-zinc-400"></div>
            <input
              type="text"
              placeholder="Buscar por nombre, email o notas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl bg-white border border-zinc-200 py-3! pl-12! pr-4! text-sm font-medium text-zinc-900 placeholder-zinc-400 outline-none transition-all duration-200 focus:border-[#2B4236] focus:ring-1 focus:ring-[#2B4236] shadow-sm"
            />
          </div>

          {/* Lista de Proveedores */}
          {isLoading ? (
            <div className="flex-1 flex items-center justify-center py-24!">
              <div className="h-9 w-9 animate-spin rounded-full border-4 border-zinc-100 border-t-[#2B4236]" />
            </div>
          ) : filteredSuppliers.length === 0 ? (
            <div className="text-center py-20! bg-zinc-50 border-2 border-dashed border-zinc-200 rounded-3xl p-6!">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-14 h-14 text-zinc-300 mx-auto mb-3!"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
                />
              </svg>
              <h3 className="text-zinc-800 font-bold text-lg">
                No se encontraron proveedores
              </h3>
              <p className="text-zinc-500 text-sm font-medium mt-1!">
                Intenta ajustar tu búsqueda o crea uno nuevo.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredSuppliers.map((supplier) => {
                const associatedCount = products.filter(
                  (p) => p.supplierId === supplier.id,
                ).length;

                return (
                  <div
                    key={supplier.id}
                    onClick={() => setSelectedSupplier(supplier)}
                    className="bg-white hover:bg-zinc-50/40 border border-zinc-200 hover:border-[#2B4236]/30 rounded-2xl p-5! cursor-pointer transition-all duration-200 group flex flex-col justify-between shadow-[0_4px_10px_rgba(0,0,0,0.02)] box-border"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-3!">
                        <h3 className="text-lg font-bold text-zinc-900 group-hover:text-[#2B4236] transition-colors duration-200">
                          {supplier.name}
                        </h3>
                        <span className="text-[10px] font-bold text-zinc-650 bg-zinc-50 px-2.5 py-0.5 rounded-lg border border-zinc-200 shrink-0 uppercase tracking-wide">
                          {associatedCount} prod.
                        </span>
                      </div>

                      <div className="space-y-2! text-xs font-medium text-zinc-500">
                        {supplier.phone && (
                          <div className="flex items-center gap-2 pl-0.5!">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={2}
                              stroke="currentColor"
                              className="w-3.5 h-3.5 text-zinc-400"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M2.25 6.58b1.071 1.071 0 0 1 .521-.861A19.742 19.742 0 0 1 12 4c3.486 0 6.64 1.254 9.229 3.328a1.07 1.07 0 0 1 .521.86v6.58A1.07 1.07 0 0 1 21.229 16c-2.589-2.074-5.743-3.328-9.229-3.328s-6.64 1.254-9.229 3.328A1.07 1.07 0 0 1 2.25 15.658V6.58Z"
                              />
                            </svg>
                            <span>{supplier.phone}</span>
                          </div>
                        )}
                        {supplier.email && (
                          <div className="flex items-center gap-2 pl-0.5!">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={2}
                              stroke="currentColor"
                              className="w-3.5 h-3.5 text-zinc-400"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                              />
                            </svg>
                            <span className="truncate">{supplier.email}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {supplier.notes && (
                      <div className="mt-4! pt-3! border-t border-zinc-100">
                        <p className="text-zinc-400 text-[11px] font-medium line-clamp-2 italic">
                          &quot;{supplier.notes}&quot;
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </main>

        {/* Modal de Detalle Rediseñado */}
        {selectedSupplier && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4! z-50 animate-in fade-in duration-200">
            <div className="bg-white border border-zinc-100 rounded-[28px] w-full max-w-lg overflow-hidden relative shadow-2xl">
              {/* Encabezado del Modal */}
              <div className="bg-zinc-50 px-6! py-5! border-b border-zinc-100 flex justify-between items-start box-border">
                <div>
                  <span className="text-[10px] font-black text-[#2B4236] uppercase tracking-widest block mb-1!">
                    Ficha de Proveedor
                  </span>
                  <h2 className="text-xl font-extrabold text-zinc-900 leading-tight">
                    {selectedSupplier.name}
                  </h2>
                </div>
                <button
                  onClick={() => setSelectedSupplier(null)}
                  className="rounded-full bg-white p-1.5! text-zinc-400 hover:text-zinc-700 border border-zinc-200 hover:border-zinc-300 transition-colors cursor-pointer"
                >
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
                      d="M6 18 18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Contenido del Modal */}
              <div className="p-6! space-y-5! max-h-[70vh] overflow-y-auto box-border">
                {/* Contacto Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4!">
                  <div className="bg-zinc-50/60 p-4! rounded-2xl  border border-zinc-400 box-border">
                    <span className="text-zinc-400 text-[10px] font-black uppercase tracking-widest block mb-1!">
                      Teléfono
                    </span>
                    {selectedSupplier.phone ? (
                      <a
                        href={`tel:${selectedSupplier.phone}`}
                        className="text-sm font-bold text-zinc-800 hover:text-[#2B4236] transition-colors duration-200"
                      >
                        {selectedSupplier.phone}
                      </a>
                    ) : (
                      <span className="text-xs font-semibold text-zinc-400 italic">
                        No registrado
                      </span>
                    )}
                  </div>

                  <div className="bg-zinc-50/60 p-4! rounded-2xl border border-zinc-400 box-border">
                    <span className="text-zinc-400 text-[10px] font-black uppercase tracking-widest block mb-1!">
                      Correo Electrónico
                    </span>
                    {selectedSupplier.email ? (
                      <a
                        href={`mailto:${selectedSupplier.email}`}
                        className="text-sm font-bold text-zinc-800 hover:text-[#2B4236] transition-colors duration-200 truncate block"
                      >
                        {selectedSupplier.email}
                      </a>
                    ) : (
                      <span className="text-xs font-semibold text-zinc-400 italic">
                        No registrado
                      </span>
                    )}
                  </div>
                </div>

                {/* Sitio Web */}
                {selectedSupplier.website && (
                  <div className="bg-zinc-50/60 p-4! rounded-2xl border border-zinc-400 box-border">
                    <span className="text-zinc-400 text-[10px] font-black uppercase tracking-widest block mb-1!">
                      Sitio Web
                    </span>
                    <a
                      href={
                        selectedSupplier.website.startsWith("http")
                          ? selectedSupplier.website
                          : `https://${selectedSupplier.website}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-bold text-[#2B4236] hover:text-[#354f41] hover:underline transition-colors duration-200 flex items-center gap-1.5!"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-4 h-4 shrink-0"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-.778.099-1.533.284-2.253"
                        />
                      </svg>
                      {selectedSupplier.website}
                    </a>
                  </div>
                )}

                {/* Notas de Entrega */}
                <div className="bg-zinc-50/60 p-4! rounded-2xl border border-zinc-400 box-border">
                  <span className="text-zinc-400 text-[10px] font-black uppercase tracking-widest block mb-2!">
                    Notas de Entrega / Información General
                  </span>
                  {selectedSupplier.notes ? (
                    <p className="text-sm font-medium text-zinc-800 whitespace-pre-wrap leading-relaxed">
                      {selectedSupplier.notes}
                    </p>
                  ) : (
                    <p className="text-xs font-semibold text-zinc-400 italic">
                      Sin notas registradas para este proveedor.
                    </p>
                  )}
                </div>

                {/* Productos Suministrados */}
                <div className="box-border">
                  <span className="text-zinc-400 text-[10px] font-black uppercase tracking-widest block mb-2!">
                    Productos Suministrados ({supplierProducts.length})
                  </span>
                  {supplierProducts.length === 0 ? (
                    <div className="text-center py-6! bg-zinc-50 border border-zinc-400 rounded-2xl box-border">
                      <p className="text-xs font-semibold text-zinc-400 italic">
                        No hay productos asignados a este proveedor en el
                        inventario.
                      </p>
                    </div>
                  ) : (
                    <div className="max-h-40 overflow-y-auto space-y-2! pr-1! custom-scrollbar box-border">
                      {supplierProducts.map((prod) => {
                        let badgeColor =
                          "bg-emerald-50 text-emerald-700 border-emerald-100 p-1.5!";
                        if (prod.status === "AGOTADO") {
                          badgeColor =
                            "bg-red-50 text-red-700 border-red-100 p-1.5!";
                        } else if (prod.status === "BAJO_STOCK") {
                          badgeColor =
                            "bg-amber-50 text-amber-700 border-amber-100 p-1.5!";
                        }

                        return (
                          <div
                            key={prod.id}
                            className="flex items-center justify-between p-3! bg-zinc-50 border border-zinc-150 rounded-xl text-xs font-semibold text-zinc-700 box-border"
                          >
                            <span className="font-bold text-zinc-800 pl-1!">
                              {prod.name}
                            </span>
                            <div className="flex items-center gap-2.5! pr-1!">
                              <span className="text-zinc-500 font-medium">
                                {prod.stock} uds.
                              </span>
                              <span
                                className={`text-[9px] font-black uppercase tracking-wider rounded-lg border ${badgeColor}`}
                              >
                                {prod.status.replace("_", " ")}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Acciones de Administración del Modal */}
              <div className="bg-zinc-50 px-6! py-4! border-t border-zinc-100 flex items-center justify-between box-border">
                {isAdmin ? (
                  <>
                    <button
                      onClick={() =>
                        handleDeleteSupplier(
                          selectedSupplier.id,
                          selectedSupplier.name,
                        )
                      }
                      className="flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-4! py-2.5! text-xs font-bold text-red-600 hover:bg-red-100 hover:text-red-700 transition-all shadow-sm cursor-pointer active:scale-95"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2.3}
                        stroke="currentColor"
                        className="w-3.5 h-3.5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                        />
                      </svg>
                      Eliminar
                    </button>
                    <button
                      onClick={() =>
                        router.push(
                          `/editar?type=supplier&id=${selectedSupplier.id}`,
                        )
                      }
                      className="flex items-center gap-1.5 rounded-xl bg-[#2B4236] hover:bg-[#354f41] border border-transparent px-5! py-2.5! text-xs font-bold text-white transition-all shadow-sm cursor-pointer active:scale-95"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2.3}
                        stroke="currentColor"
                        className="w-3.5 h-3.5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.83 20.08a4.5 4.5 0 0 1-2.014 1.248l-3.37.839a.75.75 0 0 1-.905-.905l.839-3.37a4.5 4.5 0 0 1 1.248-2.013L17.485 3.03a1.875 1.875 0 0 1 2.652 0ZM10.582 8.3L15.7 13.43"
                        />
                      </svg>
                      Editar Ficha
                    </button>
                  </>
                ) : (
                  <div className="w-full flex justify-end">
                    <button
                      onClick={() => setSelectedSupplier(null)}
                      className="rounded-xl bg-white hover:bg-zinc-50 border border-zinc-200 px-5! py-2.5! text-xs font-bold text-zinc-700 transition-colors cursor-pointer shadow-sm active:scale-95"
                    >
                      Cerrar
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AuthGuard>
  );
}
