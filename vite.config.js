import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Material local que no forma parte de la app: el mirror de la plantilla de
// referencia y las capturas. Estan en .gitignore, pero Vite los ve igual
// porque viven dentro del proyecto.
const EXCLUIDAS = ['**/plantilla-prestashop/**', '**/referencia/**']

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  optimizeDeps: {
    // Por defecto Vite busca puntos de entrada con **/*.html y se traga los
    // cientos de archivos del mirror, lo que hace fallar el escaneo de
    // dependencias. La app tiene un unico entry.
    entries: ['index.html'],
  },

  server: {
    watch: {
      // Evita vigilar ~200MB de archivos ajenos al proyecto.
      ignored: EXCLUIDAS,
    },
  },
})
