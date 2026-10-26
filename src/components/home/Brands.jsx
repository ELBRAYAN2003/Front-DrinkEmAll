import { Link } from 'react-router'
import { useFiltros } from '../../hooks/useCatalogo.js'

// Marcas conocidas que el catalogo realmente vende, con su logo. `marca` es el
// nombre tal como llega de la API (el filtro del catalogo compara contra eso).
// Los logos son marcas registradas de sus duenos y se muestran solo para
// indicar que el local las comercializa; se bajaron de Wikimedia Commons.
const LOGOS = [
  { marca: 'ABSOLUT', archivo: 'absolut.svg', alt: 'Absolut' },
  { marca: 'BALLANTINES', archivo: 'ballantines.svg', alt: "Ballantine's" },
  { marca: 'QUILMES', archivo: 'quilmes.svg', alt: 'Quilmes' },
  { marca: 'CAMPARI', archivo: 'campari.svg', alt: 'Campari' },
]

// Si el catalogo no trae ninguna de esas marcas (por ejemplo con el archivo
// estatico), se vuelve a la tira de nombres con las de mas productos.
const CUANTAS_EN_TEXTO = 8

const enLista = (marcas, marca) => marcas.some((m) => m.name.toUpperCase() === marca)

export default function Brands() {
  const { marcas } = useFiltros()
  const base = import.meta.env.BASE_URL

  if (marcas.length === 0) return null

  const conLogo = LOGOS.filter((l) => enLista(marcas, l.marca))

  return (
    <section className="brands">
      {conLogo.length > 0 ? (
        <div className="wrap">
          <ul className="brands-row brands-logos">
            {conLogo.map((l) => (
              <li key={l.marca}>
                <Link to={`/catalogo?marca=${encodeURIComponent(l.marca)}`} aria-label={`Ver productos ${l.alt}`}>
                  <img src={`${base}img/marcas/${l.archivo}`} alt={l.alt} loading="lazy" />
                </Link>
              </li>
            ))}
          </ul>
          <p className="brands-note">Las marcas pertenecen a sus respectivos titulares.</p>
        </div>
      ) : (
        <ul className="wrap brands-row">
          {marcas.slice(0, CUANTAS_EN_TEXTO).map((m) => (
            <li key={m.name}>
              <Link to={`/catalogo?marca=${encodeURIComponent(m.name)}`}>{m.name}</Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
