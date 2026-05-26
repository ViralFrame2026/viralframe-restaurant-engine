import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const templatesDir = path.join(root, "templates");
const files = (await fs.readdir(templatesDir)).filter((file) => file.endsWith(".json")).sort();

for (const file of files) {
  const template = JSON.parse(await fs.readFile(path.join(templatesDir, file), "utf8"));
  console.log(`${path.basename(file, ".json")}: ${template.mood || "No mood defined"}`);
}
