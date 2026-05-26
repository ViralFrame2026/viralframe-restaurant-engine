# Guia rapida para reutilizar el engine V2

El objetivo es vender el engine como sistema multi-template premium y cambiarlo rapido para cada cliente. Para la mayoria de los trabajos, edita:

```text
js/site-config.js
```

Arriba del archivo vas a ver `template` y el bloque `client`. En una venta normal, empieza por aca:

```js
template: "omakase",

client: {
  name: "Kaze Omakase",
  language: "en",
  tagline: "Tokyo Luxury Omakase",
  url: "https://viralframe2026.github.io/Aurelia-dining/",
  seoDescription: "Descripcion corta para Google y redes.",
  cuisine: ["Japanese", "Omakase", "Sushi"],
  priceRange: "$$$$",
  phone: "+1 212 555 0147",
  email: "reservations@kazeomakase.com",
  address: "18 Shiro Lane, Tribeca",
  city: "New York",
  hours: "Tue to Sat, 6:00 PM and 8:45 PM seatings",
  instagram: "#",
  facebook: "#",
  tiktok: "#",
  reservationMode: "demo",
  whatsappNumber: "",
  formEndpoint: "",
  newsletterEndpoint: ""
}
```

`template` acepta cualquier archivo de `templates/*.json`. Hoy hay `fine-dining`, `omakase`, `steakhouse` e `italian`.

`language` acepta `"en"` o `"es"`. Los textos reutilizables viven en `languages/`. Los campos especificos del cliente (`tagline`, `seoDescription`, `hours`, menu, FAQ y textos personalizados) conviene escribirlos directamente en el idioma elegido.

Las redes con `"#"` o vacias se ocultan del footer y no se incluyen en los datos estructurados. Usa URLs completas con `https://` cuando el cliente tenga perfiles activos.

## Checklist del cliente

Pedi estos datos antes de editar:

- Nombre de marca y subtitulo corto.
- Idioma del cliente: ingles (`en`) o espanol (`es`).
- Dominio final.
- Descripcion SEO de 140 a 160 caracteres.
- Telefono, email, direccion, ciudad y redes.
- Horarios reales.
- Estilo de cocina o rubro.
- Imagen principal, imagen del chef/equipo y 6 a 8 fotos de galeria.
- Menu: categorias, platos, descripciones y precios.
- Politicas: reservas, cancelacion, alergias, parking.
- Metodo de contacto: formulario, WhatsApp, mail o sistema externo.

## Cambios rapidos

1. Edita primero el bloque `client`.
2. Define `language: "en"` o `language: "es"` segun el idioma del cliente.
3. Cambia `hero.image`, `experience.image`, `chef.image` y `gallery.items`.
4. Cambia `menu.categories` y `menu.items`.
5. Cambia `faq.items`, `testimonials.items` y `events.items`.
6. Si el cliente necesita algo mas especifico, recien ahi toca las secciones avanzadas.

## Formularios

El formulario de reservas soporta cuatro modos:

```js
reservationMode: "demo"
```

Muestra exito sin enviar datos. Usalo para demos.

```js
reservationMode: "form-endpoint",
formEndpoint: "https://tu-endpoint.com/form"
```

Envia `FormData` a un servicio como Formspree, Netlify Forms o backend propio.
Tambien se acepta `"form_endpoint"` como alias si llega escrito con guion bajo.

```js
reservationMode: "whatsapp",
whatsappNumber: "5491112345678"
```

Abre WhatsApp con el pedido ya armado.

```js
reservationMode: "mailto",
email: "reservas@cliente.com"
```

Abre el cliente de correo del usuario.

## Archivos SEO de produccion

Antes de publicar, ejecuta:

```powershell
npm run sync
```

Eso actualiza automaticamente:

- `robots.txt`
- `sitemap.xml`
- `site.webmanifest`
- `assets/favicon.svg`
- contenido fallback y metadatos estaticos de `index.html`
- canonical de `privacy.html`

Para este repositorio, la URL base actual es:

```text
https://viralframe2026.github.io/Aurelia-dining/
```

Si el cliente usa un dominio propio, cambia `client.url` y vuelve a ejecutar `node scripts/sync-client-assets.mjs`.

## Test final

Antes de entregar, ejecuta:

```powershell
npm run smoke
```

El test revisa nav mobile, GSAP, filtros, lightbox, privacy, SEO URL y overflow mobile.

## Regla practica

Si el cliente solo cambia contenido, imagenes, contacto, redes, menu, horarios o formularios, toca `js/site-config.js`. Si cambia layout, colores profundos o estructura visual, toca `css/style.css` e `index.html`.
