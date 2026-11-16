import { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router'
import Icon from '../components/ui/Icon.jsx'
import Campo from '../components/ui/Campo.jsx'
import OrderSummary from '../components/cart/OrderSummary.jsx'
import { money } from '../lib/format.js'
import { useCarrito } from '../hooks/useCarrito.js'
import { useAuth } from '../hooks/useAuth.js'
import { useAjustesTienda } from '../hooks/useAjustesTienda.js'
import OpcionesDeLibreta from '../components/checkout/OpcionesDeLibreta.jsx'
import { miPerfil } from '../api/auth.js'
import { completarPerfil, crearPedido, mediosDePago } from '../api/tienda.js'
import { pagarConMercadoPago } from '../api/pedidos.js'
import { iniciarEspera } from '../lib/esperaDePago.js'
import { duracion, nombreDePedido } from '../lib/estadosPedido.js'
import DatosDeTransferencia, { DatosDeRetiro } from '../components/checkout/DatosDeTransferencia.jsx'
import { domicilios, facturacion } from '../api/libreta.js'
import { formatoDocumento, soloDigitos } from '../lib/documento.js'
import { calcularTotales } from '../data/cart.js'
import { mensajeDeError } from '../lib/mensajeDeError.js'
import { camposDelPaso, fechaMaximaNacimiento, normalizarDni, validarCampo, validarPaso } from '../lib/validacion.js'

const PASOS = [
  { id: 1, titulo: 'Facturacion' },
  { id: 2, titulo: 'Entrega' },
  { id: 3, titulo: 'Pago' },
  { id: 4, titulo: 'Confirmar' },
]

// Solo estos dos medios se operan: lo que no necesita una pasarela de pago. El
// servidor tambien los restringe; esto es lo que se ofrece en pantalla.
const DETALLE_DE_PAGO = {
  efectivo: 'Pagas en efectivo al recibir el pedido o al retirarlo.',
  transferencia: 'Te pasamos los datos de la cuenta y el local confirma el pago a mano.',
  'mercado pago / qr': 'Pagas ahora con tarjeta, dinero en cuenta u otros medios. Te llevamos a Mercado Pago.',
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
  domEtiqueta: '',
  facNombre: '',
  facTipo: 'DNI',
  facDoc: '',
  facCorreo: '',
}

const ESTADOS = { pending: 'Pendiente' }

export default function CheckoutPage() {
  const { usuario, esPersonal } = useAuth()
  const { lineas, vaciar } = useCarrito()
  const ajustes = useAjustesTienda()
  const navigate = useNavigate()

  const [paso, setPaso] = useState(1)
  const [entrega, setEntrega] = useState('envio')
  const [pagoId, setPagoId] = useState(null)
  const [conforme, setConforme] = useState(false)
  const [pedido, setPedido] = useState(null)

  // Ficha y medios de pago, que se piden al entrar. `perfil` null = cargando.
  const [perfil, setPerfil] = useState(null)
  const [medios, setMedios] = useState(null)
  const [falloCarga, setFalloCarga] = useState(false)

  // Libreta de la cuenta y lo que se eligio de ella. 'cuenta' = los datos de la
  // cuenta; 'nueva'/'nuevo' = cargar otros; un id = uno guardado.
  const [libreta, setLibreta] = useState({ domicilios: [], facturacion: [] })
  const [facturaElegida, setFacturaElegida] = useState('cuenta')
  const [domicilioElegido, setDomicilioElegido] = useState('nuevo')
  const [guardarFactura, setGuardarFactura] = useState(false)
  const [guardarDomicilio, setGuardarDomicilio] = useState(false)

  const [datos, setDatos] = useState(DATOS_VACIOS)
  const [errores, setErrores] = useState({})
  const [tocados, setTocados] = useState({})
  const [enviando, setEnviando] = useState(false)
  const [errorPedido, setErrorPedido] = useState(null)

  useEffect(() => {
    // Una cuenta del comercio no compra: no hay ficha de cliente que cargar.
    if (esPersonal) return undefined
    let vigente = true
    Promise.all([miPerfil(), mediosDePago(), domicilios.listar(), facturacion.listar()])
      .then(([ficha, lista, doms, facts]) => {
        if (!vigente) return
        setPerfil(ficha)
        setMedios(lista)
        setLibreta({ domicilios: doms, facturacion: facts })
        // Lo predeterminado viene marcado; sin libreta, los datos de la cuenta (el DNI que
        // falte se pide en este mismo paso, para el control de edad).
        const porDefecto = facts.find((f) => f.isDefault)
        setFacturaElegida(porDefecto ? `f${porDefecto.id}` : 'cuenta')
        const domPorDefecto = doms.find((d) => d.isDefault)
        setDomicilioElegido(domPorDefecto ? `d${domPorDefecto.id}` : 'nuevo')
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
  const facturaNueva = facturaElegida === 'nueva'
  const domicilioNuevo = domicilioElegido === 'nuevo'
  const opciones = { retiroEnLocal, faltantes, facturaNueva, domicilioNuevo }

  // Medios que se ofrecen: los que la API declara para pedidos online y existen cargados.
  const permitidos = new Set((ajustes?.onlinePaymentMethods ?? ['Efectivo', 'Transferencia']).map(clavePago))
  const mediosOnline = (medios ?? []).filter((m) => permitidos.has(clavePago(m.name)))
  const medioElegido = mediosOnline.find((m) => m.id === pagoId) ?? null

  const cambiar = (campo, valor) => {
    setDatos((previos) => ({ ...previos, [campo]: valor }))
    if (tocados[campo]) setErrores((previos) => ({ ...previos, [campo]: validarCampo(campo, valor, { ...datos, [campo]: valor }) }))
  }

  const salir = (campo) => {
    setTocados((previos) => ({ ...previos, [campo]: true }))
    setErrores((previos) => ({ ...previos, [campo]: validarCampo(campo, datos[campo], datos) }))
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

  // Datos de facturacion y domicilio que van en el pedido, segun lo elegido.
  const datosDeFactura = () => {
    if (facturaElegida === 'cuenta') {
      return {
        fullName: `${perfil.firstName ?? ''} ${perfil.lastName ?? ''}`.trim() || usuario?.name || '',
        taxIdType: 'DNI',
        taxId: perfil.documentNumber || normalizarDni(datos.dni),
        email: usuario?.email ?? '',
      }
    }
    if (facturaElegida === 'nueva') {
      return {
        fullName: datos.facNombre.trim(),
        taxIdType: datos.facTipo,
        taxId: soloDigitos(datos.facDoc),
        email: datos.facCorreo.trim(),
      }
    }
    const f = libreta.facturacion.find((x) => `f${x.id}` === facturaElegida)
    return { fullName: f.fullName, taxIdType: f.taxIdType, taxId: f.taxId, email: f.email }
  }

  const datosDeDomicilio = () => {
    if (domicilioElegido === 'nuevo') {
      return {
        street: datos.direccion.trim(),
        city: datos.ciudad.trim(),
        postalCode: datos.codigoPostal.trim().toUpperCase(),
        ...(datos.referencia.trim() && { reference: datos.referencia.trim() }),
      }
    }
    const d = libreta.domicilios.find((x) => `d${x.id}` === domicilioElegido)
    return { street: d.street, city: d.city, postalCode: d.postalCode, ...(d.reference && { reference: d.reference }) }
  }

  // Lo nuevo se guarda en la cuenta solo si la persona lo pidio, y sin bloquear nada:
  // el pedido ya esta hecho, y que no entre en la libreta (o que ya haya 10) no es un error de compra.
  const guardarEnLaCuenta = async (factura, domicilio) => {
    const tareas = []
    if (facturaNueva && guardarFactura) tareas.push(facturacion.crear(factura))
    if (!retiroEnLocal && domicilioNuevo && guardarDomicilio) {
      tareas.push(domicilios.crear({ ...domicilio, ...(datos.domEtiqueta.trim() && { label: datos.domEtiqueta.trim() }) }))
    }
    await Promise.allSettled(tareas)
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

      const factura = datosDeFactura()
      const domicilio = retiroEnLocal ? null : datosDeDomicilio()
      const creado = await crearPedido({
        items: lineas.map((l) => ({ productId: Number(l.id), quantity: l.cantidad })),
        deliveryMethod: entrega,
        ...(domicilio && { shippingAddress: domicilio }),
        contactPhone: datos.telefono.trim(),
        billing: factura,
        paymentMethodId: medioElegido.id,
      })
      // El carrito se vacia recien con la respuesta: si falla, no se pierde nada.
      vaciar()
      guardarEnLaCuenta(factura, domicilio)

      if (clavePago(medioElegido.name) === 'mercado pago / qr') {
        // El pedido ya existe (con el stock reservado). Se manda a pagar a Mercado Pago;
        // si no se puede iniciar el pago, la persona llega al detalle del pedido, donde
        // puede reintentarlo, y no se pierde nada.
        try {
          const { url } = await pagarConMercadoPago(creado.id)
          // Antes de salir, esta entrada del historial pasa a ser "esperando el pago" del
          // pedido: si la persona vuelve con "atras" desde Mercado Pago llega a esa pantalla
          // (con la cuenta regresiva) y no a un carrito vacio.
          iniciarEspera(creado.id)
          navigate(`/mis-pedidos/${creado.id}?mp=waiting`, { replace: true })
          window.location.assign(url)
          return
        } catch {
          navigate(`/mis-pedidos/${creado.id}?mp=error`, { replace: true })
          return
        }
      }
      setPedido(creado)
    } catch (error) {
      setErrorPedido(mensajeDelPedido(error))
    } finally {
      setEnviando(false)
    }
  }

  // Una cuenta del comercio no compra (la API tampoco la deja): se avisa en vez de mostrar el formulario.
  if (esPersonal) {
    return (
      <main className="checkout">
        <div className="wrap checkout-ok">
          <h1>Esta cuenta no puede comprar</h1>
          <p>
            Ingresaste con una cuenta del comercio ({usuario?.email}). Para hacer un pedido necesitás una cuenta de
            cliente.
          </p>
          <Link className="btn btn-primary" to="/salir" state={{ destino: '/ingresar' }}>
            Salir e ingresar con otra cuenta
          </Link>
          <Link className="checkout-ok-otro" to="/mis-pedidos">
            Ver los pedidos del local
          </Link>
        </div>
      </main>
    )
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

  const nombreDeCuenta = `${perfil?.firstName ?? ''} ${perfil?.lastName ?? ''}`.trim() || usuario?.name
  const dniDeCuenta = perfil?.documentNumber || normalizarDni(datos.dni)
  const opcionesDeFactura = [
    {
      id: 'cuenta',
      titulo: 'Usar los datos de mi cuenta',
      detalle: `${nombreDeCuenta} - ${dniDeCuenta ? formatoDocumento('DNI', dniDeCuenta) : 'DNI sin cargar'} - ${usuario?.email}`,
    },
    ...libreta.facturacion.map((f) => ({
      id: `f${f.id}`,
      titulo: f.label || f.fullName,
      detalle: `${f.fullName} - ${formatoDocumento(f.taxIdType, f.taxId)} - ${f.email}`,
      predeterminado: f.isDefault,
    })),
    { id: 'nueva', titulo: 'Usar otros datos', detalle: 'Los cargas para este pedido' },
  ]
  const opcionesDeDomicilio = [
    ...libreta.domicilios.map((d) => ({
      id: `d${d.id}`,
      titulo: d.label || d.street,
      detalle: `${d.street}, ${d.city} (${d.postalCode})${d.reference ? ` - ${d.reference}` : ''}`,
      predeterminado: d.isDefault,
    })),
    { id: 'nuevo', titulo: 'Usar otro domicilio', detalle: 'Lo cargas para este pedido' },
  ]

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
                  <h2>Facturacion y contacto</h2>
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

                  <h3 className="checkout-subtitulo">Datos para la factura</h3>
                  <OpcionesDeLibreta
                    nombre="factura"
                    elegida={facturaElegida}
                    onElegir={setFacturaElegida}
                    opciones={opcionesDeFactura}
                  />

                  {facturaNueva && (
                    <>
                      <div className="fields">
                        <Campo
                          campo="facNombre"
                          etiqueta="Nombre o razon social"
                          type="text"
                          autoComplete="name"
                          ancho
                          valor={datos.facNombre}
                          error={errorDe('facNombre')}
                          onCambio={cambiar}
                          onSalida={salir}
                        />
                        <label>
                          <span>Tipo de documento</span>
                          <select
                            name="facTipo"
                            value={datos.facTipo}
                            onChange={(e) => {
                              cambiar('facTipo', e.target.value)
                              // El numero se vuelve a revisar con el tipo nuevo.
                              if (tocados.facDoc) {
                                setErrores((previos) => ({
                                  ...previos,
                                  facDoc: validarCampo('facDoc', datos.facDoc, { ...datos, facTipo: e.target.value }),
                                }))
                              }
                            }}
                          >
                            <option value="DNI">DNI</option>
                            <option value="CUIT">CUIT</option>
                          </select>
                        </label>
                        <Campo
                          campo="facDoc"
                          etiqueta="Numero"
                          type="text"
                          inputMode="numeric"
                          placeholder={datos.facTipo === 'CUIT' ? '20-12345678-6' : '12345678'}
                          valor={datos.facDoc}
                          error={errorDe('facDoc')}
                          onCambio={cambiar}
                          onSalida={salir}
                        />
                        <Campo
                          campo="facCorreo"
                          etiqueta="Correo para enviar la factura"
                          type="email"
                          autoComplete="email"
                          ancho
                          valor={datos.facCorreo}
                          error={errorDe('facCorreo')}
                          onCambio={cambiar}
                          onSalida={salir}
                        />
                      </div>
                      <label className="check check-guardar">
                        <input
                          type="checkbox"
                          checked={guardarFactura}
                          onChange={(e) => setGuardarFactura(e.target.checked)}
                        />
                        <span>Guardar estos datos en mi cuenta</span>
                      </label>
                    </>
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
                          <DatosDeRetiro direccion={ajustes?.pickupAddress} horarios={ajustes?.pickupHours} /> · Sin cargo.
                        </small>
                      </span>
                    </label>
                  </div>

                  {!retiroEnLocal && (
                    <>
                      <h3 className="checkout-subtitulo">Domicilio de entrega</h3>
                      <OpcionesDeLibreta
                        nombre="domicilio"
                        elegida={domicilioElegido}
                        onElegir={setDomicilioElegido}
                        opciones={opcionesDeDomicilio}
                      />
                    </>
                  )}

                  {!retiroEnLocal && domicilioNuevo && (
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

                  {!retiroEnLocal && domicilioNuevo && (
                    <>
                      <label className="check check-guardar">
                        <input
                          type="checkbox"
                          checked={guardarDomicilio}
                          onChange={(e) => setGuardarDomicilio(e.target.checked)}
                        />
                        <span>Guardar este domicilio en mi cuenta</span>
                      </label>
                      {guardarDomicilio && (
                        <div className="fields">
                          <Campo
                            campo="domEtiqueta"
                            etiqueta="Nombre para reconocerlo (opcional)"
                            type="text"
                            maxLength={40}
                            placeholder="Casa, Trabajo..."
                            ancho
                            valor={datos.domEtiqueta}
                            error={null}
                            onCambio={cambiar}
                            onSalida={salir}
                          />
                        </div>
                      )}
                    </>
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
                  {medioElegido && /transferencia/i.test(medioElegido.name) && (
                    <DatosDeTransferencia transfer={ajustes?.transfer} />
                  )}
                  {medioElegido && /mercado pago|transferencia/i.test(medioElegido.name) && ajustes?.paymentWindowMinutes && (
                    <p className="checkout-cuenta">
                      Al confirmar reservamos tus productos por {duracion(ajustes.paymentWindowMinutes)} mientras se
                      acredita el pago. Si no se paga en ese plazo, el pedido se cancela y el stock vuelve a la venta.
                    </p>
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
                      <span>Facturacion</span>
                      <b>{textoDeFactura(datosDeFactura())}</b>
                    </li>
                    <li>
                      <span>Entrega</span>
                      <b>
                        {retiroEnLocal ? (
                          <>
                            Retiro en el local: <DatosDeRetiro direccion={ajustes?.pickupAddress} horarios={ajustes?.pickupHours} />
                          </>
                        ) : (
                          textoDeDomicilio(datosDeDomicilio())
                        )}
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
                      Declaro ser mayor de 18 anos y acepto los{' '}
                      <Link to="/terminos" target="_blank" rel="noopener">
                        terminos y condiciones
                      </Link>
                      . La venta de alcohol a menores esta prohibida por ley.
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

const textoDeFactura = (f) =>
  `${f.fullName} - ${formatoDocumento(f.taxIdType, f.taxId)} - ${f.email}`

const textoDeDomicilio = (d) =>
  `${d.street}, ${d.city} (${d.postalCode})${d.reference ? ` - ${d.reference}` : ''}`

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
        <h1>Pedido {nombreDePedido(pedido)} recibido</h1>
        {pedido.code && (
          <p className="pedido-codigo-aviso">
            Tu código de pedido es <b className="pedido-codigo">{pedido.code}</b>. Guardalo: con él el local ubica tu
            pedido.
          </p>
        )}
        <p>
          Estado: <b>{ESTADOS[pedido.status] ?? pedido.status}</b>. El local lo va a preparar y te va a
          contactar al telefono {pedido.contactPhone}.
        </p>

        <ul className="review checkout-ok-resumen">
          <li>
            <span>Entrega</span>
            <b>
              {pedido.deliveryMethod === 'retiro' ? (
                <>
                  Retiro en el local: <DatosDeRetiro direccion={ajustes?.pickupAddress} horarios={ajustes?.pickupHours} />
                </>
              ) : (
                `${pedido.shippingAddress?.street}, ${pedido.shippingAddress?.city}`
              )}
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

        {transferencia && ajustes?.paymentWindowMinutes && (
          <p className="checkout-ok-nota">
            Reservamos tus productos por {duracion(ajustes.paymentWindowMinutes)}: si la transferencia no se
            acredita en ese plazo, el pedido se cancela.
          </p>
        )}
        {transferencia && <DatosDeTransferencia transfer={ajustes?.transfer} codigo={pedido.code} />}
        <p className="checkout-ok-nota">
          Al entregar te vamos a pedir el DNI: si quien recibe no es mayor de 18 anos, el pedido no se entrega.
        </p>
        <Link className="btn btn-primary" to={`/mis-pedidos/${pedido.id}`}>
          Seguir mi pedido
        </Link>
        <Link className="checkout-ok-otro" to="/catalogo">
          Seguir comprando
        </Link>
        <Link className="checkout-ok-otro" to="/arrepentimiento">
          BOTÓN DE ARREPENTIMIENTO
        </Link>
      </div>
    </main>
  )
}
