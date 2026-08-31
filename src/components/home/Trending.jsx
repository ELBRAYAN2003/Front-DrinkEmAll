import { useState } from 'react'
import Carousel from '../ui/Carousel.jsx'
import ProductCard from '../ui/ProductCard.jsx'
import { productTabs, productsByTab } from '../../data/home.js'

export default function Trending() {
  const [tab, setTab] = useState(productTabs[0].id)

  return (
    <section className="section trending">
      <div className="wrap">
        <div className="section-head">
          <span className="eyebrow">Lo que mas sale</span>
          <h2>Tendencias de la semana</h2>
        </div>

        <div className="tabs" role="tablist" aria-label="Filtrar productos">
          {productTabs.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              id={`tab-${t.id}`}
              aria-selected={tab === t.id}
              aria-controls={`panel-${t.id}`}
              className={tab === t.id ? 'is-active' : ''}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div id={`panel-${tab}`} role="tabpanel" aria-labelledby={`tab-${tab}`}>
          <Carousel label="Productos en tendencia">
            {productsByTab[tab].map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </Carousel>
        </div>
      </div>
    </section>
  )
}
