"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  // Mientras se valida el token al arrancar la app, mostramos un spinner estético
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="relative flex items-center justify-center">
          {/* Spinner exterior animado */}
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-zinc-200 border-t-[#1a3a2a]" />
          {/* Destello estético central */}
          <div className="absolute h-4 w-4 rounded-full bg-[#1a3a2a]/20" />
        </div>
      </div>
    );
  }

  // Si no está autenticado, retornamos null para evitar el parpadeo de contenido privado antes de que se complete el redireccionamiento
  if (!user) {
    return null;
  }

  // Si el usuario está autenticado, renderizamos los contenidos protegidos
  return <>{children}</>;
}
