import { useState } from 'react'
import { guardarIngreso, leerIngreso } from '../../lib/edad.js'

// Puerta de edad. Bloquea el sitio hasta que la persona declare ser mayor.
//
// El estado inicial se resuelve leyendo el almacenamiento en el inicializador
// perezoso: hacerlo en un efecto mostraria el cartel un instante a quien ya
// respondio, y ademas chocaria con la regla de no setear estado en efectos.

export default function AgeGate() {
  const [estado, setEstado] = useState(() => (leerIngreso() ? 'listo' : 'preguntando'))

  if (estado === 'listo') return null

  return (
    <div className="agegate" role="dialog" aria-modal="true" aria-labelledby="agegate-titulo">
      <div className="agegate-panel">
        <span className="agegate-marca" aria-hidden="true">D</span>

        {estado === 'preguntando' ? (
          <>
            <h2 id="agegate-titulo">Antes de entrar</h2>
            <p>
              En DrinkEmAll vendemos bebidas alcoholicas. La venta a menores de
              18 anos esta prohibida por ley.
            </p>
            <p className="agegate-pregunta">Tenes 18 anos o mas?</p>

            <div className="agegate-botones">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  guardarIngreso()
                  setEstado('listo')
                }}
              >
                Si, soy mayor de 18
              </button>
              <button type="button" className="btn btn-ghost" onClick={() => setEstado('rechazado')}>
                No
              </button>
            </div>

            <p className="agegate-nota">Bebe con moderacion.</p>
          </>
        ) : (
          <>
            <h2 id="agegate-titulo">No podes acceder</h2>
            <p>
              Lo sentimos: solo pueden comprar personas mayores de 18 anos.
            </p>
            <button type="button" className="btn btn-ghost" onClick={() => setEstado('preguntando')}>
              Volver
            </button>
          </>
        )}
      </div>
    </div>
  )
}
