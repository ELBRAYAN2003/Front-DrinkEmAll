// Entrega un archivo que ya esta en memoria (un Blob) como descarga del navegador.
export function guardarArchivo(blob, nombre) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = nombre
  document.body.appendChild(a)
  a.click()
  a.remove()
  // Se libera despues de que el navegador arranco la descarga.
  setTimeout(() => URL.revokeObjectURL(url), 10_000)
}
