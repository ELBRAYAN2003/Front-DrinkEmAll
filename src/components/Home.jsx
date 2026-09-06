import { useEffect, useRef, useState } from 'react'
import {
  BRANDS,
  CATEGORY_BANNERS,
  GALLERY,
  HERO_SLIDES,
  PRODUCTS,
  SPECIAL,
  SUB_BANNERS,
  TESTIMONIALS,
  TRENDING,
  cms,
} from '../data.js'
import { ProductCard } from './ProductCard.jsx'
import { Icon, SectionTitle } from './ui.jsx'

export function HeroSlider() {
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused) return
    const t = setInterval(() => setI((p) => (p + 1) % HERO_SLIDES.length), 5500)
    return () => clearInterval(t)
  }, [paused])

  const go = (d) => setI((p) => (p + d + HERO_SLIDES.length) % HERO_SLIDES.length)

  return (
    <section
      className="hero-slider"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {HERO_SLIDES.map((s, k) => (
        <div className={`slide${k === i ? ' active' : ''}`} key={s.title}>
          <img src={s.img} alt="" className="slide-bg" />
          <div className="slide-overlay" />
          <div className="container slide-content">
            <span className="slide-tag">{s.tag}</span>
            <h1>{s.title}</h1>
            <p>{s.text}</p>
            <a href="#" className="btn btn-gold">{s.cta}</a>
          </div>
        </div>
      ))}
      <button className="slide-arrow left" onClick={() => go(-1)} aria-label="Previous slide">
        <Icon name="arrowLeft" size={20} />
      </button>
      <button className="slide-arrow right" onClick={() => go(1)} aria-label="Next slide">
        <Icon name="arrowRight" size={20} />
      </button>
      <div className="slide-dots">
        {HERO_SLIDES.map((_, k) => (
          <button key={k} className={`dot${k === i ? ' on' : ''}`} onClick={() => setI(k)} aria-label={`Slide ${k + 1}`} />
        ))}
      </div>
    </section>
  )
}

export function WelcomeServices() {
  const services = [
    { icon: 'truck', title: 'Free Worldwide Shipping', text: 'On all orders above $50' },
    { icon: 'gift', title: 'Easy 30 Day Returns', text: 'Return within 30 days' },
    { icon: 'reward', title: 'Money Back Guarentee', text: '100% satisfaction' },
  ]
  return (
    <section className="welcome">
      <div className="container">
        <h2 className="welcome-title">Welcome To Store!!</h2>
        <span className="pattern" aria-hidden="true" />
        <p className="welcome-text">
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
          been the industry&rsquo;s standard dummy text ever since.
        </p>
        <div className="services">
          {services.map((s) => (
            <div className="service" key={s.title}>
              <span className="service-ic"><Icon name={s.icon} size={34} /></span>
              <div>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function CategoryBanners() {
  return (
    <section className="category-banners">
      <div className="container cat-grid">
        {CATEGORY_BANNERS.map((b) => (
          <a href="#" className="cat-banner" key={b.title}>
            <img src={b.img} alt={b.title} loading="lazy" />
            <span className="cat-title">{b.title}</span>
          </a>
        ))}
      </div>
    </section>
  )
}

const TABS = ['Featured', 'New', 'Best Seller', 'Discount']
const TAB_IDS = {
  Featured: TRENDING,
  New: [2, 3, 5, 7, 9, 11, 14, 19],
  'Best Seller': [15, 3, 19, 5, 9, 13, 12, 18],
  Discount: [1, 4, 6, 10, 15, 17, 20, 13],
}

export function TrendingSection() {
  const [tab, setTab] = useState('Featured')
  const trackRef = useRef(null)

  const ids = TAB_IDS[tab]
  const shift = (dir) => {
    const el = trackRef.current
    if (el) el.scrollBy({ left: dir * 320, behavior: 'smooth' })
  }

  return (
    <section className="trending">
      <div className="container">
        <div className="trending-head">
          <h2>Trending Items</h2>
          <div className="tabs">
            {TABS.map((t) => (
              <button key={t} className={tab === t ? 'on' : ''} onClick={() => setTab(t)}>
                {t}
              </button>
            ))}
          </div>
        </div>
        <div className="trending-nav" aria-hidden="true">
          <button onClick={() => shift(-1)}><Icon name="arrowLeft" size={18} /></button>
          <button onClick={() => shift(1)}><Icon name="arrowRight" size={18} /></button>
        </div>
        <div className="product-track" ref={trackRef}>
          <div className="product-grid">
            {ids.map((id) => (
              <ProductCard key={`${tab}-${id}`} product={PRODUCTS[id]} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export function SubBanners() {
  return (
    <section className="sub-banners">
      <div className="container sub-grid">
        {SUB_BANNERS.map((sb) => (
          <a href="#" className="sub-banner" key={sb.title}>
            <img src={sb.img} alt={sb.title} loading="lazy" />
            <div className="sub-body">
              <span>{sb.label}</span>
              <h3>{sb.title}</h3>
              <b>Shop Now</b>
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}

export function Testimonials() {
  const [i, setI] = useState(0)
  const t = TESTIMONIALS[i]
  return (
    <section className="testimonials" style={{ backgroundImage: `url(${cms('testimonial-bkg.png')})` }}>
      <div className="container">
        <div className="testi-card">
          <span className="quote-mark">&ldquo;</span>
          <p>{t.text}</p>
          <div className="testi-author">
            <span className="avatar">{t.name.split(' ').map((w) => w[0]).join('')}</span>
            <div>
              <b>{t.name}</b>
              <em>({t.role})</em>
            </div>
          </div>
          <div className="slide-dots">
            {TESTIMONIALS.map((_, k) => (
              <button key={k} className={`dot${k === i ? ' on' : ''}`} onClick={() => setI(k)} aria-label={`Testimonial ${k + 1}`} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export function SpecialProducts() {
  return (
    <section className="special">
      <div className="container">
        <SectionTitle title="Special Produtcs" light />
        <div className="special-grid">
          {SPECIAL.map((id) => (
            <ProductCard key={id} product={PRODUCTS[id]} dark />
          ))}
        </div>
      </div>
    </section>
  )
}

export function Gallery() {
  return (
    <section className="gallery">
      <div className="container">
        <SectionTitle title="From The Gallery" />
        <div className="gallery-grid">
          {GALLERY.map((g) => (
            <a href="#" className="gallery-item" key={g.title}>
              <img src={g.img} alt={g.title} loading="lazy" />
              <span className="gallery-cap">{g.title}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Brands() {
  const ref = useRef(null)
  return (
    <section className="brands">
      <div className="container">
        <button
          className="brands-arrow"
          onClick={() => ref.current?.scrollBy({ left: -220, behavior: 'smooth' })}
          aria-label="Scroll brands left"
        >
          <Icon name="arrowLeft" size={18} />
        </button>
        <div className="brands-track" ref={ref}>
          {BRANDS.map((b) => (
            <a href="#" className="brand" key={b.name}>
              <img src={b.img} alt={b.name} loading="lazy" />
            </a>
          ))}
        </div>
        <button
          className="brands-arrow"
          onClick={() => ref.current?.scrollBy({ left: 220, behavior: 'smooth' })}
          aria-label="Scroll brands right"
        >
          <Icon name="arrowRight" size={18} />
        </button>
      </div>
    </section>
  )
}