import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const directory = path.dirname(fileURLToPath(import.meta.url));
const index = fs.readFileSync(path.join(directory, "index.html"), "utf8");
const css = fs.readFileSync(path.join(directory, "styles.css"), "utf8");
const js = fs.readFileSync(path.join(directory, "app.js"), "utf8");

const standalone = index
  .replace('<link rel="stylesheet" href="styles.css">', () => `<style>\n${css}\n</style>`)
  .replace('<script src="app.js"></script>', () => `<script>\n${js}\n</script>`);

fs.writeFileSync(path.join(directory, "standalone.html"), standalone);

const mainMatch = index.match(/<main id="quantumRoomLab"[\s\S]*?<\/main>/);
if (!mainMatch) throw new Error("Could not locate the visualization root.");

const fragmentCss = css
  .replace(/:root\s*\{[\s\S]*?\}\s*/, "")
  .replace(/body\s*\{[\s\S]*?\}\s*/, "")
  .replace(/\.site-header,[\s\S]*?\.room-lab\s*\{[\s\S]*?\}\s*/, ".room-lab { width: 100%; margin: 0; }\n")
  .replace(/\.site-header\s*\{[\s\S]*?\}\s*/g, "")
  .replace(/\.site-header[^\{]*\{[\s\S]*?\}\s*/g, "")
  .replace(/\.eyebrow,\s*/g, "")
  .replace(/\.site-footer[^\{]*\{[\s\S]*?\}\s*/g, "");

const fragment = `${mainMatch[0]}\n<style>\n@scope (#quantumRoomLab) {\n${fragmentCss}\n}\n</style>\n<script>\n${js}\n</script>\n`;
const fragmentPath = path.join(directory, "quantum-room-world-model.html");
fs.writeFileSync(fragmentPath, fragment);

console.log(`standalone: ${path.join(directory, "standalone.html")}`);
console.log(`fragment: ${fragmentPath}`);
