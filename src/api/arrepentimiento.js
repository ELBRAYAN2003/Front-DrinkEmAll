import { apiPost } from '../lib/api.js'

/** Registra la solicitud (sin sesion) y devuelve { code, createdAt }. */
export const solicitarArrepentimiento = ({ nombre, contacto, pedido, mensaje }) =>
  apiPost('/revocations', {
    body: {
      fullName: nombre.trim(),
      contact: contacto.trim(),
      ...(pedido.trim() && { orderReference: pedido.trim() }),
      ...(mensaje.trim() && { message: mensaje.trim() }),
    },
  })
