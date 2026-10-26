import { Link } from 'react-router'
import Icon from '../components/ui/Icon.jsx'

export default function NotFoundPage() {
  return (
    <main className="notfound">
      <div className="wrap notfound-panel">
        <p className="notfound-codigo">404</p>
        <h1>Esta pagina no existe</h1>
        <p>
          Puede que el enlace este mal escrito o que el producto ya no este
          publicado.
        </p>

        <div className="notfound-botones">
          <Link className="btn btn-primary" to="/catalogo">
            Ver el catalogo
            <Icon name="right" size={16} />
          </Link>
          <Link className="btn btn-ghost" to="/">
            Ir al inicio
          </Link>
        </div>
      </div>
    </main>
  )
}
