import { brands } from '../../data/home.js'

export default function Brands() {
  return (
    <section className="brands">
      <ul className="wrap brands-row">
        {brands.map((b) => (
          <li key={b}>
            <a href="#">{b}</a>
          </li>
        ))}
      </ul>
    </section>
  )
}
