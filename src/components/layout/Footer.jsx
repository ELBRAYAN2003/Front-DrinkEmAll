import { Link } from 'react-router'
import Icon from '../ui/Icon.jsx'
import { useCategorias } from '../../hooks/useCatalogo.js'

// Cuantas categorias se listan en el pie antes del "Ver todo".
const EN_EL_PIE = 5

const SOCIAL = [
  { name: 'facebook', label: 'Facebook' },
  { name: 'instagram', label: 'Instagram' },
  { name: 'x', label: 'X' },
  { name: 'youtube', label: 'YouTube' },
]

// Solo lo que la tienda opera de verdad (ver los medios de pago del checkout).
const PAYMENTS = ['Efectivo', 'Transferencia']

export default function Footer() {
  const categorias = useCategorias()

  return (
    <footer className="site-footer">
      <div className="wrap footer-top">
        <div className="footer-brand">
          <Link className="logo" to="/">
            <span className="logo-mark" aria-hidden="true">D</span>
            <span className="logo-text">
              DrinkEm<em>All</em>
            </span>
          </Link>
          <p>Vinos, cervezas y destilados elegidos con criterio, en Juan José Castelli, Chaco.</p>

          {/* Disposicion 954/2025: link con este rotulo exacto, a simple vista y sin
              pedir cuenta. Tambien esta en el checkout y en Mis pedidos. */}
          <Link className="btn-arrepentimiento" to="/arrepentimiento">
            BOTÓN DE ARREPENTIMIENTO
          </Link>
        </div>

        <nav className="footer-col" aria-label="Tienda">
          <h4>Tienda</h4>
          <ul>
            {categorias.slice(0, EN_EL_PIE).map((c) => (
              <li key={c.id}>
                <Link to={`/catalogo/${c.slug ?? c.id}`}>{c.name}</Link>
              </li>
            ))}
            <li>
              <Link to="/catalogo">Ver todo</Link>
            </li>
          </ul>
        </nav>

        <nav className="footer-col" aria-label="Tu cuenta">
          <h4>Tu cuenta</h4>
          <ul>
            <li>
              <Link to="/mis-pedidos">Mis pedidos</Link>
            </li>
            <li>
              <Link to="/mi-cuenta">Mi cuenta</Link>
            </li>
          </ul>
        </nav>

        <nav className="footer-col" aria-label="Información legal">
          <h4>Información</h4>
          <ul>
            <li>
              <Link to="/terminos">Términos y condiciones</Link>
            </li>
            <li>
              <Link to="/privacidad">Política de privacidad</Link>
            </li>
            <li>
              <Link to="/arrepentimiento">Arrepentimiento de compra</Link>
            </li>
          </ul>
        </nav>
      </div>

      <div className="wrap footer-bottom">
        <p className="copy">
          © {new Date().getFullYear()} DrinkEmAll. Beber con moderación. Prohibida su
          venta a menores de 18 años.{' '}
          <Link to="/terminos">Términos y condiciones</Link> ·{' '}
          <Link to="/privacidad">Política de privacidad</Link>
        </p>

        <ul className="payments">
          {PAYMENTS.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>

        <ul className="social">
          {SOCIAL.map((s) => (
            <li key={s.name}>
              {/* Sin cuenta creada todavia: se muestra el icono sin enlace. */}
              <span aria-label={s.label} title={`${s.label}: proximamente`}>
                <Icon name={s.name} size={18} />
              </span>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  )
}
