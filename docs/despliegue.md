# Despliegue en el servidor

Guía para publicar una versión nueva en el VPS (Docker + Caddy + MySQL). Los comandos con `sudo` o que
tocan secretos los corre quien administra el servidor; los secretos se generan **en el servidor** y
nunca se versionan ni se pegan en chats.

## 0. Antes de empezar

- `main` de los dos repositorios tiene la versión a publicar (Front y Back, hermanos en la misma carpeta:
  `drinkemall/Front-DrinkEmAll` y `drinkemall/Back-DrinkEmAll`).
- Hacer una **copia de la base** (las migraciones nuevas se aplican solas al arrancar el backend):

  ```bash
  docker compose -f Front-DrinkEmAll/deploy/docker-compose.yml exec db \
    sh -c 'mysqldump -uroot -p"$MYSQL_ROOT_PASSWORD" --single-transaction drinkemall' > respaldo-$(date +%F).sql
  ```

## 1. Actualizar el código

```bash
cd drinkemall/Front-DrinkEmAll && git pull
cd ../Back-DrinkEmAll && git pull      # el backend en el VPS es una copia: traer los archivos de main
```

## 2. Variables (`deploy/.env` en el servidor)

Partir de `deploy/.env.example` y completar **solo en el servidor**:

| Variable | Qué poner |
| --- | --- |
| `ADMIN_PASSWORD` | Solo si se va a crear el admin por primera vez. El admin que ya existe se cambia en el paso 5. |
| `VENDEDOR_EMAIL`, `VENDEDOR_PASSWORD`, `ONLINE_SELLER_EMAIL` | La cuenta del comercio (el mismo correo en las dos). Contraseña de 12+ caracteres, generada con `openssl rand -base64 24`. |
| `MERCADOPAGO_ACCESS_TOKEN` | Access Token de **producción** de la aplicación. |
| `MERCADOPAGO_WEBHOOK_SECRET` | Clave secreta de webhooks (paso 6). Obligatoria con token. |
| `MERCADOPAGO_SANDBOX` | `false`. |
| `PAYMENT_WINDOW_MINUTES` | `180` (reserva del stock). |

No definir `SEED_TEST_PRODUCT` en producción.

## 3. Reconstruir y arrancar

```bash
cd Front-DrinkEmAll/deploy
sudo docker compose build api web
sudo docker compose up -d
sudo docker compose logs -f api     # esperar "aplicando migraciones" y "arrancando la API"
```

## 4. Crear el vendedor del comercio (una sola vez)

```bash
sudo docker compose exec api npx sequelize-cli db:seed --seed 20261117100001-vendedor-tienda.js
```

Sin `VENDEDOR_EMAIL` y `VENDEDOR_PASSWORD` no hace nada. Es idempotente.

## 5. Cambiar la contraseña del admin existente

El admin de un servidor sembrado antes sigue con la contraseña que estuvo publicada en el repositorio. Cambiarla
ya, con una clave larga y propia (12+ caracteres), y se cierran todas sus sesiones:

```bash
sudo docker compose exec -e NEW_PASSWORD='<clave-larga-y-propia>' api node scripts/set-password.js admin@drinkemall.com
```

Para que la clave no quede en el historial del shell: anteponer un espacio al comando (si el shell lo ignora) o
leerla con `read -rs NEW_PASSWORD` y usar `-e NEW_PASSWORD`.

## 6. Mercado Pago en producción

1. En el panel de la aplicación: **activar las credenciales de producción** (pide rubro, el sitio web
   `https://drinkemall.sbcorp.site` y aceptar los términos).
2. Copiar el **Access Token** de producción al `.env` del servidor.
3. **Webhooks > Configurar notificaciones**: URL `https://drinkemall.sbcorp.site/api/webhooks/mercadopago`,
   evento **Pagos**. Copiar la **clave secreta** al `.env` (`MERCADOPAGO_WEBHOOK_SECRET`).
4. Reiniciar el backend para que tome las variables: `sudo docker compose up -d api`.

## 7. Verificar

- `https://drinkemall.sbcorp.site/api/shop/settings` responde y lista *Mercado Pago / QR*.
- Entrar a `/ingresar` con la cuenta del vendedor: lleva a `/panel`.
- En el panel > **Datos del local**: cargar alias, CBU/CVU, titular, dirección y horarios.
- Probar con el **producto de $1** (si se lo creó) con una tarjeta real **de otra persona** y retiro en el local,
  y comprobar que el pedido pasa a *Pagado* y se descarga el comprobante.
- La contraseña vieja del admin ya no entra.
