import { useState } from 'react'
import { cms } from '../data.js'
import { Icon } from './ui.jsx'

const HOME_LINKS = ['Prices drop', 'New products', 'Best sellers', 'Sitemap', 'Stores', 'Light Red']
const INF_LINKS = ['Home', 'Shop', 'Categories SALE', 'Products HOT', 'Top Deals', 'Elements']
const SOCIALS = ['facebook', 'youtube', 'twitter', 'instagram', 'pinterest']

export function Footer() {
  const [email, setEmail] = useState('')
  const [agree, setAgree] = useState(true)
  const [done, setDone] = useState(false)

  const submit = (e) => {
    e.preventDefault()
    if (agree && email.trim()) setDone(true)
  }

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-contact">
          <div className="f-contact">
            <span className="f-ic"><Icon name="phone" size={22} /></span>
            <div>
              <em>Call Us Free</em>
              <a href="#">(+91) 9876-543-210</a>
            </div>
          </div>
          <div className="f-contact">
            <span className="f-ic"><Icon name="pin" size={22} /></span>
            <div>
              <em>Our Address</em>
              <span>DrinkEmAll- Whisky, Vodka &amp; Beer Store, Trade Centre, France</span>
            </div>
          </div>
          <div className="f-contact">
            <span className="f-ic"><Icon name="mail" size={22} /></span>
            <div>
              <em>Send Email Now</em>
              <a href="#">drinkemall@example.com</a>
            </div>
          </div>
        </div>

        <div className="footer-main">
          <div className="f-col f-about">
            <a href="#" className="logo footer-logo">
              <span className="logo-ic" aria-hidden="true"><Icon name="beer" size={20} /></span>
              DrinkEmAll
            </a>
            <p>
              DrinkEmAll brings you whiskies, vodka, fernet and craft beers from around the world.
            </p>
            <div className="f-social">
              {SOCIALS.map((s) => (
                <a href="#" key={s} aria-label={s}><Icon name={s} size={17} /></a>
              ))}
            </div>
          </div>

          <div className="f-col">
            <h4>Information</h4>
            <ul>
              {INF_LINKS.map((l) => (
                <li key={l}><a href="#">{l}</a></li>
              ))}
            </ul>
          </div>

          <div className="f-col">
            <h4>Our Services</h4>
            <ul>
              {HOME_LINKS.map((l) => (
                <li key={l}><a href="#">{l}</a></li>
              ))}
            </ul>
          </div>

          <div className="f-col f-news">
            <h4>Our Newsletter</h4>
            <p>Subscribe to our latest newsletter to get news about special discounts.</p>
            {done ? (
              <p className="news-ok">Thank you for subscribing! <Icon name="check" size={14} /></p>
            ) : (
              <form onSubmit={submit} className="news-form">
                <input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button type="submit">Subscribe</button>
              </form>
            )}
            <label className="news-agree">
              <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
              I agree to the terms and conditions and the privacy policy
            </label>
          </div>
        </div>

        <div className="footer-bottom">
          <span className="copy">Copyright &copy; DrinkEmAll. All Rights Reserved</span>
          <div className="f-meta">
            <span className="f-meta-item">EN <Icon name="chevron" size={13} /></span>
            <span className="f-meta-item">$ USD <Icon name="chevron" size={13} /></span>
          </div>
          <img src={cms('payment.png')} alt="Payment methods" className="pay-img" loading="lazy" />
        </div>
      </div>
    </footer>
  )
}