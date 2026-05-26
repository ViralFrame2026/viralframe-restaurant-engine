import fs from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

async function readConfig() {
  const source = await fs.readFile(path.join(root, "js", "site-config.js"), "utf8");
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(source, context, { filename: "site-config.js" });
  return resolveEngineConfig(context.window.RESTAURANT_TEMPLATE_CONFIG);
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function mergeDeep(target, source) {
  Object.entries(source || {}).forEach(([key, sourceValue]) => {
    const targetValue = target[key];

    if (Array.isArray(sourceValue)) {
      target[key] = sourceValue;
      return;
    }

    if (isPlainObject(sourceValue) && isPlainObject(targetValue)) {
      mergeDeep(targetValue, sourceValue);
      return;
    }

    target[key] = sourceValue;
  });

  return target;
}

async function readJsonIfExists(filePath) {
  try {
    return JSON.parse(await fs.readFile(filePath, "utf8"));
  } catch {
    return null;
  }
}

async function resolveEngineConfig(config) {
  const templateName = config.template || config.client?.template;
  const language = String(config.client?.language || config.site?.language || "en").toLowerCase();
  const templateConfig = templateName ? await readJsonIfExists(path.join(root, "templates", `${templateName}.json`)) : null;
  const languageConfig = await readJsonIfExists(path.join(root, "languages", `${language}.json`));
  return mergeDeep(mergeDeep(mergeDeep({}, templateConfig || {}), languageConfig || {}), config);
}

function ensureTrailingSlash(url) {
  return url.endsWith("/") ? url : `${url}/`;
}

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escapeAttribute(value) {
  return escapeHtml(value).replace(/"/g, "&quot;");
}

function replaceOrKeep(source, pattern, replacement) {
  return pattern.test(source) ? source.replace(pattern, () => replacement) : source;
}

function isUsableExternalUrl(value) {
  const url = String(value || "").trim();
  return /^https?:\/\//i.test(url);
}

function renderImage(image = {}, className = "", loading = "lazy", extra = "") {
  return `<img${className ? ` class="${escapeAttribute(className)}"` : ""} src="${escapeAttribute(image.src || "")}" alt="${escapeAttribute(image.alt || "")}" width="${escapeAttribute(image.width || "1200")}" height="${escapeAttribute(image.height || "800")}" loading="${loading}" decoding="async"${extra}>`;
}

function renderCta(cta = {}, className = "btn btn--gold") {
  return `<a class="${escapeAttribute(className)}" href="${escapeAttribute(cta.href || "#reservations")}">${escapeHtml(cta.label || "Reserve")}</a>`;
}

function renderCards(items, className, renderer) {
  return (items || []).map((item, index) => renderer(item, index)).join("\n");
}

function renderIndexBody(config) {
  const brand = config.brand || {};
  const fullName = brand.fullName || config.client?.name || "Restaurant";
  const descriptor = brand.descriptor || "";
  const navLinks = config.nav?.links || [];
  const socialLinks = (config.contact?.social || []).filter((link) => isUsableExternalUrl(link.url));
  const labels = config.ui?.locationLabels || {};

  const nav = navLinks.map((link) => `        <a class="nav-link" href="${escapeAttribute(link.href)}">${escapeHtml(link.label)}</a>`).join("\n");
  const menuFilters = (config.menu?.categories || []).map((category, index) => `          <button class="filter-btn${index === 0 ? " is-active" : ""}" type="button" data-filter="${escapeAttribute(category.value)}" aria-pressed="${index === 0 ? "true" : "false"}">${escapeHtml(category.label)}</button>`).join("\n");
  const menuCards = renderCards(config.menu?.items, "menu-card", (item) => `          <article class="menu-card reveal" data-category="${escapeAttribute(item.category)}">
            <div class="menu-card__top">
              <span>${escapeHtml(item.categoryLabel || item.category)}</span>
              <strong>${escapeHtml(item.price || "")}</strong>
            </div>
            <h3>${escapeHtml(item.title || "")}</h3>
            <p>${escapeHtml(item.body || "")}</p>
          </article>`);
  const menuFeatured = config.menu?.featured ? `      <article class="menu-featured reveal">
        <span class="menu-featured__eyebrow">${escapeHtml(config.menu.featured.eyebrow || "")}</span>
        <h3>${escapeHtml(config.menu.featured.title || "")}</h3>
        <p>${escapeHtml(config.menu.featured.body || "")}</p>
        <strong>${escapeHtml(config.menu.featured.meta || "")}</strong>
      </article>` : "";
  const ritualItems = renderCards(config.ritual?.items, "ritual-card", (item, index) => `        <article class="ritual-card reveal">
          <span>${String(index + 1).padStart(2, "0")}</span>
          <h3>${escapeHtml(item.title || "")}</h3>
          <p>${escapeHtml(item.body || "")}</p>
        </article>`);
  const galleryItems = renderCards(config.gallery?.items, "gallery-item", (item) => {
    const layoutClass = item.layout ? ` gallery-item--${escapeAttribute(item.layout)}` : "";
    return `          <button class="gallery-item${layoutClass} reveal" type="button" aria-label="${escapeAttribute(item.caption || item.alt || config.ui?.lightboxFallbackAlt || "Open gallery image")}" data-caption="${escapeAttribute(item.caption || item.alt || "")}" data-full="${escapeAttribute(item.full || item.src || "")}">
            ${renderImage(item, "", "lazy")}
          </button>`;
  });
  const faqItems = renderCards(config.faq?.items, "accordion-item", (item) => `          <div class="accordion-item">
            <button class="accordion-trigger" type="button" aria-expanded="false">
              ${escapeHtml(item.question || "")}
              <span aria-hidden="true"></span>
            </button>
            <div class="accordion-panel" hidden>
              <p>${escapeHtml(item.answer || "")}</p>
            </div>
          </div>`);
  const socialMarkup = socialLinks.map((link) => `        <a href="${escapeAttribute(link.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(link.label)}</a>`).join("\n");

  return `<body class="is-loading">
  <a class="skip-link" href="#home">${escapeHtml(config.ui?.skipToContent || "Skip to content")}</a>
  <div class="preloader" id="preloader" aria-label="Loading ${escapeAttribute(fullName)}">
    <div class="preloader__panel">
      <p class="preloader__eyebrow">${escapeHtml(config.preloader?.eyebrow || "")}</p>
      <span class="preloader__brand">${escapeHtml(brand.name || fullName)}</span>
      <div class="preloader__track" aria-hidden="true"><span class="preloader__bar" id="preloaderBar"></span></div>
      <span class="preloader__counter" id="preloaderCounter">0%</span>
    </div>
  </div>

  <header class="site-header" id="siteHeader">
    <nav class="nav container" aria-label="Primary navigation">
      <a class="brand" href="#home" aria-label="${escapeAttribute(`${fullName} home`)}">
        <span>${escapeHtml(brand.name || fullName)}</span>
        <small>${escapeHtml(descriptor)}</small>
      </a>
      <button class="nav-toggle" id="navToggle" type="button" aria-label="${escapeAttribute(config.ui?.navOpenLabel || "Open navigation menu")}" aria-controls="navPanel" aria-expanded="false"><span></span><span></span><span></span></button>
      <div class="nav-panel" id="navPanel">
${nav}
        ${renderCta(config.nav?.cta, "btn btn--small btn--gold")}
      </div>
    </nav>
  </header>

  <main id="home">
    <section class="hero" aria-label="${escapeAttribute(`${fullName} introduction`)}">
      ${renderImage(config.hero?.image, "hero__image", "eager", ' fetchpriority="high"')}
      <div class="hero__overlay" aria-hidden="true"></div>
      <div class="container hero__content">
        <div class="hero__copy reveal">
          <div class="hero__meta"><p class="eyebrow">${escapeHtml(config.hero?.eyebrow || "")}</p><span>${escapeHtml(config.hero?.timeNote || "")}</span></div>
          <h1>${escapeHtml(config.hero?.title || "")}</h1>
          <p class="hero__lead">${escapeHtml(config.hero?.lead || "")}</p>
          <div class="hero__actions">${renderCta(config.hero?.primaryCta)}${renderCta(config.hero?.secondaryCta, "btn btn--glass")}</div>
        </div>
        <div class="hero__reservation reveal" aria-label="Reservation preview">
          <div><span>${escapeHtml(config.hero?.reservation?.firstLabel || "")}</span><strong>${escapeHtml(config.hero?.reservation?.firstValue || "")}</strong></div>
          <div><span>${escapeHtml(config.hero?.reservation?.secondLabel || "")}</span><strong>${escapeHtml(config.hero?.reservation?.secondValue || "")}</strong></div>
          ${renderCta(config.hero?.reservation?.cta, "btn btn--small btn--gold")}
        </div>
        <div class="hero__stats reveal" aria-label="Restaurant highlights">
${(config.hero?.stats || []).map((item) => `          <div><span>${escapeHtml(item.value)}</span><strong>${escapeHtml(item.label)}</strong></div>`).join("\n")}
        </div>
        ${(config.hero?.cards || []).map((item, index) => `<div class="hero-card hero-card--${index === 0 ? "top" : "bottom"} reveal" aria-hidden="true"><span>${escapeHtml(item.label)}</span><strong>${escapeHtml(item.text)}</strong></div>`).join("\n        ")}
      </div>
    </section>

    <section class="marquee" aria-label="${escapeAttribute(`${fullName} services and highlights`)}"><div class="marquee__track">${[...(config.marquee || []), ...(config.marquee || [])].map((item) => `<span>${escapeHtml(item)}</span>`).join("")}</div></section>

    <section class="section experience" id="experience"><div class="container experience__grid">
      <div class="section-copy reveal"><p class="eyebrow">${escapeHtml(config.experience?.eyebrow || "")}</p><h2>${escapeHtml(config.experience?.title || "")}</h2><p>${escapeHtml(config.experience?.body || "")}</p></div>
      <div class="experience__visual reveal">${renderImage(config.experience?.image, "", "lazy")}<div class="experience__note"><span>${escapeHtml(config.experience?.note?.label || "")}</span><strong>${escapeHtml(config.experience?.note?.text || "")}</strong></div></div>
      <div class="feature-grid">${(config.experience?.features || []).map((item) => `<article class="feature-card reveal"><span class="feature-card__number">${escapeHtml(item.number)}</span><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.body)}</p></article>`).join("")}</div>
    </div></section>

    <section class="section ritual"><div class="container ritual__grid"><div class="section-copy reveal"><p class="eyebrow">${escapeHtml(config.ritual?.eyebrow || "")}</p><h2>${escapeHtml(config.ritual?.title || "")}</h2><p>${escapeHtml(config.ritual?.body || "")}</p></div><div class="ritual-grid">
${ritualItems}
      </div></div></section>

    <section class="section menu-section" id="menu"><div class="container">
      <div class="section-head reveal"><div><p class="eyebrow">${escapeHtml(config.menu?.eyebrow || "")}</p><h2>${escapeHtml(config.menu?.title || "")}</h2></div><p>${escapeHtml(config.menu?.body || "")}</p></div>
      <div class="menu-filters reveal" aria-label="Filter menu dishes">
${menuFilters}
      </div>
      <div class="menu-grid" id="menuGrid">
${menuCards}
      </div>
${menuFeatured}
    </div></section>

    <section class="section tasting"><div class="container tasting__grid"><div class="tasting__card reveal"><p class="eyebrow">${escapeHtml(config.tasting?.eyebrow || "")}</p><h2>${escapeHtml(config.tasting?.title || "")}</h2><p>${escapeHtml(config.tasting?.body || "")}</p><div class="tasting__price">${escapeHtml(config.tasting?.price || "")} <span>${escapeHtml(config.tasting?.priceLabel || "")}</span></div>${renderCta(config.tasting?.cta)}</div><ol class="course-list reveal">${(config.tasting?.courses || []).map((course, index) => `<li><span>${String(index + 1).padStart(2, "0")}</span> ${escapeHtml(course)}</li>`).join("")}</ol></div></section>

    <section class="section wine"><div class="container wine__grid"><div class="section-copy reveal"><p class="eyebrow">${escapeHtml(config.wine?.eyebrow || "")}</p><h2>${escapeHtml(config.wine?.title || "")}</h2><p>${escapeHtml(config.wine?.body || "")}</p>${renderCta(config.wine?.cta, "btn btn--glass")}</div><div class="pairing-grid">${(config.wine?.pairings || []).map((item) => `<article class="pairing-card reveal"><span>${escapeHtml(item.number)}</span><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.body)}</p></article>`).join("")}</div></div></section>

    <section class="section chef" id="chef"><div class="container chef__grid"><div class="chef__image reveal">${renderImage(config.chef?.image, "", "lazy")}</div><div class="section-copy reveal"><p class="eyebrow">${escapeHtml(config.chef?.eyebrow || "")}</p><h2>${escapeHtml(config.chef?.title || "")}</h2><p>${escapeHtml(config.chef?.body || "")}</p><blockquote>"${escapeHtml(config.chef?.quote || "")}"</blockquote><p class="chef__signature">${escapeHtml(config.chef?.signature || "")}</p></div></div></section>

    <section class="section gallery" id="gallery"><div class="container"><div class="section-head reveal"><div><p class="eyebrow">${escapeHtml(config.gallery?.eyebrow || "")}</p><h2>${escapeHtml(config.gallery?.title || "")}</h2></div><p>${escapeHtml(config.gallery?.body || "")}</p></div><div class="gallery-grid">
${galleryItems}
    </div></div></section>

    <section class="section testimonials"><div class="container"><div class="section-head reveal"><div><p class="eyebrow">${escapeHtml(config.testimonials?.eyebrow || "")}</p><h2>${escapeHtml(config.testimonials?.title || "")}</h2></div></div><div class="testimonial-grid">${(config.testimonials?.items || []).map((item) => `<article class="testimonial-card reveal"><div class="rating" aria-label="${escapeAttribute(config.ui?.ratingAriaLabel || "Five star rating")}">&#9733;&#9733;&#9733;&#9733;&#9733;</div><p>"${escapeHtml(item.quote)}"</p><strong>${escapeHtml(item.name)}</strong></article>`).join("")}</div></div></section>

    <section class="section private-events"><div class="container events__grid"><div class="section-copy reveal"><p class="eyebrow">${escapeHtml(config.events?.eyebrow || "")}</p><h2>${escapeHtml(config.events?.title || "")}</h2><p>${escapeHtml(config.events?.body || "")}</p>${renderCta(config.events?.cta)}</div><div class="event-list reveal" aria-label="Private event formats">${(config.events?.items || []).map((item, index) => `<div><span>${String(index + 1).padStart(2, "0")}</span> ${escapeHtml(item)}</div>`).join("")}</div></div></section>

    <section class="section reservations" id="reservations"><div class="container reservations__grid"><div class="section-copy reveal"><p class="eyebrow">${escapeHtml(config.reservations?.eyebrow || "")}</p><h2>${escapeHtml(config.reservations?.title || "")}</h2><p>${escapeHtml(config.reservations?.body || "")}</p><div class="reservation-note"><span>${escapeHtml(config.reservations?.noteLabel || "")}</span><strong>${escapeHtml(config.reservations?.noteText || config.hours?.short || "")}</strong></div></div>
      <form class="reservation-form reveal" id="reservationForm" novalidate><div class="form-grid">${["name", "email", "date", "time", "guests"].map((id) => `<div class="form-field"><label for="${id}">${escapeHtml(config.forms?.reservation?.labels?.[id] || id)}</label><input id="${id}" name="${id}" type="${id === "email" ? "email" : id === "guests" ? "number" : id}" autocomplete="${id === "name" ? "name" : id === "email" ? "email" : "off"}" aria-describedby="${id}Error" required><small class="field-error" id="${id}Error" aria-live="polite"></small></div>`).join("")}<div class="form-field form-field--full"><label for="message">${escapeHtml(config.forms?.reservation?.labels?.message || "Message")}</label><textarea id="message" name="message" rows="5" placeholder="${escapeAttribute(config.forms?.reservation?.labels?.messagePlaceholder || "")}" aria-describedby="messageError"></textarea><small class="field-error" id="messageError" aria-live="polite"></small></div></div><button class="btn btn--gold" type="submit">${escapeHtml(config.forms?.reservation?.labels?.submit || "Request")}</button><p class="form-success" id="formSuccess" role="status" aria-live="polite"></p></form>
    </div></section>

    <section class="section location"><div class="container location__grid"><div class="location-card reveal"><p class="eyebrow">${escapeHtml(config.location?.eyebrow || "")}</p><h2>${escapeHtml(config.location?.title || "")}</h2><div class="location-list"><p><strong>${escapeHtml(labels.hours || "Hours")}</strong> ${escapeHtml(config.hours?.location || "")}</p><p><strong>${escapeHtml(labels.phone || "Phone")}</strong> <a href="tel:${escapeAttribute(config.contact?.phoneHref || "")}">${escapeHtml(config.contact?.phoneDisplay || "")}</a></p><p><strong>${escapeHtml(labels.email || "Email")}</strong> <a href="mailto:${escapeAttribute(config.contact?.email || "")}">${escapeHtml(config.contact?.email || "")}</a></p></div><a class="btn btn--glass" href="mailto:${escapeAttribute(config.contact?.email || "")}">${escapeHtml(config.location?.contactCta?.label || "Contact")}</a></div><div class="map-card reveal" aria-label="Stylized map showing ${escapeAttribute(fullName)} location"><div class="map-card__grid" aria-hidden="true"></div><div class="map-card__pin" aria-hidden="true"><span></span></div><p>${escapeHtml(config.location?.mapLabel || fullName)}<br><strong>${escapeHtml(config.location?.mapSubLabel || config.contact?.district || "")}</strong></p></div></div></section>

    <section class="section faq"><div class="container faq__grid"><div class="section-copy reveal"><p class="eyebrow">${escapeHtml(config.faq?.eyebrow || "")}</p><h2>${escapeHtml(config.faq?.title || "")}</h2></div><div class="accordion reveal" id="faqAccordion">
