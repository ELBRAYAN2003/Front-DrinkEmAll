import { money } from '../../lib/format.js'
import { calcularTotales } from '../../data/cart.js'
import { useAjustesTienda } from '../../hooks/useAjustesTienda.js'

// Tarjeta de totales. La comparten el carrito y el checkout, asi el calculo
// vive en un solo lugar y las dos vistas no pueden mostrar cifras distintas.

export default function OrderSummary({ lineas, retiroEnLocal = false, children }) {
  const ajustes = useAjustesTienda()
  const { subtotal, envio, iva, total } = calcularTotales(lineas, { retiroEnLocal, ajustes })
  const faltaParaGratis = ajustes ? ajustes.freeShippingFrom - subtotal : 0

  return (
    <aside className="summary" aria-label="Resumen del pedido">
      <h2>Resumen</h2>

      <dl className="summary-lines">
        <div>
          <dt>Subtotal</dt>
          <dd>{money.format(subtotal)}</dd>
        </div>
        <div>
          <dt>Envio</dt>
          <dd>{envio === null ? 'Se calcula al confirmar' : envio === 0 ? 'Gratis' : money.format(envio)}</dd>
        </div>
        <div className="summary-muted">
          <dt>IVA incluido</dt>
          <dd>{money.format(iva)}</dd>
        </div>
      </dl>

      <p className="summary-total">
        <span>Total</span>
        <b>{money.format(total)}{envio === null && ' + envio'}</b>
      </p>

      {!retiroEnLocal && faltaParaGratis > 0 && subtotal > 0 && (
        <p className="summary-hint">
          Te faltan {money.format(faltaParaGratis)} para el envio gratis.
        </p>
      )}

      {children}
    </aside>
  )
}
