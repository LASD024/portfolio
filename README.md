# Portafolio — Luis Alejandro Silva Díaz (Ingeniería Mecatrónica)

Sitio estático en HTML5, CSS3 y JavaScript puro. Compatible con GitHub Pages, sin backend ni frameworks.

## Estructura
```
index.html
css/styles.css        (paleta en variables CSS, según paleta_navy_verde_teal_portafolio.md)
js/projects.js        (datos de proyectos: aquí se edita el contenido)
js/script.js          (menú, render de proyectos, video YouTube bajo demanda)
assets/images|icons|docs
```

## Completar contenido
- `js/projects.js`: por proyecto, completa `youtube` (solo el ID, p. ej. `dQw4w9WgXcQ`) e `image` (opcional).
- Imágenes de proyectos: guárdalas en `assets/images/` (optimizadas, .webp/.jpg).
- `index.html`: ajusta `og:image` a una URL absoluta al publicar.

## Publicar en GitHub Pages
1. Sube la carpeta a un repositorio (p. ej. `usuario.github.io`).
2. Settings → Pages → Deploy from a branch → `main` / `/ (root)`.
3. Abre `https://usuario.github.io`.