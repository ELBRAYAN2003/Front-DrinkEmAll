import { useCallback, useEffect, useRef, useState } from 'react'
import Icon from './Icon.jsx'

// Carrusel por scroll nativo con scroll-snap. Sin dependencias: el navegador
// resuelve el arrastre, el gesto tactil y la inercia, y aca solo agregamos los
// botones y el estado de los extremos.

export default function Carousel({ children, className = '', label }) {
  const track = useRef(null)
  const [edges, setEdges] = useState({ start: true, end: false })

  const sync = useCallback(() => {
    const el = track.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    setEdges({ start: el.scrollLeft <= 1, end: el.scrollLeft >= max - 1 })
  }, [])

  useEffect(() => {
    const el = track.current
    if (!el) return
    sync()
    el.addEventListener('scroll', sync, { passive: true })
    const ro = new ResizeObserver(sync)
    ro.observe(el)
    return () => {
      el.removeEventListener('scroll', sync)
      ro.disconnect()
    }
  }, [sync])

  const page = (dir) => {
    const el = track.current
    if (!el) return
    el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: 'smooth' })
  }

  return (
    <div className={`carousel ${className}`.trim()}>
      <button
        type="button"
        className="carousel-nav is-prev"
        onClick={() => page(-1)}
        disabled={edges.start}
        aria-label="Anterior"
      >
        <Icon name="left" />
      </button>

      <ul className="carousel-track" ref={track} aria-label={label}>
        {children}
      </ul>

      <button
        type="button"
        className="carousel-nav is-next"
        onClick={() => page(1)}
        disabled={edges.end}
        aria-label="Siguiente"
      >
        <Icon name="right" />
      </button>
    </div>
  )
}
