import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router'
import Icon from '../components/ui/Icon.jsx'
import { conciliarPago, pagarConMercadoPago, unPedido } from '../api/pedidos.js'
import { esDeMercadoPago, esperaElPago, estadoVisible, etiquetaDe, lineaDeTiempo, reservadoHasta } from '../lib/estadosPedido.js'
import { useAjustesTienda } from '../hooks/useAjustesTienda.js'
import { formatoFechaHora, money } from '../lib/format.js'
import { formatoDocumento } from '../lib/documento.js'
import { mensajeDeError } from '../lib/mensajeDeError.js'
import { useRecarga } from '../hooks/useRecarga.js'
import { ESPERA_MAXIMA_MS, iniciarEspera, inicioDeEspera } from '../lib/esperaDePago.js'

const ESTADO_DE_PAGO = { pendiente: 'Pendiente', pagado: 'Pagado', cancelado: 'Cancelado' }

// Al volver de Mercado Pago el pago puede tardar un rato en registrarse (el aviso o la
// acreditacion no son instantaneos): se espera hasta 5 minutos con una cuenta regresiva,
// preguntando cada 10 segundos, y despues se deja de insistir y se avisa. Solo ocurre
// al volver de pagar, no siempre.
const CADA_MS = 10 * 1000

const rechazado = (pago) => ['rejected', 'cancelled'].includes(pago?.externalStatus)

