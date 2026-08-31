import Icon from '../ui/Icon.jsx'
import { sceneImage } from '../../lib/placeholder.js'
import { promos } from '../../data/home.js'

export default function Promos() {
  return (
    <section className="promos">
      <div className="wrap promos-grid">
        {promos.map((p) => (
          <a
            key={p.id}
            className="promo"
            href="#"
            style={{ backgroundImage: `url("${sceneImage({ hue: p.hue, tone: p.tone })}")` }}
          >
            <span className="promo-eyebrow">{p.eyebrow}</span>
            <h3>{p.title}</h3>
            <p>{p.text}</p>
            <span className="promo-cta">
              {p.cta}
              <Icon name="right" size={15} />
            </span>
          </a>
        ))}
      </div>
    </section>
  )
}
