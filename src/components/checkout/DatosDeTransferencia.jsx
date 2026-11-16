import { useState } from 'react'
import Icon from '../ui/Icon.jsx'
import { cbuLegible } from '../../lib/datosDelLocal.js'

// Boton para copiar un dato al portapapeles (alias, CBU). Si el navegador no lo permite, no pasa nada:
// la persona igual lo puede seleccionar a mano.
function Copiar({ texto, etiqueta }) {
  const [copiado, setCopiado] = useState(false)
  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(texto)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2000)
    } catch {
      // Sin permiso para el portapapeles: queda el texto para seleccionar.
    }
  }
  return (
    <button type="button" className="copiar" onClick={copiar} aria-label={`Copiar ${etiqueta}`}>
      <Icon name={copiado ? 'check' : 'compare'} size={14} />
      {copiado ? 'Copiado' : 'Copiar'}
    </button>
  )
}

/**
 * A que cuenta transferir. `transfer` viene de /shop/settings; lo que el comercio no cargo no se
 * muestra, y si no cargo nada se avisa que el local lo informara (nunca se inventa un dato).
 * `codigo` es el codigo del pedido, para pedir que lo pongan en el concepto de la transferencia.
 */
export default function DatosDeTransferencia({ transfer, codigo }) {
  const hay = transfer && (transfer.alias || transfer.cbu)
  if (!hay) {
    return (
      <p className="transferencia-aviso">
        El local te va a pasar los datos de la cuenta para transferir{codigo ? ` (pedido ${codigo})` : ''}.
      </p>
    )
  }
  return (
    <div className="transferencia">
      <h3>Transferí a esta cuenta</h3>
      <dl>
        {transfer.alias && (
          <div>
            <dt>Alias</dt>
            <dd>
              <b>{transfer.alias}</b> <Copiar texto={transfer.alias} etiqueta="el alias" />
            </dd>
          </div>
        )}
        {transfer.cbu && (
          <div>
            <dt>CBU / CVU</dt>
            <dd>
              <b>{cbuLegible(transfer.cbu)}</b> <Copiar texto={transfer.cbu} etiqueta="el CBU o CVU" />
            </dd>
          </div>
        )}
        {transfer.holder && (
          <div>
            <dt>Titular</dt>
            <dd>{transfer.holder}</dd>
          </div>
        )}
        {transfer.cuit && (
          <div>
            <dt>CUIT / CUIL</dt>
            <dd>{transfer.cuit}</dd>
          </div>
        )}
      </dl>
      {codigo && (
        <p className="transferencia-codigo">
          En el concepto o la referencia de la transferencia poné tu código de pedido: <b>{codigo}</b>
        </p>
      )}
      {transfer.note && <p className="transferencia-nota">{transfer.note}</p>}
    </div>
  )
}

/** Donde y cuando retirar. Lo que no se cargo no se muestra. */
export function DatosDeRetiro({ direccion, horarios }) {
  if (!direccion && !horarios) return <>Te confirmamos la dirección cuando el pedido esté listo.</>
  return (
    <>
      {direccion}
      {direccion && horarios ? ' · ' : ''}
      {horarios}
    </>
  )
}
