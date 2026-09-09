import { Link } from 'react-router'
import { useCategorias } from '../../hooks/useCatalogo.js'

export default function Categories() {
  const categorias = useCategorias()

  // Mientras no llegan, la seccion no se dibuja: un grid vacio con el titulo
  // arriba se ve peor que no mostrar nada durante un instante.
  if (categorias.length === 0) return null

  return (
    <section className="section categories">
      <div className="wrap">
        <div className="section-head">
          <span className="eyebrow">Elegi por estilo</span>
          <h2>Nuestras categorias</h2>
          <p>Vinos, destilados, cervezas y mas. Empeza por la que te tiente.</p>
        </div>

        <ul className="cat-grid">
          {categorias.map((c) => (
            <li key={c.id}>
              <Link to={`/catalogo/${c.slug}`} className="cat-card">
                <img src={c.image} alt="" loading="lazy" />
                <span className="cat-body">
                  <b>{c.name}</b>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
