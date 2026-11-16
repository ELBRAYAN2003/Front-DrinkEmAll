import { BrowserRouter, Route, Routes } from "react-router";
import InvitacionCuenta from "./components/auth/InvitacionCuenta.jsx";
import RutaPrivada from "./components/auth/RutaPrivada.jsx";
import AgeGate from "./components/layout/AgeGate.jsx";
import Footer from "./components/layout/Footer.jsx";
import Header from "./components/layout/Header.jsx";
import AuthProvider from "./context/AuthProvider.jsx";
import CarritoProvider from "./context/CarritoProvider.jsx";
import MisPedidosPage from "./pages/MisPedidosPage.jsx";
import PedidoPage from "./pages/PedidoPage.jsx";
import AccountPage from "./pages/AccountPage.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import CartPage from "./pages/CartPage.jsx";
import CatalogPage from "./pages/CatalogPage.jsx";
import CheckoutPage from "./pages/CheckoutPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import PrivacyPage from "./pages/PrivacyPage.jsx";
import ProductPage from "./pages/ProductPage.jsx";
import SalirPage from "./pages/SalirPage.jsx";

import "./components/ui/ui.css";
import "./components/layout/layout.css";
import "./components/home/home.css";
import "./pages/auth.css";
import "./pages/catalog.css";
import "./pages/checkout.css";
import "./pages/product.css";
import "./pages/legal.css";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CarritoProvider>
          <AgeGate />
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            {/* La categoria viaja en la ruta para que el filtro sea compartible. */}
            <Route path="/catalogo" element={<CatalogPage />} />
            <Route path="/catalogo/:categoria" element={<CatalogPage />} />
            <Route path="/producto/:id" element={<ProductPage />} />
            <Route path="/privacidad" element={<PrivacyPage />} />
            <Route path="/carrito" element={<CartPage />} />
            {/* Se puede mirar y armar el carrito sin cuenta; la cuenta se pide recien
                al finalizar la compra. El carrito se conserva al ingresar. */}
            <Route
              path="/checkout"
              element={
                <RutaPrivada aviso="Para finalizar la compra necesitas una cuenta. Tu carrito se conserva.">
                  <CheckoutPage />
                </RutaPrivada>
              }
            />
            {/* "key" evita que ingresar y registro compartan el estado del formulario
                al pasar de una ruta a la otra. */}
            <Route path="/ingresar" element={<AuthPage key="ingreso" modo="ingreso" />} />
            <Route path="/registro" element={<AuthPage key="registro" modo="registro" />} />
            <Route path="/salir" element={<SalirPage />} />
            <Route
              path="/mi-cuenta"
              element={
                <RutaPrivada>
                  <AccountPage />
                </RutaPrivada>
              }
            />
            {/* Cualquier otra URL: antes renderizaba cabecera y pie con el
                medio vacio, sin aviso ni salida. */}
            <Route
              path="/mis-pedidos"
              element={
                <RutaPrivada aviso="Ingresa para ver tus pedidos.">
                  <MisPedidosPage />
                </RutaPrivada>
              }
            />
            <Route
              path="/mis-pedidos/:id"
              element={
                <RutaPrivada aviso="Ingresa para ver tus pedidos.">
                  <PedidoPage />
                </RutaPrivada>
              }
            />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          <Footer />
          <InvitacionCuenta />
        </CarritoProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
