# Kaze Omakase / Restaurant Engine V2

Static multi-template restaurant engine for premium hospitality websites. The current root demo is **Kaze Omakase**, powered by the `omakase` template.

The project stays framework-free: semantic HTML, CSS variables, vanilla JavaScript, JSON templates, and simple Node scripts for sync/validation.

## Structure

```text
.
|-- index.html
|-- privacy.html
|-- js/
|   |-- site-config.js
|   |-- main.js
|   `-- vendor/gsap.min.js
|-- css/style.css
|-- templates/
|   |-- fine-dining.json
|   |-- omakase.json
|   |-- steakhouse.json
|   `-- italian.json
|-- languages/
|   |-- en.json
|   `-- es.json
|-- scripts/
|   |-- sync-client-assets.mjs
|   |-- validate-engine.mjs
|   `-- template-info.mjs
|-- tests/smoke.mjs
|-- showcase/
|   |-- kaze-omakase/
|   `-- aurelia-dining/
|-- package.json
`-- README.md
```

## Create A New Client

Edit [js/site-config.js](js/site-config.js):

```js
template: "omakase",

client: {
  name: "Client Name",
  language: "en",
  tagline: "Premium Restaurant",
  url: "https://example.com/",
  seoDescription: "Short search and social description.",
  cuisine: ["Japanese", "Omakase"],
  phone: "+1 212 555 0100",
  email: "reservations@example.com",
  address: "Street Address",
  city: "City",
  hours: "Tue to Sat, 6:00 PM to late",
  instagram: "#",
  facebook: "#",
  tiktok: "#",
  reservationMode: "demo"
}
```

Then update the advanced content blocks as needed: `hero`, `menu`, `gallery`, `faq`, `testimonials`, `events`, `privacy`, and `theme`.

## Create A New Template

Add a JSON file in `templates/`. A template can define mood, fonts, colors, overlays, imagery, labels, hero style, spacing, cards, buttons, section labels, menu defaults, FAQ defaults, and SEO defaults.

Use it from `site-config.js`:

```js
template: "steakhouse"
```

## Change Language

Set:

```js
client: {
  language: "es"
}
```

Reusable UI copy comes from `languages/en.json` or `languages/es.json`. Client-specific copy should still be written in the chosen language.

## Sync Static Output

Run after config/template changes:

```powershell
npm run sync
```

This regenerates:

- `index.html` fallback content
- SEO and social tags
- JSON-LD
- `privacy.html`
- `robots.txt`
- `sitemap.xml`
- `site.webmanifest`
- `assets/favicon.svg`

## Local Preview

```powershell
npm run dev
```

## Validate

```powershell
npm run validate
npm run smoke
```

The smoke test validates nav, filters, FAQ, forms basics, social links, language, gallery, privacy page, and mobile overflow.

## Deploy

Deploy the repository root as a static site. GitHub Pages can serve the project directly with no build output required.
