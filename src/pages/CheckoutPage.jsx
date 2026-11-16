import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router'
import Icon from '../components/ui/Icon.jsx'
import Campo from '../components/ui/Campo.jsx'
import OrderSummary from '../components/cart/OrderSummary.jsx'
import { money } from '../lib/format.js'
import { useCarrito } from '../hooks/useCarrito.js'
import { useAuth } from '../hooks/useAuth.js'
import { useAjustesTienda } from '../hooks/useAjustesTienda.js'
import { miPerfil } from '../api/auth.js'
import { completarPerfil, crearPedido, mediosDePago } from '../api/tienda.js'
import { calcularTotales } from '../data/cart.js'
import { mensajeDeError } from '../lib/mensajeDeError.js'
import { camposDelPaso, fechaMaximaNacimiento, normalizarDni, validarCampo, validarPaso } from '../lib/validacion.js'

const PASOS = [
  { id: 1, titulo: 'Tus datos' },
  { id: 2, titulo: 'Entrega' },
  { id: 3, titulo: 'Pago' },
  { id: 4, titulo: 'Confirmar' },
]

// Solo estos dos medios se operan: lo que no necesita una pasarela de pago. El
// servidor tambien los restringe; esto es lo que se ofrece en pantalla.
const DETALLE_DE_PAGO = {
  efectivo: 'Pagas en efectivo al recibir el pedido o al retirarlo.',
  transferencia: 'Te pasamos los datos de la cuenta y el local confirma el pago a mano.',
}
const clavePago = (nombre) =>
  String(nombre).normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase()

const DATOS_VACIOS = {
  telefono: '',
  fechaNacimiento: '',
  dni: '',
  direccion: '',
  ciudad: 'Juan Jose Castelli',
  codigoPostal: '',
  referencia: '',
}

const ESTADOS = { pending: 'Pendiente' }

