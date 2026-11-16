import { useCallback, useState } from 'react'
import { Link, useParams } from 'react-router'
import { cambiarEstadoDelPedido, marcarPagado, pedidoDelComercio } from '../../api/panel.js'
import { useRecarga } from '../../hooks/useRecarga.js'
import { esDeMercadoPago, estadoVisible, etiquetaDe, nombreDePedido } from '../../lib/estadosPedido.js'
import { formatoFechaHora, money } from '../../lib/format.js'
import { formatoDocumento } from '../../lib/documento.js'
import BotonComprobante from '../../components/ui/BotonComprobante.jsx'
import { mensajeDeError } from '../../lib/mensajeDeError.js'
import { ACCION_DE_ESTADO, esperaAcreditacion, pagoDelPedido, siguientesEstados } from '../../lib/panel.js'

const PAGO = { pendiente: 'Pendiente', pagado: 'Pagado', cancelado: 'Cancelado' }

export default function PanelPedidoPage() {
  const { id } = useParams()
  const [pedido, setPedido] = useState(null)
  const [noExiste, setNoExiste] = useState(false)
  const [error, setError] = useState(null)
  const [trabajando, setTrabajando] = useState(false)
  const [dniVerificado, setDniVerificado] = useState(false)
  const [cancelando, setCancelando] = useState(false)
  const [nota, setNota] = useState('')

  const cargar = useCallback(async () => {
    try {
      setPedido(await pedidoDelComercio(id))
      setNoExiste(false)
    } catch (e) {
      if (e.status === 404) setNoExiste(true)
      else setError(mensajeDeError(e))
    }
  }, [id])
  const { actualizando, actualizar } = useRecarga(cargar)

  // Toda accion del comercio: se hace, se muestra el error de la API si lo hay, y se recarga.
  const ejecutar = async (accion) => {
    setTrabajando(true)
    setError(null)
    try {
      await accion()
      await cargar()
    } catch (e) {
      setError(mensajeDeError(e))
    } finally {
      setTrabajando(false)
    }
  }

  const cambiarEstado = (estado, extra = {}) =>
    ejecutar(async () => {
      await cambiarEstadoDelPedido(id, { status: estado, ...extra })
      setDniVerificado(false)
      setCancelando(false)
      setNota('')
    })

  if (noExiste) {
    return (
      <section>
        <p className="panel-vacio">No existe ese pedido.</p>
        <Link to="/panel" className="panel-boton">Volver a los pedidos</Link>
      </section>
    )
  }
  if (!pedido) return <p aria-busy="true">{error ?? 'Cargando el pedido...'}</p>

  const pago = pagoDelPedido(pedido)
  const estado = estadoVisible(pedido)
  const siguientes = siguientesEstados(pedido.fulfillmentStatus, pedido.deliveryMethod)
  const avanzar = siguientes.filter((e) => e !== 'cancelado')
  const puedeCancelar = siguientes.includes('cancelado')
  const bloqueadoPorPago = esperaAcreditacion(pedido)
  const puedeMarcarPagado = pago?.status === 'pendiente' && !esDeMercadoPago(pedido) && pedido.fulfillmentStatus !== 'cancelado'
  const d = pedido.shippingAddress

  return (
    <section>
      <p className="panel-miga">
        <Link to="/panel">Pedidos</Link> / {nombreDePedido(pedido)}
      </p>
      <div className="panel-cabecera">
        <h1>
          Pedido {nombreDePedido(pedido)} <span className={`pedido-estado is-${estado.clave}`}>{estado.etiqueta}</span>
        </h1>
        <button type="button" className="panel-boton" onClick={actualizar} disabled={actualizando}>
          {actualizando ? 'Actualizando...' : 'Actualizar'}
        </button>
      </div>

      {error && <p className="panel-error" role="alert">{error}</p>}

      {pago?.duplicateIds?.length > 0 && (
        <div className="panel-error panel-cobro-doble" role="alert">
          <b>Mercado Pago cobró de más este pedido.</b> Además del pago {pago.externalId} se aprobaron{' '}
          {pago.duplicateIds.length === 1 ? 'otro pago' : `${pago.duplicateIds.length} pagos más`}: operación
          {pago.duplicateIds.length === 1 ? '' : 'es'} <b>{pago.duplicateIds.join(', ')}</b>. Hay que reintegrar{' '}
          {pago.duplicateIds.length === 1 ? 'ese importe' : 'esos importes'} al cliente desde Mercado Pago (Tu negocio &gt;
          Actividad).
        </div>
      )}

      <div className="panel-doble">
        <div className="panel-tarjeta">
          <h2>Qué preparar</h2>
          <table className="panel-tabla">
            <thead>
              <tr>
                <th>Código</th>
                <th>Producto</th>
                <th className="num">Cant.</th>
                <th className="num">Stock</th>
                <th className="num">Importe</th>
              </tr>
            </thead>
            <tbody>
              {pedido.items.map((it) => (
                <tr key={it.id}>
                  <td className="panel-sku">{it.product?.sku ?? '-'}</td>
                  <td>{it.product?.name ?? `Producto ${it.productId}`}</td>
                  <td className="num"><b>{it.quantity}</b></td>
                  <td className="num">{it.product?.stock ?? '-'}</td>
                  <td className="num">{money.format(it.subtotal)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="4">Envío</td>
                <td className="num">{pedido.shippingCost === 0 ? 'Sin cargo' : money.format(pedido.shippingCost)}</td>
              </tr>
              <tr>
                <td colSpan="4"><b>Total</b></td>
                <td className="num"><b>{money.format(pedido.total)}</b></td>
              </tr>
            </tfoot>
          </table>

          <h2>Acciones</h2>
          {bloqueadoPorPago && (
            <p className="panel-aviso">
              Pago con Mercado Pago sin acreditar: no se puede preparar hasta que se acredite (se actualiza solo).
              Si nunca se paga, el pedido se cancela solo al vencer la reserva.
            </p>
          )}
          <div className="panel-acciones">
            {avanzar.map((e) => (
              <div key={e} className="panel-accion">
                {e === 'entregado' && (
                  <label className="panel-dni">
                    <input type="checkbox" checked={dniVerificado} onChange={(ev) => setDniVerificado(ev.target.checked)} />
                    <span>Verifiqué el DNI de quien recibe y es mayor de 18 años</span>
                  </label>
                )}
                <button
                  type="button"
                  className="panel-boton panel-boton-primario"
                  disabled={trabajando || (e === 'preparando' && bloqueadoPorPago) || (e === 'entregado' && !dniVerificado)}
                  onClick={() => cambiarEstado(e, e === 'entregado' ? { idChecked: true } : {})}
                >
                  {ACCION_DE_ESTADO[e]}
                </button>
              </div>
            ))}
            {puedeMarcarPagado && (
              <button type="button" className="panel-boton" disabled={trabajando} onClick={() => ejecutar(() => marcarPagado(pago.id))}>
                Marcar el pago como recibido
              </button>
            )}
            {puedeCancelar && !cancelando && (
              <button type="button" className="panel-boton panel-boton-peligro" onClick={() => setCancelando(true)}>
                Cancelar pedido…
              </button>
            )}
          </div>
          {cancelando && (
            <div className="panel-cancelar">
              <label>
                <span>Motivo (queda en el historial)</span>
                <input type="text" value={nota} maxLength={255} onChange={(e) => setNota(e.target.value)} placeholder="Fuera de zona, sin stock..." />
              </label>
              <button
                type="button"
                className="panel-boton panel-boton-peligro"
                disabled={trabajando}
                onClick={() => cambiarEstado('cancelado', nota.trim() ? { note: nota.trim() } : {})}
              >
                Confirmar cancelación
              </button>
              <button type="button" className="panel-boton" onClick={() => setCancelando(false)}>
                No cancelar
              </button>
              <small>Al cancelar se devuelve el stock y se anula el pago pendiente.</small>
            </div>
          )}
          {!avanzar.length && !puedeCancelar && !puedeMarcarPagado && <p className="panel-vacio">No hay acciones: el pedido ya terminó.</p>}
        </div>

        <div className="panel-tarjeta">
          <h2>Datos</h2>
          <dl className="panel-datos">
            <div>
              <dt>Cliente</dt>
              <dd>
                {pedido.customer?.firstName} {pedido.customer?.lastName}
                {pedido.customer?.documentNumber ? ` · DNI ${pedido.customer.documentNumber}` : ''}
              </dd>
            </div>
            <div>
              <dt>Contacto</dt>
              <dd>{pedido.contactPhone}</dd>
            </div>
            <div>
              <dt>Entrega</dt>
              <dd>
                {pedido.deliveryMethod === 'retiro'
                  ? 'Retiro en el local'
                  : `${d?.street}, ${d?.city} (${d?.postalCode})${d?.reference ? ` · ${d.reference}` : ''}`}
              </dd>
            </div>
            <div>
              <dt>Pago</dt>
              <dd>
                {pago?.paymentMethod?.name ?? '-'} · {PAGO[pago?.status] ?? '-'}
                {pago?.externalId ? ` · operación ${pago.externalId}` : ''}
              </dd>
            </div>
            {pedido.billing && (
              <div>
                <dt>Facturación</dt>
                <dd>
                  {pedido.billing.fullName} · {formatoDocumento(pedido.billing.taxIdType, pedido.billing.taxId)} ·{' '}
                  {pedido.billing.email}
                </dd>
              </div>
            )}
            <div>
              <dt>Fecha</dt>
              <dd>{formatoFechaHora(pedido.saleDate)}</dd>
            </div>
            {pedido.notes && (
              <div>
                <dt>Nota del cliente</dt>
                <dd>{pedido.notes}</dd>
              </div>
            )}
          </dl>

          {pago?.status === 'pagado' && <BotonComprobante pedido={pedido} className="panel-boton" />}

          <h2>Historial</h2>
          <ol className="panel-historial">
            {(pedido.events ?? []).map((ev) => (
              <li key={ev.id}>
                <b>{etiquetaDe(ev.status)}</b>
                <span>{formatoFechaHora(ev.createdAt)}</span>
                {ev.idChecked && <small>DNI verificado al entregar</small>}
                {ev.note && <small>{ev.note}</small>}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
