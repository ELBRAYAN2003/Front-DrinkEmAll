import { BrowserRouter, Route, Routes, useLocation } from "react-router";
import InvitacionCuenta from "./components/auth/InvitacionCuenta.jsx";
import RutaPrivada from "./components/auth/RutaPrivada.jsx";
import RutaDeCliente from "./components/auth/RutaDeCliente.jsx";
import RutaDelComercio from "./components/auth/RutaDelComercio.jsx";
import PanelLayout from "./components/panel/PanelLayout.jsx";
import PanelPedidosPage from "./pages/panel/PanelPedidosPage.jsx";
import PanelPedidoPage from "./pages/panel/PanelPedidoPage.jsx";
import PanelPrepararPage from "./pages/panel/PanelPrepararPage.jsx";
import PanelProductosPage from "./pages/panel/PanelProductosPage.jsx";
import PanelArrepentimientosPage from "./pages/panel/PanelArrepentimientosPage.jsx";
import PanelLocalPage from "./pages/panel/PanelLocalPage.jsx";
import AgeGate from "./components/layout/AgeGate.jsx";
import AvisoCarrito from "./components/ui/AvisoCarrito.jsx";
import Footer from "./components/layout/Footer.jsx";
import Header from "./components/layout/Header.jsx";
import AuthProvider from "./context/AuthProvider.jsx";
import CarritoProvider from "./context/CarritoProvider.jsx";
import ArrepentimientoPage from "./pages/ArrepentimientoPage.jsx";
import TermsPage from "./pages/TermsPage.jsx";
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
import "./pages/panel/panel.css";

// El panel del comercio no lleva nada de la tienda (cabecera, pie, puerta de edad, invitacion):
// es otro lugar de trabajo, para otra persona.
function Contenido() {
  const { pathname } = useLocation();
  if (pathname.startsWith("/panel")) {
    return (
      <Routes>
        <Route
          path="/panel"
          element={
            <RutaDelComercio>
              <PanelLayout />
            </RutaDelComercio>
          }
        >
          <Route index element={<PanelPedidosPage />} />
          <Route path="pedidos/:id" element={<PanelPedidoPage />} />
          <Route path="preparar" element={<PanelPrepararPage />} />
          <Route path="productos" element={<PanelProductosPage />} />
          <Route path="arrepentimientos" element={<PanelArrepentimientosPage />} />
          <Route path="local" element={<PanelLocalPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    );
  }
  return (
    <>
      <AgeGate />
      <Header />
      <Tienda />
      <Footer />
      <InvitacionCuenta />
      <AvisoCarrito />
    </>
  );
}

function Tienda() {
  return (
          <Routes>
            <Route path="/" element={<HomePage />} />
            {/* La categoria viaja en la ruta para que el filtro sea compartible. */}
            <Route path="/catalogo" element={<CatalogPage />} />
            <Route path="/catalogo/:categoria" element={<CatalogPage />} />
            <Route path="/producto/:id" element={<ProductPage />} />
            <Route path="/privacidad" element={<PrivacyPage />} />
            <Route path="/terminos" element={<TermsPage />} />
            {/* Publica y sin cuenta: la Disposicion 954/2025 no permite pedir registro previo. */}
            <Route path="/arrepentimiento" element={<ArrepentimientoPage />} />
            <Route path="/carrito" element={<CartPage />} />
            {/* Se puede mirar y armar el carrito sin cuenta; la cuenta se pide recien
                al finalizar la compra. El carrito se conserva al ingresar. */}
            <Route
              path="/checkout"
              element={
                <RutaDeCliente aviso="Para finalizar la compra necesitas una cuenta. Tu carrito se conserva.">
                  <CheckoutPage />
                </RutaDeCliente>
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
                <RutaDeCliente aviso="Ingresa para ver tus pedidos.">
                  <MisPedidosPage />
                </RutaDeCliente>
              }
            />
            <Route
              path="/mis-pedidos/:id"
              element={
                <RutaDeCliente
                  aviso="Ingresa para ver tus pedidos."
                  destinoPersonal={(u) => `/panel/pedidos/${u.pathname.split("/").pop()}`}
                >
                  <PedidoPage />
                </RutaDeCliente>
              }
            />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CarritoProvider>
          <Contenido />
        </CarritoProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
