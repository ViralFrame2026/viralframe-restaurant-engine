import fs from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const requiredFiles = [
  "js/site-config.js",
  "js/main.js",
  "scripts/sync-client-assets.mjs",
  "tests/smoke.mjs",
  "package.json"
];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function readJson(relativePath) {
  return JSON.parse(await fs.readFile(path.join(root, relativePath), "utf8"));
}

for (const file of requiredFiles) {
  await fs.access(path.join(root, file));
}

JSON.parse(await fs.readFile(path.join(root, "package.json"), "utf8"));

const configSource = await fs.readFile(path.join(root, "js", "site-config.js"), "utf8");
const context = { window: {} };
vm.createContext(context);
vm.runInContext(configSource, context, { filename: "site-config.js" });
const config = context.window.RESTAURANT_TEMPLATE_CONFIG;

assert(config, "Config did not expose RESTAURANT_TEMPLATE_CONFIG.");
assert(config.template, "Config must declare a template.");
assert(config.client?.name, "Config must include client.name.");
assert(config.site?.url, "Config must include site.url.");
assert(config.menu?.categories?.length, "Config must include menu categories.");
assert(config.menu?.items?.length, "Config must include menu items.");
assert(config.gallery?.items?.length, "Config must include gallery items.");

await readJson(`templates/${config.template}.json`);
await readJson(`languages/${config.client.language || config.site.language || "en"}.json`);

const templateFiles = (await fs.readdir(path.join(root, "templates"))).filter((file) => file.endsWith(".json"));
for (const file of templateFiles) {
  const template = await readJson(`templates/${file}`);
  assert(template.mood, `${file} is missing mood.`);
  assert(template.colors, `${file} is missing colors.`);
  assert(template.menuCategoryDefaults, `${file} is missing menuCategoryDefaults.`);
  assert(template.seoDefaults, `${file} is missing seoDefaults.`);
}

const languageFiles = (await fs.readdir(path.join(root, "languages"))).filter((file) => file.endsWith(".json"));
for (const file of languageFiles) {
  const language = await readJson(`languages/${file}`);
  assert(language.site?.language, `${file} is missing site.language.`);
  assert(language.ui?.navOpenLabel, `${file} is missing ui labels.`);
  assert(language.forms?.reservation?.labels, `${file} is missing reservation labels.`);
}

console.log("Engine validation passed.");
