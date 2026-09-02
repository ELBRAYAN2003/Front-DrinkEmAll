import { useCallback, useEffect, useState } from 'react'
import Icon from '../ui/Icon.jsx'
import { heroPromos, slideArt, slides } from '../../data/home.js'

export default function Hero() {
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)

  const go = useCallback((n) => setI(((n % slides.length) + slides.length) % slides.length), [])

  useEffect(() => {
    if (paused) return
    const id = setInterval(() => go(i + 1), 6000)
    return () => clearInterval(id)
  }, [i, paused, go])

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
          {slides.map((s, idx) => (
            <article
              key={s.id}
              className={`hero-slide ${idx === i ? 'is-active' : ''}`.trim()}
              aria-hidden={idx !== i}
              style={{ '--slide-bg': s.bg }}
            >
              <div className="hero-copy">
                <p className="hero-eyebrow">{s.eyebrow}</p>
                <h1>{s.title}</h1>
                <p className="hero-sub">{s.subtitle}</p>
                <p className="hero-off">
                  <b>{s.off}</b>
                  <span>de descuento</span>
                </p>
                <a className="btn btn-primary" href="#" tabIndex={idx === i ? 0 : -1}>
                  {s.cta}
                </a>
              </div>

              <img className="hero-art" src={slideArt[s.id]} alt="" />
            </article>
          ))}

          <button type="button" className="hero-nav is-prev" onClick={() => go(i - 1)} aria-label="Anterior">
            <Icon name="left" />
          </button>
          <button type="button" className="hero-nav is-next" onClick={() => go(i + 1)} aria-label="Siguiente">
            <Icon name="right" />
          </button>

          <ul className="hero-dots">
            {slides.map((s, idx) => (
              <li key={s.id}>
                <button
                  type="button"
                  className={idx === i ? 'is-active' : ''}
                  onClick={() => setI(idx)}
                  aria-label={`Ir a la diapositiva ${idx + 1}`}
                  aria-current={idx === i}
                />
              </li>
            ))}
          </ul>
        </div>

        <div className="hero-side">
          {heroPromos.map((p) => (
            <a
              key={p.id}
              className="hero-promo"
              href="#"
              style={{ '--promo-bg': p.bg, '--promo-ink': p.ink }}
            >
              <span className="hero-promo-copy">
                <small>{p.price}</small>
                <strong>{p.title}</strong>
                <em>{p.subtitle}</em>
                <span className="hero-promo-cta">{p.cta}</span>
              </span>

              <img className="hero-promo-art" src={p.image} alt="" loading="lazy" />
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
