"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import AuthGuard from "../components/AuthGuard";
import Header from "../components/Header";

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();

  const menuItems = [
    {
      title: "Checklist",
      path: "/checklist",
      allowedRoles: ["ADMIN", "USER"],
    },
    {
      title: "Inventario",
      path: "/inventario",
      allowedRoles: ["ADMIN", "USER"],
    },
    {
      title: "Proveedores",
      path: "/proveedores",
      allowedRoles: ["ADMIN", "USER"],
    },
    {
      title: "Historial",
      path: "/reportes",
      allowedRoles: ["ADMIN"],
    },
  ];

  return (
    <AuthGuard>
      {/* 1. Añadimos items-center aquí para asegurar que todo el layout se centre en pantallas gigantes */}
      <div className="min-h-screen bg-white text-zinc-900 flex flex-col font-sans w-full items-center">
        {/* Contenedor del Header que ocupe todo el ancho */}
        <div className="w-full">
          <Header />
        </div>

        {/* 2. El secreto: Cambiamos max-w-full por max-w-[94vw] (o el porcentaje que quieras de margen) */}
        <main className="flex-1 w-full max-w-[94vw] xl:max-w-350 flex items-center justify-center py-4">
          {/* Cuadrícula centrada con gap de 2 */}
          <div className="grid grid-cols-2 gap-2 w-full justify-center">
            {menuItems.map((item, index) => {
              const isAllowed = user && item.allowedRoles.includes(user.role);

              if (!isAllowed) {
                return (
                  <div
                    key={index}
                    className="bg-[#2B4236] text-white/30 rounded-2xl h-32 sm:h-40 md:h-56 lg:h-64 w-full flex items-center justify-center opacity-40 select-none cursor-not-allowed relative px-4 text-center shadow-[0_4px_10px_rgba(0,0,0,0.3)]"
                  >
                    <span className="text-base sm:text-xl md:text-2xl font-semibold tracking-wide">
                      {item.title}
                    </span>
                    <span className="absolute top-2 right-2 text-[9px] font-bold uppercase tracking-wider bg-zinc-800/80 px-1.5 py-0.5 rounded text-zinc-400">
                      Solo Admin
                    </span>
                  </div>
                );
              }

              return (
                <div
                  key={index}
                  onClick={() => router.push(item.path)}
                  className="bg-[#2B4236] hover:bg-[#354f41] text-white rounded-2xl h-32 sm:h-40 md:h-56 lg:h-64 w-full flex items-center justify-center shadow-[0_5px_12px_rgba(0,0,0,0.35)] hover:shadow-[0_8px_16px_rgba(0,0,0,0.4)] active:scale-[0.99] transition-all duration-200 cursor-pointer text-center select-none px-4"
                >
                  <span className="text-base sm:text-xl md:text-2xl font-semibold tracking-wide">
                    {item.title}
                  </span>
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
