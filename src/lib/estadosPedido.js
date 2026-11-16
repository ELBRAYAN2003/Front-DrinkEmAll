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
  pago: 'Pago',
}

export const etiquetaDe = (estado) => ETIQUETAS[estado] ?? estado

/** El pago del pedido (el primero), o null. */
const pagoDe = (pedido) => pedido?.payments?.[0] ?? null

/** Se paga con Mercado Pago: el pedido no avanza hasta que el pago este acreditado. */
export const esDeMercadoPago = (pedido) => /mercado pago/i.test(pagoDe(pedido)?.paymentMethod?.name ?? '')

/** Pedido de Mercado Pago que todavia no se pago (y sigue en pie). */
export const esperaElPago = (pedido) =>
  esDeMercadoPago(pedido) && pagoDe(pedido)?.status === 'pendiente' && pedido.fulfillmentStatus === 'recibido'

/**
 * Como se le muestra el estado a la persona. "Recibido" quiere decir que el local tiene el
 * pedido; con Mercado Pago eso no alcanza para decir que esta todo en marcha: mientras
 * no se acredite el pago se muestra "Pago pendiente", y cuando se acredita y el local
 * todavia no lo empezo a preparar, "Pago recibido".
 */
export function estadoVisible(pedido) {
  if (esperaElPago(pedido)) return { clave: 'esperando_pago', etiqueta: 'Pago pendiente' }
  if (esDeMercadoPago(pedido) && pedido.fulfillmentStatus === 'recibido' && pagoDe(pedido)?.status === 'pagado') {
    return { clave: 'pago_recibido', etiqueta: 'Pago recibido' }
  }
  return { clave: pedido.fulfillmentStatus, etiqueta: etiquetaDe(pedido.fulfillmentStatus) }
}

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
  const lista = pasos.map((estado, i) => ({
    estado,
    fecha: evento(estado)?.createdAt ?? null,
    nota: evento(estado)?.note ?? null,
    // "actual" es el ultimo logrado; los que siguen se muestran apagados.
    situacion: i < indiceActual ? 'hecho' : i === indiceActual ? 'actual' : 'pendiente',
  }))

  // Con Mercado Pago el pago es un paso propio entre "pedido creado" y "preparando": asi
  // se ve que el pedido esta guardado pero todavia no se cobro.
  if (esDeMercadoPago(pedido)) {
    const pago = pagoDe(pedido)
    const pagado = pago?.status === 'pagado'
    lista[0] = { ...lista[0], situacion: 'hecho' }
    const pasoPago = {
      estado: 'pago',
      fecha: pagado ? (pago.paidAt ?? null) : null,
      nota: null,
      situacion: pagado ? (actual === 'recibido' ? 'actual' : 'hecho') : 'actual',
    }
    // Sin pagar, lo que sigue no puede estar hecho.
    const resto = lista.slice(1).map((p) => (pagado ? p : { ...p, situacion: 'pendiente' }))
    return [lista[0], pasoPago, ...resto]
  }
  return lista
}

/** 180 -> "3 horas", 90 -> "1 hora y 30 minutos", 45 -> "45 minutos". */
export function duracion(minutos) {
  const h = Math.floor(minutos / 60)
  const m = minutos % 60
  const horas = h ? `${h} ${h === 1 ? 'hora' : 'horas'}` : ''
  const mins = m ? `${m} ${m === 1 ? 'minuto' : 'minutos'}` : ''
  return [horas, mins].filter(Boolean).join(' y ')
}

/**
 * Hasta cuando se le reserva el stock a un pedido que espera un pago por adelantado
 * (Mercado Pago o transferencia). Efectivo no vence: se paga al entregar. Devuelve una Date
 * o null si el pedido no esta en esa situacion.
 */
export function reservadoHasta(pedido, minutos) {
  const pago = pagoDe(pedido)
  if (!pago || pago.status !== 'pendiente' || pedido.fulfillmentStatus !== 'recibido' || !minutos) return null
  const metodo = pago.paymentMethod?.name ?? ''
  if (!/mercado pago|transferencia/i.test(metodo)) return null
  return new Date(new Date(pedido.saleDate).getTime() + minutos * 60 * 1000)
}

/** Como se nombra un pedido ante la persona: su codigo (DRK-7K4Q9X) o, si no lo tiene, el numero. */
export const nombreDePedido = (pedido) => pedido?.code ?? (pedido?.id ? `#${pedido.id}` : '')
