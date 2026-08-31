import Icon from '../ui/Icon.jsx'
import { gallery } from '../../data/home.js'

export default function Gallery() {
  return (
    <section className="section gallery">
      <div className="wrap">
        <div className="section-head">
          <span className="eyebrow">Del blog</span>
          <h2>Para leer con una copa</h2>
          <p>Guias cortas, sin solemnidad y con recomendaciones concretas.</p>
        </div>

        <ul className="gallery-grid">
          {gallery.map((post) => (
            <li key={post.id}>
              <a className="post" href="#">
                <span className="post-media">
                  <img src={post.image} alt="" loading="lazy" />
                  <em className="post-tag">{post.tag}</em>
                </span>
                <span className="post-body">
                  <h3>{post.title}</h3>
                  <span className="post-cta">
                    Leer nota <Icon name="right" size={14} />
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
