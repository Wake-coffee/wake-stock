"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";
import { api } from "../../utils/api";
import AuthGuard from "../../components/AuthGuard";
import Header from "../../components/Header";

interface ReportItem {
  id: string;
  name: string;
  stock: number;
  minQuantity: number;
  maxQuantity: number;
  status: string;
  supplierName: string;
}

interface Report {
  id: string;
  submittedBy: string;
  items: ReportItem[];
  createdAt: string;
}

export default function ReportesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedReportId, setExpandedReportId] = useState<string | null>(null);

  const isAdmin = user?.role === "ADMIN";

  // Redirección si no es ADMIN
  useEffect(() => {
    if (user && user.role !== "ADMIN") {
      router.replace("/");
    }
  }, [user, router]);

  useEffect(() => {
    async function loadReports() {
      if (!isAdmin) return;
      try {
        setIsLoading(true);
        const response = await api.get("/api/reports");
        if (!response.ok) {
          throw new Error("Error al obtener el historial de reportes");
        }
        const data = await response.json();
        setReports(data);
      } catch (err: unknown) {
        setError(
          err instanceof Error ? err.message : "Error al cargar los reportes",
        );
      } finally {
        setIsLoading(false);
      }
    }
    loadReports();
  }, [isAdmin]);

  const toggleExpand = (id: string) => {
    setExpandedReportId((prev) => (prev === id ? null : id));
  };

  // Filtrado reactivo en el cliente por el usuario o productos contenidos en el reporte
  const filteredReports = reports.filter((report) => {
    const matchesUser = report.submittedBy
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchesProduct = report.items.some((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    return matchesUser || matchesProduct;
  });

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!isAdmin) {
    return null; // Ocultar mientras redirige
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-white text-zinc-900 flex flex-col font-sans w-full items-center overflow-x-hidden">
        <div className="w-full">
          <Header />
        </div>

        {/* main adaptado con max-w-[94vw] exacto */}
        <main className="flex-1 w-full max-w-[94vw] xl:max-w-350 flex flex-col py-8! mb-24! box-border">
          {/* Cabecera de Página */}
          <div className="flex flex-col gap-4 mb-8! pb-4! border-b border-zinc-105">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-[#2B4236]">
                Historial de Reportes
              </h1>
              <p className="mt-1.5 text-sm font-medium text-zinc-500">
                Visualiza y audita los checklists diarios completados
                anteriormente por el personal.
              </p>
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

          {/* Buscador */}
          <div className="relative mb-6! p-2! box-border">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-zinc-400"></div>
            <input
              type="text"
              placeholder="Buscar por usuario o nombre del producto..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl bg-white border border-zinc-200 py-3! pl-12! pr-4! text-sm font-medium text-zinc-900 placeholder-zinc-400 outline-none transition-all duration-200 focus:border-[#2B4236] focus:ring-1 focus:ring-[#2B4236] shadow-sm"
            />
          </div>

          {/* Listado de Reportes */}
          {isLoading ? (
            <div className="flex-1 flex items-center justify-center py-24! text-zinc-500 gap-3 box-border">
              <div className="h-9 w-9 animate-spin rounded-full border-4 border-zinc-100 border-t-[#2B4236]" />
            </div>
          ) : filteredReports.length === 0 ? (
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
                  d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.03 0 1.9.693 2.166 1.638m-7.377 12.481A6.762 6.762 0 0 1 6 16.419V9c0-1.104.896-2 2-2h8a2 2 0 0 1 2 2v7.419c0 1.253-.342 2.427-.94 3.442"
                />
              </svg>
              <h3 className="text-zinc-800 font-bold text-lg">
                No hay reportes registrados
              </h3>
              <p className="text-zinc-500 text-sm font-medium mt-1!">
                Aparecerán aquí cuando el personal envíe checklists de cocina.
              </p>
            </div>
          ) : (
            <div className="space-y-3!">
              {filteredReports.map((report, reportIdx) => {
                const isExpanded = expandedReportId === report.id;

                const criticalCount = report.items.filter(
                  (item) =>
                    item &&
                    (item.status === "AGOTADO" || item.status === "BAJO_STOCK"),
                ).length;

                return (
                  <div
                    key={report.id ?? reportIdx}
                    className={`rounded-2xl border transition-all duration-200 overflow-hidden box-border ${
                      isExpanded
                        ? "border-[#2B4236] bg-zinc-50/40 shadow-[0_4px_12px_rgba(43,66,54,0.05)]"
                        : "border-zinc-200 bg-white hover:border-[#2B4236]/30 hover:bg-zinc-50/40 shadow-[0_4px_10px_rgba(0,0,0,0.02)]"
                    }`}
                  >
                    {/* Cabecera del Reporte Acordeón */}
                    <div
                      onClick={() => toggleExpand(report.id)}
                      className="group p-5! relative flex items-center justify-between gap-4 cursor-pointer select-none box-border"
                    >
                      <div className="flex-1 min-w-0 pl-1!">
                        <div className="flex items-center gap-2 mb-2! flex-wrap">
                          <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                            Reporte
                          </span>
                          <span className="text-xs font-bold text-zinc-650 bg-zinc-50 border border-zinc-200 px-3! py-1! rounded-xl shadow-sm">
                            {formatDate(report.createdAt)}
                          </span>
                          {criticalCount > 0 && (
                            <span className="text-[10px] font-bold uppercase tracking-wider text-red-700 bg-red-50 border border-red-100 px-2.5! py-1! rounded-lg">
                              {criticalCount} Críticos
                            </span>
                          )}
                        </div>
                        <h3 className="text-base font-bold text-zinc-800 group-hover:text-[#2B4236] transition-colors duration-200">
                          Enviado por:{" "}
                          <span className="text-[#2B4236] font-black">
                            {report.submittedBy}
                          </span>
                        </h3>
                      </div>

                      <div className="flex items-center gap-3 shrink-0 box-border pr-1!">
                        <span className="text-xs font-bold text-zinc-650 bg-zinc-50 border border-zinc-200 px-3! py-1.5! rounded-xl uppercase tracking-wide shadow-sm">
                          {report.items.length} Prod.
                        </span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2.5}
                          stroke="currentColor"
                          className={`w-4 h-4 text-zinc-400 transition-transform duration-300 ${
                            isExpanded ? "rotate-180 text-[#2B4236]" : ""
                          }`}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m19.5 8.25-7.5 7.5-7.5-7.5"
                          />
                        </svg>
                      </div>
                    </div>

                    {/* Desplegable Interno: Listado de Ítems */}
                    {isExpanded && (
                      <div className="border-t border-zinc-200 p-6! bg-white space-y-4! box-border animate-in fade-in duration-200">
                        <h4 className="text-xs font-black uppercase tracking-widest text-zinc-400 pl-1!">
                          Productos en Alerta
                        </h4>

                        {/* Cuadrícula interna de productos reportados */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {report.items.map((item, itemIdx) => {
                            let badgeColor;
                            if (item.status === "AGOTADO") {
                              badgeColor =
                                "bg-red-50 text-red-700 border-red-100 p-1.5!";
                            } else if (item.status === "BAJO_STOCK") {
                              badgeColor =
                                "bg-amber-50 text-amber-700 border-amber-100 p-1.5!";
                            } else {
                              badgeColor =
                                "bg-zinc-50 text-zinc-650 border-zinc-200 p-1.5!";
                            }

                            return (
                              <div
                                key={item.id ?? `${reportIdx}-${itemIdx}`}
                                className="bg-white border border-zinc-200 p-4! rounded-2xl flex flex-col justify-between shadow-[0_4px_10px_rgba(0,0,0,0.01)] box-border"
                              >
                                <div className="flex items-start justify-between gap-3 mb-3!">
                                  <div className="min-w-0 pl-0.5!">
                                    <h5 className="font-bold text-sm text-zinc-800 truncate">
                                      {item.name}
                                    </h5>
                                    <span className="text-[10px] font-medium text-zinc-400 block mt-0.5!">
                                      Proveedor: {item.supplierName}
                                    </span>
                                  </div>
                                  <span
                                    className={`text-[10px] font-bold uppercase tracking-wider rounded-lg border shrink-0 ${badgeColor}`}
                                  >
                                    {item.status
                                      ? item.status.replace("_", " ")
                                      : "N/D"}
                                  </span>
                                </div>

                                <div className="flex items-center justify-between text-xs font-medium text-zinc-500 pt-3! border-t border-zinc-100 px-0.5!">
                                  <span>
                                    Stock Reportado:{" "}
                                    <strong className="text-[#2B4236] font-bold">
                                      {item.stock} uds.
                                    </strong>
                                  </span>
                                  <span className="text-zinc-400">
                                    Mínimo: {item.minQuantity} uds.
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </AuthGuard>
  );
}
