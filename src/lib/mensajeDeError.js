// Texto para mostrarle a la persona cuando una llamada a la API falla.
//
// Los errores de validacion traen un detalle por campo ([{ path, message }]):
// si estan, se muestran todos, porque "Datos invalidos" solo no dice que corregir.
export function mensajeDeError(error) {
  // El indice unico de la base contesta con un texto tecnico que nombra la columna.
  if (error?.status === 409 && /document_?number/i.test(error.message)) {
    return 'Ya hay una cuenta registrada con ese DNI.'
  }
  const detalles = error?.details
  if (Array.isArray(detalles) && detalles.length > 0) {
    return detalles.map((d) => d.message).join(' ')
  }
  return error?.message || 'Algo salio mal. Proba de nuevo.'
}
