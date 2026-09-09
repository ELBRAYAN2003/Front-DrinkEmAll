import { useState } from 'react'
import Carousel from '../ui/Carousel.jsx'
import ProductCard from '../ui/ProductCard.jsx'
import { useCategorias, useProductos } from '../../hooks/useCatalogo.js'

const CUANTOS = 10

// Las pestañas son categorias reales del catalogo. Se prefieren estas por ser
// las de mayor volumen; si alguna no existe se completa con las primeras que
// haya, para que la seccion nunca quede sin pestañas.
const PREFERIDAS = ['vinos', 'whisky', 'gin', 'cervezas']

export default function Trending() {
  const categorias = useCategorias()
  const [elegida, setElegida] = useState(null)

  const preferidas = categorias.filter((c) => PREFERIDAS.includes(c.slug))
  const pestanas = (preferidas.length > 0 ? preferidas : categorias).slice(0, 4)
  const activa = pestanas.find((c) => c.id === elegida) ?? pestanas[0]

  const { productos, cargando } = useProductos({
    page: 1,
    pageSize: CUANTOS,
    categoryId: activa?.id,
    // Sin categoria todavia no hay nada util que pedir.
    pausado: !activa,
  })

  if (pestanas.length === 0) return null

  return (
    <section className="section trending">
      <div className="wrap">
        <div className="section-head">
          <span className="eyebrow">Lo que mas sale</span>
          <h2>Tendencias de la semana</h2>
        </div>

        <div className="tabs" role="tablist" aria-label="Filtrar productos">
          {pestanas.map((c) => (
            <button
              key={c.id}
              type="button"
              role="tab"
              id={`tab-${c.slug}`}
              aria-selected={activa?.id === c.id}
              aria-controls={`panel-${c.slug}`}
              className={activa?.id === c.id ? 'is-active' : ''}
              onClick={() => setElegida(c.id)}
            >
              {c.name}
            </button>
          ))}
        </div>

        <div id={`panel-${activa?.slug}`} role="tabpanel" aria-labelledby={`tab-${activa?.slug}`}>
          {/* Se mantiene el carrusel anterior mientras llega el nuevo: vaciarlo
              haria saltar el alto de la seccion en cada cambio de pestaña. */}
          <div className={cargando ? 'is-loading' : ''}>
            <Carousel label="Productos en tendencia">
              {productos.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </Carousel>
          </div>
        </div>
      </div>
    </section>
  )
}
