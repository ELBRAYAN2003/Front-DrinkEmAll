import Footer from './components/layout/Footer.jsx'
import Header from './components/layout/Header.jsx'
import Brands from './components/home/Brands.jsx'
import Categories from './components/home/Categories.jsx'
import ContactStrip from './components/home/ContactStrip.jsx'
import DealOfDay from './components/home/DealOfDay.jsx'
import Gallery from './components/home/Gallery.jsx'
import Hero from './components/home/Hero.jsx'
import Newsletter from './components/home/Newsletter.jsx'
import Promos from './components/home/Promos.jsx'
import Services from './components/home/Services.jsx'
import SpecialProducts from './components/home/SpecialProducts.jsx'
import Testimonials from './components/home/Testimonials.jsx'
import Trending from './components/home/Trending.jsx'

import './components/ui/ui.css'
import './components/layout/layout.css'
import './components/home/home.css'

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Services />
        <Categories />
        <Trending />
        <Promos />
        <DealOfDay />
        <SpecialProducts />
        <Gallery />
        <Testimonials />
        <Brands />
        <ContactStrip />
        <Newsletter />
      </main>
      <Footer />
    </>
  )
}
