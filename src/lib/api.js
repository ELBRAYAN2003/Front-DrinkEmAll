// Cliente HTTP contra la API de DrinkEmAll.
//
// Las rutas que piden sesion (`auth: true`) mandan el token de acceso y, si la API
// contesta 401 porque venció, lo renuevan una vez con el token de refresco y
// repiten el pedido. Si la renovacion falla, la sesion se cierra.
//
// El backend responde SIEMPRE con el mismo sobre en los listados:
//   { data: [...], meta: { page, pageSize, total, totalPages } }
// y con el objeto plano en los detalles. Los errores llegan con un status
// fuera del rango 2xx y un cuerpo JSON con el mensaje.

import { borrarSesion, guardarSesion, leerSesion } from './sesion.js'

export const API_URL = import.meta.env.VITE_API_URL ?? ''
export const API_FILES = import.meta.env.VITE_API_FILES ?? ''

// Permite arrancar sin backend: si no hay URL configurada, la app cae al
// catalogo de maqueta en lugar de romper.
export const hayApi = Boolean(API_URL)

export class ApiError extends Error {
  constructor(message, status, details = null, code = null) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    // La API devuelve, en los errores de validacion, [{ path, message }].
    this.details = details
    // Codigo estable de algunos errores de negocio (PERFIL_INCOMPLETO, MENOR_DE_EDAD).
    this.code = code
  }
}

function construirUrl(ruta, params = {}) {
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
  return url
}

// Una sola renovacion a la vez: si varios pedidos reciben 401 juntos, todos
// esperan la misma. El refresco rota el token (cada uno sirve una sola vez), asi
// que dos renovaciones en paralelo harian fallar a la segunda.
let renovando = null

function renovarSesion() {
  renovando ??= (async () => {
    const actual = leerSesion()
    if (!actual) return null
    try {
      const res = await fetch(construirUrl('/auth/refresh'), {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: actual.refreshToken }),
      })
      if (!res.ok) {
        // El token de refresco ya no sirve (vencio o lo revocaron): hay que volver a ingresar.
        borrarSesion()
        return null
      }
      const { accessToken, refreshToken } = await res.json()
      const nueva = { ...actual, accessToken, refreshToken }
      guardarSesion(nueva)
      return nueva
    } catch {
      // Sin red no se puede renovar, pero eso no es motivo para cerrar la sesion.
      return null
    }
  })().finally(() => {
    renovando = null
  })
  return renovando
}

async function pedir(metodo, ruta, { params, body, signal, auth = false, formato = 'json' } = {}) {
  if (!hayApi) throw new ApiError('No hay VITE_API_URL configurada', 0)

  const url = construirUrl(ruta, params)
  const enviar = (token) =>
    fetch(url, {
      method: metodo,
      signal,
      headers: {
        Accept: formato === 'blob' ? 'application/pdf' : 'application/json',
        ...(body !== undefined && { 'Content-Type': 'application/json' }),
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })

  const sesion = auth ? leerSesion() : null
  if (auth && !sesion) throw new ApiError('Tenes que iniciar sesion.', 401)

  let res
  try {
    res = await enviar(sesion?.accessToken)
    if (res.status === 401 && auth) {
      const nueva = await renovarSesion()
      if (nueva) res = await enviar(nueva.accessToken)
    }
  } catch (error) {
    if (error.name === 'AbortError') throw error
    throw new ApiError('No pudimos conectar con el servidor. Proba de nuevo en un momento.', 0)
  }

  if (!res.ok) {
    const cuerpo = await res.json().catch(() => null)
    throw new ApiError(cuerpo?.message ?? `Error ${res.status} al pedir ${ruta}`, res.status, cuerpo?.details ?? null, cuerpo?.code ?? null)
  }
  // 204: la API contesta sin cuerpo (por ejemplo al cerrar sesion).
  if (formato === 'blob') return res.blob()
  return res.status === 204 ? null : res.json()
}

/**
 * @param {string} ruta  por ejemplo '/products'
 * @param {{params?: Record<string, unknown>, signal?: AbortSignal, auth?: boolean}} opciones
 */
export const apiGet = (ruta, opciones) => pedir('GET', ruta, opciones)
export const apiPost = (ruta, opciones) => pedir('POST', ruta, opciones)
export const apiPatch = (ruta, opciones) => pedir('PATCH', ruta, opciones)
/** Baja un archivo (PDF) con la sesion: devuelve un Blob. */
export const apiBlob = (ruta, opciones) => pedir('GET', ruta, { ...opciones, formato: 'blob' })
export const apiPut = (ruta, opciones) => pedir('PUT', ruta, opciones)
export const apiDelete = (ruta, opciones) => pedir('DELETE', ruta, opciones)

/** Convierte una imageUrl relativa del backend en una URL absoluta. */
export function urlDeArchivo(ruta) {
  if (!ruta) return null
  if (/^https?:\/\//i.test(ruta)) return ruta
  return `${API_FILES}${ruta.startsWith('/') ? '' : '/'}${ruta}`
}
