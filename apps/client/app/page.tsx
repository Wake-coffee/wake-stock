"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import AuthGuard from "../components/AuthGuard";
import Header from "../components/Header";

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Buenos días";
    if (hour < 18) return "Buenas tardes";
    return "Buenas noches";
  };

  const menuItems = [
    {
      title: "Checklist",
      description: "Revisa el faltante del día",
      path: "/checklist",
      icon: "checklist",
      allowedRoles: ["ADMIN", "USER"],
    },
    {
      title: "Inventario",
      description: "Consulta y actualiza el stock",
      path: "/inventario",
      icon: "box",
      allowedRoles: ["ADMIN", "USER"],
    },
    {
      title: "Proveedores",
      description: "Gestiona tus proveedores",
      path: "/proveedores",
      icon: "truck",
      allowedRoles: ["ADMIN", "USER"],
    },
    {
      title: "Historial",
      description: "Consulta los últimos movimientos",
      path: "/reportes",
      icon: "clock",
      allowedRoles: ["ADMIN"],
    },
  ];

  const getIcon = (iconType: string) => {
    switch (iconType) {
      case "checklist":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      case "box":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 7.5V18a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18V7.5m18 0V5.25A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25v2.25m18 0h-13.5M3 7.5h13.5"
            />
          </svg>
        );
      case "truck":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 16h12M6 20a2 2 0 1 1 4 0 2 2 0 0 1-4 0zm10 0a2 2 0 1 1 4 0 2 2 0 0 1-4 0zM4 8h14v8H4z"
            />
          </svg>
        );
      case "clock":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      case "reception":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 7.5V18a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18V7.5m18 0V5.25A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25v2.25m18 0h-13.5M3 7.5h13.5"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-white text-zinc-900 flex flex-col font-sans w-full items-center">
        <div className="w-full">
          <Header />
        </div>

        <main className="flex-1 w-full max-w-[94vw] xl:max-w-350 flex flex-col py-10 gap-6">
          {/* Saludo */}
          <div className="flex flex-col gap-1">
            <h1 className="text-4xl font-black tracking-tight text-[#2B4236]">
              {getGreeting()} 👋
            </h1>
            <p className="text-sm font-medium text-zinc-500">
              ¿Qué quieres hacer hoy?
            </p>
          </div>

          {/* Botón destacado de Recepción */}
          <button
            onClick={() => router.push("/recepcion")}
            className="w-full h-30 bg-[#2B4236] hover:bg-[#354f41] text-white rounded-2xl px-6 py-5 shadow-[0_4px_12px_rgba(43,66,54,0.3)] hover:shadow-[0_8px_16px_rgba(43,66,54,0.4)] active:scale-[0.98] transition-all duration-200 flex items-center justify-between gap-4 group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#c7e9c0] rounded-full flex items-center justify-center text-[#2B4236] flex-shrink-0">
                {getIcon("reception")}
              </div>
              <div className="text-left">
                <p className="text-lg font-bold">Registrar recepción</p>
                <p className="text-sm text-white/80">
                  Añade los productos que han llegado
                </p>
              </div>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="w-5 h-5 flex-shrink-0 group-hover:translate-x-1 transition-transform"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 4.5L15.75 12l-7.5 7.5"
              />
            </svg>
          </button>

          {/* Grid de otros botones */}
          <div className="grid grid-cols-2 gap-4 w-full">
            {menuItems.map((item, index) => {
              const isAllowed = user && item.allowedRoles.includes(user.role);

              if (!isAllowed) {
                return (
                  <div
                    key={index}
                    className="bg-[#2B4236] text-white/30 rounded-2xl p-4 opacity-40 select-none cursor-not-allowed relative shadow-[0_2px_8px_rgba(0,0,0,0.1)]"
                  >
                    <div className="flex flex-col gap-2">
                      <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white/30">
                        {getIcon(item.icon)}
                      </div>
                      <div>
                        <p className="font-bold text-sm">{item.title}</p>
                        <p className="text-xs text-white/30">
                          {item.description}
                        </p>
                      </div>
                    </div>
                    <span className="absolute top-2 right-2 text-[8px] font-bold uppercase tracking-wider bg-zinc-800/80 px-1.5 py-0.5 rounded text-zinc-400">
                      Admin
                    </span>
                  </div>
                );
              }

              return (
                <button
                  key={index}
                  onClick={() => router.push(item.path)}
                  className="bg-[#2B4236] hover:bg-[#354f41] text-white rounded-2xl p-4 shadow-[0_2px_8px_rgba(43,66,54,0.2)] hover:shadow-[0_4px_12px_rgba(43,66,54,0.3)] active:scale-[0.97] transition-all duration-200 cursor-pointer text-left flex flex-col gap-3 group"
                >
                  <div className="w-10 h-10 bg-[#c7e9c0] rounded-full flex items-center justify-center text-[#2B4236] flex-shrink-0">
                    {getIcon(item.icon)}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-sm">{item.title}</p>
                    <p className="text-xs text-white/80">{item.description}</p>
                  </div>
                  <div className="flex justify-end group-hover:translate-x-1 transition-transform">
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
                        d="M8.25 4.5L15.75 12l-7.5 7.5"
                      />
                    </svg>
                  </div>
                </button>
              );
            })}
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
