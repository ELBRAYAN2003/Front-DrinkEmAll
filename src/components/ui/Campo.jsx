// Campo de texto con su mensaje de error debajo. El error se pasa ya resuelto:
// quien decide si el valor sirve son las reglas de lib/validacion.js.
export default function Campo({ campo, etiqueta, valor, error, ancho, onCambio, onSalida, ...resto }) {
  const id = `campo-${campo}`
  return (
    <label className={ancho ? 'field-wide' : undefined}>
      <span>{etiqueta}</span>
      <input
        id={id}
        name={campo}
        value={valor}
        onChange={(e) => onCambio(campo, e.target.value)}
        onBlur={() => onSalida(campo)}
        className={error ? 'is-invalid' : undefined}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        {...resto}
      />
      {error && (
        <em className="field-error" id={`${id}-error`}>
          {error}
        </em>
      )}
    </label>
  )
}
