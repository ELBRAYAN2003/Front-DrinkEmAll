import { useState } from 'react'
import Icon from '../ui/Icon.jsx'
import { ubicacion } from '../../data/home.js'

// Solo se afirma lo que el sitio ya cumple: el retiro sin cargo y el envio
// gratis desde $80 son reglas del checkout (data/cart.js). No hay horarios
// porque todavia no estan confirmados.
const PUNTOS = [
  {
    icono: 'pin',
    titulo: 'Un local de barrio',
    texto: 'Atendemos en mostrador, como siempre. La tienda online suma: no reemplaza.',
  },
  {
    icono: 'truck',
    titulo: 'Retiro sin cargo',
    texto: 'Compra desde la web y pasa a buscar tu pedido por el local.',
  },
  {
    icono: 'shield',
    titulo: 'Llegamos a tu zona',
    texto: 'Entregamos en Castelli y localidades cercanas. Envio gratis desde $80.',
  },
]

export default function Location() {
  // El mapa es un iframe de Google: hasta que no se pide, no se carga.
  const [verMapa, setVerMapa] = useState(false)

  const consulta = encodeURIComponent(ubicacion.consulta)
  const incrustado = `https://www.google.com/maps?q=${consulta}&z=14&output=embed`
  const enGoogle = `https://www.google.com/maps/search/?api=1&query=${consulta}`

  return (
    <section className="section location">
      <div className="wrap location-grid">
        <div className="location-copy">
          <span className="eyebrow">Visitanos</span>
          <h2>Donde nos ubicamos</h2>
          <p>
            Pasa a conocernos o retira tu pedido. Estamos en {ubicacion.lugar}.
          </p>

          <ul className="location-points">
            {PUNTOS.map((p) => (
              <li key={p.titulo}>
                <span className="location-point-icon" aria-hidden="true">
                  <Icon name={p.icono} size={20} />
                </span>
                <span>
                  <b>{p.titulo}</b>
                  {p.texto}
                </span>
              </li>
            ))}
          </ul>

          <a className="btn btn-ghost" href={enGoogle} target="_blank" rel="noopener noreferrer">
            Abrir en Google Maps
          </a>
        </div>

        <div className="location-map">
          {verMapa ? (
            <iframe
              title={`Mapa con la ubicacion de DrinkEmAll en ${ubicacion.lugar}`}
              src={incrustado}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          ) : (
            <div className="location-gate">
              <Icon name="pin" size={36} />
              <p>
                El mapa lo muestra Google Maps. Al cargarlo, Google recibe tu
                conexion y puede usar sus propias cookies.
              </p>
              <button type="button" className="btn btn-primary" onClick={() => setVerMapa(true)}>
                Ver el mapa
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
