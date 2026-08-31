import { useCallback, useEffect, useState } from 'react'
import Icon from '../ui/Icon.jsx'
import { sceneImage } from '../../lib/placeholder.js'
import { slides } from '../../data/home.js'

const scenes = slides.map((s) => sceneImage({ hue: s.hue, tone: s.tone }))

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
    <section
      className="hero"
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
          style={{ backgroundImage: `url("${scenes[idx]}")` }}
        >
          <div className="wrap hero-content">
            <p className="hero-eyebrow">{s.eyebrow}</p>
            <h1>{s.title}</h1>
            <p className="hero-text">{s.text}</p>
            <a className="btn btn-light" href="#" tabIndex={idx === i ? 0 : -1}>
              {s.cta}
              <Icon name="right" size={16} />
            </a>
          </div>
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
    </section>
  )
}
