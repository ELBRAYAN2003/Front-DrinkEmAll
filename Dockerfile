# Frontend: se compila con node y el resultado estatico lo sirve Caddy.
# La imagen final no lleva node ni node_modules, solo los archivos compilados.

FROM node:22-alpine AS build
WORKDIR /app
RUN corepack enable

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

# Vite incrusta las variables en el bundle al compilar, no en tiempo de
# ejecucion. Van relativas porque el front y la API se sirven desde el mismo
# dominio: asi no queda el host escrito en el build ni hace falta CORS.
ARG VITE_API_URL=/api
ARG VITE_API_FILES=
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_API_FILES=$VITE_API_FILES
RUN pnpm build

FROM caddy:2-alpine
COPY --from=build /app/dist /srv
