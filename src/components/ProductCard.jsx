import { Bottle } from './Bottle.jsx'
import { Countdown, Icon, Price, Stars } from './ui.jsx'

export function ProductCard({ product, dark = false }) {
  const sale = product.discount > 0

  return (
    <article className={`product-card${dark ? ' dark' : ''}`}>
      <div className="pc-media">
        <a href="#" className="pc-img" aria-label={product.name}>
          <Bottle kind={product.kind} />
        </a>

        <div className="pc-badges">
          {sale && <span className="badge badge-sale">-{product.discount}%</span>}
          <span className="badge badge-new">New</span>
          {product.pack && <span className="badge badge-pack">Pack</span>}
          {product.stock === 0 && <span className="badge badge-out">Out of Stock</span>}
        </div>

        {product.countdown && (
          <div className="pc-countdown">
            <Icon name="clock" size={13} />
            <Countdown />
          </div>
        )}

        <div className="pc-actions">
          <button aria-label="Quick view"><Icon name="search" size={16} /></button>
          <button aria-label="Add to compare"><Icon name="compare" size={16} /></button>
          <button aria-label="Add to wishlist"><Icon name="heart" size={16} /></button>
        </div>
      </div>

      <div className="pc-body">
        <a href="#" className="pc-brand">{product.brand}</a>
        <h3 className="pc-title">
          <a href="#">{product.name}</a>
        </h3>
        <Stars rating={product.rating} />
        <Price price={product.price} discount={product.discount} />
        <p className={`pc-avail ${product.stock === 0 ? 'none' : ''}`}>
          Availability: {product.stock > 0 ? `${product.stock} In Stock` : 'Out of stock'}
        </p>
        <button className="btn-cart">
          <Icon name="cart" size={16} />
          {product.customize ? 'Customize' : 'Add to cart'}
        </button>
      </div>
    </article>
  )
}