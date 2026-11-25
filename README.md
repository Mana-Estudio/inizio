# INIZIO — propuesta de rediseño

Prototipo de la nueva web de [INIZIO](https://www.inizio.es/) (estudio de arquitectura, Pozuelo de Alarcón), hecho por Maná a partir de la maqueta de Claude Design. Publicado en https://inizio.manaestudio.ar/

**Stack:** Astro 7 (sitio estático) · Newsreader + Hanken Grotesk (self-hosted) · `astro:assets` (WebP + srcset) · View Transitions nativas entre listado y ficha · motor de animación propio con Web Animations API (`src/scripts/motion.ts`), sin dependencias.

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # sitio estático en dist/
```

## Notas

- Las animaciones respetan "reducir movimiento" del sistema. Para forzarlas en una demo: `?motion=1` (queda activo en la pestaña). `?nomotion` las apaga (útil para capturas).
- Fotos y textos tomados de la web actual del cliente, solo para el prototipo (`src/assets/`, `src/data/proyectos.ts`).
- Municipio, estado y tipología de cada casa son **provisionales**; todo lo que está entre corchetes (`[Año]`, `[m²]`, testimonios, honorarios…) es un dato pendiente del estudio.
- Los formularios de contacto y de propuesta son demostrativos: no envían nada.
- `noindex` y `robots.txt` bloquean la indexación mientras sea una propuesta.
