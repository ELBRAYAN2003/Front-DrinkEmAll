// Lista de opciones (radio) para elegir entre lo guardado en la cuenta y "otro".
// Usa el mismo aspecto que las opciones de entrega y de pago del checkout.
export default function OpcionesDeLibreta({ nombre, opciones, elegida, onElegir }) {
  return (
    <div className="options" role="radiogroup">
      {opciones.map((o) => (
        <label key={o.id} className={`option ${elegida === o.id ? 'is-picked' : ''}`.trim()}>
          <input type="radio" name={nombre} checked={elegida === o.id} onChange={() => onElegir(o.id)} />
          <span>
            <b>
              {o.titulo}
              {o.predeterminado && <em className="option-tag">Predeterminado</em>}
            </b>
            {o.detalle && <small>{o.detalle}</small>}
          </span>
        </label>
      ))}
    </div>
  )
}
