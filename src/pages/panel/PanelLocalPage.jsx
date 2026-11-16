import { useCallback, useState } from 'react'
import { datosDelLocal, guardarDatosDelLocal } from '../../api/panel.js'
import { invalidarAjustes } from '../../hooks/useAjustesTienda.js'
import { useRecarga } from '../../hooks/useRecarga.js'
import { validarDatosDelLocal } from '../../lib/datosDelLocal.js'
import { mensajeDeError } from '../../lib/mensajeDeError.js'

const VACIO = {
  pickupAddress: '',
  pickupHours: '',
  deliveryZone: '',
  shippingCost: '',
  freeShippingFrom: '',
  transferAlias: '',
  transferCbu: '',
  transferHolder: '',
  transferCuit: '',
  transferNote: '',
}

const desdeApi = (a) => ({
  pickupAddress: a.pickupAddress ?? '',
  pickupHours: a.pickupHours ?? '',
  deliveryZone: a.deliveryZone ?? '',
  shippingCost: String(a.shippingCost ?? ''),
  freeShippingFrom: String(a.freeShippingFrom ?? ''),
  transferAlias: a.transfer?.alias ?? '',
  transferCbu: a.transfer?.cbu ?? '',
  transferHolder: a.transfer?.holder ?? '',
  transferCuit: a.transfer?.cuit ?? '',
  transferNote: a.transfer?.note ?? '',
})

function Campo({ etiqueta, campo, datos, errores, cambiar, ayuda, ...resto }) {
  return (
    <label className="panel-form-campo">
      <span>{etiqueta}</span>
      <input value={datos[campo]} onChange={(e) => cambiar(campo, e.target.value)} aria-invalid={errores[campo] ? 'true' : undefined} {...resto} />
      {ayuda && !errores[campo] && <small>{ayuda}</small>}
      {errores[campo] && <small className="panel-error-chico">{errores[campo]}</small>}
    </label>
  )
}

// "Datos del local": lo que ve el cliente al retirar, al pagar por transferencia y al pedir envio.
export default function PanelLocalPage() {
  const [datos, setDatos] = useState(VACIO)
  const [original, setOriginal] = useState(null)
  const [error, setError] = useState(null)
  const [estado, setEstado] = useState(null) // null | 'guardando' | 'ok'
  const [tocado, setTocado] = useState(false)

  const cargar = useCallback(async () => {
    try {
      const actuales = desdeApi(await datosDelLocal())
      setOriginal(actuales)
      setDatos(actuales)
      setError(null)
    } catch (e) {
      setError(mensajeDeError(e))
    }
  }, [])
  useRecarga(cargar)

  const errores = tocado ? validarDatosDelLocal(datos) : {}
  const cambiar = (campo, valor) => {
    setDatos((d) => ({ ...d, [campo]: valor }))
    setEstado(null)
  }
  const hayCambios = original && Object.keys(VACIO).some((c) => datos[c].trim() !== original[c].trim())

  const guardar = async (e) => {
    e.preventDefault()
    setTocado(true)
    if (Object.keys(validarDatosDelLocal(datos)).length > 0) return
    setEstado('guardando')
    setError(null)
    try {
      // Solo se mandan los campos que cambiaron.
      const cuerpo = {}
      for (const c of Object.keys(VACIO)) {
        if (datos[c].trim() !== original[c].trim()) {
          cuerpo[c] = c === 'shippingCost' || c === 'freeShippingFrom' ? Number(datos[c].replace(',', '.')) : datos[c].trim()
        }
      }
      const vigentes = desdeApi(await guardarDatosDelLocal(cuerpo))
      invalidarAjustes()
      setOriginal(vigentes)
      setDatos(vigentes)
      setEstado('ok')
    } catch (err) {
      setError(mensajeDeError(err))
      setEstado(null)
    }
  }

  const props = { datos, errores, cambiar }

  return (
    <section>
      <div className="panel-cabecera">
        <h1>Datos del local</h1>
      </div>
      <p className="panel-ayuda">
        Lo que cargues acá lo ve el cliente al comprar: a qué cuenta transferir, dónde y cuándo retirar, y cuánto cuesta el
        envío. Un campo vacío no se muestra.
      </p>

      {error && <p className="panel-error" role="alert">{error}</p>}
      {!original && !error && <p aria-busy="true">Cargando...</p>}

      {original && (
        <form className="panel-form" onSubmit={guardar} noValidate>
          <fieldset className="panel-tarjeta">
            <legend>Transferencia</legend>
            <p className="panel-ayuda">Son los datos de la cuenta adonde los clientes mandan el dinero: revisalos bien antes de guardar.</p>
            <div className="panel-form-grilla">
              <Campo {...props} campo="transferAlias" etiqueta="Alias" placeholder="mi.comercio" maxLength={20} />
              <Campo {...props} campo="transferCbu" etiqueta="CBU o CVU" inputMode="numeric" placeholder="22 números" ayuda="Se aceptan espacios o guiones." />
              <Campo {...props} campo="transferHolder" etiqueta="Titular de la cuenta" maxLength={80} />
              <Campo {...props} campo="transferCuit" etiqueta="CUIT / CUIL del titular" inputMode="numeric" placeholder="20-12345678-6" />
              <Campo {...props} campo="transferNote" etiqueta="Nota para el cliente (opcional)" maxLength={300} ayuda="Por ejemplo: avisá por WhatsApp cuando transfieras." />
            </div>
          </fieldset>

          <fieldset className="panel-tarjeta">
            <legend>Retiro en el local</legend>
            <div className="panel-form-grilla">
              <Campo {...props} campo="pickupAddress" etiqueta="Dirección del local" maxLength={160} />
              <Campo {...props} campo="pickupHours" etiqueta="Horarios de retiro" maxLength={160} placeholder="Lunes a sábados de 9 a 13 y de 17 a 21" />
            </div>
          </fieldset>

          <fieldset className="panel-tarjeta">
            <legend>Envío a domicilio</legend>
            <div className="panel-form-grilla">
              <Campo {...props} campo="deliveryZone" etiqueta="Zona de entrega" maxLength={120} />
              <Campo {...props} campo="shippingCost" etiqueta="Costo de envío ($)" inputMode="decimal" />
              <Campo {...props} campo="freeShippingFrom" etiqueta="Envío gratis desde ($)" inputMode="decimal" ayuda="Compras iguales o mayores a este importe no pagan envío." />
            </div>
          </fieldset>

          <div className="panel-form-acciones">
            <button type="submit" className="panel-boton panel-boton-primario" disabled={!hayCambios || estado === 'guardando'}>
              {estado === 'guardando' ? 'Guardando...' : 'Guardar cambios'}
            </button>
            {estado === 'ok' && <span className="panel-ok">Guardado. Ya lo ven los clientes.</span>}
            {hayCambios && <button type="button" className="panel-boton" onClick={() => setDatos(original)}>Descartar cambios</button>}
          </div>
        </form>
      )}
    </section>
  )
}
