import { useState } from 'react'
import { comprobanteDelPedido } from '../../api/pedidos.js'
import { guardarArchivo } from '../../lib/descarga.js'
import { mensajeDeError } from '../../lib/mensajeDeError.js'

/**
 * Descarga el comprobante de compra y pago (PDF sin valor fiscal) del pedido. Solo se ofrece con el
 * pago acreditado; el nombre del archivo lleva el codigo del pedido.
 */
export default function BotonComprobante({ pedido, className = 'btn btn-ghost' }) {
  const [estado, setEstado] = useState(null) // null | 'bajando' | mensaje de error
  const bajar = async () => {
    setEstado('bajando')
    try {
      guardarArchivo(await comprobanteDelPedido(pedido.id), `comprobante-${pedido.code ?? pedido.id}.pdf`)
      setEstado(null)
    } catch (e) {
      setEstado(mensajeDeError(e))
    }
  }
  return (
    <div className="comprobante">
      <button type="button" className={className} onClick={bajar} disabled={estado === 'bajando'}>
        {estado === 'bajando' ? 'Preparando el PDF...' : 'Descargar comprobante'}
      </button>
      <small>Comprobante de compra y pago. No es una factura fiscal.</small>
      {estado && estado !== 'bajando' && <small className="comprobante-error" role="alert">{estado}</small>}
    </div>
  )
}