const reloj = (ms) => {
  const total = Math.max(0, Math.ceil(ms / 1000))
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`
}

// Con horas, para la reserva del stock (que dura horas): 02:59:41.
const relojLargo = (ms) => {
  const total = Math.max(0, Math.ceil(ms / 1000))
  const dos = (n) => String(n).padStart(2, '0')
  return `${dos(Math.floor(total / 3600))}:${dos(Math.floor((total % 3600) / 60))}:${dos(total % 60)}`
}

// Que decirle a la persona segun lo que contesta el servidor (no segun la URL).
function estadoDelPago({ vuelta, pago, fase }) {
  if (pago?.status === 'pagado') {
    return { tipo: 'ok', titulo: 'Pago recibido', texto: 'Recibimos tu pago. ¡Gracias! El local ya puede preparar tu pedido.' }
  }
  if (rechazado(pago)) {
    return {
      tipo: 'error',
      titulo: 'Pago rechazado',
      texto: 'Mercado Pago no pudo procesar el pago. Tu pedido sigue guardado: podés intentarlo de nuevo con otro medio de pago.',
    }
  }
  if (vuelta === 'error') {
    return { tipo: 'error', titulo: 'No pudimos iniciar el pago', texto: 'Tu pedido está guardado. Probá de nuevo con el botón de abajo.' }
  }
  if (vuelta === 'failure') {
    return { tipo: 'error', titulo: 'Error en el pago', texto: 'El pago no se completó. Tu pedido sigue guardado: podés intentarlo de nuevo.' }
  }
  if (fase === 'vencida') {
    return {
      tipo: 'error',
      titulo: 'No recibimos tu pago',
      texto: 'Pasaron 5 minutos y Mercado Pago no nos confirmó el pago: se canceló, no se completó o todavía no se acreditó. Si ya pagaste, se va a actualizar solo cuando se confirme; si no, podés intentarlo de nuevo.',
    }
  }
  if (fase === 'esperando') {
    return {
      tipo: 'info',
      titulo: 'Esperando tu pago',
      texto: 'Completá el pago en Mercado Pago. Si ya pagaste, estamos confirmándolo y puede demorar unos minutos: no hace falta que cierres esta página.',
    }
  }
  return null
}

// "Recibido" en un pedido de Mercado Pago dice que el pedido se creo, no que se pago: se
// muestra como "Pedido creado", y el pago tiene su propio paso.
function tituloDelPaso(paso, pedido) {
  if (esDeMercadoPago(pedido) && paso.estado === 'recibido') return 'Pedido creado'
  if (paso.estado === 'pago') return pedido.payments?.[0]?.status === 'pagado' ? 'Pago recibido' : 'Pago pendiente'
  return etiquetaDe(paso.estado)
}

export default function PedidoPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const ajustes = useAjustesTienda()
  const [params] = useSearchParams()
  const vuelta = params.get('mp')
  const [fase, setFase] = useState(null) // null | 'esperando' | 'vencida'
  const [ahora, setAhora] = useState(() => Date.now())
  const [pagando, setPagando] = useState(false)
  const [errorPago, setErrorPago] = useState(null)
  const [pedido, setPedido] = useState(null)
  const [noExiste, setNoExiste] = useState(false)
  const [error, setError] = useState(null)

  const cargar = useCallback(async () => {
    try {
      let actual = await unPedido(id)
      // Un pedido de Mercado Pago que figura sin pagar puede estar pagado y no haberse enterado
      // todavia (por ejemplo si la persona volvio sin pasar por el enlace de retorno, o el aviso
      // no llego). Se le pregunta a Mercado Pago. Si se vuelve con ?mp=..., eso ya lo hace el efecto de abajo.
      if (!vuelta && esperaElPago(actual)) {
        const r = await conciliarPago(id).catch(() => null)
        if (r?.order) actual = r.order
      }
      setPedido(actual)
      setNoExiste(false)
      setError(null)
    } catch (e) {
      // Uno ajeno responde igual que uno inexistente: no se confirma que existe.
      if (e.status === 404 || e.status === 403) setNoExiste(true)
      else setError(mensajeDeError(e))
    }
  }, [id, vuelta])
  const { actualizando, actualizar } = useRecarga(cargar)

  // Al volver de Mercado Pago se le pregunta por el pago: no se confia en lo que diga
  // la URL (cualquiera podria escribir ?mp=success), solo en lo que contesta el servidor.
  // Si el pago todavia no figura, se vuelve a preguntar hasta 5 minutos (ver arriba). Tambien
  // se pregunta apenas la pagina vuelve a verse (por ejemplo con "atras" desde Mercado Pago).
  useEffect(() => {
    if (!vuelta) return undefined
    let vigente = true
    let temporizador

    const consultar = async () => {
      clearTimeout(temporizador)
      const r = vuelta === 'error' ? null : await conciliarPago(id).catch(() => null)
      if (!vigente) return
      if (r?.order) setPedido(r.order)
      const pago = r?.order?.payments?.[0] ?? null
      const termino = pago?.status === 'pagado' || rechazado(pago) || vuelta === 'error' || vuelta === 'failure'
      if (termino) {
        setFase(null)
        return
      }
      if (Date.now() - inicioDeEspera(id) >= ESPERA_MAXIMA_MS) {
        setFase('vencida')
        return
      }
      setFase('esperando')
      temporizador = setTimeout(consultar, CADA_MS)
    }

    const alVolver = () => {
      if (document.visibilityState === 'visible') consultar()
    }
    consultar()
    document.addEventListener('visibilitychange', alVolver)
    window.addEventListener('pageshow', alVolver)
    return () => {
      vigente = false
      clearTimeout(temporizador)
      document.removeEventListener('visibilitychange', alVolver)
      window.removeEventListener('pageshow', alVolver)
    }
  }, [id, vuelta])

  const hasta = pedido ? reservadoHasta(pedido, ajustes?.paymentWindowMinutes) : null
  const hayReserva = Boolean(hasta)

  // Las cuentas regresivas (espera de 5 minutos y reserva del stock) se redibujan cada segundo.
  useEffect(() => {
    if (fase !== 'esperando' && !hayReserva) return undefined
    const reloj1s = setInterval(() => setAhora(Date.now()), 1000)
    return () => clearInterval(reloj1s)
  }, [fase, hayReserva])

  const pagar = async () => {
    setPagando(true)
    setErrorPago(null)
    try {
      const { url } = await pagarConMercadoPago(id)
      // Intento nuevo: 5 minutos nuevos. Y esta pagina queda en el historial como "esperando
      // el pago", para que "atras" desde Mercado Pago vuelva aca y no a una pantalla vacia.
      iniciarEspera(id)
      navigate(`/mis-pedidos/${id}?mp=waiting`, { replace: true })
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
  const mensaje = vuelta ? estadoDelPago({ vuelta, pago, fase }) : null
  const restante = ESPERA_MAXIMA_MS - (ahora - inicioDeEspera(id))
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
          <div className={`pedido-aviso is-${mensaje.tipo}`} role="status">
            <b>{mensaje.titulo}</b>
            <p>{mensaje.texto}</p>
            {fase === 'esperando' && (
              <p className="pedido-cuenta">
                Tiempo de espera: <b>{reloj(restante)}</b>
              </p>
            )}
            {puedePagar && mensaje.tipo !== 'ok' && (
              <button type="button" className="btn btn-primary" onClick={pagar} disabled={pagando}>
                {pagando ? 'Abriendo Mercado Pago...' : fase === 'esperando' ? 'Ir a pagar a Mercado Pago' : 'Intentar de nuevo'}
              </button>
            )}
            {errorPago && <p className="checkout-aviso" role="alert">{errorPago}</p>}
          </div>
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
                <span className={`pedido-estado is-${estadoVisible(pedido).clave}`}>
                  {estadoVisible(pedido).etiqueta}
                </span>
              </h2>
              <ol className="linea-tiempo">
                {pasos.map((p) => (
                  <li key={p.estado} className={`is-${p.situacion} is-${p.estado}`}>
                    <span className="linea-punto" aria-hidden="true">
                      {p.situacion !== 'pendiente' && <Icon name="check" size={12} />}
                    </span>
                    <span>
                      <b>{tituloDelPaso(p, pedido)}</b>
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
              {hasta && (
                <div className="pedido-reserva">
                  <Icon name="check" size={14} />
                  <div>
                    <span>Tus productos están reservados. Tiempo para pagar:</span>
                    <b className="pedido-reserva-reloj">{relojLargo(hasta.getTime() - ahora)}</b>
                    <small>
                      Hasta las{' '}
                      {hasta.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
                      {hasta.toDateString() !== new Date().toDateString() &&
                        ` del ${hasta.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' })}`}
                      {' '}
                      Si el pago no se acredita antes, el pedido se cancela y el stock vuelve a la venta.
                    </small>
                  </div>
                </div>
              )}
              {puedePagar && (
                <div className="pedido-pagar">
                  <button type="button" className="btn btn-primary" onClick={pagar} disabled={pagando}>
                    {pagando ? 'Abriendo Mercado Pago...' : 'Pagar con Mercado Pago'}
                  </button>
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
