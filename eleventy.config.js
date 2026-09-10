/**
 * Eleventy-configuratie — Massagepraktijk Mirjam Maat
 *
 * Uitgangspunt: de gegenereerde site moet visueel en in markup identiek zijn
 * aan de originele handgeschreven HTML. Daarom:
 *  - .html-bestanden blijven .html (geen "pretty URLs"), zodat bestaande
 *    links als href="contact.html" blijven werken;
 *  - assets gaan 1-op-1 door passthrough copy, met identieke paden;
 *  - de markdown-filter is een exacte port van de oude render.js, zodat
 *    bestaande CMS-teksten precies dezelfde HTML opleveren als voorheen.
 */
import YAML from "yaml";

/* ---- Exacte port van mdToHtml() uit de oude render.js ---- */
function escapeHtml(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function inline(s) {
  s = escapeHtml(s);
  s = s.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  return s;
}
function mdToHtml(md) {
  if (!md) return "";
  const blocks = md.trim().split(/\n\s*\n/);
  return blocks
    .map((block) => {
      const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
      if (!lines.length) return "";
      if (lines[0].indexOf("## ") === 0) return "<h2>" + inline(lines[0].slice(3)) + "</h2>";
      if (lines.every((l) => l.indexOf("- ") === 0)) {
        return "<ul>" + lines.map((l) => "<li>" + inline(l.slice(2)) + "</li>").join("") + "</ul>";
      }
      return "<p>" + inline(lines.join(" ")) + "</p>";
    })
    .join("\n");
}

export default function (eleventyConfig) {
  // YAML als databestandsformaat (Eleventy kent standaard alleen JSON/JS)
  eleventyConfig.addDataExtension("yml,yaml", (contents) => YAML.parse(contents));

  // Markdown-filter voor CMS-tekstvelden
  eleventyConfig.addFilter("md", mdToHtml);

  // Splitst een tekst op lege regels in alinea's
  eleventyConfig.addFilter("split", (s, sep) => String(s || "").split(sep));

  // Assets ongewijzigd kopiëren — src/ wordt uit het pad gestript
  eleventyConfig.addPassthroughCopy("src/images");   // -> _site/images
  eleventyConfig.addPassthroughCopy("src/styles.css");
  eleventyConfig.addPassthroughCopy("src/main.js");

}

export const config = {
  dir: {
    input: "src",
    output: "_site",
    includes: "_includes",
    data: "_data"
  },
  htmlTemplateEngine: "njk",
  markdownTemplateEngine: "njk"
};