${faqItems}
    </div></div></section>

    <section class="final-cta"><div class="container final-cta__content reveal"><p class="eyebrow">${escapeHtml(config.finalCta?.eyebrow || "")}</p><h2>${escapeHtml(config.finalCta?.title || "")}</h2>${renderCta(config.finalCta?.cta)}</div></section>
  </main>

  <footer class="site-footer"><div class="container footer__grid"><div><a class="brand footer__brand" href="#home" aria-label="${escapeAttribute(`${fullName} home`)}"><span>${escapeHtml(brand.name || fullName)}</span><small>${escapeHtml(descriptor)}</small></a><p>${escapeHtml(brand.tagline || "")}</p></div><div><h3>${escapeHtml(config.footer?.exploreTitle || "Explore")}</h3>${navLinks.slice(0, 4).map((link) => `<a href="${escapeAttribute(link.href)}">${escapeHtml(link.label)}</a>`).join("")}</div><div${socialLinks.length ? "" : " hidden"}><h3>${escapeHtml(config.footer?.socialTitle || "Social")}</h3>${socialMarkup}</div><form class="newsletter" id="newsletterForm" novalidate><h3>${escapeHtml(config.footer?.newsletterTitle || "")}</h3><label for="newsletterEmail">${escapeHtml(config.footer?.newsletterLabel || "")}</label><div class="newsletter__row"><input id="newsletterEmail" name="newsletterEmail" type="email" placeholder="${escapeAttribute(config.footer?.newsletterPlaceholder || "")}" aria-label="${escapeAttribute(config.footer?.newsletterPlaceholder || "")}"><button class="btn btn--small btn--glass" type="submit">${escapeHtml(config.footer?.newsletterButton || "")}</button></div><p id="newsletterMessage" class="newsletter__message" role="status" aria-live="polite"></p></form></div><div class="container footer__bottom"><p>&copy; <span id="currentYear"></span> ${escapeHtml(fullName)}. ${escapeHtml(config.footer?.copyrightSuffix || "")}</p><div class="footer__links"><a href="#home">${escapeHtml(config.footer?.backToTop || "Back to top")}</a><a href="privacy.html">${escapeHtml(config.footer?.privacyLink || "Privacy")}</a></div></div></footer>

  <div class="lightbox" id="lightbox" role="dialog" aria-modal="true" aria-hidden="true" aria-label="Gallery image preview" hidden><button class="lightbox__close" id="lightboxClose" type="button" aria-label="Close gallery preview">&times;</button><img id="lightboxImage" alt="" decoding="async"><p id="lightboxCaption"></p></div>
