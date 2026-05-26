import fs from "node:fs/promises";
import http from "node:http";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const port = Number(process.env.PORT || 4173);
const baseUrl = `http://127.0.0.1:${port}`;

const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".xml": "text/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml; charset=utf-8",
  ".png": "image/png"
};

async function loadPlaywright() {
  const target = process.env.PLAYWRIGHT_MODULE || "@playwright/test";
  if (/^[A-Za-z]:[\\/]/.test(target) || target.startsWith("/")) {
    const stats = await fs.stat(target);
    const modulePath = stats.isDirectory() ? path.join(target, "index.js") : target;
    return import(pathToFileURL(modulePath).href);
  }

  try {
    return await import(target);
  } catch {
    return import("playwright");
  }
}

function startServer() {
  const server = http.createServer(async (request, response) => {
    const url = new URL(request.url || "/", baseUrl);
    const requested = decodeURIComponent(url.pathname === "/" ? "/index.html" : url.pathname);
    const filePath = path.normalize(path.join(root, requested));

    if (!filePath.startsWith(root)) {
      response.writeHead(403);
      response.end("Forbidden");
      return;
    }

    try {
      const content = await fs.readFile(filePath);
      response.writeHead(200, { "Content-Type": mime[path.extname(filePath)] || "application/octet-stream" });
      response.end(content);
    } catch {
      response.writeHead(404);
      response.end("Not found");
    }
  });

  return new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(port, "127.0.0.1", () => resolve(server));
  });
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function readConfig() {
  const source = await fs.readFile(path.join(root, "js", "site-config.js"), "utf8");
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(source, context, { filename: "site-config.js" });
  return context.window.RESTAURANT_TEMPLATE_CONFIG;
}

const config = await readConfig();
const playwright = await loadPlaywright();
const { chromium } = playwright.default || playwright;
const server = await startServer();
const launchOptions = process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {};
const browser = await chromium.launch({ headless: true, ...launchOptions });

