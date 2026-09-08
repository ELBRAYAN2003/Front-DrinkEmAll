import { Footer } from './components/Footer.jsx'
import { Header } from './components/Header.jsx'
import {
  Brands,
  CategoryBanners,
  Gallery,
  HeroSlider,
  SpecialProducts,
  SubBanners,
  Testimonials,
  TrendingSection,
  WelcomeServices,
} from './components/Home.jsx'

function App() {
  return (
    <>
      <Header />
      <main>
        <HeroSlider />
        <WelcomeServices />
        <CategoryBanners />
        <TrendingSection />
        <SubBanners />
        <Testimonials />
        <SpecialProducts />
        <Gallery />
        <Brands />
      </main>
      <Footer />
    </>
  )
}

export default App