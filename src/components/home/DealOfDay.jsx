import Countdown from '../ui/Countdown.jsx'
import Icon from '../ui/Icon.jsx'
import { money } from '../../lib/format.js'
import { productImage } from '../../lib/placeholder.js'
import { countdownDeal as deal } from '../../data/home.js'

const art = productImage({ hue: deal.hue, shape: 'wine', bg: '#f0e6de' })

export default function DealOfDay() {
  const off = Math.round((1 - deal.price / deal.oldPrice) * 100)

  return (
    <section className="section deal">
      <div className="wrap deal-inner">
        <div className="deal-media">
          <img src={art} alt="" loading="lazy" />
          <span className="badge is-off">-{off}%</span>
        </div>

        <div className="deal-body">
          <span className="eyebrow">{deal.eyebrow}</span>
          <h2>{deal.title}</h2>
          <p>{deal.text}</p>

          <p className="deal-price">
            <b>{money.format(deal.price)}</b>
            <s>{money.format(deal.oldPrice)}</s>
          </p>

          <div className="deal-timer">
            <span>Termina en</span>
            <Countdown target={deal.endsAt} />
          </div>

          <a className="btn btn-primary" href="#">
            <Icon name="cart" size={18} />
            {deal.cta}
          </a>
        </div>
      </div>
    </section>
  )
}
