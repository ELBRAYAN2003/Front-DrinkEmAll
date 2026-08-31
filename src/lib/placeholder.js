// Arte de relleno generado como SVG en linea.
//
// Evita depender de binarios y permite variar color/forma por producto sin
// sumar peso al repo. Cuando existan fotos reales, basta con reemplazar el
// campo `image` de cada producto en src/data/home.js: los componentes ya
// consumen una URL cualquiera.

const toDataUri = (markup) =>
  `data:image/svg+xml;charset=utf-8,${encodeURIComponent(markup.replace(/\s+/g, ' ').trim())}`

// Siluetas normalizadas a un viewBox de 320x320.
const SHAPES = {
  wine: 'M140 46h40v56c0 13 28 27 28 60v96a22 22 0 0 1-22 22h-52a22 22 0 0 1-22-22v-96c0-33 28-47 28-60z',
  beer: 'M132 54h56v42c0 11 24 23 24 52v92a22 22 0 0 1-22 22h-60a22 22 0 0 1-22-22v-92c0-29 24-41 24-52z',
  can: 'M118 62h84a10 10 0 0 1 10 10v180a10 10 0 0 1-10 10h-84a10 10 0 0 1-10-10V72a10 10 0 0 1 10-10z',
}

/**
 * Botella/lata estilizada para tarjetas de producto.
 * @param {{hue?: number, shape?: keyof SHAPES, bg?: string}} opts
 */
export function productImage({ hue = 348, shape = 'wine', bg = '#f7f2ec' } = {}) {
  const body = SHAPES[shape] ?? SHAPES.wine
  const neck = shape === 'can' ? '' : `<rect x="136" y="34" width="48" height="16" rx="5" fill="#3b2a21"/>`
  const label =
    shape === 'can'
      ? `<rect x="108" y="140" width="104" height="66" fill="#f6f0e6" opacity=".92"/>`
      : `<rect x="118" y="190" width="84" height="62" rx="3" fill="#f6f0e6" opacity=".92"/>`

  return toDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" width="320" height="320" viewBox="0 0 320 320" role="img">
      <defs>
        <linearGradient id="b" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="hsl(${hue} 48% 38%)"/>
          <stop offset="1" stop-color="hsl(${hue} 58% 19%)"/>
        </linearGradient>
        <linearGradient id="s" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stop-color="#fff" stop-opacity=".28"/>
          <stop offset=".35" stop-color="#fff" stop-opacity="0"/>
        </linearGradient>
      </defs>
      <rect width="320" height="320" fill="${bg}"/>
      <ellipse cx="160" cy="286" rx="62" ry="10" fill="#000" opacity=".08"/>
      ${neck}
      <path d="${body}" fill="url(#b)"/>
      <path d="${body}" fill="url(#s)"/>
      ${label}
      <rect x="130" y="206" width="60" height="4" rx="2" fill="hsl(${hue} 45% 34%)" opacity=".55"/>
      <rect x="140" y="218" width="40" height="3" rx="1.5" fill="hsl(${hue} 45% 34%)" opacity=".35"/>
    </svg>
  `)
}

/**
 * Fondo abstracto para banners y cabeceras de seccion.
 */
export function sceneImage({ hue = 348, tone = 30 } = {}) {
  return toDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500" role="img">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="hsl(${hue} 42% ${tone + 14}%)"/>
          <stop offset="1" stop-color="hsl(${hue} 52% ${tone - 8}%)"/>
        </linearGradient>
      </defs>
      <rect width="800" height="500" fill="url(#g)"/>
      <circle cx="640" cy="120" r="190" fill="#fff" opacity=".07"/>
      <circle cx="150" cy="430" r="230" fill="#000" opacity=".10"/>
      <circle cx="380" cy="250" r="90" fill="#fff" opacity=".05"/>
    </svg>
  `)
}

/**
 * Miniatura cuadrada para la galeria / feed social.
 */
export function tileImage({ hue = 348 } = {}) {
  return toDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400" role="img">
      <defs>
        <linearGradient id="t" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="hsl(${hue} 40% 42%)"/>
          <stop offset="1" stop-color="hsl(${hue + 18} 46% 24%)"/>
        </linearGradient>
      </defs>
      <rect width="400" height="400" fill="url(#t)"/>
      <circle cx="300" cy="110" r="130" fill="#fff" opacity=".08"/>
      <circle cx="110" cy="320" r="150" fill="#000" opacity=".12"/>
    </svg>
  `)
}
