import ProductCard from '../ui/ProductCard.jsx'
import { specialProducts } from '../../data/home.js'

export default function SpecialProducts() {
  return (
    <section className="section special">
      <div className="wrap">
        <div className="section-head">
          <span className="eyebrow">Precio rebajado</span>
          <h2>Seleccion especial</h2>
          <p>Etiquetas con descuento vigente mientras dure el stock.</p>
        </div>

        <ul className="product-grid">
          {specialProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </ul>
      </div>
    </section>
  )
}
