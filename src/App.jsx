import { BrowserRouter, Route, Routes } from "react-router";
import AgeGate from "./components/layout/AgeGate.jsx";
import Footer from "./components/layout/Footer.jsx";
import Header from "./components/layout/Header.jsx";
import CarritoProvider from "./context/CarritoProvider.jsx";
import CartPage from "./pages/CartPage.jsx";
import CatalogPage from "./pages/CatalogPage.jsx";
import CheckoutPage from "./pages/CheckoutPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import ProductPage from "./pages/ProductPage.jsx";

import "./components/ui/ui.css";
import "./components/layout/layout.css";
import "./components/home/home.css";
import "./pages/catalog.css";
import "./pages/checkout.css";
import "./pages/product.css";

export default function App() {
  return (
    <BrowserRouter>
      <CarritoProvider>
        <AgeGate />
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/* La categoria viaja en la ruta para que el filtro sea compartible. */}
          <Route path="/catalogo" element={<CatalogPage />} />
          <Route path="/catalogo/:categoria" element={<CatalogPage />} />
          <Route path="/producto/:id" element={<ProductPage />} />
          <Route path="/carrito" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
        </Routes>
        <Footer />
      </CarritoProvider>
    </BrowserRouter>
  );
}
