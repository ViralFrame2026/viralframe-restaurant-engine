const qs = (selector, scope = document) => scope.querySelector(selector);
const qsa = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const LANGUAGE_STORAGE_KEY = "restaurantEngineLanguage";
const SUPPORTED_LANGUAGES = ["en", "es"];
let engineBaseConfig = null;
const engineLanguagePacks = {};

function getTemplateConfig() {
  return window.RESTAURANT_TEMPLATE_CONFIG || {};
}

function getConfigValue(path, fallback = "") {
  const value = path.split(".").reduce((current, key) => {
    if (!current || !Object.prototype.hasOwnProperty.call(current, key)) return undefined;
    return current[key];
  }, getTemplateConfig());

  return value === undefined || value === null ? fallback : value;
}

function getConfigArray(path) {
  const value = getConfigValue(path, []);
  return Array.isArray(value) ? value : [];
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function mergeDeep(target, source) {
  Object.entries(source || {}).forEach(([key, sourceValue]) => {
    const targetValue = target[key];

    if (Array.isArray(sourceValue)) {
      if (
        Array.isArray(targetValue) &&
        targetValue.every(isPlainObject) &&
        sourceValue.every(isPlainObject)
      ) {
        target[key] = targetValue.map((item, index) => (
          sourceValue[index] ? mergeDeep({ ...item }, sourceValue[index]) : item
        ));
        sourceValue.slice(targetValue.length).forEach((item) => {
          target[key].push(isPlainObject(item) ? mergeDeep({}, item) : item);
        });
      } else {
        target[key] = sourceValue.map((item) => (isPlainObject(item) ? mergeDeep({}, item) : item));
      }
      return;
    }

    if (isPlainObject(sourceValue) && isPlainObject(targetValue)) {
      mergeDeep(targetValue, sourceValue);
      return;
    }

    target[key] = isPlainObject(sourceValue) ? mergeDeep({}, sourceValue) : sourceValue;
  });

  return target;
}

async function fetchJson(path) {
  try {
    const response = await fetch(path, { cache: "no-cache" });
    if (!response.ok) return null;
    return response.json();
  } catch {
    return null;
  }
}

function normalizeLanguage(language) {
  const value = String(language || "").toLowerCase();
  return SUPPORTED_LANGUAGES.includes(value) ? value : "en";
}

function getStoredLanguage() {
  try {
    const value = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return value && SUPPORTED_LANGUAGES.includes(value) ? value : "";
  } catch {
    return "";
  }
}

async function getLanguagePack(language) {
  const selectedLanguage = normalizeLanguage(language);
  if (!engineLanguagePacks[selectedLanguage]) {
    engineLanguagePacks[selectedLanguage] = await fetchJson(`languages/${selectedLanguage}.json`) || {};
  }
  return engineLanguagePacks[selectedLanguage];
}

async function setEngineLanguage(language, options = {}) {
  const selectedLanguage = normalizeLanguage(language);
  const { persist = true, render = true } = options;
  const baseConfig = engineBaseConfig || window.RESTAURANT_ENGINE_BASE_CONFIG || window.RESTAURANT_TEMPLATE_CONFIG || {};
  const languageConfig = await getLanguagePack(selectedLanguage);
  const languageOverrides = baseConfig.translations?.[selectedLanguage] || {};

  window.RESTAURANT_TEMPLATE_CONFIG = mergeDeep(
    mergeDeep(mergeDeep({}, baseConfig), languageConfig),
    languageOverrides
  );
  window.RESTAURANT_TEMPLATE_CONFIG.client ||= {};
  window.RESTAURANT_TEMPLATE_CONFIG.site ||= {};
  window.RESTAURANT_TEMPLATE_CONFIG.client.language = selectedLanguage;
  window.RESTAURANT_TEMPLATE_CONFIG.site.language = selectedLanguage;
  window.RESTAURANT_TEMPLATE_CONFIG.site.locale = selectedLanguage === "es" ? "es_ES" : "en_US";

  if (persist) {
    try {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, selectedLanguage);
    } catch {
      // Local storage can be unavailable in private contexts; the UI still switches for this session.
    }
  }

  if (render) {
    initTemplateConfig();
    refreshDynamicInteractions();
  }
}

async function prepareEngineConfig() {
  const baseConfig = window.RESTAURANT_TEMPLATE_CONFIG || {};
  const templateName = baseConfig.template || baseConfig.client?.template;
  const defaultLanguage = normalizeLanguage(baseConfig.client?.language || baseConfig.site?.language || "en");
  const language = getStoredLanguage() || defaultLanguage;
  const templateConfig = templateName ? await fetchJson(`templates/${templateName}.json`) : null;

  engineBaseConfig = mergeDeep(mergeDeep({}, templateConfig || {}), baseConfig);
  window.RESTAURANT_ENGINE_BASE_CONFIG = engineBaseConfig;
  await setEngineLanguage(language, { persist: Boolean(getStoredLanguage()), render: false });
}

function createElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined && text !== null) element.textContent = text;
  return element;
}

function clearElement(element) {
  if (!element) return;
  while (element.firstChild) element.removeChild(element.firstChild);
}

function setText(selector, value, scope = document) {
  const element = qs(selector, scope);
  if (element && value !== undefined && value !== null) element.textContent = value;
}

function setAllText(selector, value, scope = document) {
  if (value === undefined || value === null) return;
  qsa(selector, scope).forEach((element) => {
    element.textContent = value;
  });
}

function setAttribute(selector, attribute, value, scope = document) {
  const element = qs(selector, scope);
  if (!element || value === undefined || value === null || value === "") return;
  element.setAttribute(attribute, value);
}

function setMeta(selector, value) {
  setAttribute(selector, "content", value);
}

function setCta(selector, cta, scope = document) {
  const element = qs(selector, scope);
  if (!element || !cta) return;

  if (cta.label) element.textContent = cta.label;
  if (cta.href) element.setAttribute("href", cta.href);
}

function setImage(selector, image, scope = document) {
  const element = qs(selector, scope);
  if (!element || !image) return;

  ["src", "alt", "width", "height"].forEach((attribute) => {
    if (image[attribute]) element.setAttribute(attribute, image[attribute]);
  });
}

function numberLabel(index) {
  return String(index + 1).padStart(2, "0");
}

function appendLineBreakText(parent, text) {
  String(text || "").split("\n").forEach((line, index) => {
    if (index) parent.appendChild(document.createElement("br"));
    parent.append(document.createTextNode(line));
  });
}

function isUsableExternalUrl(value) {
  const url = String(value || "").trim();
  return /^https?:\/\//i.test(url);
}

function normalizeSubmitMode(mode) {
  return String(mode || "demo").trim().replace("_", "-").toLowerCase();
}

