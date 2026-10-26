import { useEffect, useReducer } from "react";
import { CarritoContext } from "./carritoContext.js";

const CLAVE = "drinkemall.carrito";

function leerGuardado() {
  try {
    const crudo = localStorage.getItem(CLAVE);
    return crudo ? JSON.parse(crudo) : [];
  } catch {
    return [];
  }
}

function normalizar(producto) {
  return {
    id: String(producto.id),
    name: producto.name,
    brand: producto.brand ?? "",
    price: Number(producto.price),
    image: producto.image,
    stock: Number(producto.stock ?? 99),
    cantidad: 1,
  };
}

const tope = (linea, cantidad) =>
  Math.max(1, Math.min(linea.stock || 99, cantidad));

function reducer(lineas, accion) {
  switch (accion.type) {
    case "agregar": {
      const nueva = normalizar(accion.producto);
      if (!lineas.some((l) => l.id === nueva.id)) return [...lineas, nueva];
      return lineas.map((l) =>
        l.id === nueva.id ? { ...l, cantidad: tope(l, l.cantidad + 1) } : l,
      );
    }
    case "cambiarCantidad":
      return lineas.map((l) =>
        l.id === accion.id
          ? { ...l, cantidad: tope(l, l.cantidad + accion.delta) }
          : l,
      );
    case "quitar":
      return lineas.filter((l) => l.id !== accion.id);
    case "vaciar":
      return [];
    default:
      return lineas;
  }
}

export default function CarritoProvider({ children }) {
  const [lineas, dispatch] = useReducer(reducer, undefined, leerGuardado);

  useEffect(() => {
    try {
      localStorage.setItem(CLAVE, JSON.stringify(lineas));
    } catch {
      // no hace nada
    }
  }, [lineas]);

  const valor = {
    lineas,
    unidades: lineas.reduce((acc, l) => acc + l.cantidad, 0),
    agregar: (producto) => dispatch({ type: "agregar", producto }),
    quitar: (id) => dispatch({ type: "quitar", id }),
    cambiarCantidad: (id, delta) =>
      dispatch({ type: "cambiarCantidad", id, delta }),
    vaciar: () => dispatch({ type: "vaciar" }),
  };

  return (
    <CarritoContext.Provider value={valor}>{children}</CarritoContext.Provider>
  );
}
