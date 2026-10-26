// Puntuacion en estrellas. Usa un degradado por estrella para soportar medios
// puntos sin recurrir a medio icono recortado.

export default function Stars({ value = 0, reviews }) {
  return (
    <span className="stars" title={`${value} de 5`}>
      <span className="stars-track" aria-hidden="true">
        {[0, 1, 2, 3, 4].map((i) => {
          const fill = Math.max(0, Math.min(1, value - i)) * 100
          return (
            <span key={i} className="star">
              <span className="star-fill" style={{ width: `${fill}%` }}>★</span>
              <span className="star-empty">★</span>
            </span>
          )
        })}
      </span>
      <span className="sr-only">{value} de 5 estrellas</span>
      {reviews != null && <span className="stars-count">({reviews})</span>}
    </span>
  )
}