function buildReservationMessage(form) {
  const data = new FormData(form);
  const labels = getConfigValue("forms.reservation.messageLabels", {});
  const lines = [
    `${labels.intro || "Reservation request for"} ${data.get("name") || ""}`,
    `${labels.email || "Email"}: ${data.get("email") || ""}`,
    `${labels.date || "Date"}: ${data.get("date") || ""}`,
    `${labels.time || "Time"}: ${data.get("time") || ""}`,
    `${labels.guests || "Guests"}: ${data.get("guests") || ""}`
  ];

  const message = String(data.get("message") || "").trim();
  if (message) lines.push(`${labels.message || "Message"}: ${message}`);

  return lines.join("\n");
}

function applyTemplateSeo() {
  const brandName = getConfigValue("brand.name", "Restaurant");
  const fullName = getConfigValue("brand.fullName", brandName);
  const siteUrl = getConfigValue("site.url", window.location.href);
  const themeColor = getConfigValue("site.themeColor", "#050505");
  const ogImage = getConfigValue("seo.ogImage", "");

  document.documentElement.lang = getConfigValue("site.language", "en");
  document.title = getConfigValue("seo.title", document.title);
  setMeta('meta[name="description"]', getConfigValue("seo.description"));
  setMeta('meta[name="robots"]', getConfigValue("seo.robots", "index, follow"));
  setMeta('meta[name="theme-color"]', themeColor);
  setAttribute('link[rel="canonical"]', "href", siteUrl);
  setMeta('meta[property="og:title"]', getConfigValue("seo.ogTitle", fullName));
  setMeta('meta[property="og:description"]', getConfigValue("seo.ogDescription", getConfigValue("seo.description")));
  setMeta('meta[property="og:site_name"]', fullName);
  setMeta('meta[property="og:locale"]', getConfigValue("site.locale", "en_US"));
  setMeta('meta[property="og:image"]', ogImage);
  setMeta('meta[property="og:image:width"]', getConfigValue("seo.ogImageWidth", "1600"));
  setMeta('meta[property="og:image:height"]', getConfigValue("seo.ogImageHeight", "1067"));
  setMeta('meta[property="og:url"]', siteUrl);
  setMeta('meta[name="twitter:title"]', getConfigValue("seo.ogTitle", fullName));
  setMeta('meta[name="twitter:description"]', getConfigValue("seo.ogDescription", getConfigValue("seo.description")));
  setMeta('meta[name="twitter:image"]', ogImage);

  const initial = (brandName.charAt(0).toUpperCase() || "R").replace(/[^A-Z0-9]/i, "R");
  const bg = themeColor;
  const gold = getConfigValue("theme.colors.gold", "#D6B46A");
  const iconSvg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><rect width='64' height='64' rx='12' fill='${bg}'/><text x='32' y='42' text-anchor='middle' font-family='Georgia,serif' font-size='34' fill='${gold}'>${initial}</text></svg>`;
  setAttribute('link[rel="icon"]', "href", `data:image/svg+xml,${encodeURIComponent(iconSvg)}`);

  const schema = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: fullName,
    url: siteUrl,
    image: ogImage,
    description: getConfigValue("seo.description"),
    servesCuisine: getConfigArray("business.cuisine").length ? getConfigArray("business.cuisine") : ["Modern American", "Fine Dining"],
    priceRange: getConfigValue("business.priceRange", "$$$"),
    telephone: getConfigValue("contact.phoneHref"),
    email: getConfigValue("contact.email"),
    acceptsReservations: true,
    sameAs: getConfigArray("contact.social").map((item) => item.url).filter(isUsableExternalUrl),
    address: {
      "@type": "PostalAddress",
      streetAddress: getConfigValue("contact.addressLine"),
      addressLocality: getConfigValue("contact.city", getConfigValue("contact.district")),
      addressRegion: getConfigValue("contact.region"),
      addressCountry: getConfigValue("contact.country")
    },
    openingHoursSpecification: getConfigArray("hours.schema").map((item) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: item.dayOfWeek,
      opens: item.opens,
      closes: item.closes
    }))
  };

  const schemaScript = qs("#restaurantSchema") || qs('script[type="application/ld+json"]');
  if (schemaScript) schemaScript.textContent = JSON.stringify(schema, null, 2);
}

function applyTemplateTheme() {
  const themeTokens = {
    "theme.colors.bg": "--bg",
    "theme.colors.gold": "--gold",
    "theme.colors.cream": "--cream",
    "theme.colors.wine": "--wine",
    "theme.colors.sage": "--sage",
    "theme.fonts.heading": "--font-heading",
    "theme.fonts.body": "--font-body",
    "theme.radius.base": "--radius",
    "theme.shadows.base": "--shadow",
    "theme.shadows.accent": "--gold-shadow",
    "theme.motion.ease": "--ease",
    "theme.overlays.hero": "--hero-overlay"
  };

  Object.entries(themeTokens).forEach(([path, token]) => {
    const value = getConfigValue(path, "");
    if (value) document.documentElement.style.setProperty(token, value);
  });
}

function applyTemplateBranding() {
  const brandName = getConfigValue("brand.name", "Restaurant");
  const descriptor = getConfigValue("brand.descriptor", "");
  const fullName = getConfigValue("brand.fullName", `${brandName} ${descriptor}`.trim());

  qsa(".brand").forEach((brand) => {
    setText("span", brandName, brand);
    setText("small", descriptor, brand);
    brand.setAttribute("aria-label", `${fullName} home`);
  });

  setText(".preloader__eyebrow", getConfigValue("preloader.eyebrow"));
  setText(".preloader__brand", brandName);
  setAttribute("#preloader", "aria-label", `Loading ${fullName}`);
}

function applyTemplateNav() {
  const panel = qs("#navPanel");
  if (!panel) return;

  clearElement(panel);
  if (panel.classList.contains("nav-panel--privacy")) {
    [
      { label: getConfigValue("privacy.menuLink", "Menu"), href: "index.html#menu" },
      { label: getConfigValue("privacy.galleryLink", "Gallery"), href: "index.html#gallery" }
    ].forEach((link) => {
      const anchor = createElement("a", "nav-link", link.label);
      anchor.href = link.href;
      panel.appendChild(anchor);
    });

    const privacyCta = createElement("a", "btn btn--small btn--gold", getConfigValue("privacy.reserveCta", "Reserve"));
    privacyCta.href = "index.html#reservations";
    panel.appendChild(privacyCta);
  } else {
    getConfigArray("nav.links").forEach((link) => {
      const anchor = createElement("a", "nav-link", link.label);
      anchor.href = link.href || "#";
      panel.appendChild(anchor);
    });

    const cta = getConfigValue("nav.cta", null);
    if (cta) {
      const anchor = createElement("a", "btn btn--small btn--gold", cta.label);
      anchor.href = cta.href || "#reservations";
      panel.appendChild(anchor);
    }
  }

  const switcher = createElement("div", "language-switcher");
  switcher.setAttribute("aria-label", getConfigValue("ui.languageSwitcherLabel", "Language selector"));
  SUPPORTED_LANGUAGES.forEach((language) => {
    const button = createElement("button", "language-switcher__btn", language.toUpperCase());
    const isActive = getConfigValue("site.language", "en") === language;
    const languageName = getConfigValue(`ui.languageNames.${language}`, language.toUpperCase());
    button.type = "button";
    button.dataset.language = language;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
    button.setAttribute("aria-label", languageName);
    button.title = languageName;
    button.addEventListener("click", async () => {
      await setEngineLanguage(language);
    });
    switcher.appendChild(button);
  });
  panel.appendChild(switcher);
}

function applyPrivacyPage() {
  const policyContent = qs(".policy-content");
  if (!policyContent) return;

  const siteUrl = getConfigValue("site.url", window.location.href).replace(/\/?$/, "/");
  const privacyUrl = `${siteUrl}privacy.html`;
  document.title = `${getConfigValue("privacy.title", "Privacy Policy")} | ${getConfigValue("brand.fullName", "Restaurant")}`;
  setMeta('meta[name="description"]', getConfigValue("privacy.description"));
  setAttribute('link[rel="canonical"]', "href", privacyUrl);
  setMeta('meta[property="og:title"]', document.title);
  setMeta('meta[property="og:description"]', getConfigValue("privacy.description"));
  setMeta('meta[property="og:url"]', privacyUrl);
  setAttribute("nav.nav", "aria-label", getConfigValue("privacy.navLabel", "Privacy navigation"));
  setText(".eyebrow", getConfigValue("privacy.eyebrow", "Privacy"), policyContent);
  setText("h1", getConfigValue("privacy.title", "Privacy Policy"), policyContent);

  const intro = qs("h1 + p", policyContent);
  if (intro) intro.textContent = getConfigValue("privacy.intro", "");

  qsa("h2", policyContent).forEach((heading) => heading.remove());
  qsa("h1 + p ~ p", policyContent).forEach((paragraph) => {
    if (!paragraph.closest("a")) paragraph.remove();
  });

  const backCta = qs(".policy-content > .btn", policyContent);
  getConfigArray("privacy.sections").forEach((section) => {
    const heading = createElement("h2", "", section.title);
    const body = createElement("p", "", section.body);
    policyContent.insertBefore(heading, backCta);
    policyContent.insertBefore(body, backCta);
  });

  if (backCta) backCta.textContent = getConfigValue("privacy.backCta", "Back to Site");
}

function applyTemplateHero() {
  setAttribute(".hero", "aria-label", `${getConfigValue("brand.fullName", "Restaurant")} introduction`);
  setImage(".hero__image", getConfigValue("hero.image", null));
  setText(".hero__meta .eyebrow", getConfigValue("hero.eyebrow"));
  setText(".hero__meta span", getConfigValue("hero.timeNote"));
  setText(".hero h1", getConfigValue("hero.title"));
  setText(".hero__lead", getConfigValue("hero.lead"));
  setCta(".hero__actions .btn--gold", getConfigValue("hero.primaryCta", null));
  setCta(".hero__actions .btn--glass", getConfigValue("hero.secondaryCta", null));

  setText(".hero__reservation div:nth-child(1) span", getConfigValue("hero.reservation.firstLabel"));
  setText(".hero__reservation div:nth-child(1) strong", getConfigValue("hero.reservation.firstValue"));
  setText(".hero__reservation div:nth-child(2) span", getConfigValue("hero.reservation.secondLabel"));
  setText(".hero__reservation div:nth-child(2) strong", getConfigValue("hero.reservation.secondValue"));
  setCta(".hero__reservation .btn", getConfigValue("hero.reservation.cta", null));

  const stats = qs(".hero__stats");
  if (stats) {
    clearElement(stats);
    getConfigArray("hero.stats").forEach((item) => {
      const card = createElement("div");
      card.appendChild(createElement("span", "", item.value));
      card.appendChild(createElement("strong", "", item.label));
      stats.appendChild(card);
    });
  }

  qsa(".hero-card").forEach((card, index) => {
    const item = getConfigArray("hero.cards")[index];
    if (!item) return;
    setText("span", item.label, card);
    setText("strong", item.text, card);
  });
}

function applyTemplateMarquee() {
  const track = qs(".marquee__track");
  const items = getConfigArray("marquee");
  if (!track || !items.length) return;

  setAttribute(".marquee", "aria-label", `${getConfigValue("brand.fullName", "Restaurant")} services and highlights`);
  clearElement(track);
  [...items, ...items].forEach((item) => {
    track.appendChild(createElement("span", "", item));
  });
}

function applyTemplateExperience() {
  const section = qs(".experience");
  if (!section) return;

  setText(".section-copy .eyebrow", getConfigValue("experience.eyebrow"), section);
  setText(".section-copy h2", getConfigValue("experience.title"), section);
  setText(".section-copy p:nth-of-type(2)", getConfigValue("experience.body"), section);
  setImage(".experience__visual img", getConfigValue("experience.image", null), section);
  setText(".experience__note span", getConfigValue("experience.note.label"), section);
  setText(".experience__note strong", getConfigValue("experience.note.text"), section);

  const grid = qs(".feature-grid", section);
  if (!grid) return;
  clearElement(grid);
  getConfigArray("experience.features").forEach((item) => {
    const article = createElement("article", "feature-card reveal");
    article.appendChild(createElement("span", "feature-card__number", item.number));
    article.appendChild(createElement("h3", "", item.title));
    article.appendChild(createElement("p", "", item.body));
    grid.appendChild(article);
  });
}

function applyTemplateRitual() {
  const section = qs(".ritual");
  if (!section) return;

  setText(".section-copy .eyebrow", getConfigValue("ritual.eyebrow"), section);
  setText(".section-copy h2", getConfigValue("ritual.title"), section);
  setText(".section-copy p:nth-of-type(2)", getConfigValue("ritual.body"), section);

  const grid = qs(".ritual-grid", section);
  if (!grid) return;
  clearElement(grid);
  getConfigArray("ritual.items").forEach((item, index) => {
    const article = createElement("article", "ritual-card reveal");
    article.appendChild(createElement("span", "", numberLabel(index)));
    article.appendChild(createElement("h3", "", item.title));
    article.appendChild(createElement("p", "", item.body));
    grid.appendChild(article);
  });
}

function applyTemplateMenu() {
  const section = qs("#menu");
  if (!section) return;

  setText(".section-head .eyebrow", getConfigValue("menu.eyebrow"), section);
  setText(".section-head h2", getConfigValue("menu.title"), section);
  setText(".section-head > p", getConfigValue("menu.body"), section);

  const filters = qs(".menu-filters", section);
  if (filters) {
    clearElement(filters);
    getConfigArray("menu.categories").forEach((category, index) => {
      const button = createElement("button", `filter-btn${index === 0 ? " is-active" : ""}`, category.label);
      button.type = "button";
      button.dataset.filter = category.value;
      button.setAttribute("aria-pressed", String(index === 0));
      filters.appendChild(button);
    });
  }

  const grid = qs("#menuGrid", section);
  if (!grid) return;
  clearElement(grid);
  getConfigArray("menu.items").forEach((item) => {
    const article = createElement("article", "menu-card reveal");
    article.dataset.category = item.category;

    const top = createElement("div", "menu-card__top");
    top.appendChild(createElement("span", "", item.categoryLabel || item.category));
    top.appendChild(createElement("strong", "", item.price));
    article.appendChild(top);
    article.appendChild(createElement("h3", "", item.title));
    article.appendChild(createElement("p", "", item.body));
    grid.appendChild(article);
  });

  const featured = getConfigValue("menu.featured", null);
  let featuredBlock = qs(".menu-featured", section);
  if (!featured) {
    if (featuredBlock) featuredBlock.remove();
    return;
  }

  if (!featuredBlock) {
    featuredBlock = createElement("article", "menu-featured reveal");
    grid.insertAdjacentElement("afterend", featuredBlock);
  }

  clearElement(featuredBlock);
  featuredBlock.appendChild(createElement("span", "menu-featured__eyebrow", featured.eyebrow));
  featuredBlock.appendChild(createElement("h3", "", featured.title));
  featuredBlock.appendChild(createElement("p", "", featured.body));
  featuredBlock.appendChild(createElement("strong", "", featured.meta));
}

function applyTemplateTasting() {
  const section = qs(".tasting");
  if (!section) return;

  setText(".tasting__card .eyebrow", getConfigValue("tasting.eyebrow"), section);
  setText(".tasting__card h2", getConfigValue("tasting.title"), section);
  setText(".tasting__card p:not(.eyebrow)", getConfigValue("tasting.body"), section);
  setCta(".tasting__card .btn", getConfigValue("tasting.cta", null), section);

  const price = qs(".tasting__price", section);
  if (price) {
    clearElement(price);
    price.append(document.createTextNode(getConfigValue("tasting.price")));
    price.appendChild(createElement("span", "", getConfigValue("tasting.priceLabel")));
  }

  const courses = qs(".course-list", section);
  if (!courses) return;
  clearElement(courses);
  getConfigArray("tasting.courses").forEach((course, index) => {
    const item = createElement("li");
    item.appendChild(createElement("span", "", numberLabel(index)));
    item.append(document.createTextNode(` ${course}`));
    courses.appendChild(item);
  });
}

function applyTemplateWine() {
  const section = qs(".wine");
  if (!section) return;

  setText(".section-copy .eyebrow", getConfigValue("wine.eyebrow"), section);
  setText(".section-copy h2", getConfigValue("wine.title"), section);
  setText(".section-copy p:nth-of-type(2)", getConfigValue("wine.body"), section);
  setCta(".section-copy .btn", getConfigValue("wine.cta", null), section);

  const grid = qs(".pairing-grid", section);
  if (!grid) return;
  clearElement(grid);
  getConfigArray("wine.pairings").forEach((item) => {
    const article = createElement("article", "pairing-card reveal");
    article.appendChild(createElement("span", "", item.number));
    article.appendChild(createElement("h3", "", item.title));
    article.appendChild(createElement("p", "", item.body));
    grid.appendChild(article);
  });
}

function applyTemplateChef() {
  const section = qs(".chef");
  if (!section) return;

  setImage(".chef__image img", getConfigValue("chef.image", null), section);
  setText(".section-copy .eyebrow", getConfigValue("chef.eyebrow"), section);
  setText(".section-copy h2", getConfigValue("chef.title"), section);
  setText(".section-copy p:nth-of-type(2)", getConfigValue("chef.body"), section);
  setText("blockquote", `"${getConfigValue("chef.quote")}"`, section);
  setText(".chef__signature", getConfigValue("chef.signature"), section);
}

function applyTemplateGallery() {
  const section = qs("#gallery");
  if (!section) return;

  setText(".section-head .eyebrow", getConfigValue("gallery.eyebrow"), section);
  setText(".section-head h2", getConfigValue("gallery.title"), section);
  setText(".section-head > p", getConfigValue("gallery.body"), section);

  const grid = qs(".gallery-grid", section);
  if (!grid) return;
  clearElement(grid);
  getConfigArray("gallery.items").forEach((item) => {
    const layoutClass = item.layout ? ` gallery-item--${item.layout}` : "";
    const button = createElement("button", `gallery-item${layoutClass} reveal`);
    button.type = "button";
    button.dataset.caption = item.caption || item.alt || "";
    button.setAttribute("aria-label", item.caption || item.alt || getConfigValue("ui.lightboxFallbackAlt", "Open gallery image"));
    if (item.full) button.dataset.full = item.full;

    const image = createElement("img");
    ["src", "alt", "width", "height"].forEach((attribute) => {
      if (item[attribute]) image.setAttribute(attribute, item[attribute]);
    });
    image.loading = "lazy";
    image.decoding = "async";
    button.appendChild(image);
    grid.appendChild(button);
  });
}

function applyTemplateTestimonials() {
  const section = qs(".testimonials");
  if (!section) return;

  setText(".section-head .eyebrow", getConfigValue("testimonials.eyebrow"), section);
  setText(".section-head h2", getConfigValue("testimonials.title"), section);

  const grid = qs(".testimonial-grid", section);
  if (!grid) return;
  clearElement(grid);
  getConfigArray("testimonials.items").forEach((item) => {
    const article = createElement("article", "testimonial-card reveal");
    article.appendChild(createElement("div", "rating", "\u2605\u2605\u2605\u2605\u2605"));
    article.lastChild.setAttribute("aria-label", getConfigValue("ui.ratingAriaLabel", "Five star rating"));
    article.appendChild(createElement("p", "", `"${item.quote}"`));
    article.appendChild(createElement("strong", "", item.name));
    grid.appendChild(article);
  });
}

function applyTemplateEvents() {
  const section = qs(".private-events");
  if (!section) return;

  setText(".section-copy .eyebrow", getConfigValue("events.eyebrow"), section);
  setText(".section-copy h2", getConfigValue("events.title"), section);
  setText(".section-copy p:nth-of-type(2)", getConfigValue("events.body"), section);
  setCta(".section-copy .btn", getConfigValue("events.cta", null), section);

  const list = qs(".event-list", section);
  if (!list) return;
  clearElement(list);
  getConfigArray("events.items").forEach((item, index) => {
    const row = createElement("div");
    row.appendChild(createElement("span", "", numberLabel(index)));
    row.append(document.createTextNode(` ${item}`));
    list.appendChild(row);
  });
}

function applyTemplateReservations() {
  const section = qs("#reservations");
  const reservationForm = qs("#reservationForm");
  const reservationConfig = getConfigValue("forms.reservation", {});
  const labels = reservationConfig.labels || {};
  if (!section) return;

  setText(".section-copy .eyebrow", getConfigValue("reservations.eyebrow"), section);
  setText(".section-copy h2", getConfigValue("reservations.title"), section);
  setText(".section-copy p:nth-of-type(2)", getConfigValue("reservations.body"), section);
  setText(".reservation-note span", getConfigValue("reservations.noteLabel"), section);
  setText(".reservation-note strong", getConfigValue("reservations.noteText", getConfigValue("hours.short")), section);

  setAttribute("#time", "min", reservationConfig.timeMin);
  setAttribute("#time", "max", reservationConfig.timeMax);
  setAttribute("#guests", "min", reservationConfig.minGuests);
  setAttribute("#guests", "max", reservationConfig.maxGuests);

  Object.entries({
    name: labels.name,
    email: labels.email,
    date: labels.date,
    time: labels.time,
    guests: labels.guests,
    message: labels.message
  }).forEach(([id, label]) => {
    setText(`label[for="${id}"]`, label, section);
  });
  setAttribute("#message", "placeholder", labels.messagePlaceholder, section);

  if (reservationForm) {
    reservationForm.dataset.submitMode = normalizeSubmitMode(reservationConfig.submitMode);
    reservationForm.dataset.endpoint = reservationConfig.endpoint || "";
    reservationForm.dataset.method = reservationConfig.method || "POST";
    reservationForm.dataset.whatsappNumber = reservationConfig.whatsappNumber || "";
    reservationForm.dataset.emailFallback = reservationConfig.emailFallback || getConfigValue("contact.email");
    setText('button[type="submit"]', labels.submit, reservationForm);
  }
}

function applyTemplateLocation() {
  const section = qs(".location");
  if (!section) return;

  setText(".location-card .eyebrow", getConfigValue("location.eyebrow"), section);
  setText(".location-card h2", getConfigValue("location.title"), section);

  const list = qs(".location-list", section);
  if (list) {
    clearElement(list);
    const labels = getConfigValue("ui.locationLabels", {});

    const hours = createElement("p");
    hours.appendChild(createElement("strong", "", labels.hours || "Hours"));
    hours.append(document.createTextNode(" "));
    appendLineBreakText(hours, getConfigValue("hours.location"));
    list.appendChild(hours);

    const phone = createElement("p");
    phone.appendChild(createElement("strong", "", labels.phone || "Phone"));
    phone.append(document.createTextNode(" "));
    const phoneLink = createElement("a", "", getConfigValue("contact.phoneDisplay"));
    phoneLink.href = `tel:${getConfigValue("contact.phoneHref")}`;
    phone.appendChild(phoneLink);
    list.appendChild(phone);

    const email = createElement("p");
    email.appendChild(createElement("strong", "", labels.email || "Email"));
    email.append(document.createTextNode(" "));
    const emailLink = createElement("a", "", getConfigValue("contact.email"));
    emailLink.href = `mailto:${getConfigValue("contact.email")}`;
    email.appendChild(emailLink);
    list.appendChild(email);
  }

  const contactCta = qs(".location-card .btn", section);
  if (contactCta) {
    contactCta.textContent = getConfigValue("location.contactCta.label", "Contact");
    contactCta.href = `mailto:${getConfigValue("contact.email")}`;
  }

  const map = qs(".map-card p", section);
  if (map) {
    clearElement(map);
    map.append(document.createTextNode(getConfigValue("location.mapLabel", getConfigValue("brand.fullName"))));
    map.appendChild(document.createElement("br"));
    map.appendChild(createElement("strong", "", getConfigValue("location.mapSubLabel", getConfigValue("contact.district"))));
  }

  const mapCard = qs(".map-card", section);
  const mapsUrl = getConfigValue("contact.mapsUrl");
  if (mapCard && mapsUrl) {
    mapCard.dataset.mapsUrl = mapsUrl;
    mapCard.tabIndex = 0;
    mapCard.setAttribute("role", "link");
    mapCard.setAttribute("aria-label", getConfigValue("ui.mapAriaLabel", "Open {brand} in maps").replace("{brand}", getConfigValue("brand.fullName", "restaurant")));
    mapCard.addEventListener("click", () => window.open(mapsUrl, "_blank", "noopener,noreferrer"));
    mapCard.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      window.open(mapsUrl, "_blank", "noopener,noreferrer");
    });
  }
}

function applyTemplateFaq() {
  const section = qs(".faq");
  if (!section) return;

  setText(".section-copy .eyebrow", getConfigValue("faq.eyebrow"), section);
  setText(".section-copy h2", getConfigValue("faq.title"), section);

  const accordion = qs("#faqAccordion", section);
  if (!accordion) return;
  clearElement(accordion);
  getConfigArray("faq.items").forEach((item) => {
    const wrapper = createElement("div", "accordion-item");
    const trigger = createElement("button", "accordion-trigger", item.question);
    trigger.type = "button";
    trigger.setAttribute("aria-expanded", "false");
    trigger.appendChild(createElement("span"));
    trigger.lastChild.setAttribute("aria-hidden", "true");

    const panel = createElement("div", "accordion-panel");
    panel.hidden = true;
    panel.appendChild(createElement("p", "", item.answer));
    wrapper.appendChild(trigger);
    wrapper.appendChild(panel);
    accordion.appendChild(wrapper);
  });
}

function applyTemplateFinalCta() {
  const section = qs(".final-cta");
  if (!section) return;

  setText(".eyebrow", getConfigValue("finalCta.eyebrow"), section);
  setText("h2", getConfigValue("finalCta.title"), section);
  setCta(".btn", getConfigValue("finalCta.cta", null), section);
}

function applyTemplateFooter() {
  const footer = qs(".site-footer");
  if (!footer) return;

  setText(".footer__grid > div:first-child p", getConfigValue("brand.tagline"), footer);
  setText(".footer__grid > div:nth-child(2) h3", getConfigValue("footer.exploreTitle"), footer);
  setText(".footer__grid > div:nth-child(3) h3", getConfigValue("footer.socialTitle"), footer);
  setText(".newsletter h3", getConfigValue("footer.newsletterTitle"), footer);
  setText(".newsletter label", getConfigValue("footer.newsletterLabel"), footer);
  setAttribute(".newsletter input", "placeholder", getConfigValue("footer.newsletterPlaceholder"), footer);
  setAttribute(".newsletter input", "aria-label", getConfigValue("footer.newsletterPlaceholder"), footer);
  setText(".newsletter button", getConfigValue("footer.newsletterButton"), footer);
  setText('.footer__links a[href="#home"]', getConfigValue("footer.backToTop"), footer);
  setText('.footer__links a[href="privacy.html"]', getConfigValue("footer.privacyLink"), footer);

  const explore = qs(".footer__grid > div:nth-child(2)", footer);
  if (explore) {
    qsa("a", explore).forEach((anchor) => anchor.remove());
    getConfigArray("nav.links").slice(0, 4).forEach((link) => {
      const anchor = createElement("a", "", link.label);
      anchor.href = link.href || "#";
      explore.appendChild(anchor);
    });
  }

  const social = qs(".footer__grid > div:nth-child(3)", footer);
  if (social) {
    qsa("a", social).forEach((anchor) => anchor.remove());
    const socialLinks = getConfigArray("contact.social").filter((link) => isUsableExternalUrl(link.url));
    social.hidden = socialLinks.length === 0;
    socialLinks.forEach((link) => {
      const anchor = createElement("a", "", link.label);
      anchor.href = link.url;
      anchor.target = "_blank";
      anchor.rel = "noopener noreferrer";
      social.appendChild(anchor);
    });
  }

  const copyright = qs(".footer__bottom p", footer);
  if (copyright) {
    clearElement(copyright);
    copyright.append(document.createTextNode("\u00A9 "));
    const year = createElement("span");
    year.id = "currentYear";
    copyright.appendChild(year);
    copyright.append(document.createTextNode(` ${getConfigValue("brand.fullName")}. ${getConfigValue("footer.copyrightSuffix", "All rights reserved.")}`));
  }
}

function initTemplateConfig() {
  if (!window.RESTAURANT_TEMPLATE_CONFIG) return;

  applyTemplateTheme();
  applyTemplateSeo();
  applyTemplateBranding();
  applyTemplateNav();
  applyTemplateHero();
  applyTemplateMarquee();
  applyTemplateExperience();
  applyTemplateRitual();
  applyTemplateMenu();
  applyTemplateTasting();
  applyTemplateWine();
  applyTemplateChef();
  applyTemplateGallery();
  applyTemplateTestimonials();
  applyTemplateEvents();
  applyTemplateReservations();
  applyTemplateLocation();
  applyTemplateFaq();
  applyTemplateFinalCta();
  applyTemplateFooter();
  applyPrivacyPage();
}

function refreshDynamicInteractions() {
  initNavigation();
  initSmoothScrolling();
  initActiveNavLinks();
  initMenuFilter();
  initGalleryLightbox();
  initAccordion();
  initReservationForm();
  initNewsletterForm();
  initRevealAnimations();
  setCurrentYear();
}

function initPreloader() {
  const preloader = qs("#preloader");
  const bar = qs("#preloaderBar");
  const counter = qs("#preloaderCounter");

  if (!preloader || !bar || !counter) return;

  let progress = 0;
  const update = (value) => {
    progress = Math.min(value, 100);
    bar.style.width = `${progress}%`;
    counter.textContent = `${Math.round(progress)}%`;
  };

  const timer = window.setInterval(() => {
    const next = progress + Math.random() * 11 + 4;
    update(Math.min(next, 92));
  }, 90);

  const finish = () => {
    window.clearInterval(timer);
    update(100);

    window.setTimeout(() => {
      preloader.classList.add("is-hidden");
      document.body.classList.remove("is-loading");
    }, prefersReducedMotion ? 60 : 360);

    window.setTimeout(() => {
      preloader.remove();
    }, prefersReducedMotion ? 120 : 1000);
  };

  if (document.readyState === "complete") {
    finish();
  } else {
    window.addEventListener("load", finish, { once: true });
    window.setTimeout(finish, 2600);
  }
}

function initGsapAnimations() {
  const gsap = window.gsap;

  if (!gsap || prefersReducedMotion) return;

  const hero = qs(".hero");
  const heroImage = qs(".hero__image");
  const heroRevealBlocks = qsa(".hero__copy, .hero__reservation, .hero__stats, .hero-card");
  const heroIntroItems = qsa(".hero__meta, .hero h1, .hero__lead, .hero__actions, .hero__reservation, .hero__stats");

  heroRevealBlocks.forEach((element) => element.classList.add("is-visible"));

  gsap.set(heroIntroItems, { autoAlpha: 0, y: 22 });
  gsap.set(".hero__stats div", { autoAlpha: 0, y: 12 });
  gsap.set(".hero-card", { autoAlpha: 0, y: 18, scale: 0.96 });

  const intro = gsap.timeline({ defaults: { ease: "power3.out" } });

  if (heroImage) {
    intro.fromTo(heroImage, { scale: 1.12, y: 18 }, { scale: 1.045, y: 0, duration: 1.65 }, 0);
  }

  intro
    .fromTo(".site-header", { autoAlpha: 0, y: -18 }, { autoAlpha: 1, y: 0, duration: 0.7 }, 0.12)
    .to(heroIntroItems, { autoAlpha: 1, y: 0, duration: 0.88, stagger: 0.09 }, 0.22)
    .to(".hero__stats div", { autoAlpha: 1, y: 0, duration: 0.62, stagger: 0.07 }, 0.72)
    .to(".hero-card", { autoAlpha: 1, y: 0, scale: 1, duration: 0.78, stagger: 0.14 }, 0.86);

  if (hero && heroImage && window.matchMedia("(pointer: fine)").matches) {
    const moveHeroImage = gsap.quickTo(heroImage, "y", { duration: 0.45, ease: "power2.out" });

    window.addEventListener("scroll", () => {
      const heroBottom = hero.getBoundingClientRect().bottom;
      if (heroBottom <= 0) return;

      moveHeroImage(window.scrollY * 0.055);
    }, { passive: true });
  }
}

function initGsapNavigation() {
  const gsap = window.gsap;
  const panel = qs("#navPanel");
  const mobileNav = window.matchMedia("(max-width: 1023px)");

  if (!gsap || prefersReducedMotion || !panel || !mobileNav.matches) return;

  const items = qsa(".nav-link, .nav-panel .btn", panel);
  if (!items.length) return;

  gsap.set(items, { autoAlpha: 0, y: 14 });

  const animateItems = () => {
    if (!panel.classList.contains("is-open")) {
      gsap.set(items, { autoAlpha: 0, y: 14 });
      return;
    }

    gsap.to(items, {
      autoAlpha: 1,
      y: 0,
      duration: 0.55,
      ease: "power3.out",
      stagger: 0.055
    });
  };

  const observer = new MutationObserver(animateItems);
  observer.observe(panel, { attributes: true, attributeFilter: ["class"] });
}

function initNavigation() {
  const header = qs("#siteHeader");
  const toggle = qs("#navToggle");
  const panel = qs("#navPanel");
  const links = qsa(".nav-link, .nav-panel .btn");
  const openLabel = getConfigValue("ui.navOpenLabel", "Open navigation menu");
  const closeLabel = getConfigValue("ui.navCloseLabel", "Close navigation menu");

  if (toggle) toggle.setAttribute("aria-label", openLabel);

  const setHeaderState = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 20);
  };

  const closeMenu = () => {
    if (!toggle || !panel) return;
    toggle.classList.remove("is-active");
    panel.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", openLabel);
    document.body.classList.remove("nav-open");
  };

  const openMenu = () => {
    if (!toggle || !panel) return;
    toggle.classList.add("is-active");
    panel.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", closeLabel);
    document.body.classList.add("nav-open");
  };

  if (toggle && panel) {
    toggle.onclick = () => {
      const isOpen = panel.classList.contains("is-open");
      isOpen ? closeMenu() : openMenu();
    };

    links.forEach((link) => {
      link.onclick = closeMenu;
    });

    document.onkeydown = (event) => {
      if (event.key === "Escape") closeMenu();
    };
  }

  setHeaderState();
  window.addEventListener("scroll", setHeaderState, { passive: true });
}

function initSmoothScrolling() {
  qsa('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      const targetId = anchor.getAttribute("href");
      if (!targetId || targetId === "#") return;

      const target = qs(targetId);
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start"
      });

      history.pushState(null, "", targetId);
    });
  });
}

function initActiveNavLinks() {
  const navLinks = qsa(".nav-link");
  const sections = navLinks
    .map((link) => qs(link.getAttribute("href")))
    .filter(Boolean);

  if (!sections.length) return;

  const setActive = (id) => {
    navLinks.forEach((link) => {
      link.classList.toggle("is-active", link.getAttribute("href") === `#${id}`);
    });
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setActive(entry.target.id);
      }
    });
  }, {
    rootMargin: "-35% 0px -55% 0px",
    threshold: 0
  });

  sections.forEach((section) => observer.observe(section));
}

