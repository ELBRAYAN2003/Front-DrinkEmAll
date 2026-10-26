import { Link } from 'react-router'
import ProductCard from '../ui/ProductCard.jsx'
import { useProductos } from '../../hooks/useCatalogo.js'

const CUANTOS = 8

export default function SpecialProducts() {
  // Los productos en promocion los marca el backend, no se deducen del precio.
  const { productos, meta, cargando, error } = useProductos({
    page: 1,
    pageSize: CUANTOS,
    soloOferta: true,
  })

  // Si no hay ofertas vigentes la seccion desaparece, en vez de anunciar
  // "precio rebajado" sobre una grilla vacia.
  if (error || (!cargando && productos.length === 0)) return null

  return (
    <section className="section special">
      <div className="wrap">
        <div className="section-head">
          <span className="eyebrow">En promocion</span>
          <h2>Seleccion especial</h2>
          {/* Dice "en promocion" y no "precio rebajado" porque el backend marca
              la promocion con una bandera: el precio anterior solo esta cargado
              en algunos, asi que no todas las tarjetas muestran el tachado. */}
          <p>Las etiquetas que el local tiene en promocion ahora mismo.</p>
        </div>

        <ul className={`product-grid ${cargando ? 'is-loading' : ''}`.trim()}>
          {productos.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </ul>

        {meta.total > CUANTOS && (
          <p className="section-more">
            <Link className="btn btn-ghost" to="/catalogo?oferta=1">
              Ver las {meta.total} ofertas
            </Link>
          </p>
        )}
      </div>
    </section>
  )
}
