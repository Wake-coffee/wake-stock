"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";

export default function LoginPage() {
  const { login, user, isLoading: authLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // Si el usuario ya está autenticado, redirigir automáticamente a la raíz
  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Por favor, rellene todos los campos.");
      return;
    }

    setIsSubmitting(true);
    try {
      await login(email, password);
      router.push("/");
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Error al iniciar sesión. Por favor, verifique sus credenciales.";
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Prevenir parpadeo visual del formulario si el estado de sesión está cargando
  if (authLoading || user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-zinc-200 border-t-[#2B4236]" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F0F0F0] md:bg-white px-4! py-12! sm:px-6! lg:px-8!">
      {/* Tarjeta de Login Principal - Estilo Wake Stock con esquinas muy redondeadas */}
      <div className="relative w-full max-w-md space-y-8 rounded-[28px] border border-zinc-200 bg-white p-8! shadow-[0_15px_35px_rgba(0,0,0,0.1)]">
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Alerta de Error estilizada con bordes 2xl */}
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

          <div className="space-y-4">
            {/* Input Correo */}
            <div>
              <label
                htmlFor="email-address"
                className="block text-xs font-black uppercase tracking-widest text-zinc-400 pl-1!"
              >
                Correo Electrónico
              </label>
              <div className="mt-2! relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4! pointer-events-none text-zinc-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-4 h-4 ml-1!"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                    />
                  </svg>
                </div>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-2xl border border-zinc-200 bg-white py-3! pl-11! pr-4! text-sm font-medium text-zinc-900 placeholder-zinc-400 outline-none transition-all duration-200 focus:border-[#2B4236] focus:ring-1 focus:ring-[#2B4236] shadow-sm"
                  placeholder="admin@wake.com"
                />
              </div>
            </div>

            {/* Input Contraseña */}
            <div>
              <label
                htmlFor="password"
                className="block text-xs font-black uppercase tracking-widest text-zinc-400 pl-1! mt-3!"
              >
                Contraseña
              </label>
              <div className="mt-2! mb-2! relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4! pointer-events-none text-zinc-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-4 h-4 ml-1!"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0V10.5m-3 1.125c0-.622.504-1.125 1.125-1.125h2.25c.622 0 1.125.504 1.125 1.125V21h-4.5V11.625Zm9.75 0c0-.622.504-1.125 1.125-1.125h2.25c.622 0 1.125.504 1.125 1.125V21h-4.5V11.625Z"
                    />
                  </svg>
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-2xl border border-zinc-200 bg-white py-3! pl-11! pr-4! text-sm font-medium text-zinc-900 placeholder-zinc-400 outline-none transition-all duration-200 focus:border-[#2B4236] focus:ring-1 focus:ring-[#2B4236] shadow-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          {/* Botón Acceder - Estilo grande con relieve exacto de tus botones de la home */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center items-center rounded-xl bg-[#2B4236] hover:bg-[#354f41] px-5! py-3.5! text-sm font-bold text-white outline-none transition-all duration-200 shadow-[0_4px_12px_rgba(43,66,54,0.3)] active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100 disabled:shadow-none cursor-pointer border-none"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <svg
                  className="h-4 w-4 animate-spin text-white"
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
                Iniciando sesión...
              </span>
            ) : (
              "Entrar al sistema"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