function initMenuFilter() {
  const buttons = qsa(".filter-btn");
  const cards = qsa(".menu-card");

  if (!buttons.length || !cards.length) return;

  buttons.forEach((button) => {
    button.setAttribute("aria-pressed", String(button.classList.contains("is-active")));
  });

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;

      buttons.forEach((item) => {
        const isActive = item === button;
        item.classList.toggle("is-active", isActive);
        item.setAttribute("aria-pressed", String(isActive));
      });

      cards.forEach((card) => {
        const shouldShow = filter === "all" || card.dataset.category === filter;

        if (shouldShow) {
          card.hidden = false;
          card.setAttribute("aria-hidden", "false");
          requestAnimationFrame(() => {
            card.classList.remove("is-hidden");
          });
        } else {
          card.classList.add("is-hidden");
          card.setAttribute("aria-hidden", "true");
          card.hidden = true;
        }
      });
    });
  });
}

function initGalleryLightbox() {
  const lightbox = qs("#lightbox");
  const image = qs("#lightboxImage");
  const caption = qs("#lightboxCaption");
  const closeButton = qs("#lightboxClose");
  const items = qsa(".gallery-item");

  if (!lightbox || !image || !caption || !closeButton || !items.length) return;

  let closeTimer = 0;
  let previouslyFocusedElement = null;

  const clearLightboxImage = () => {
    image.removeAttribute("src");
    image.alt = "";
    caption.textContent = "";
  };

  const openLightbox = (item) => {
    const img = qs("img", item);
    if (!img) return;

    const fullImage = item.dataset.full || img.currentSrc || img.src;
    if (!fullImage) return;

    window.clearTimeout(closeTimer);
    previouslyFocusedElement = document.activeElement;
    image.src = fullImage;
    image.alt = img.alt || getConfigValue("ui.lightboxFallbackAlt", "Restaurant gallery image");
    caption.textContent = item.dataset.caption || img.alt || "";
    lightbox.hidden = false;
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("lightbox-open");

    requestAnimationFrame(() => {
      lightbox.classList.add("is-open");
      closeButton.focus();
    });
  };

  const closeLightbox = () => {
    if (lightbox.hidden) return;

    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("lightbox-open");

    closeTimer = window.setTimeout(() => {
      lightbox.hidden = true;
      clearLightboxImage();

      if (previouslyFocusedElement && typeof previouslyFocusedElement.focus === "function") {
        previouslyFocusedElement.focus();
      }
    }, prefersReducedMotion ? 0 : 260);
  };

  items.forEach((item) => {
    item.addEventListener("click", () => openLightbox(item));
  });

  closeButton.addEventListener("click", closeLightbox);
  closeButton.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;

    event.preventDefault();
    closeLightbox();
  });

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (event) => {
    if (lightbox.hidden) return;

    if (event.key === "Escape") {
      closeLightbox();
      return;
    }

    if (event.key !== "Tab") return;

    const focusable = qsa('button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])', lightbox)
      .filter((element) => !element.disabled && element.offsetParent !== null);

    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
}