try {
  const page = await browser.newPage({ viewport: { width: 390, height: 812 }, deviceScaleFactor: 2, isMobile: true });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (["error", "warning"].includes(message.type()) && !message.text().includes("ERR_NETWORK_ACCESS_DENIED")) {
      errors.push(`${message.type()}: ${message.text()}`);
    }
  });

  await page.goto(`${baseUrl}/index.html`, { waitUntil: "load", timeout: 15000 });
  await page.waitForTimeout(1800);

  const initial = await page.evaluate(() => ({
    configLoaded: Boolean(window.RESTAURANT_TEMPLATE_CONFIG),
    templateLanguage: window.RESTAURANT_TEMPLATE_CONFIG?.site?.language,
    brandName: window.RESTAURANT_TEMPLATE_CONFIG?.brand?.fullName,
    documentLanguage: document.documentElement.lang,
    privacyTitle: window.RESTAURANT_TEMPLATE_CONFIG?.privacy?.title,
    gsapLoaded: typeof window.gsap === "object",
    canonical: document.querySelector('link[rel="canonical"]')?.href,
    reservationSubmit: document.querySelector('#reservationForm button[type="submit"]')?.textContent.trim(),
    menuCards: document.querySelectorAll(".menu-card").length,
    galleryItems: document.querySelectorAll(".gallery-item").length,
    faqItems: document.querySelectorAll(".accordion-item").length,
    noHorizontalOverflow: document.documentElement.scrollWidth <= window.innerWidth + 1
  }));

  assert(initial.configLoaded, "Config did not load.");
  assert(initial.documentLanguage === initial.templateLanguage, "Document language does not match template language.");
  assert(Boolean(initial.reservationSubmit), "Reservation submit label was not applied.");
  assert(initial.gsapLoaded, "GSAP did not load.");
  assert(initial.brandName === config.brand.fullName, "Rendered brand does not match config.");
  assert(initial.canonical === config.site.url, "Canonical URL does not match config site URL.");
  assert(initial.menuCards >= 1, "Menu cards were not rendered.");
  assert(initial.galleryItems >= 1, "Gallery items were not rendered.");
  assert(initial.faqItems >= 1, "FAQ items were not rendered.");
  assert(initial.noHorizontalOverflow, "Mobile layout has horizontal overflow.");
  assert(await page.locator(".language-switcher__btn").count() === 2, "Language switcher did not render.");

  await page.locator('.language-switcher__btn[data-language="en"]').first().click();
  await page.waitForTimeout(350);
  const englishState = await page.evaluate(() => ({
    language: document.documentElement.lang,
    title: document.title,
    hero: document.querySelector(".hero h1")?.textContent.trim(),
    reservationSubmit: document.querySelector('#reservationForm button[type="submit"]')?.textContent.trim(),
    ogLocale: document.querySelector('meta[property="og:locale"]')?.content,
    storedLanguage: localStorage.getItem("restaurantEngineLanguage"),
    activeLanguage: document.querySelector(".language-switcher__btn.is-active")?.dataset.language
  }));
  assert(englishState.language === "en", "EN switch did not update html lang.");
  assert(englishState.ogLocale === "en_US", "EN switch did not update og:locale.");
  assert(englishState.title.includes("Tokyo Luxury Omakase"), "EN switch did not update document title.");
  assert(englishState.hero.includes("Seasonal omakase"), "EN switch did not update hero copy.");
  assert(englishState.reservationSubmit === "Request Reservation", "EN switch did not update form labels.");
  assert(englishState.storedLanguage === "en", "EN preference was not stored.");
  assert(englishState.activeLanguage === "en", "EN button was not marked active.");

  await page.reload({ waitUntil: "load", timeout: 15000 });
  await page.waitForTimeout(900);
  assert(await page.evaluate(() => document.documentElement.lang === "en"), "Stored EN language was not restored after reload.");

  await page.click("#navToggle");
  await page.waitForTimeout(250);
  assert(await page.evaluate(() => document.querySelector("#navPanel").classList.contains("is-open")), "Mobile nav did not open.");
  await page.locator('#navPanel .language-switcher__btn[data-language="es"]').click();
  await page.waitForTimeout(350);
  const spanishState = await page.evaluate(() => ({
    language: document.documentElement.lang,
    title: document.title,
    hero: document.querySelector(".hero h1")?.textContent.trim(),
    reservationSubmit: document.querySelector('#reservationForm button[type="submit"]')?.textContent.trim(),
    ogLocale: document.querySelector('meta[property="og:locale"]')?.content,
    storedLanguage: localStorage.getItem("restaurantEngineLanguage"),
    activeLanguage: document.querySelector(".language-switcher__btn.is-active")?.dataset.language,
    navOpen: document.querySelector("#navPanel").classList.contains("is-open")
  }));
  assert(spanishState.language === "es", "ES switch did not update html lang.");
  assert(spanishState.ogLocale === "es_ES", "ES switch did not update og:locale.");
  assert(spanishState.title.includes("Omakase de lujo"), "ES switch did not update document title.");
  assert(spanishState.hero.includes("Omakase de temporada"), "ES switch did not update hero copy.");
  assert(spanishState.reservationSubmit === "Solicitar reserva", "ES switch did not update form labels.");
  assert(spanishState.storedLanguage === "es", "ES preference was not stored.");
  assert(spanishState.activeLanguage === "es", "ES button was not marked active.");
  assert(spanishState.navOpen, "Mobile nav stopped working after language switch.");
  await page.keyboard.press("Escape");
  await page.waitForTimeout(250);
  assert(await page.evaluate(() => !document.querySelector("#navPanel").classList.contains("is-open")), "Mobile nav did not close.");

  const targetFilter = await page.locator('.filter-btn:not([data-filter="all"])').first().getAttribute("data-filter");
  assert(Boolean(targetFilter), "No non-all menu filter was rendered.");
  await page.click(`.filter-btn[data-filter="${targetFilter}"]`);
  const filterState = await page.evaluate(() => ({
    visibleCards: Array.from(document.querySelectorAll(".menu-card")).filter((card) => !card.hidden).length,
    hiddenOccupySpace: Array.from(document.querySelectorAll(".menu-card")).filter((card) => card.hidden).some((card) => card.getBoundingClientRect().height > 0 || getComputedStyle(card).display !== "none")
  }));
  assert(filterState.visibleCards >= 1, "Menu filter did not show cards.");
  assert(!filterState.hiddenOccupySpace, "Hidden menu cards still occupy layout space.");

  await page.locator(".accordion-trigger").first().click();
  assert(await page.locator(".accordion-trigger").first().getAttribute("aria-expanded") === "true", "FAQ did not open.");

  const socialState = await page.evaluate(() => Array.from(document.querySelectorAll(".site-footer a[target='_blank']")).map((link) => ({
    href: link.href,
    rel: link.rel
  })));
  socialState.forEach((link) => {
    assert(link.href.startsWith("http"), "External social link is not absolute.");
    assert(link.rel.includes("noopener") && link.rel.includes("noreferrer"), "External social link is missing rel safety attributes.");
  });

  await page.click(".gallery-item");
  await page.waitForTimeout(250);
  assert(await page.evaluate(() => !document.querySelector("#lightbox").hidden && document.querySelector("#lightboxImage").hasAttribute("src")), "Lightbox did not open correctly.");
  await page.keyboard.press("Escape");
  await page.waitForTimeout(350);
  assert(await page.evaluate(() => document.querySelector("#lightbox").hidden && !document.querySelector("#lightboxImage").hasAttribute("src")), "Lightbox did not close cleanly.");

  await page.goto(`${baseUrl}/privacy.html`, { waitUntil: "load", timeout: 15000 });
  assert(await page.locator("h1").textContent() === initial.privacyTitle, "Privacy page did not render.");

  assert(errors.length === 0, `Runtime warnings/errors: ${errors.join("; ")}`);
  console.log("Smoke test passed.");
} finally {
  await browser.close();
  server.close();
}