export default function CheckoutPage() {
  const { usuario } = useAuth()
  const { lineas, vaciar } = useCarrito()
  const ajustes = useAjustesTienda()

  const [paso, setPaso] = useState(1)
  const [entrega, setEntrega] = useState('envio')
  const [pagoId, setPagoId] = useState(null)
  const [conforme, setConforme] = useState(false)
  const [pedido, setPedido] = useState(null)

  // Ficha y medios de pago, que se piden al entrar. `perfil` null = cargando.
  const [perfil, setPerfil] = useState(null)
  const [medios, setMedios] = useState(null)
  const [falloCarga, setFalloCarga] = useState(false)

  const [datos, setDatos] = useState(DATOS_VACIOS)
  const [errores, setErrores] = useState({})
  const [tocados, setTocados] = useState({})
  const [enviando, setEnviando] = useState(false)
  const [errorPedido, setErrorPedido] = useState(null)

  useEffect(() => {
    let vigente = true
    Promise.all([miPerfil(), mediosDePago()])
      .then(([ficha, lista]) => {
        if (!vigente) return
        setPerfil(ficha)
        setMedios(lista)
        // El telefono de la cuenta se ofrece de entrada; se puede cambiar para este pedido.
        // El alta lo guarda en el usuario y no siempre en la ficha, por eso se mira tambien ahi.
        const telefono = ficha.phone || usuario?.phone
        if (telefono) setDatos((previos) => ({ ...previos, telefono }))
      })
      .catch(() => vigente && setFalloCarga(true))
    return () => {
      vigente = false
    }
    // Se pide una vez al entrar: la sesion no cambia mientras se esta en el checkout.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const retiroEnLocal = entrega === 'retiro'

  // Lo que la cuenta no tiene y hay que pedir (cuentas anteriores a que se exigiera).
  const faltantes = perfil
    ? [!perfil.birthDate && 'fechaNacimiento', !perfil.documentNumber && 'dni'].filter(Boolean)
    : []
  const opciones = { retiroEnLocal, faltantes }

  // Medios que se ofrecen: los que la API declara para pedidos online y existen cargados.
  const permitidos = new Set((ajustes?.onlinePaymentMethods ?? ['Efectivo', 'Transferencia']).map(clavePago))
  const mediosOnline = (medios ?? []).filter((m) => permitidos.has(clavePago(m.name)))
  const medioElegido = mediosOnline.find((m) => m.id === pagoId) ?? null

  const cambiar = (campo, valor) => {
    setDatos((previos) => ({ ...previos, [campo]: valor }))
    if (tocados[campo]) setErrores((previos) => ({ ...previos, [campo]: validarCampo(campo, valor) }))
  }

  const salir = (campo) => {
    setTocados((previos) => ({ ...previos, [campo]: true }))
    setErrores((previos) => ({ ...previos, [campo]: validarCampo(campo, datos[campo]) }))
  }

  // Revisa un paso entero y marca sus campos para que los mensajes salgan juntos.
  const revisarPaso = (numero) => {
    const fallas = validarPaso(numero, datos, opciones)
    const campos = camposDelPaso(numero, opciones)
    setErrores((previos) => ({
      ...previos,
      ...Object.fromEntries(campos.map((c) => [c, fallas[c] ?? null])),
    }))
    if (Object.keys(fallas).length === 0) return true
    setTocados((previos) => ({ ...previos, ...Object.fromEntries(campos.map((c) => [c, true])) }))
    return false
  }

  const continuar = () => {
    if (paso === 3 && !medioElegido) {
      setErrorPedido('Elegi como vas a pagar.')
      return
    }
    setErrorPedido(null)
    if (revisarPaso(paso)) setPaso(paso + 1)
  }

  const ir = (destino) => {
    if (destino <= paso) {
      setPaso(destino)
      return
    }
    for (let n = paso; n < destino; n += 1) {
      if (!revisarPaso(n)) {
        setPaso(n)
        return
      }
    }
    setPaso(destino)
  }

  const confirmar = async (e) => {
    e.preventDefault()
    // El submit puede dispararse con Enter desde cualquier campo, y mientras hay
    // una llamada en curso no se manda otra: evita duplicar el pedido.
    if (!conforme || enviando) return
    for (const numero of [1, 2]) {
      if (!revisarPaso(numero)) {
        setPaso(numero)
        return
      }
    }
    if (!medioElegido) {
      setPaso(3)
      setErrorPedido('Elegi como vas a pagar.')
      return
    }

    setEnviando(true)
    setErrorPedido(null)
    try {
      // Datos que la ficha no tenia: se guardan antes del pedido, que los exige.
      const completar = {}
      if (!perfil.birthDate) completar.birthDate = datos.fechaNacimiento
      if (!perfil.documentNumber) completar.documentNumber = normalizarDni(datos.dni)
      if (!perfil.phone) completar.phone = datos.telefono.trim()
      if (Object.keys(completar).length > 0) {
        setPerfil(await completarPerfil(completar))
      }

      const creado = await crearPedido({
        items: lineas.map((l) => ({ productId: Number(l.id), quantity: l.cantidad })),
        deliveryMethod: entrega,
        ...(!retiroEnLocal && {
          shippingAddress: {
            street: datos.direccion.trim(),
            city: datos.ciudad.trim(),
            postalCode: datos.codigoPostal.trim().toUpperCase(),
            ...(datos.referencia.trim() && { reference: datos.referencia.trim() }),
          },
        }),
        contactPhone: datos.telefono.trim(),
        paymentMethodId: medioElegido.id,
      })
      // El carrito se vacia recien con la respuesta: si falla, no se pierde nada.
      setPedido(creado)
      vaciar()
    } catch (error) {
      setErrorPedido(mensajeDelPedido(error))
    } finally {
      setEnviando(false)
    }
  }

  if (pedido) {
    return (
      <PedidoCreado
        pedido={pedido}
        medio={medioElegido}
        ajustes={ajustes}
      />
    )
  }

  if (lineas.length === 0) return <Navigate to="/carrito" replace />

  const errorDe = (campo) => (tocados[campo] ? errores[campo] : null)
  const faltaAlgo = camposDelPaso(paso, opciones).some((campo) => errorDe(campo))
  const totales = calcularTotales(lineas, { retiroEnLocal, ajustes })

  return (
    <main className="checkout">
      <nav className="breadcrumb wrap" aria-label="Miga de pan">
        <Link to="/">Inicio</Link>
        <Icon name="right" size={13} />
        <Link to="/carrito">Carrito</Link>
        <Icon name="right" size={13} />
        <span aria-current="page">Checkout</span>
      </nav>

      <header className="catalog-head wrap">
        <h1>Finalizar compra</h1>
      </header>

      <div className="wrap checkout-grid">
        <div>
          <ol className="steps">
            {PASOS.map((p) => (
              <li
                key={p.id}
                className={`${p.id === paso ? 'is-active' : ''} ${p.id < paso ? 'is-done' : ''}`.trim()}
              >
                <button type="button" onClick={() => ir(p.id)}>
                  <span className="steps-num">{p.id < paso ? <Icon name="check" size={14} /> : p.id}</span>
                  {p.titulo}
                </button>
              </li>
            ))}
          </ol>

          {falloCarga ? (
            <div className="checkout-panel">
              <p className="checkout-aviso" role="alert">
                <Icon name="alert" size={16} />
                No pudimos cargar tus datos. Revisa tu conexion y recarga la pagina.
              </p>
            </div>
          ) : !perfil || !medios ? (
            <div className="checkout-panel" aria-busy="true">
              <p>Cargando tus datos...</p>
            </div>
          ) : (
            <form className="checkout-panel" onSubmit={confirmar} noValidate>
              {paso === 1 && (
                <section>
                  <h2>Tus datos</h2>
                  <p className="checkout-cuenta">
                    Compras como <b>{usuario?.name}</b> ({usuario?.email}).
                  </p>
                  <div className="fields">
                    <Campo
                      campo="telefono"
                      etiqueta="Telefono de contacto"
                      type="tel"
                      autoComplete="tel"
                      placeholder="+54 9 362 000 0000"
                      ancho
                      valor={datos.telefono}
                      error={errorDe('telefono')}
                      onCambio={cambiar}
                      onSalida={salir}
                    />
                    {faltantes.includes('fechaNacimiento') && (
                      <Campo
                        campo="fechaNacimiento"
                        etiqueta="Fecha de nacimiento"
                        type="date"
                        autoComplete="bday"
                        max={fechaMaximaNacimiento()}
                        valor={datos.fechaNacimiento}
                        error={errorDe('fechaNacimiento')}
                        onCambio={cambiar}
                        onSalida={salir}
                      />
                    )}
                    {faltantes.includes('dni') && (
                      <Campo
                        campo="dni"
                        etiqueta="DNI"
                        type="text"
                        inputMode="numeric"
                        placeholder="12345678"
                        valor={datos.dni}
                        error={errorDe('dni')}
                        onCambio={cambiar}
                        onSalida={salir}
                      />
                    )}
                  </div>
                  {faltantes.length > 0 && (
                    <p className="checkout-cuenta">
                      Tu cuenta no tiene {faltantes.length === 2 ? 'estos datos' : 'este dato'} y la
                      venta de alcohol a menores esta prohibida: los pedimos una sola vez y no se pueden
                      cambiar despues.
                    </p>
                  )}
                </section>
              )}

              {paso === 2 && (
                <section>
                  <h2>Como lo recibis</h2>
                  <div className="options">
                    <label className={`option ${entrega === 'envio' ? 'is-picked' : ''}`.trim()}>
                      <input
                        type="radio"
                        name="entrega"
                        checked={entrega === 'envio'}
                        onChange={() => setEntrega('envio')}
                      />
                      <span>
                        <b>Envio a domicilio</b>
                        <small>{textoDeEnvio(ajustes)}</small>
                      </span>
                    </label>
                    <label className={`option ${retiroEnLocal ? 'is-picked' : ''}`.trim()}>
                      <input
                        type="radio"
                        name="entrega"
                        checked={retiroEnLocal}
                        onChange={() => setEntrega('retiro')}
                      />
                      <span>
                        <b>Retiro en el local</b>
                        <small>
                          {ajustes?.pickupAddress
                            ? `${ajustes.pickupAddress}. Sin cargo.`
                            : 'Sin cargo. Te confirmamos la direccion cuando el pedido este listo.'}
                        </small>
                      </span>
                    </label>
                  </div>

                  {!retiroEnLocal && (
                    <div className="fields">
                      <Campo
                        campo="direccion"
                        etiqueta="Direccion"
                        type="text"
                        autoComplete="street-address"
                        placeholder="Calle y numero"
                        ancho
                        valor={datos.direccion}
                        error={errorDe('direccion')}
                        onCambio={cambiar}
                        onSalida={salir}
                      />
                      <Campo
                        campo="ciudad"
                        etiqueta="Ciudad"
                        type="text"
                        autoComplete="address-level2"
                        valor={datos.ciudad}
                        error={errorDe('ciudad')}
                        onCambio={cambiar}
                        onSalida={salir}
                      />
                      <Campo
                        campo="codigoPostal"
                        etiqueta="Codigo postal"
                        type="text"
                        autoComplete="postal-code"
                        placeholder="3700"
                        valor={datos.codigoPostal}
                        error={errorDe('codigoPostal')}
                        onCambio={cambiar}
                        onSalida={salir}
                      />
                      <Campo
                        campo="referencia"
                        etiqueta="Referencia (opcional)"
                        type="text"
                        placeholder="Porton negro, timbre 2"
                        ancho
                        valor={datos.referencia}
                        error={null}
                        onCambio={cambiar}
                        onSalida={salir}
                      />
                    </div>
                  )}
                </section>
              )}

              {paso === 3 && (
                <section>
                  <h2>Como pagas</h2>
                  {mediosOnline.length === 0 ? (
                    <p className="checkout-aviso" role="alert">
                      <Icon name="alert" size={16} />
                      Por ahora no hay medios de pago disponibles. Proba mas tarde.
                    </p>
                  ) : (
                    <div className="options">
                      {mediosOnline.map((m) => (
                        <label key={m.id} className={`option ${pagoId === m.id ? 'is-picked' : ''}`.trim()}>
                          <input
                            type="radio"
                            name="pago"
                            checked={pagoId === m.id}
                            onChange={() => {
                              setPagoId(m.id)
                              setErrorPedido(null)
                            }}
                          />
                          <span>
                            <b>{m.name}</b>
                            <small>{DETALLE_DE_PAGO[clavePago(m.name)]}</small>
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                </section>
              )}

              {paso === 4 && (
                <section>
                  <h2>Revisa el pedido</h2>
                  <ul className="review">
                    <li>
                      <span>Contacto</span>
                      <b>
                        {usuario?.name} &middot; {datos.telefono}
                      </b>
                    </li>
                    <li>
                      <span>Entrega</span>
                      <b>
                        {retiroEnLocal
                          ? 'Retiro en el local'
                          : `${datos.direccion}, ${datos.ciudad} (${datos.codigoPostal.toUpperCase()})`}
                      </b>
                    </li>
                    <li>
                      <span>Pago</span>
                      <b>{medioElegido?.name}</b>
                    </li>
                    <li>
                      <span>Total estimado</span>
                      <b>
                        {money.format(totales.total)}
                        {totales.envio === null && ' + envio'}
                      </b>
                    </li>
                  </ul>

                  <ul className="review-items">
                    {lineas.map((l) => (
                      <li key={l.id}>
                        <img src={l.image} alt="" />
                        <span>
                          <b>{l.name}</b>
                          <small>
                            {l.cantidad} x {money.format(l.price)}
                          </small>
                        </span>
                        <em>{money.format(l.price * l.cantidad)}</em>
                      </li>
                    ))}
                  </ul>

                  <p className="checkout-edad">
                    <Icon name="alert" size={16} />
                    Al entregar te vamos a pedir el DNI. Si quien recibe no es mayor de 18 anos, el
                    pedido no se entrega.
                  </p>

                  <label className="check">
                    <input type="checkbox" checked={conforme} onChange={(e) => setConforme(e.target.checked)} />
                    <span>
                      Declaro ser mayor de 18 anos. La venta de alcohol a menores esta prohibida por ley.
                    </span>
                  </label>
                </section>
              )}

              {(faltaAlgo || errorPedido) && (
                <div className="checkout-aviso" role="alert">
                  <Icon name="alert" size={16} />
                  <span>
                    {errorPedido ?? 'Revisa los campos marcados para poder continuar.'}
                    {errorPedido && /stock|unidades|disponible/i.test(errorPedido) && (
                      <>
                        {' '}
                        <Link to="/carrito">Ajustar el carrito</Link>
                      </>
                    )}
                  </span>
                </div>
              )}

              <div className="checkout-nav">
                {paso > 1 && (
                  <button type="button" className="btn btn-ghost" disabled={enviando} onClick={() => setPaso(paso - 1)}>
                    <Icon name="left" size={16} />
                    Volver
                  </button>
                )}
                {paso < 4 ? (
                  <button type="button" className="btn btn-primary" onClick={continuar}>
                    Continuar
                    <Icon name="right" size={16} />
                  </button>
                ) : (
                  <button type="submit" className="btn btn-primary" disabled={!conforme || enviando}>
                    <Icon name="check" size={17} />
                    {enviando ? 'Enviando...' : 'Confirmar pedido'}
                  </button>
                )}
              </div>
            </form>
          )}
        </div>

        <OrderSummary lineas={lineas} retiroEnLocal={retiroEnLocal}>
          <Link className="summary-edit" to="/carrito">
            Editar el carrito
          </Link>
        </OrderSummary>
      </div>
    </main>
  )
}

function textoDeEnvio(ajustes) {
  if (!ajustes) return 'Te mostramos el costo al confirmar.'
  const zona = ajustes.deliveryZone ? `${ajustes.deliveryZone}. ` : ''
  return `${zona}${money.format(ajustes.shippingCost)}, gratis desde ${money.format(ajustes.freeShippingFrom)}.`
}

// Mensaje segun el error de la API. Los de negocio se reconocen por su codigo.
function mensajeDelPedido(error) {
  if (error?.code === 'MENOR_DE_EDAD') return 'Solo pueden comprar personas mayores de 18 anos.'
  if (error?.code === 'PERFIL_INCOMPLETO') return 'Faltan datos en tu cuenta. Volve al primer paso y completalos.'
  if (error?.status === 503) return 'Los pedidos online no estan disponibles por el momento. Proba mas tarde.'
  return mensajeDeError(error)
}

function PedidoCreado({ pedido, medio, ajustes }) {
  const transferencia = medio && clavePago(medio.name) === 'transferencia'
  return (
    <main className="checkout">
      <div className="wrap checkout-ok">
        <span className="checkout-ok-icono" aria-hidden="true">
          <Icon name="check" size={30} />
        </span>
        <h1>Pedido #{pedido.id} recibido</h1>
        <p>
          Estado: <b>{ESTADOS[pedido.status] ?? pedido.status}</b>. El local lo va a preparar y te va a
          contactar al telefono {pedido.contactPhone}.
        </p>

        <ul className="review checkout-ok-resumen">
          <li>
            <span>Entrega</span>
            <b>
              {pedido.deliveryMethod === 'retiro'
                ? 'Retiro en el local'
                : `${pedido.shippingAddress?.street}, ${pedido.shippingAddress?.city}`}
            </b>
          </li>
          <li>
            <span>Pago</span>
            <b>{medio?.name}</b>
          </li>
          <li>
            <span>Envio</span>
            <b>{pedido.shippingCost === 0 ? 'Sin cargo' : money.format(pedido.shippingCost)}</b>
          </li>
          <li>
            <span>Total</span>
            <b>{money.format(pedido.total)}</b>
          </li>
          <li>
            <span>Fecha</span>
            <b>{new Date(pedido.saleDate).toLocaleString('es-AR')}</b>
          </li>
        </ul>

        {transferencia && (
          <p className="checkout-ok-nota">
            {ajustes?.transferInstructions
              ? ajustes.transferInstructions
              : 'Para pagar por transferencia, el local te va a pasar los datos de la cuenta.'}
          </p>
        )}
        <p className="checkout-ok-nota">
          Al entregar te vamos a pedir el DNI: si quien recibe no es mayor de 18 anos, el pedido no se entrega.
        </p>
        <Link className="btn btn-primary" to="/catalogo">
          Seguir comprando
        </Link>
      </div>
    </main>
  )
}
