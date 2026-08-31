import { categories } from '../../data/home.js'

export default function Categories() {
  return (
    <section className="section categories">
      <div className="wrap">
        <div className="section-head">
          <span className="eyebrow">Elegi por estilo</span>
          <h2>Nuestras categorias</h2>
          <p>Seis puertas de entrada a la bodega. Empeza por la que te tiente.</p>
        </div>

        <ul className="cat-grid">
          {categories.map((c) => (
            <li key={c.id}>
              <a href="#" className="cat-card">
                <img src={c.image} alt="" loading="lazy" />
                <span className="cat-body">
                  <b>{c.name}</b>
                  <small>{c.count} productos</small>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
