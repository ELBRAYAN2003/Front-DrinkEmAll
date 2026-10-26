import About from '../components/home/About.jsx'
import Brands from '../components/home/Brands.jsx'
import Categories from '../components/home/Categories.jsx'
import Hero from '../components/home/Hero.jsx'
import Location from '../components/home/Location.jsx'
import Newsletter from '../components/home/Newsletter.jsx'
import Services from '../components/home/Services.jsx'
import SpecialProducts from '../components/home/SpecialProducts.jsx'
import Trending from '../components/home/Trending.jsx'

export default function HomePage() {
  return (
    <main>
      <Hero />
      <Services />
      <Categories />
      <Trending />
      <SpecialProducts />
      <Brands />
      <About />
      <Location />
      <Newsletter />
    </main>
  )
}
