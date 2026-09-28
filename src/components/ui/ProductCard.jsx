import { Link } from 'react-router'
import Countdown from './Countdown.jsx'
import Icon from './Icon.jsx'
import Stars from './Stars.jsx'
import { money } from '../../lib/format.js'
import { useCarrito } from '../../hooks/useCarrito.js'

const QUICK_ACTIONS = [
  { name: 'heart', label: 'Agregar a favoritos' },
  { name: 'compare', label: 'Comparar' },
  { name: 'eye', label: 'Vista rapida' },
]

export default function ProductCard({ product }) {
  const { name, brand, price, oldPrice, rating, reviews, stock, notes, badges = [], dealEndsAt, image, hoverImage } = product

  const soldOut = stock === 0
  const off = oldPrice ? Math.round((1 - price / oldPrice) * 100) : 0
  const { agregar } = useCarrito()

  return (
    <li className={`product-card ${soldOut ? 'is-soldout' : ''}`.trim()}>
      <div className="product-media">
        <Link className="product-link" to={`/producto/${product.id}`} aria-label={name}>
          <img className="product-img" src={image} alt="" loading="lazy" />
          <img className="product-img is-hover" src={hoverImage} alt="" loading="lazy" />
        </Link>

        <div className="product-badges">
          {off > 0 && <span className="badge is-off">-{off}%</span>}
          {badges.includes('nuevo') && <span className="badge is-new">Nuevo</span>}
          {soldOut && <span className="badge is-out">Sin stock</span>}
        </div>

        <div className="product-actions">
          {QUICK_ACTIONS.map((a) => (
            <button key={a.name} type="button" className="icon-btn" aria-label={a.label} title={a.label}>
              <Icon name={a.name} size={18} />
            </button>
          ))}
        </div>

        {dealEndsAt && !soldOut && <Countdown target={dealEndsAt} compact />}
      </div>

      <div className="product-body">
        <span className="product-brand">{brand}</span>
        <h3 className="product-name">
          <Link to={`/producto/${product.id}`}>{name}</Link>
        </h3>
        <Stars value={rating} reviews={reviews} />

        <p className="product-price">
          <b>{money.format(price)}</b>
          {oldPrice && <s>{money.format(oldPrice)}</s>}
        </p>

        <ul className="product-notes">
          {notes.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>

        <div className="product-foot">
          <button
            type="button"
            className="btn btn-primary"
            disabled={soldOut}
            onClick={() => agregar(product)}
          >
            <Icon name="cart" size={18} />
            {soldOut ? 'Sin stock' : 'Agregar'}
          </button>
          <span className="product-stock">
            {soldOut ? 'Agotado' : `${stock} disponibles`}
          </span>
        </div>
      </div>
    </li>
  )
}
