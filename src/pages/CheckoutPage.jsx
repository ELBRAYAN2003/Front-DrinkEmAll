import { useState } from 'react'
import { Link, Navigate } from 'react-router'
import Icon from '../components/ui/Icon.jsx'
import OrderSummary from '../components/cart/OrderSummary.jsx'
import { money } from '../lib/format.js'
import { useCarrito } from '../hooks/useCarrito.js'
import { registrarPedido } from '../lib/edad.js'
import { CAMPOS_POR_PASO, validarCampo, validarPaso } from '../lib/validacion.js'

const PASOS = [
  { id: 1, titulo: 'Tus datos' },
  { id: 2, titulo: 'Entrega' },
  { id: 3, titulo: 'Pago' },
  { id: 4, titulo: 'Confirmar' },
]

const PAGOS = [
  { id: 'tarjeta', titulo: 'Tarjeta de credito o debito', detalle: 'Hasta 3 cuotas sin interes' },
  { id: 'transferencia', titulo: 'Transferencia bancaria', detalle: '5% de descuento' },
  { id: 'efectivo', titulo: 'Efectivo al recibir', detalle: 'Solo para envios locales' },
]

const DATOS_VACIOS = {
  nombre: '',
  apellido: '',
  email: '',
  telefono: '',
  direccion: '',
  ciudad: '',
  codigoPostal: '',
  referencia: '',
}

// Campo de texto con su mensaje de error debajo. El error se pasa ya resuelto:
// quien decide si el valor sirve son las reglas de lib/validacion.js.
function Campo({ campo, etiqueta, valor, error, ancho, onCambio, onSalida, ...resto }) {
  const id = `checkout-${campo}`
  return (
    <label className={ancho ? 'field-wide' : undefined}>
      <span>{etiqueta}</span>
      <input
        id={id}
        name={campo}
        value={valor}
        onChange={(e) => onCambio(campo, e.target.value)}
        onBlur={() => onSalida(campo)}
        className={error ? 'is-invalid' : undefined}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        {...resto}
      />
      {error && (
        <em className="field-error" id={`${id}-error`}>
          {error}
        </em>
      )}
    </label>
  )
}

