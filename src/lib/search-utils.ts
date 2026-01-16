import CyrillicToTranslit from "cyrillic-to-translit-js";

const translitUk = CyrillicToTranslit({ preset: "uk" });

function getTransliteration(input: string): string | null {
  const hasCyrillic = /[а-яіїєґА-ЯІЇЄҐ]/.test(input);
  const hasLatin = /[a-zA-Z]/.test(input);

  if (hasCyrillic) {
    const translit = translitUk.transform(input);
    if (translit && translit !== input) {
      return translit.toLowerCase();
    }
  }

  if (hasLatin) {
    const reverse = translitUk.reverse(input);
    if (reverse && reverse !== input) {
      return reverse.toLowerCase();
    }
  }

  return null;
}

/**
 * Build FTS query with transliteration support
 * "batman" → "'batman':* | 'батман':*"
 */
export function buildFtsQuery(input: string): string {
  if (!input) return "";

  const normalized = input.toLowerCase().trim();
  const translit = getTransliteration(input);

  // FTS query with prefix matching
  const queries = [`'${normalized}':*`];
  if (translit) {
    queries.push(`'${translit}':*`);
  }

  return queries.join(" | ");
}
