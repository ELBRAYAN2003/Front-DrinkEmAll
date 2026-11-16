// Estados de entrega de un pedido, con su nombre para la persona y el recorrido
// que le toca segun como lo recibe. El servidor es el que decide los estados;
// aca solo se muestran.

export const ETIQUETAS = {
  recibido: 'Recibido',
  preparando: 'Preparando',
  en_camino: 'En camino',
  listo_para_retirar: 'Listo para retirar',
  entregado: 'Entregado',
  cancelado: 'Cancelado',
}

export const etiquetaDe = (estado) => ETIQUETAS[estado] ?? estado

/** Los pasos que recorre un pedido: el retiro no pasa por "En camino". */
export const pasosDe = (deliveryMethod) => [
  'recibido',
  'preparando',
  deliveryMethod === 'retiro' ? 'listo_para_retirar' : 'en_camino',
  'entregado',
]

/**
 * Linea de tiempo lista para dibujar: cada paso con su fecha (si ya ocurrio) y su
 * situacion. Si el pedido se cancelo se muestran solo los pasos que llegaron a
 * pasar y la cancelacion; los que faltaban dejan de tener sentido.
 */
export function lineaDeTiempo(pedido) {
  const eventos = pedido.events ?? []
  const evento = (estado) => eventos.find((e) => e.status === estado)
  const actual = pedido.fulfillmentStatus

  if (actual === 'cancelado') {
    return eventos.map((e) => ({ estado: e.status, fecha: e.createdAt, nota: e.note, situacion: 'hecho' }))
  }

  const pasos = pasosDe(pedido.deliveryMethod)
  const indiceActual = pasos.indexOf(actual)
  return pasos.map((estado, i) => ({
    estado,
    fecha: evento(estado)?.createdAt ?? null,
    nota: evento(estado)?.note ?? null,
    // "actual" es el ultimo logrado; los que siguen se muestran apagados.
    situacion: i < indiceActual ? 'hecho' : i === indiceActual ? 'actual' : 'pendiente',
  }))
}
