import { BrowserRouter, Route, Routes } from 'react-router'
import Footer from './components/layout/Footer.jsx'
import Header from './components/layout/Header.jsx'
import CatalogPage from './pages/CatalogPage.jsx'
import HomePage from './pages/HomePage.jsx'

import './components/ui/ui.css'
import './components/layout/layout.css'
import './components/home/home.css'
import './pages/catalog.css'

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* La categoria viaja en la ruta para que el filtro sea compartible. */}
        <Route path="/catalogo" element={<CatalogPage />} />
        <Route path="/catalogo/:categoria" element={<CatalogPage />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}
