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
| `src/api/catalog.js` | `listarProductos`, `obtenerProducto`, `listarCategorias`, `listarFiltros` |
| `src/hooks/useCatalogo.js` | `useProductos`, `useCategorias` y `useFiltros`, con corte a la maqueta si no hay API |

Si `VITE_API_URL` queda vacia, el hook devuelve la maqueta. Asi se puede
trabajar sin backend levantado.

### Como esta conectado el catalogo

`CatalogPage` no toca `src/data/home.js`: pide todo a la API a traves de los
hooks. El servidor resuelve filtrado, orden y paginacion; la pagina solo maneja
el estado de los controles.

La categoria viaja por la URL como slug legible (`/catalogo/whisky`,
`/catalogo/conac`) y se traduce al id numerico que espera la API contra la lista
de categorias. Mientras esa lista no llego, el pedido de productos queda en
pausa para no traer el catalogo entero y descartarlo en el acto.

## Contrato del backend

Base: `http://localhost:3000/api` — documentacion viva en `/api-docs` (Swagger).

Los listados responden siempre con el mismo sobre:

```json
{ "data": [], "meta": { "page": 1, "pageSize": 20, "total": 0, "totalPages": 1 } }
```

### Endpoints que usa el catalogo

| Metodo | Ruta | Parametros |
| --- | --- | --- |
| GET | `/products` | `page`, `pageSize` (max 100), `categoryId`, `search`, `active`, `brand`, `priceMin`, `priceMax`, `sort`, `onOffer` |
| GET | `/products/filters` | — (devuelve marcas con su conteo y rango de precios) |
| GET | `/products/:id` | — |
| GET | `/categories` | `page`, `pageSize` |

`sort` acepta `price_asc`, `price_desc`, `name_asc` y `name_desc`, y ordena el
catalogo completo, no la pagina visible. `brand` admite varias separadas por
coma. Los importes llegan como numero, no como string.

Campos del producto: `id`, `name`, `description`, `sku`, `brand`, `price`,
`oldPrice`, `onOffer`, `stock`, `lowStockThreshold`, `imageUrl`, `active`,
`categoryId`, `supplierId`, mas los objetos `category` y `supplier`.

Las fotos se sirven desde `/uploads/products/<archivo>` en el origen del
backend, no bajo `/api`. De ahi que `VITE_API_FILES` sea una variable aparte.

### Lo que la UI muestra y el modelo no tiene

- **Puntaje y resenas.** No hay sistema de resenas, asi que el adaptador deja
  `rating` en 0 y `reviews` en null, y la tarjeta se degrada sin romperse. Por
  eso el selector de orden tampoco ofrece "mejor puntuados": seria una opcion
  que no ordena nada.
- **Precio anterior.** El campo existe (`oldPrice`), pero el relevamiento del
  sitio de origen solo lo trae para un producto. El precio tachado y el badge de
  descuento aparecen solo en ese, y en los que se carguen a mano.
- **Stock.** Los productos tienen un stock de relleno hasta que se haga el
  inventario real. Por eso no hay filtro "solo con stock": hoy no discriminaria
  nada.

### CORS

El backend toma el origen permitido de su propio `.env` (`CORS_ORIGIN`), por
defecto `http://localhost:5173`. Si se cambia el puerto del front, hay que
actualizarlo alla tambien.
