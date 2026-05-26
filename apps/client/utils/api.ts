const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// Helper para obtener una cookie en el cliente
function getCookie(name: string): string | null {
  if (typeof window === "undefined") return null;
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    if (!c) continue;
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

// Obtener el token de cookies o localStorage
export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return getCookie("token") || localStorage.getItem("token");
}

// Guardar el token en cookie y localStorage (útil para el login)
export function setToken(token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("token", token);
  // Almacenar también en cookie (expira en 24 horas, compatible con SSR/AuthGuards)
  document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Lax`;
}

// Remover el token de cookie y localStorage (útil para el logout)
export function removeToken(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem("token");
  document.cookie =
    "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
}

interface FetchOptions extends RequestInit {
  json?: unknown;
}

// Función fetch principal con inyección automática del token
export async function apiFetch(
  endpoint: string,
  options: FetchOptions = {},
): Promise<Response> {
  const token = getToken();

  // Normalizar la URL
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = endpoint.startsWith("http")
    ? endpoint
    : `${API_BASE_URL}${cleanEndpoint}`;

  // Combinar cabeceras
  const headers = new Headers(options.headers);
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  // Atajo opcional para mandar objetos JSON directamente
  let body = options.body;
  if (options.json !== undefined) {
    headers.set("Content-Type", "application/json");
    body = JSON.stringify(options.json);
  } else if (
    body &&
    !(body instanceof FormData) &&
    !headers.has("Content-Type")
  ) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(url, {
    ...options,
    body,
    headers,
  });

  return response;
}

// Métodos de conveniencia REST listos para usar
export const api = {
  get: (endpoint: string, options?: FetchOptions) =>
    apiFetch(endpoint, { ...options, method: "GET" }),

  post: (
    endpoint: string,
    data?: Record<string, unknown>,
    options?: FetchOptions,
  ) => apiFetch(endpoint, { ...options, method: "POST", json: data }),

  put: (
    endpoint: string,
    data?: Record<string, unknown>,
    options?: FetchOptions,
  ) => apiFetch(endpoint, { ...options, method: "PUT", json: data }),

  patch: (
    endpoint: string,
    data?: Record<string, unknown>,
    options?: FetchOptions,
  ) => apiFetch(endpoint, { ...options, method: "PATCH", json: data }),

  delete: (endpoint: string, options?: FetchOptions) =>
    apiFetch(endpoint, { ...options, method: "DELETE" }),
};
