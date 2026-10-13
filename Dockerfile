# syntax=docker/dockerfile:1

FROM node:24-alpine AS build
# Fonts for rasterising the SVG covers into Open Graph PNGs (sharp/librsvg).
RUN apk add --no-cache fontconfig font-inter font-jetbrains-mono
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run check && npm run build

FROM nginxinc/nginx-unprivileged:1.29.1-alpine
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY nginx/security-headers.conf /etc/nginx/snippets/security-headers.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 8080
