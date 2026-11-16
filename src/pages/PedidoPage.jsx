import { useCallback, useState } from 'react'
import { Link, useParams } from 'react-router'
import Icon from '../components/ui/Icon.jsx'
import { unPedido } from '../api/pedidos.js'
import { etiquetaDe, lineaDeTiempo } from '../lib/estadosPedido.js'
import { formatoFechaHora, money } from '../lib/format.js'
import { formatoDocumento } from '../lib/documento.js'
import { mensajeDeError } from '../lib/mensajeDeError.js'
import { useRecarga } from '../hooks/useRecarga.js'

const ESTADO_DE_PAGO = { pendiente: 'Pendiente', pagado: 'Pagado', cancelado: 'Cancelado' }

export default function PedidoPage() {
  const { id } = useParams()
  const [pedido, setPedido] = useState(null)
  const [noExiste, setNoExiste] = useState(false)
  const [error, setError] = useState(null)

  const cargar = useCallback(async () => {
    try {
      setPedido(await unPedido(id))
      setNoExiste(false)
      setError(null)
    } catch (e) {
      // Uno ajeno responde igual que uno inexistente: no se confirma que existe.
      if (e.status === 404 || e.status === 403) setNoExiste(true)
      else setError(mensajeDeError(e))
    }
  }, [id])
  const { actualizando, actualizar } = useRecarga(cargar)

  if (noExiste) {
    return (
      <main className="auth pedidos">
        <div className="wrap">
          <div className="catalog-empty">
            <p>No encontramos ese pedido.</p>
            <Link className="btn btn-primary" to="/mis-pedidos">
              Ver mis pedidos
            </Link>
          </div>
        </div>
      </main>
    )
  }

  const pago = pedido?.payments?.[0]
  const pasos = pedido ? lineaDeTiempo(pedido) : []
  const direccion = pedido?.shippingAddress

  return (
    <main className="auth pedidos">
      <div className="wrap">
        <nav className="breadcrumb" aria-label="Miga de pan">
          <Link to="/">Inicio</Link>
          <Icon name="right" size={13} />
          <Link to="/mis-pedidos">Mis pedidos</Link>
          <Icon name="right" size={13} />
          <span aria-current="page">Pedido #{id}</span>
        </nav>

        <div className="pedidos-cabecera">
          <h1 className="account-title">Pedido #{id}</h1>
          <button type="button" className="btn btn-ghost" onClick={actualizar} disabled={actualizando}>
            <Icon name="refresh" size={16} />
            {actualizando ? 'Actualizando...' : 'Actualizar'}
          </button>
        </div>

        {error && (
          <p className="checkout-aviso" role="alert">
            <Icon name="alert" size={16} />
            {error}
          </p>
        )}
        {!pedido && !error && <p aria-busy="true">Cargando el pedido...</p>}

        {pedido && (
          <div className="pedido-grid">
            <section className="auth-card" aria-labelledby="pedido-seguimiento">
              <h2 id="pedido-seguimiento">
                Seguimiento{' '}
                <span className={`pedido-estado is-${pedido.fulfillmentStatus}`}>
                  {etiquetaDe(pedido.fulfillmentStatus)}
                </span>
              </h2>
              <ol className="linea-tiempo">
                {pasos.map((p) => (
                  <li key={p.estado} className={`is-${p.situacion} is-${p.estado}`}>
                    <span className="linea-punto" aria-hidden="true">
                      {p.situacion !== 'pendiente' && <Icon name="check" size={12} />}
                    </span>
                    <span>
                      <b>{etiquetaDe(p.estado)}</b>
                      {p.fecha && <small>{formatoFechaHora(p.fecha)}</small>}
                      {p.nota && <small>{p.nota}</small>}
                      {p.situacion === 'pendiente' && <small>Pendiente</small>}
                    </span>
                  </li>
                ))}
              </ol>
              {pedido.deliveryMethod === 'envio' &&
                !['entregado', 'cancelado'].includes(pedido.fulfillmentStatus) && (
                  <p className="checkout-edad">
                    <Icon name="alert" size={16} />
                    Al entregar te vamos a pedir el DNI. Si quien recibe no es mayor de 18 anos, el
                    pedido no se entrega.
                  </p>
                )}
            </section>

            <section className="auth-card" aria-labelledby="pedido-detalle">
              <h2 id="pedido-detalle">Detalle</h2>
              <ul className="review-items">
                {pedido.items.map((it) => (
                  <li key={it.id}>
                    <span>
                      <b>{it.product?.name ?? `Producto ${it.productId}`}</b>
                      <small>
                        {it.quantity} x {money.format(it.unitPrice)}
                      </small>
                    </span>
                    <em>{money.format(it.subtotal)}</em>
                  </li>
                ))}
              </ul>
              <dl className="summary-lines">
                <div>
                  <dt>Envio</dt>
                  <dd>{pedido.shippingCost === 0 ? 'Sin cargo' : money.format(pedido.shippingCost)}</dd>
                </div>
                <div className="summary-total">
                  <dt>Total</dt>
                  <dd>
                    <b>{money.format(pedido.total)}</b>
                  </dd>
                </div>
              </dl>
              <ul className="review">
                <li>
                  <span>Fecha</span>
                  <b>{formatoFechaHora(pedido.saleDate)}</b>
                </li>
                <li>
                  <span>Entrega</span>
                  <b>
                    {pedido.deliveryMethod === 'retiro'
                      ? 'Retiro en el local'
                      : `${direccion?.street}, ${direccion?.city} (${direccion?.postalCode})${
                          direccion?.reference ? ` - ${direccion.reference}` : ''
                        }`}
                  </b>
                </li>
                {pedido.billing && (
                  <li>
                    <span>Facturacion</span>
                    <b>
                      {pedido.billing.fullName} - {formatoDocumento(pedido.billing.taxIdType, pedido.billing.taxId)} -{' '}
                      {pedido.billing.email}
                    </b>
                  </li>
                )}
                <li>
                  <span>Contacto</span>
                  <b>{pedido.contactPhone}</b>
                </li>
                <li>
                  <span>Pago</span>
                  <b>
                    {pago?.paymentMethod?.name ?? 'Sin dato'}
                    {pago && ` - ${ESTADO_DE_PAGO[pago.status] ?? pago.status}`}
                  </b>
                </li>
              </ul>
              <p className="pedido-arrepentimiento">
                <Link to="/arrepentimiento">BOTÓN DE ARREPENTIMIENTO</Link>
              </p>
            </section>
          </div>
        )}
      </div>
    </main>
  )
}
