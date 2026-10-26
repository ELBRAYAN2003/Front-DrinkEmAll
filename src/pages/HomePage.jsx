import Brands from '../components/home/Brands.jsx'
import Categories from '../components/home/Categories.jsx'
import ContactStrip from '../components/home/ContactStrip.jsx'
import Gallery from '../components/home/Gallery.jsx'
import Hero from '../components/home/Hero.jsx'
import Newsletter from '../components/home/Newsletter.jsx'
import Services from '../components/home/Services.jsx'
import SpecialProducts from '../components/home/SpecialProducts.jsx'
import Testimonials from '../components/home/Testimonials.jsx'
import Trending from '../components/home/Trending.jsx'

export default function HomePage() {
  return (
    <main>
      <Hero />
      <Services />
      <Categories />
      <Trending />
      <SpecialProducts />
      <Gallery />
      <Testimonials />
      <Brands />
      <ContactStrip />
      <Newsletter />
    </main>
  )
}
