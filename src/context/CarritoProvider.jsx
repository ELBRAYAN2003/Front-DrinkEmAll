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
      const cantidad = accion.cantidad ?? 1;
      if (!lineas.some((l) => l.id === nueva.id)) {
        return [...lineas, { ...nueva, cantidad: tope(nueva, cantidad) }];
      }
      return lineas.map((l) =>
        l.id === nueva.id ? { ...l, cantidad: tope(l, l.cantidad + cantidad) } : l,
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
    // Devuelve cuantas unidades entraron de verdad (0 si ya estaba el maximo de stock), para poder avisarlo.
    agregar: (producto, cantidad = 1) => {
      const actual = lineas.find((l) => l.id === String(producto.id));
      const stock = Number(producto.stock ?? 99) || 99;
      const antes = actual?.cantidad ?? 0;
      const despues = Math.max(1, Math.min(stock, antes + cantidad));
      dispatch({ type: "agregar", producto, cantidad });
      return Math.max(0, despues - antes);
    },
    quitar: (id) => dispatch({ type: "quitar", id }),
    cambiarCantidad: (id, delta) =>
      dispatch({ type: "cambiarCantidad", id, delta }),
    vaciar: () => dispatch({ type: "vaciar" }),
  };

  return (
    <CarritoContext.Provider value={valor}>{children}</CarritoContext.Provider>
  );
}