function initAccordion() {
  const accordion = qs("#faqAccordion");
  if (!accordion) return;

  const triggers = qsa(".accordion-trigger", accordion);

  triggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const item = trigger.closest(".accordion-item");
      if (!item) return;

      const panel = qs(".accordion-panel", item);
      if (!panel) return;

      const isOpen = trigger.getAttribute("aria-expanded") === "true";

      triggers.forEach((otherTrigger) => {
        const otherItem = otherTrigger.closest(".accordion-item");
        if (!otherItem) return;

        const otherPanel = qs(".accordion-panel", otherItem);
        if (!otherPanel) return;

        otherTrigger.setAttribute("aria-expanded", "false");
        otherPanel.hidden = true;
      });

      trigger.setAttribute("aria-expanded", String(!isOpen));
      panel.hidden = isOpen;
    });
  });
}

function initReservationForm() {
  const form = qs("#reservationForm");
  const success = qs("#formSuccess");
  const dateInput = qs("#date");
  const submitButton = form ? qs('button[type="submit"]', form) : null;
  const formConfig = getConfigValue("forms.reservation", {});
  const messages = {
    nameRequired: "Please enter your name.",
    emailInvalid: "Please enter a valid email address.",
    dateRequired: "Please choose a reservation date.",
    datePast: "Please choose today or a future date.",
    timeRequired: "Please choose a preferred time.",
    timeEarly: "Please choose a time after {min}.",
    timeLate: "Please choose a time before {max}.",
    guestsRange: "Please choose between {min} and {max} guests.",
    ...(formConfig.messages || {})
  };

  if (!form || !success) return;

  if (dateInput) {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    dateInput.min = `${yyyy}-${mm}-${dd}`;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const setError = (field, message) => {
    if (!field) return;

    const wrapper = field.closest(".form-field");
    if (!wrapper) return;

    const error = qs(".field-error", wrapper);
    wrapper.classList.toggle("has-error", Boolean(message));
    field.setAttribute("aria-invalid", message ? "true" : "false");
    if (error) error.textContent = message;
  };

  const validate = () => {
    let valid = true;
    const fields = {
      name: qs("#name"),
      email: qs("#email"),
      date: qs("#date"),
      time: qs("#time"),
      guests: qs("#guests")
    };

    if (Object.values(fields).some((field) => !field)) return false;

    Object.values(fields).forEach((field) => {
      setError(field, "");
    });

    let firstInvalidField = null;
    const fail = (field, message) => {
      setError(field, message);
      firstInvalidField ||= field;
      valid = false;
    };

    if (!fields.name.value.trim()) {
      fail(fields.name, messages.nameRequired);
    }

    if (!emailPattern.test(fields.email.value.trim())) {
      fail(fields.email, messages.emailInvalid);
    }

    if (!fields.date.value) {
      fail(fields.date, messages.dateRequired);
    } else if (fields.date.min && fields.date.value < fields.date.min) {
      fail(fields.date, messages.datePast);
    }

    if (!fields.time.value) {
      fail(fields.time, messages.timeRequired);
    } else if (fields.time.min && fields.time.value < fields.time.min) {
      fail(fields.time, messages.timeEarly.replace("{min}", fields.time.min));
    } else if (fields.time.max && fields.time.value > fields.time.max) {
      fail(fields.time, messages.timeLate.replace("{max}", fields.time.max));
    }

    const guests = Number(fields.guests.value);
    const minGuests = Number(fields.guests.min || formConfig.minGuests || 1);
    const maxGuests = Number(fields.guests.max || formConfig.maxGuests || 12);
    if (!guests || guests < minGuests || guests > maxGuests) {
      fail(fields.guests, messages.guestsRange.replace("{min}", minGuests).replace("{max}", maxGuests));
    }

    if (firstInvalidField) {
      firstInvalidField.focus();
    }

    return valid;
  };

  const setSubmitting = (isSubmitting) => {
    if (!submitButton) return;
    submitButton.disabled = isSubmitting;
    submitButton.setAttribute("aria-busy", String(isSubmitting));
  };

  const sendToEndpoint = async () => {
    const endpoint = form.dataset.endpoint;
    if (!endpoint) throw new Error("No reservation endpoint configured.");

    const response = await fetch(endpoint, {
      method: form.dataset.method || "POST",
      body: new FormData(form),
      headers: { Accept: "application/json" }
    });

    if (!response.ok) throw new Error("Reservation endpoint request failed.");
    return true;
  };

  const openWhatsapp = () => {
    const number = (form.dataset.whatsappNumber || "").replace(/\D/g, "");
    if (!number) return false;

    const url = `https://wa.me/${number}?text=${encodeURIComponent(buildReservationMessage(form))}`;
    window.open(url, "_blank", "noopener,noreferrer");
    return true;
  };

  const openMailClient = () => {
    const email = form.dataset.emailFallback;
    if (!email) return false;

    const subjectLabel = getConfigValue("forms.reservation.messageLabels.emailSubject", "Reservation request");
    const subject = encodeURIComponent(`${subjectLabel} - ${getConfigValue("brand.fullName", "Restaurant")}`);
    const body = encodeURIComponent(buildReservationMessage(form));
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    return true;
  };

  form.onsubmit = async (event) => {
    event.preventDefault();
    success.textContent = "";

    if (!validate()) return;

    const submitMode = normalizeSubmitMode(form.dataset.submitMode);

    try {
      setSubmitting(true);
      success.textContent = formConfig.sendingMessage || "";

      if (submitMode === "form-endpoint") {
        await sendToEndpoint();
      } else if (submitMode === "whatsapp") {
        if (!openWhatsapp() && !openMailClient()) throw new Error("No WhatsApp number or email fallback configured.");
      } else if (submitMode === "mailto") {
        if (!openMailClient()) throw new Error("No email fallback configured.");
      }

      success.textContent = formConfig.successMessage || "Thank you. Your request has been received.";
      form.reset();
    } catch (error) {
      success.textContent = formConfig.errorMessage || "We could not send the request. Please contact the host team directly.";
    } finally {
      setSubmitting(false);
    }
  };
}

function initNewsletterForm() {
  const form = qs("#newsletterForm");
  const message = qs("#newsletterMessage");
  const input = qs("#newsletterEmail");
  const config = getConfigValue("forms.newsletter", {});

  if (!form || !message || !input) return;

  form.onsubmit = async (event) => {
    event.preventDefault();
    const value = input.value.trim();

    if (!value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      message.textContent = config.invalidMessage || "Enter a valid email to join the list.";
      return;
    }

    try {
      if (config.endpoint) {
        const response = await fetch(config.endpoint, {
          method: "POST",
          body: new FormData(form),
          headers: { Accept: "application/json" }
        });

        if (!response.ok) throw new Error("Newsletter endpoint request failed.");
      }

      message.textContent = config.successMessage || "You are on the list.";
      form.reset();
    } catch (error) {
      message.textContent = config.errorMessage || "We could not add this email right now.";
    }
  };
}

function initRevealAnimations() {
  const elements = qsa(".reveal");
  if (!elements.length) return;

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    elements.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const siblings = qsa(".reveal", entry.target.parentElement || document);
      const index = Math.min(siblings.indexOf(entry.target), 5);
      entry.target.style.setProperty("--reveal-delay", `${Math.max(index, 0) * 45}ms`);
      entry.target.classList.add("is-visible");
      obs.unobserve(entry.target);
    });
  }, {
    threshold: 0.16,
    rootMargin: "0px 0px -8% 0px"
  });

  elements.forEach((element) => observer.observe(element));
}

function initButtonMicroInteractions() {
  qsa(".btn").forEach((button) => {
    button.addEventListener("pointermove", (event) => {
      const rect = button.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      button.style.setProperty("--x", `${x}%`);
      button.style.setProperty("--y", `${y}%`);
    });
  });
}

function setCurrentYear() {
  const year = qs("#currentYear");
  if (year) year.textContent = new Date().getFullYear();
}

document.addEventListener("DOMContentLoaded", async () => {
  await prepareEngineConfig();
  initTemplateConfig();
  initPreloader();
  initGsapNavigation();
  refreshDynamicInteractions();
  initGsapAnimations();
  initButtonMicroInteractions();
});
