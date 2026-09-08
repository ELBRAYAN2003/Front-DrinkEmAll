# DrinkEmAll — Frontend

Tienda de vinos, cervezas y destilados. React 19 + Vite, CSS plano con anidamiento
nativo y `react-router`. Sin librerias de UI ni de estado.

## Arranque

```bash
pnpm install
cp .env.example .env    # ajustar si el backend no esta en localhost:3000
pnpm dev                # http://localhost:5173
```

Otros comandos: `pnpm build`, `pnpm preview`, `pnpm lint`.

## Estructura

```
src/
  pages/        HomePage y CatalogPage (una por ruta)
  components/
    layout/     Header y Footer
    home/       las secciones de la home
    ui/         Icon, Stars, Countdown, Carousel, ProductCard
  data/home.js  contenido de maqueta (hoy es la fuente de datos)
  api/          endpoints de la API           <- preparado, sin usar
  hooks/        useCatalogo                   <- preparado, sin usar
  lib/          api, adapters, format, placeholder
```

Rutas: `/` (home), `/catalogo` y `/catalogo/:categoria`.

## Conexion con el backend

El front **todavia consume la maqueta** de `src/data/home.js`. La capa para
conectarlo ya esta escrita y probada de tipos, pero ningun componente la
importa. Falta un unico paso: cambiar la fuente de datos de `CatalogPage`.

### Lo que ya esta hecho

| Archivo | Que resuelve |
| --- | --- |
| `.env.example` | `VITE_API_URL` y `VITE_API_FILES` |
| `src/lib/api.js` | fetch con URL base, querystring, `ApiError` y URLs de imagenes |
| `src/lib/adapters.js` | traduce el producto de la API a la forma que espera `ProductCard` |
| `src/api/catalog.js` | `listarProductos`, `obtenerProducto`, `listarCategorias` |
| `src/hooks/useCatalogo.js` | `useProductos` y `useCategorias`, con corte a la maqueta si no hay API |

Si `VITE_API_URL` queda vacia, el hook devuelve la maqueta. Asi se puede
trabajar sin backend levantado.

### El paso que falta

En `src/pages/CatalogPage.jsx`, reemplazar:

```js
import { allProducts, brands, categories } from '../data/home.js'
```

por el hook:

```js
import { useCategorias, useProductos } from '../hooks/useCatalogo.js'
```

y usar `productos`, `meta`, `cargando` y `error` en lugar de filtrar
`allProducts` en el cliente. Con la API, la categoria y la paginacion las
resuelve el servidor.

## Contrato del backend

Base: `http://localhost:3000/api` — documentacion viva en `/api-docs` (Swagger).

Los listados responden siempre con el mismo sobre:

```json
{ "data": [], "meta": { "page": 1, "pageSize": 20, "total": 0, "totalPages": 1 } }
```

### Endpoints que usa el catalogo

| Metodo | Ruta | Parametros |
| --- | --- | --- |
| GET | `/products` | `page`, `pageSize` (max 100), `categoryId`, `search`, `active` |
| GET | `/products/:id` | — |
| GET | `/categories` | `page`, `pageSize` |

Campos del producto: `id`, `name`, `description`, `sku`, `brand`, `price`,
`stock`, `lowStockThreshold`, `imageUrl`, `active`, `categoryId`, `supplierId`,
mas los objetos `category` y `supplier` incluidos.

Las fotos se sirven desde `/uploads/products/<archivo>` en el origen del
backend, no bajo `/api`. De ahi que `VITE_API_FILES` sea una variable aparte.

### Diferencias a resolver

Estas tres cosas la UI ya las ofrece y la API todavia no:

1. **Filtro por marca.** `/products` no acepta `brand`. Hoy el sidebar filtra
   marcas en el cliente; con paginacion del servidor eso solo alcanzaria a la
   pagina cargada.
2. **Rango de precio.** Tampoco hay `priceMin` / `priceMax`, con el mismo
   problema.
3. **Orden.** No hay parametro de ordenamiento, asi que "precio de menor a
   mayor" ordenaria solo la pagina actual, no el catalogo.

Mientras no existan del lado del servidor, conviene o bien pedir esos
parametros al backend, o bien marcar esos filtros como refinamientos de la
pagina visible.

Ademas, el modelo no tiene **precio anterior, puntaje ni reseñas**, que la
tarjeta de producto sí muestra. El adaptador los deja en null y la tarjeta se
degrada sin romperse.

### CORS

El backend toma el origen permitido de su propio `.env` (`CORS_ORIGIN`), por
defecto `http://localhost:5173`. Si se cambia el puerto del front, hay que
actualizarlo alla tambien.
