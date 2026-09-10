/**
 * Geldt voor alle templates in src/.
 *  - permalink: houdt de .html-extensie in stand (contact.html blijft
 *    /contact.html) in plaats van Eleventy's standaard /contact/index.html.
 *  - massage: koppelt een massagepagina automatisch aan het bijbehorende
 *    databestand in _data/massages/ op basis van de bestandsnaam.
 */
export default {
  permalink: (data) => `${data.page.filePathStem}.html`,
  eleventyComputed: {
    massage: (data) => (data.massages ? data.massages[data.page.fileSlug] : undefined)
  }
};
