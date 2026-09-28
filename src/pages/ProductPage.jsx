import { useState } from 'react'
import { Link, useParams } from 'react-router'
import Carousel from '../components/ui/Carousel.jsx'
import Icon from '../components/ui/Icon.jsx'
import ProductCard from '../components/ui/ProductCard.jsx'
import Stars from '../components/ui/Stars.jsx'
import { money } from '../lib/format.js'
import { useCarrito } from '../hooks/useCarrito.js'
import { useCategorias, useProducto, useProductos } from '../hooks/useCatalogo.js'

const VENTAJAS = [
  { icon: 'truck', texto: 'Envio en 24 horas, gratis desde $80' },
  { icon: 'refresh', texto: 'Cambios dentro de los 30 dias' },
  { icon: 'shield', texto: 'Pago protegido' },
]

export default function ProductPage() {
  const { id } = useParams()
  const { producto, cargando, error } = useProducto(id)
  const { agregar } = useCarrito()
  const categorias = useCategorias()
  const [cantidad, setCantidad] = useState(1)

  // Relacionados: misma categoria. Se pide siempre pero se pausa hasta saber
  // cual es, para no disparar un pedido sin filtro.
  const { productos: relacionados } = useProductos({
    categoryId: producto?.categoryId ?? undefined,
    page: 1,
    pageSize: 10,
    pausado: !producto?.categoryId,
  })

  if (cargando) {
    return (
      <main className="product">
        <div className="wrap catalog-empty">
          <p>Cargando producto...</p>
        </div>
      </main>
    )
  }

  if (error || !producto) {
    return (
      <main className="product">
        <div className="wrap catalog-empty">
          <p>No encontramos ese producto.</p>
          <Link className="btn btn-primary" to="/catalogo">Volver al catalogo</Link>
        </div>
      </main>
    )
  }

  const agotado = producto.stock === 0
  const off = producto.oldPrice
    ? Math.round((1 - producto.price / producto.oldPrice) * 100)
    : 0
  const maximo = producto.stock || 99

  // La categoria de la API llega por id; la de la maqueta ya es el slug.
  const categoria =
    categorias.find((c) => String(c.id) === String(producto.categoryId)) ??
    categorias.find((c) => c.name === producto.category)

  const otros = relacionados.filter((p) => p.id !== producto.id).slice(0, 8)

  return (
    <main className="product">
      <nav className="breadcrumb wrap" aria-label="Miga de pan">
        <Link to="/">Inicio</Link>
        <Icon name="right" size={13} />
        <Link to="/catalogo">Catalogo</Link>
        {categoria && (
          <>
            <Icon name="right" size={13} />
            <Link to={`/catalogo/${categoria.slug ?? categoria.id}`}>{categoria.name}</Link>
          </>
        )}
        <Icon name="right" size={13} />
        <span aria-current="page">{producto.name}</span>
      </nav>

      <div className="wrap product-detail">
        <div className="product-gallery">
          <img src={producto.image} alt={producto.name} />
          {off > 0 && <span className="badge is-off">-{off}%</span>}
          {agotado && <span className="badge is-out">Sin stock</span>}
        </div>

        <div className="product-info">
          {producto.brand && <span className="product-info-brand">{producto.brand}</span>}
          <h1>{producto.name}</h1>

          <div className="product-info-meta">
            <Stars value={producto.rating} reviews={producto.reviews} />
            {producto.sku && <span className="product-sku">SKU {producto.sku}</span>}
          </div>

          <p className="product-info-price">
            <b>{money.format(producto.price)}</b>
            {producto.oldPrice && <s>{money.format(producto.oldPrice)}</s>}
          </p>

          <p className={`product-info-stock ${agotado ? 'is-out' : ''}`.trim()}>
            <Icon name={agotado ? 'close' : 'check'} size={16} />
            {agotado ? 'Sin stock por ahora' : `${producto.stock} disponibles`}
          </p>

          {(producto.description || producto.notes?.length > 0) && (
            <div className="product-info-desc">
              {producto.description ? (
                <p>{producto.description}</p>
              ) : (
                <ul>
                  {producto.notes.map((n) => (
                    <li key={n}>{n}</li>
                  ))}
                </ul>
              )}
            </div>
          )}

          <div className="product-buy">
            <div className="qty" role="group" aria-label="Cantidad">
              <button
                type="button"
                onClick={() => setCantidad((n) => Math.max(1, n - 1))}
                disabled={agotado || cantidad <= 1}
                aria-label="Quitar uno"
              >
                –
              </button>
              <span aria-live="polite">{cantidad}</span>
              <button
                type="button"
                onClick={() => setCantidad((n) => Math.min(maximo, n + 1))}
                disabled={agotado || cantidad >= maximo}
                aria-label="Agregar uno"
              >
                +
              </button>
            </div>

            <button
              type="button"
              className="btn btn-primary product-buy-cta"
              disabled={agotado}
              // El contexto agrega de a uno: se repite por la cantidad elegida
              // en vez de duplicar la logica de tope en esta pagina.
              onClick={() => {
                for (let i = 0; i < cantidad; i++) agregar(producto)
              }}
            >
              <Icon name="cart" size={18} />
              {agotado ? 'Sin stock' : 'Agregar al carrito'}
            </button>
          </div>

          <ul className="product-perks">
            {VENTAJAS.map((v) => (
              <li key={v.icon}>
                <Icon name={v.icon} size={18} />
                {v.texto}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {otros.length > 0 && (
        <section className="section wrap">
          <div className="section-head">
            <span className="eyebrow">Tambien te puede gustar</span>
            <h2>De la misma categoria</h2>
          </div>
          <Carousel label="Productos relacionados">
            {otros.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </Carousel>
        </section>
      )}
    </main>
  )
}
