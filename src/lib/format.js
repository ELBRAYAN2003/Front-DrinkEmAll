// Formateo compartido. Vive fuera de los componentes para no romper el fast
// refresh de Vite (un archivo de componente solo debe exportar componentes).

export const money = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0,
})
