import Icon from '../ui/Icon.jsx'
import Stars from '../ui/Stars.jsx'
import { testimonials } from '../../data/home.js'

export default function Testimonials() {
  return (
    <section className="section testimonials">
      <div className="wrap">
        <div className="section-head">
          <span className="eyebrow">Opiniones</span>
          <h2>Que dicen los que ya compraron</h2>
        </div>

        <ul className="testi-grid">
          {testimonials.map((t) => (
            <li key={t.id} className="testi">
              <Icon name="quote" size={30} className="testi-quote" />
              <p>{t.quote}</p>
              <Stars value={5} />
              <footer>
                <span className="testi-avatar" style={{ '--avatar-hue': t.hue }} aria-hidden="true">
                  {t.name.charAt(0)}
                </span>
                <span>
                  <b>{t.name}</b>
                  <small>{t.role}</small>
                </span>
              </footer>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
