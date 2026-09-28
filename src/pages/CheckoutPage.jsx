import { useState } from 'react'
import { Link, Navigate } from 'react-router'
import Icon from '../components/ui/Icon.jsx'
import OrderSummary from '../components/cart/OrderSummary.jsx'
import { money } from '../lib/format.js'
import { useCarrito } from '../hooks/useCarrito.js'
import { registrarPedido } from '../lib/edad.js'

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

export default function CheckoutPage() {
  // Vista de maqueta: nada se envia a ningun lado. Los pasos y las opciones
  // viven en estado local para poder recorrer el flujo completo.
  const [paso, setPaso] = useState(1)
  const [entrega, setEntrega] = useState('envio')
  const [pago, setPago] = useState('tarjeta')
  const [conforme, setConforme] = useState(false)
  const [registro, setRegistro] = useState(null)

  const { lineas, vaciar } = useCarrito()

  const retiroEnLocal = entrega === 'retiro'

  const confirmar = (e) => {
    e.preventDefault()
    // Doble control: el boton ya esta deshabilitado, pero el submit puede
    // dispararse con Enter desde cualquier campo del formulario.
    if (!conforme) return
    setRegistro(registrarPedido({ unidades: lineas.length, entrega, pago }))
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
                <button type="button" onClick={() => setPaso(p.id)}>
                  <span className="steps-num">{p.id < paso ? <Icon name="check" size={14} /> : p.id}</span>
                  {p.titulo}
                </button>
              </li>
            ))}
          </ol>

          <form className="checkout-panel" onSubmit={confirmar}>
            {paso === 1 && (
              <section>
                <h2>Tus datos</h2>
                <div className="fields">
                  <label>
                    <span>Nombre</span>
                    <input type="text" autoComplete="given-name" placeholder="Brayan" />
                  </label>
                  <label>
                    <span>Apellido</span>
                    <input type="text" autoComplete="family-name" placeholder="Sosa" />
                  </label>
                  <label className="field-wide">
                    <span>Correo</span>
                    <input type="email" autoComplete="email" placeholder="tunombre@correo.com" />
                  </label>
                  <label className="field-wide">
                    <span>Telefono</span>
                    <input type="tel" autoComplete="tel" placeholder="+54 9 362 000 0000" />
                  </label>
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
                    <label className="field-wide">
                      <span>Direccion</span>
                      <input type="text" autoComplete="street-address" placeholder="Calle y numero" />
                    </label>
                    <label>
                      <span>Ciudad</span>
                      <input type="text" autoComplete="address-level2" placeholder="Resistencia" />
                    </label>
                    <label>
                      <span>Codigo postal</span>
                      <input type="text" autoComplete="postal-code" placeholder="3500" />
                    </label>
                    <label className="field-wide">
                      <span>Referencia (opcional)</span>
                      <input type="text" placeholder="Porton negro, timbre 2" />
                    </label>
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
                    <span>Entrega</span>
                    <b>{retiroEnLocal ? 'Retiro en el local' : 'Envio a domicilio'}</b>
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

            <div className="checkout-nav">
              {paso > 1 && (
                <button type="button" className="btn btn-ghost" onClick={() => setPaso(paso - 1)}>
                  <Icon name="left" size={16} />
                  Volver
                </button>
              )}
              {paso < 4 ? (
                <button type="button" className="btn btn-primary" onClick={() => setPaso(paso + 1)}>
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
