// Cliente HTTP contra la API de DrinkEmAll.
//
// El backend responde SIEMPRE con el mismo sobre en los listados:
//   { data: [...], meta: { page, pageSize, total, totalPages } }
// y con el objeto plano en los detalles. Los errores llegan con un status
// fuera del rango 2xx y un cuerpo JSON con el mensaje.

export const API_URL = import.meta.env.VITE_API_URL ?? ''
export const API_FILES = import.meta.env.VITE_API_FILES ?? ''

// Permite arrancar sin backend: si no hay URL configurada, la app cae al
// catalogo de maqueta en lugar de romper.
export const hayApi = Boolean(API_URL)

export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

/**
 * @param {string} ruta  por ejemplo '/products'
 * @param {{params?: Record<string, unknown>, signal?: AbortSignal}} opciones
 */
export async function apiGet(ruta, { params = {}, signal } = {}) {
  if (!hayApi) throw new ApiError('No hay VITE_API_URL configurada', 0)

  // La base permite que VITE_API_URL sea relativa ('/api'), que es lo que se
  // usa cuando el front y la API se sirven desde el mismo dominio: asi no hay
  // host escrito en el build ni hace falta CORS. Si la URL ya es absoluta, el
  // segundo argumento se ignora.
  const url = new URL(`${API_URL}${ruta}`, window.location.origin)
  for (const [clave, valor] of Object.entries(params)) {
    // Los parametros vacios se omiten: el backend los valida con Zod y un
    // string vacio no pasa el esquema.
    if (valor !== undefined && valor !== null && valor !== '') {
      url.searchParams.set(clave, String(valor))
    }
  }

  const res = await fetch(url, {
    signal,
    headers: { Accept: 'application/json' },
  })

  if (!res.ok) {
    const cuerpo = await res.json().catch(() => null)
    throw new ApiError(cuerpo?.message ?? `Error ${res.status} al pedir ${ruta}`, res.status)
  }
  return res.json()
}

/** Convierte una imageUrl relativa del backend en una URL absoluta. */
export function urlDeArchivo(ruta) {
  if (!ruta) return null
  if (/^https?:\/\//i.test(ruta)) return ruta
  return `${API_FILES}${ruta.startsWith('/') ? '' : '/'}${ruta}`
}