</body>`;
}

function renderThemeStyle(config) {
  const tokens = {
    "--bg": config.theme?.colors?.bg,
    "--gold": config.theme?.colors?.gold,
    "--cream": config.theme?.colors?.cream,
    "--wine": config.theme?.colors?.wine,
    "--sage": config.theme?.colors?.sage,
    "--font-heading": config.theme?.fonts?.heading,
    "--font-body": config.theme?.fonts?.body,
    "--radius": config.theme?.radius?.base,
    "--shadow": config.theme?.shadows?.base,
    "--gold-shadow": config.theme?.shadows?.accent,
    "--ease": config.theme?.motion?.ease,
    "--hero-overlay": config.theme?.overlays?.hero
  };
  const css = Object.entries(tokens)
    .filter(([, value]) => Boolean(value))
    .map(([token, value]) => `    ${token}: ${value};`)
    .join("\n");

  return `<style id="engineTheme">\n  :root {\n${css}\n  }\n</style>`;
}

async function syncHtml(config) {
  const baseUrl = ensureTrailingSlash(config.site.url);
  const brand = config.brand.fullName;
  const title = config.seo.title;
  const description = config.seo.description;
  const ogTitle = config.seo.ogTitle;
  const ogDescription = config.seo.ogDescription;
  const ogImage = config.seo.ogImage;
  const language = config.site.language || "en";
  const locale = config.site.locale || "en_US";
  const schema = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: brand,
    url: baseUrl,
    image: ogImage,
    description,
    servesCuisine: config.business.cuisine,
    priceRange: config.business.priceRange,
    telephone: config.contact.phoneHref,
    email: config.contact.email,
    acceptsReservations: true,
    sameAs: config.contact.social.map((item) => item.url).filter(isUsableExternalUrl),
    address: {
      "@type": "PostalAddress",
      streetAddress: config.contact.addressLine,
      addressLocality: config.contact.city || config.contact.district,
      addressRegion: config.contact.region,
      addressCountry: config.contact.country
    },
    openingHoursSpecification: config.hours.schema.map((item) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: item.dayOfWeek,
      opens: item.opens,
      closes: item.closes
    }))
  };

  const indexPath = path.join(root, "index.html");
  let index = await fs.readFile(indexPath, "utf8");
  index = replaceOrKeep(index, /<html lang="[^"]*">/, `<html lang="${escapeAttribute(language)}">`);
  index = replaceOrKeep(index, /<title>.*?<\/title>/, `<title>${escapeHtml(title)}</title>`);
  index = replaceOrKeep(index, /<meta name="description" content="[^"]*">/, `<meta name="description" content="${escapeAttribute(description)}">`);
  index = replaceOrKeep(index, /<meta name="theme-color" content="[^"]*">/, `<meta name="theme-color" content="${escapeAttribute(config.site.themeColor)}">`);
  index = replaceOrKeep(index, /<link rel="canonical" href="[^"]*">/, `<link rel="canonical" href="${baseUrl}">`);
  index = replaceOrKeep(index, /<link rel="icon" href="[^"]*">/, `<link rel="icon" href="assets/favicon.svg">`);
  index = replaceOrKeep(index, /<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${escapeAttribute(ogTitle)}">`);
  index = replaceOrKeep(index, /<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${escapeAttribute(ogDescription)}">`);
  index = replaceOrKeep(index, /<meta property="og:site_name" content="[^"]*">/, `<meta property="og:site_name" content="${escapeAttribute(brand)}">`);
  index = replaceOrKeep(index, /<meta property="og:locale" content="[^"]*">/, `<meta property="og:locale" content="${escapeAttribute(locale)}">`);
  index = replaceOrKeep(index, /<meta property="og:image" content="[^"]*">/, `<meta property="og:image" content="${ogImage.replace(/&/g, "&amp;")}">`);
  index = replaceOrKeep(index, /<meta property="og:url" content="[^"]*">/, `<meta property="og:url" content="${baseUrl}">`);
  index = replaceOrKeep(index, /<meta name="twitter:title" content="[^"]*">/, `<meta name="twitter:title" content="${escapeAttribute(ogTitle)}">`);
  index = replaceOrKeep(index, /<meta name="twitter:description" content="[^"]*">/, `<meta name="twitter:description" content="${escapeAttribute(ogDescription)}">`);
  index = replaceOrKeep(index, /<meta name="twitter:image" content="[^"]*">/, `<meta name="twitter:image" content="${ogImage.replace(/&/g, "&amp;")}">`);
  if (/<style id="engineTheme">[\s\S]*?<\/style>/.test(index)) {
    index = replaceOrKeep(index, /<style id="engineTheme">[\s\S]*?<\/style>/, renderThemeStyle(config));
  } else {
    index = index.replace("</head>", `  ${renderThemeStyle(config)}\n</head>`);
  }
  index = replaceOrKeep(
    index,
    /<script id="restaurantSchema" type="application\/ld\+json">[\s\S]*?<\/script>/,
    `<script id="restaurantSchema" type="application/ld+json">\n${JSON.stringify(schema, null, 2).split("\n").map((line) => `    ${line}`).join("\n")}\n  </script>`
  );
  index = replaceOrKeep(index, /<body[\s\S]*<\/body>/, renderIndexBody(config));
  await fs.writeFile(indexPath, index);

  const privacyPath = path.join(root, "privacy.html");
  const privacyConfig = config.privacy || {};
  const privacyTitle = `${privacyConfig.title || "Privacy Policy"} | ${brand}`;
  const privacySections = (privacyConfig.sections || []).map((section) => `        <h2>${escapeHtml(section.title)}</h2>
        <p>${escapeHtml(section.body)}</p>`).join("\n\n");
  const privacy = `<!DOCTYPE html>
<html lang="${escapeAttribute(language)}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(privacyTitle)}</title>
  <meta name="description" content="${escapeAttribute(privacyConfig.description || `Privacy policy for ${brand} reservation and newsletter requests.`)}">
  <meta name="robots" content="${escapeAttribute(config.seo.robots || "index, follow")}">
  <meta name="theme-color" content="${escapeAttribute(config.site.themeColor)}">
  <link rel="canonical" href="${baseUrl}privacy.html">
  <link rel="icon" href="assets/favicon.svg">
  <link rel="manifest" href="site.webmanifest">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <header class="site-header is-scrolled" id="siteHeader">
    <nav class="nav container" aria-label="${escapeAttribute(privacyConfig.navLabel || "Privacy navigation")}">
      <a class="brand" href="index.html#home" aria-label="${escapeAttribute(`${brand} home`)}">
        <span>${escapeHtml(config.brand.name)}</span>
        <small>${escapeHtml(config.brand.descriptor)}</small>
      </a>
      <div class="nav-panel nav-panel--privacy" id="navPanel">
        <a class="nav-link" href="index.html#menu">${escapeHtml(privacyConfig.menuLink || "Menu")}</a>
        <a class="nav-link" href="index.html#gallery">${escapeHtml(privacyConfig.galleryLink || "Gallery")}</a>
        <a class="btn btn--small btn--gold" href="index.html#reservations">${escapeHtml(privacyConfig.reserveCta || "Reserve a Table")}</a>
      </div>
    </nav>
  </header>

  <main class="policy-page">
    <section class="section">
      <div class="container policy-content">
        <p class="eyebrow">${escapeHtml(privacyConfig.eyebrow || "Privacy")}</p>
        <h1>${escapeHtml(privacyConfig.title || "Privacy Policy")}</h1>
        <p>${escapeHtml(privacyConfig.intro || "")}</p>

${privacySections}

        <a class="btn btn--gold" href="index.html#home">${escapeHtml(privacyConfig.backCta || "Back to Site")}</a>
      </div>
    </section>
  </main>
  <script src="js/site-config.js"></script>
  <script src="js/main.js"></script>
</body>
</html>
`;
  await fs.writeFile(privacyPath, privacy);
}

