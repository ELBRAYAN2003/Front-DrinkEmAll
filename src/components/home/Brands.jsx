import { Link } from 'react-router'
import { useFiltros } from '../../hooks/useCatalogo.js'

// La tira es angosta: entran unas pocas. Se muestran las de mas productos, que
// es como llega ordenada la lista desde la API.
const CUANTAS = 8

export default function Brands() {
  const { marcas } = useFiltros()

  if (marcas.length === 0) return null

  return (
    <section className="brands">
      <ul className="wrap brands-row">
        {marcas.slice(0, CUANTAS).map((m) => (
          <li key={m.name}>
            {/* Antes apuntaban a "#". Ahora llevan al catalogo ya filtrado. */}
            <Link to={`/catalogo?marca=${encodeURIComponent(m.name)}`}>{m.name}</Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
