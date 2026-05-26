"use client";

import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (!user) return null;

  return (
    <header className="w-full bg-[#2B4236] h-16 flex items-center pl-6 pr-10 md:pr-16 justify-between relative shadow-md z-50">
      {/* Espaciador izquierdo */}
      <div className="w-10 h-10 pointer-events-none" />

      {/* Título centrado */}
      <div
        className="absolute left-1/2 -translate-x-1/2 cursor-pointer text-xl font-medium tracking-wider text-white hover:opacity-80 transition-all select-none uppercase"
        onClick={() => router.push("/")}
      >
        wake stock
      </div>

      {/* Avatar con Dropdown mejorado */}
      <div
        className="relative flex items-center"
        style={{ marginRight: "8px" }}
      >
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="h-10 w-10 rounded-full bg-white flex items-center justify-center text-xl hover:scale-105 active:scale-95 transition-all focus:outline-none cursor-pointer border-none shadow-md"
        >
          <span className="opacity-80">👤</span>
        </button>

        {showDropdown && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowDropdown(false)}
            />

            {/* MENÚ DROPDOWN REDISEÑADO */}
            <div className="absolute right-0 top-12 bg-white shadow-[0_20px_25px_-5px_rgba(0,0,0,0.2),0_10px_10px_-5px_rgba(0,0,0,0.1)] border border-zinc-100 overflow-hidden z-50 animate-in fade-in zoom-in duration-200">
              {/* Info Usuario */}
              <div className="px-5! py-4! bg-zinc-50/80 border-b border-zinc-100">
                <p className="text-sm font-bold text-[#2B4236] truncate leading-tight">
                  {user.name}
                </p>
                <div className="inline-block mt-1.5! px-2! py-0.5! bg-[#2B4236]/10 rounded-lg">
                  <p className="text-[10px] font-black text-[#2B4236] uppercase tracking-widest">
                    {user.role}
                  </p>
                </div>
              </div>

              {/* Acciones */}
              <div className="p-2">
                <button
                  onClick={() => {
                    setShowDropdown(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center gap-3! px-4! py-3! text-sm font-bold text-red-500 hover:bg-red-50 rounded-[18px] transition-colors cursor-pointer border-none bg-transparent group"
                >
                  <div className="p-1.5! bg-red-100 rounded-lg group-hover:bg-red-200 transition-colors">
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
                        d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75"
                      />
                    </svg>
                  </div>
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