async function syncRobots(config) {
  const baseUrl = ensureTrailingSlash(config.site.url);
  await fs.writeFile(
    path.join(root, "robots.txt"),
    `User-agent: *\nAllow: /\n\nSitemap: ${baseUrl}sitemap.xml\n`
  );
}

async function syncSitemap(config) {
  const baseUrl = ensureTrailingSlash(config.site.url);
  const today = new Date().toISOString().slice(0, 10);
  const urls = ["", "privacy.html"].map((pathPart) => `  <url>
    <loc>${escapeXml(`${baseUrl}${pathPart}`)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${pathPart ? "0.3" : "1.0"}</priority>
  </url>`).join("\n");

  await fs.writeFile(
    path.join(root, "sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
  );
}

async function syncManifest(config) {
  const manifest = {
    name: config.brand.fullName,
    short_name: config.brand.name,
    description: config.client.tagline || config.seo.description,
    start_url: "./",
    display: "standalone",
    background_color: config.theme.colors.bg,
    theme_color: config.site.themeColor,
    icons: [
      {
        src: "assets/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any maskable"
      }
    ]
  };

  await fs.writeFile(path.join(root, "site.webmanifest"), `${JSON.stringify(manifest, null, 2)}\n`);
}

async function syncFavicon(config) {
  const initial = (config.brand.name.charAt(0).toUpperCase() || "R").replace(/[^A-Z0-9]/i, "R");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="12" fill="${config.theme.colors.bg}"/>
  <text x="32" y="42" text-anchor="middle" font-family="Georgia, serif" font-size="34" fill="${config.theme.colors.gold}">${initial}</text>
</svg>
`;

  await fs.mkdir(path.join(root, "assets"), { recursive: true });
  await fs.writeFile(path.join(root, "assets", "favicon.svg"), svg);
}

const config = await readConfig();
await syncHtml(config);
await syncRobots(config);
await syncSitemap(config);
await syncManifest(config);
await syncFavicon(config);

console.log(`Synced production assets for ${config.brand.fullName}`);
