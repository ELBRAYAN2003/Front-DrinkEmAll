import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router'
import Icon from '../ui/Icon.jsx'
import { money } from '../../lib/format.js'
import { usePromosDeCategoria, useProductos } from '../../hooks/useCatalogo.js'

const CUANTOS_SLIDES = 3

// Solo entran productos con foto de 1000px o mas: el hero ocupa media pantalla
// y las fotos del catalogo arrancan en 225px. Quedan 184 candidatos.
const ANCHO_MINIMO = 1000

// Las dos tarjetas laterales. Elegidas por datos, no por gusto: son las
// categorias con mejor proporcion de fotos grandes despues de Vinos, que por
// tamaño ya tiene su lugar en el resto de la home.
const CATEGORIAS_PROMO = ['cervezas', 'combos']

// Fondos suaves que se turnan por slide, para que el carrusel no sea plano.
const FONDOS = ['#e8f1fa', '#f4efe8', '#eef1ec']

function descuento(producto) {
  if (!producto.oldPrice) return null
  return Math.round((1 - producto.price / producto.oldPrice) * 100)
}

export default function Hero() {
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)

  const { productos: slides } = useProductos({
    page: 1,
    pageSize: CUANTOS_SLIDES,
    minImagen: ANCHO_MINIMO,
  })
  const promos = usePromosDeCategoria(CATEGORIAS_PROMO)

  const total = slides.length
  // El modulo se calcula sobre `n` y no sobre el estado anterior, asi que no
  // hace falta la forma de actualizacion funcional.
  const go = useCallback((n) => setI(total === 0 ? 0 : ((n % total) + total) % total), [total])

  useEffect(() => {
    if (paused || total <= 1) return
    const id = setInterval(() => go(i + 1), 6000)
    return () => clearInterval(id)
  }, [i, paused, go, total])

  // Si el indice quedo fuera de rango al cambiar los productos, se acota.
  const actual = total === 0 ? 0 : Math.min(i, total - 1)

  // Sin productos no se dibuja nada: un carrusel vacio con flechas es peor que
  // no mostrar la seccion.
  if (total === 0) return null

  return (
    <section className="hero">
      <div className="wrap hero-grid">
        <div
          className="hero-slider"
          aria-roledescription="carrusel"
          aria-label="Destacados"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {slides.map((p, idx) => {
            const off = descuento(p)
            return (
              <article
                key={p.id}
                className={`hero-slide ${idx === actual ? 'is-active' : ''}`.trim()}
                aria-hidden={idx !== actual}
                style={{ '--slide-bg': FONDOS[idx % FONDOS.length] }}
              >
                <div className="hero-copy">
                  <p className="hero-eyebrow">{p.category ?? 'Del catalogo'}</p>
                  <h1>{p.brand || p.name}</h1>
                  <p className="hero-sub">{p.name}</p>

                  {/* El descuento solo se muestra si el producto realmente tiene
                      precio anterior. Antes habia un 20% fijo que no salia de
                      ningun dato. */}
                  <p className="hero-off">
                    <b>{money.format(p.price)}</b>
                    <span>{off ? `${off}% menos que antes` : 'precio de lista'}</span>
                  </p>

                  <Link
                    className="btn btn-primary"
                    to={p.brand ? `/catalogo?marca=${encodeURIComponent(p.brand)}` : '/catalogo'}
                    tabIndex={idx === actual ? 0 : -1}
                  >
                    Ver en el catalogo
                  </Link>
                </div>

                <img className="hero-art" src={p.image} alt="" />
              </article>
            )
          })}

          {total > 1 && (
            <>
              <button type="button" className="hero-nav is-prev" onClick={() => go(actual - 1)} aria-label="Anterior">
                <Icon name="left" />
              </button>
              <button type="button" className="hero-nav is-next" onClick={() => go(actual + 1)} aria-label="Siguiente">
                <Icon name="right" />
              </button>

              <ul className="hero-dots">
                {slides.map((p, idx) => (
                  <li key={p.id}>
                    <button
                      type="button"
                      className={idx === actual ? 'is-active' : ''}
                      onClick={() => setI(idx)}
                      aria-label={`Ir a la diapositiva ${idx + 1}`}
                      aria-current={idx === actual}
                    />
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        <div className="hero-side">
          {promos.map(({ categoria, producto, total: cuantos }) => (
            <Link
              key={categoria.id}
              className="hero-promo"
              to={`/catalogo/${categoria.slug}`}
              style={{ '--promo-bg': `hsl(${categoria.hue} 32% 94%)`, '--promo-ink': '#1c1418' }}
            >
              <span className="hero-promo-copy">
                {/* "Desde" sobre el precio real del mas barato de la categoria,
                    no sobre un numero de maqueta. */}
                <small>Desde {money.format(producto.price)}</small>
                <strong>{categoria.name}</strong>
                <em>{cuantos} etiquetas</em>
                <span className="hero-promo-cta">Ver ahora</span>
              </span>

              <img className="hero-promo-art" src={producto.image} alt="" loading="lazy" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
