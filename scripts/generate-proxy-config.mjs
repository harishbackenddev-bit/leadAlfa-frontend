import { writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { loadEnv } from "vite";
import {
  getNetlifyRedirects,
  normalizeWpSiteUrl,
} from "../config/wordpress-proxy.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const env = loadEnv("production", root, "");
const wpSiteUrl = normalizeWpSiteUrl(
  process.env.VITE_WP_SITE_URL || env.VITE_WP_SITE_URL
);

const redirects = [
  "# Auto-generated — do not edit. Run: npm run sync:proxy",
  ...getNetlifyRedirects(wpSiteUrl),
  "",
].join("\n");

writeFileSync(resolve(root, "public/_redirects"), redirects);

console.log(`Netlify WordPress proxy config generated for ${wpSiteUrl}`);
