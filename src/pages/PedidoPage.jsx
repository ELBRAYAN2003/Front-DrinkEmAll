import { useCallback, useEffect, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router'
import Icon from '../components/ui/Icon.jsx'
import { conciliarPago, pagarConMercadoPago, unPedido } from '../api/pedidos.js'
import { etiquetaDe, lineaDeTiempo } from '../lib/estadosPedido.js'
import { formatoFechaHora, money } from '../lib/format.js'
import { formatoDocumento } from '../lib/documento.js'
import { mensajeDeError } from '../lib/mensajeDeError.js'
import { useRecarga } from '../hooks/useRecarga.js'

const ESTADO_DE_PAGO = { pendiente: 'Pendiente', pagado: 'Pagado', cancelado: 'Cancelado' }

// Al volver de Mercado Pago el pago puede tardar un rato en registrarse (el aviso o la
// acreditacion no son instantaneos): se espera hasta 5 minutos, preguntando cada 10
// segundos, y despues se deja de insistir. Solo ocurre al volver de pagar, no siempre.
const ESPERA_MAXIMA_MS = 5 * 60 * 1000
const CADA_MS = 10 * 1000

const resuelto = (pago) =>
  pago?.status === 'pagado' || ['rejected', 'cancelled'].includes(pago?.externalStatus)

// Mensaje al volver de Mercado Pago, segun como quedo el pago despues de conciliarlo.
function avisoDeVuelta(mp, pago, verificando) {
  if (pago?.status === 'pagado') return { tipo: 'ok', texto: 'Recibimos tu pago. ¡Gracias! El local ya puede preparar tu pedido.' }
  if (verificando) {
    return {
      tipo: 'info',
      texto: 'Estamos confirmando tu pago con Mercado Pago. Puede demorar unos minutos: no hace falta que cierres esta página.',
    }
  }
  if (mp === 'error') return { tipo: 'error', texto: 'No pudimos iniciar el pago. Tu pedido está guardado: probá de nuevo con el botón de abajo.' }
  if (mp === 'failure' || ['rejected', 'cancelled'].includes(pago?.externalStatus)) {
    return { tipo: 'error', texto: 'El pago no se completó. Podés intentarlo de nuevo con el botón de abajo.' }
  }
  return {
    tipo: 'info',
    texto: 'Todavía no vemos tu pago acreditado. Si ya pagaste, se va a actualizar solo cuando Mercado Pago lo confirme; podés revisar con el botón Actualizar.',
  }
}

export default function PedidoPage() {
  const { id } = useParams()
  const [params] = useSearchParams()
  const vuelta = params.get('mp')
  const [aviso, setAviso] = useState(null)
  const [verificando, setVerificando] = useState(false)
  const [pagando, setPagando] = useState(false)
  const [errorPago, setErrorPago] = useState(null)
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

  // Al volver de Mercado Pago se le pregunta por el pago: no se confia en lo que diga
  // la URL (cualquiera podria escribir ?mp=success), solo en lo que contesta el servidor.
  // Si el pago todavia no figura, se vuelve a preguntar hasta 5 minutos (ver arriba).
  useEffect(() => {
    if (!vuelta) return undefined
    let vigente = true
    let temporizador
    const inicio = Date.now()

    const consultar = async () => {
      const r = vuelta === 'error' ? null : await conciliarPago(id).catch(() => null)
      if (!vigente) return
      if (r?.order) setPedido(r.order)
      const pago = r?.order?.payments?.[0] ?? null
      // Se insiste solo si volvio de pagar o quedo pendiente (no si ya fallo) y no hay resultado.
      const insistir = vuelta !== 'failure' && vuelta !== 'error' && !resuelto(pago) && Date.now() - inicio < ESPERA_MAXIMA_MS
      setVerificando(insistir)
      setAviso({ mp: vuelta, pago })
      if (insistir) temporizador = setTimeout(consultar, CADA_MS)
    }
    consultar()
    return () => {
      vigente = false
      clearTimeout(temporizador)
    }
  }, [id, vuelta])

  const pagar = async () => {
    setPagando(true)
    setErrorPago(null)
    try {
      const { url } = await pagarConMercadoPago(id)
      window.location.assign(url)
    } catch (e) {
      setErrorPago(mensajeDeError(e))
      setPagando(false)
    }
  }

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
  const esMercadoPago = /mercado pago/i.test(pago?.paymentMethod?.name ?? '')
  const puedePagar = esMercadoPago && pago?.status === 'pendiente' && pedido?.fulfillmentStatus === 'recibido'
  const mensaje = aviso ? avisoDeVuelta(aviso.mp, pedido?.payments?.[0] ?? aviso.pago, verificando) : null
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

        {mensaje && (
          <p className={`pedido-aviso is-${mensaje.tipo}`} role="status">
            {mensaje.texto}
          </p>
        )}

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
              {puedePagar && (
                <div className="pedido-pagar">
                  <button type="button" className="btn btn-primary" onClick={pagar} disabled={pagando}>
                    {pagando ? 'Abriendo Mercado Pago...' : 'Pagar con Mercado Pago'}
                  </button>
                  <small>Tenés un tiempo limitado para pagar: si vence, el pedido se cancela y se libera el stock.</small>
                  {errorPago && <p className="checkout-aviso" role="alert">{errorPago}</p>}
                </div>
              )}
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
