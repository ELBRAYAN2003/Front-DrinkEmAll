import { apiGet, apiPatch, apiPost } from '../lib/api.js'
import { borrarSesion, guardarSesion, leerSesion } from '../lib/sesion.js'
import { normalizarDni } from '../lib/validacion.js'

// Cuenta de la persona usuaria. Toda la comunicacion con /auth y /customers/me
// pasa por aca, asi los componentes no conocen la forma de la API.

function recordar({ user, accessToken, refreshToken }) {
  guardarSesion({ usuario: user, accessToken, refreshToken })
  return user
}

/**
 * Crea la cuenta y deja la sesion iniciada. El backend crea tambien la ficha de
 * cliente, que es la que se asocia a las compras.
 */
export async function registrar({ nombre, apellido, dni, fechaNacimiento, email, telefono, password }) {
  const body = {
    name: `${nombre} ${apellido}`.trim(),
    firstName: nombre.trim(),
    lastName: apellido.trim(),
    documentNumber: normalizarDni(dni),
    birthDate: fechaNacimiento,
    email: email.trim(),
    password,
  }
  if (telefono?.trim()) body.phone = telefono.trim()
  return recordar(await apiPost('/auth/register', { body }))
}

export async function ingresar(email, password) {
  return recordar(await apiPost('/auth/login', { body: { email: email.trim(), password } }))
}

/** Cierra la sesion aca y le pide a la API que invalide el token de refresco. */
export async function cerrarSesion() {
  const sesion = leerSesion()
  // Se borra primero: la persona sale aunque la API no conteste.
  borrarSesion()
  if (!sesion) return
  try {
    await apiPost('/auth/logout', { body: { refreshToken: sesion.refreshToken } })
  } catch {
    // El token vence solo: no hay nada mas que hacer si no hubo respuesta.
  }
}

/** Ficha de cliente del usuario logueado (de ahi sale el id que usan las ventas). */
export const miPerfil = () => apiGet('/customers/me', { auth: true })

export const cambiarPassword = (actual, nueva) =>
  apiPatch('/auth/change-password', {
    body: { currentPassword: actual, newPassword: nueva },
    auth: true,
  })