export default function CheckoutPage() {
  // Vista de maqueta: nada se envia a ningun lado. Los pasos y las opciones
  // viven en estado local para poder recorrer el flujo completo.
  const [paso, setPaso] = useState(1)
  const [entrega, setEntrega] = useState('envio')
  const [pago, setPago] = useState('tarjeta')
  const [conforme, setConforme] = useState(false)
  const [registro, setRegistro] = useState(null)

  // Los campos de texto son controlados para poder revisarlos mientras se
  // escribe. "tocados" existe para no mostrar errores de campos que la persona
  // todavia no visito: un formulario en rojo antes de la primera letra espanta.
  const [datos, setDatos] = useState(DATOS_VACIOS)
  const [errores, setErrores] = useState({})
  const [tocados, setTocados] = useState({})

  const { lineas, vaciar } = useCarrito()

  const retiroEnLocal = entrega === 'retiro'

  const cambiar = (campo, valor) => {
    setDatos((previos) => ({ ...previos, [campo]: valor }))
    // Mientras se corrige un campo ya marcado, el mensaje se actualiza en vivo.
    if (tocados[campo]) {
      setErrores((previos) => ({ ...previos, [campo]: validarCampo(campo, valor) }))
    }
  }

  const salir = (campo) => {
    setTocados((previos) => ({ ...previos, [campo]: true }))
    setErrores((previos) => ({ ...previos, [campo]: validarCampo(campo, datos[campo]) }))
  }

  // Revisa un paso entero. Si algo falla, marca todos sus campos como tocados
  // para que los mensajes aparezcan juntos y no de a uno. Devuelve si paso.
  const revisarPaso = (numero) => {
    const fallas = validarPaso(numero, datos, { retiroEnLocal })
    const campos = CAMPOS_POR_PASO[numero] ?? []
    setErrores((previos) => ({
      ...previos,
      ...Object.fromEntries(campos.map((c) => [c, fallas[c] ?? null])),
    }))
    if (Object.keys(fallas).length === 0) return true
    setTocados((previos) => ({
      ...previos,
      ...Object.fromEntries(campos.map((c) => [c, true])),
    }))
    return false
  }

  const continuar = () => {
    if (revisarPaso(paso)) setPaso(paso + 1)
  }

  // Los numeros de arriba dejan volver sin trabas, pero para saltar hacia
  // adelante hay que tener completo todo lo que queda en el medio.
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

  const confirmar = (e) => {
    e.preventDefault()
    // Doble control: el boton ya esta deshabilitado, pero el submit puede
    // dispararse con Enter desde cualquier campo del formulario.
    if (!conforme) return
    // Ultima revision antes de registrar: los dos pasos con datos se validan
    // enteros, porque a este punto se puede llegar salteando con Enter.
    for (const numero of [1, 2]) {
      if (!revisarPaso(numero)) {
        setPaso(numero)
        return
      }
    }
    setRegistro(
      registrarPedido({
        unidades: lineas.length,
        entrega,
        pago,
        cliente: {
          nombre: datos.nombre.trim(),
          apellido: datos.apellido.trim(),
          email: datos.email.trim(),
          telefono: datos.telefono.trim(),
        },
        envio: retiroEnLocal
          ? null
          : {
              direccion: datos.direccion.trim(),
              ciudad: datos.ciudad.trim(),
              codigoPostal: datos.codigoPostal.trim().toUpperCase(),
              referencia: datos.referencia.trim(),
            },
      }),
    )
    vaciar()
  }

  // Sin lineas no hay nada que confirmar: se vuelve al carrito, que ya tiene
  // su propio estado vacio. El registro se comprueba antes para no expulsar a
  // quien acaba de confirmar.
  if (!registro && lineas.length === 0) return <Navigate to="/carrito" replace />

  if (registro) {
    return (
      <main className="checkout">
        <div className="wrap checkout-ok">
          <span className="checkout-ok-icono" aria-hidden="true">
            <Icon name="check" size={30} />
          </span>
          <h1>Pedido registrado</h1>
          <p>
            Guardamos tu conformidad de mayoria de edad el{' '}
            {new Date(registro.fecha).toLocaleString('es-AR')}.
          </p>
          <p className="checkout-ok-nota">
            El pedido todavia no se envia a ningun lado: queda registrado en
            este navegador hasta que el checkout hable con el backend.
          </p>
          <Link className="btn btn-primary" to="/catalogo">
            Seguir comprando
          </Link>
        </div>
      </main>
    )
  }

  // Un campo solo muestra su error si ya fue tocado.
  const errorDe = (campo) => (tocados[campo] ? errores[campo] : null)

  const camposDelPaso = (numero) =>
    numero === 2 && retiroEnLocal ? [] : (CAMPOS_POR_PASO[numero] ?? [])

  const faltaAlgo = camposDelPaso(paso).some((campo) => errorDe(campo))

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

          <form className="checkout-panel" onSubmit={confirmar} noValidate>
            {paso === 1 && (
              <section>
                <h2>Tus datos</h2>
                <div className="fields">
                  <Campo
                    campo="nombre"
                    etiqueta="Nombre"
                    type="text"
                    autoComplete="given-name"
                    placeholder="Brayan"
                    valor={datos.nombre}
                    error={errorDe('nombre')}
                    onCambio={cambiar}
                    onSalida={salir}
                  />
                  <Campo
                    campo="apellido"
                    etiqueta="Apellido"
                    type="text"
                    autoComplete="family-name"
                    placeholder="Sosa"
                    valor={datos.apellido}
                    error={errorDe('apellido')}
                    onCambio={cambiar}
                    onSalida={salir}
                  />
                  <Campo
                    campo="email"
                    etiqueta="Correo"
                    type="email"
                    autoComplete="email"
                    placeholder="tunombre@correo.com"
                    ancho
                    valor={datos.email}
                    error={errorDe('email')}
                    onCambio={cambiar}
                    onSalida={salir}
                  />
                  <Campo
                    campo="telefono"
                    etiqueta="Telefono"
                    type="tel"
                    autoComplete="tel"
                    placeholder="+54 9 362 000 0000"
                    ancho
                    valor={datos.telefono}
                    error={errorDe('telefono')}
                    onCambio={cambiar}
                    onSalida={salir}
                  />
                </div>
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
                      <small>Llega en 24 horas. Gratis desde $80.</small>
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
                      <small>Av. Sarmiento 1420, Resistencia. Sin cargo.</small>
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
                      placeholder="Resistencia"
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
                      inputMode="text"
                      placeholder="3500"
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
                <div className="options">
                  {PAGOS.map((m) => (
                    <label key={m.id} className={`option ${pago === m.id ? 'is-picked' : ''}`.trim()}>
                      <input
                        type="radio"
                        name="pago"
                        checked={pago === m.id}
                        onChange={() => setPago(m.id)}
                      />
                      <span>
                        <b>{m.titulo}</b>
                        <small>{m.detalle}</small>
                      </span>
                    </label>
                  ))}
                </div>
              </section>
            )}

            {paso === 4 && (
              <section>
                <h2>Revisa el pedido</h2>
                <ul className="review">
                  <li>
                    <span>Contacto</span>
                    <b>
                      {datos.nombre} {datos.apellido} &middot; {datos.email}
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
                    <b>{PAGOS.find((m) => m.id === pago)?.titulo}</b>
                  </li>
                </ul>

                <ul className="review-items">
                  {lineas.map((l) => (
                    <li key={l.id}>
                      <img src={l.image} alt="" />
                      <span>
                        <b>{l.name}</b>
                        <small>{l.cantidad} x {money.format(l.price)}</small>
                      </span>
                      <em>{money.format(l.price * l.cantidad)}</em>
                    </li>
                  ))}
                </ul>

                <label className="check">
                  <input
                    type="checkbox"
                    checked={conforme}
                    onChange={(e) => setConforme(e.target.checked)}
                  />
                  <span>
                    Declaro ser mayor de 18 anos y acepto los terminos. La venta
                    de alcohol a menores esta prohibida por ley.
                  </span>
                </label>
              </section>
            )}

            {faltaAlgo && (
              <p className="checkout-aviso" role="alert">
                <Icon name="alert" size={16} />
                Revisa los campos marcados para poder continuar.
              </p>
            )}

            <div className="checkout-nav">
              {paso > 1 && (
                <button type="button" className="btn btn-ghost" onClick={() => setPaso(paso - 1)}>
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
                <button type="submit" className="btn btn-primary" disabled={!conforme}>
                  <Icon name="check" size={17} />
                  Confirmar pedido
                </button>
              )}
            </div>
          </form>
        </div>

        <OrderSummary lineas={lineas} retiroEnLocal={retiroEnLocal}>
          <Link className="summary-edit" to="/carrito">Editar el carrito</Link>
        </OrderSummary>
      </div>
    </main>
  )
}
