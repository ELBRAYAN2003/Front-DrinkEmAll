import { useState } from 'react'
import { Link } from 'react-router'
import Icon from '../components/ui/Icon.jsx'
import OrderSummary from '../components/cart/OrderSummary.jsx'
import { money } from '../lib/format.js'
import { lineasIniciales } from '../data/cart.js'

export default function CartPage() {
  // Vista de maqueta: el carrito vive en estado local. Cuando exista el
  // backend, esto pasa a un contexto compartido con el resto de la app.
  const [lineas, setLineas] = useState(lineasIniciales)

  const cambiarCantidad = (id, delta) =>
    setLineas((prev) =>
      prev.map((l) =>
        l.id === id
          // Nunca por debajo de 1 ni por encima del stock: para vaciar una
          // linea esta el boton de quitar.
          ? { ...l, cantidad: Math.max(1, Math.min(l.stock || 99, l.cantidad + delta)) }
          : l,
      ),
    )

  const quitar = (id) => setLineas((prev) => prev.filter((l) => l.id !== id))

  const unidades = lineas.reduce((acc, l) => acc + l.cantidad, 0)

  return (
    <main className="cart">
      <nav className="breadcrumb wrap" aria-label="Miga de pan">
        <Link to="/">Inicio</Link>
        <Icon name="right" size={13} />
        <span aria-current="page">Carrito</span>
      </nav>

      <header className="catalog-head wrap">
        <h1>Tu carrito</h1>
        <p>
          {lineas.length === 0
            ? 'Todavia no agregaste nada.'
            : `${unidades} unidad${unidades === 1 ? '' : 'es'} en ${lineas.length} producto${lineas.length === 1 ? '' : 's'}.`}
        </p>
      </header>

      {lineas.length === 0 ? (
        <div className="wrap">
          <div className="catalog-empty">
            <p>Tu carrito esta vacio.</p>
            <Link className="btn btn-primary" to="/catalogo">Ver el catalogo</Link>
          </div>
        </div>
      ) : (
        <div className="wrap cart-grid">
          <section className="cart-lines" aria-label="Productos del carrito">
            <ul>
              {lineas.map((l) => (
                <li key={l.id} className="cart-line">
                  <img src={l.image} alt="" />

                  <div className="cart-line-info">
                    <span className="cart-line-brand">{l.brand}</span>
                    <h3>{l.name}</h3>
                    <p className="cart-line-unit">{money.format(l.price)} por unidad</p>
                  </div>

                  <div className="qty" role="group" aria-label={`Cantidad de ${l.name}`}>
                    <button
                      type="button"
                      onClick={() => cambiarCantidad(l.id, -1)}
                      disabled={l.cantidad <= 1}
                      aria-label="Quitar uno"
                    >
                      –
                    </button>
                    <span aria-live="polite">{l.cantidad}</span>
                    <button
                      type="button"
                      onClick={() => cambiarCantidad(l.id, 1)}
                      disabled={l.cantidad >= (l.stock || 99)}
                      aria-label="Agregar uno"
                    >
                      +
                    </button>
                  </div>

                  <p className="cart-line-total">{money.format(l.price * l.cantidad)}</p>

                  <button
                    type="button"
                    className="cart-line-remove"
                    onClick={() => quitar(l.id)}
                    aria-label={`Quitar ${l.name}`}
                  >
                    <Icon name="close" size={17} />
                  </button>
                </li>
              ))}
            </ul>

            <Link className="cart-back" to="/catalogo">
              <Icon name="left" size={15} />
              Seguir comprando
            </Link>
          </section>

          <OrderSummary lineas={lineas}>
            <Link className="btn btn-primary summary-cta" to="/checkout">
              Finalizar compra
              <Icon name="right" size={16} />
            </Link>
            <p className="summary-note">Los impuestos se calculan en el checkout.</p>
          </OrderSummary>
        </div>
      )}
    </main>
  )
}
