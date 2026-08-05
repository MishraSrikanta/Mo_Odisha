/**
 * Odia (ଓଡ଼ିଆ) script utilities.
 *
 * Covers three jobs:
 *   1. Glyph inventories for the animated letter curtain and particle field.
 *   2. A Roman → Odia transliteration engine so visitors can type Odia on a
 *      QWERTY keyboard (ITRANS-flavoured, longest-match tokenizer).
 *   3. A virtual keyboard layout + word suggestion dictionary.
 *
 * Everything here is pure and dependency-free so it can run inside a Web
 * Worker or during server rendering.
 */

/** Independent vowels — ଅ ଆ ଇ ଈ ଉ ଊ ଋ ... */
export const ODIA_VOWELS = [
  "ଅ", "ଆ", "ଇ", "ଈ", "ଉ", "ଊ", "ଋ", "ଏ", "ଐ", "ଓ", "ଔ",
] as const;

/** Consonants grouped by traditional varga (row) order. */
export const ODIA_CONSONANT_ROWS = [
  ["କ", "ଖ", "ଗ", "ଘ", "ଙ"],
  ["ଚ", "ଛ", "ଜ", "ଝ", "ଞ"],
  ["ଟ", "ଠ", "ଡ", "ଢ", "ଣ"],
  ["ତ", "ଥ", "ଦ", "ଧ", "ନ"],
  ["ପ", "ଫ", "ବ", "ଭ", "ମ"],
  ["ଯ", "ର", "ଲ", "ୱ", "ଶ", "ଷ", "ସ", "ହ"],
  ["ଳ", "କ୍ଷ", "ଜ୍ଞ", "ଡ଼", "ଢ଼", "ୟ"],
] as const;

export const ODIA_CONSONANTS = ODIA_CONSONANT_ROWS.flat();

export const ODIA_MATRAS = ["ା", "ି", "ୀ", "ୁ", "ୂ", "ୃ", "େ", "ୈ", "ୋ", "ୌ", "ଂ", "ଃ", "ଁ", "୍"] as const;

export const ODIA_DIGITS = ["୦", "୧", "୨", "୩", "୪", "୫", "୬", "୭", "୮", "୯"] as const;

/**
 * The glyph set woven into the curtain. Deliberately ordered
 * vowels-then-consonants so the grid reads like a varnamala chart when still.
 */
export const CURTAIN_GLYPHS: string[] = [...ODIA_VOWELS, ...ODIA_CONSONANTS];

/** A lighter set for the drifting background layer — wide, open shapes read better small. */
export const AMBIENT_GLYPHS: string[] = [
  "ଅ", "ଆ", "ଇ", "ଉ", "ଏ", "ଓ",
  "କ", "ଗ", "ଙ", "ଚ", "ଜ", "ଞ",
  "ଟ", "ଡ", "ଣ", "ତ", "ଦ", "ନ",
  "ପ", "ବ", "ମ", "ଯ", "ର", "ଲ",
  "ଶ", "ଷ", "ସ", "ହ", "ଳ", "ୱ",
];

/* ------------------------------------------------------------------ *
 * Roman → Odia transliteration
 * ------------------------------------------------------------------ */

const HALANT = "୍";

/** Consonants keyed by Roman sequence. Longest key wins during matching. */
const CONSONANT_MAP: Record<string, string> = {
  kh: "ଖ", gh: "ଘ", ngh: "ଙ", ng: "ଙ", "~n": "ଞ",
  chh: "ଛ", ch: "ଚ", jh: "ଝ",
  Th: "ଠ", Dh: "ଢ", Rh: "ଢ଼",
  th: "ଥ", dh: "ଧ", ph: "ଫ", bh: "ଭ",
  sh: "ଶ", Sh: "ଷ", shh: "ଷ", ksh: "କ୍ଷ", gy: "ଜ୍ଞ",
  k: "କ", g: "ଗ", c: "ଚ", j: "ଜ",
  T: "ଟ", D: "ଡ", N: "ଣ", R: "ଡ଼", L: "ଳ",
  t: "ତ", d: "ଦ", n: "ନ",
  p: "ପ", f: "ଫ", b: "ବ", m: "ମ",
  y: "ଯ", Y: "ୟ", r: "ର", l: "ଲ",
  v: "ୱ", w: "ୱ", s: "ସ", h: "ହ",
};

/** Vowels as [independent, dependent matra]. The inherent 'a' has no matra. */
const VOWEL_MAP: Record<string, [string, string]> = {
  aa: ["ଆ", "ା"], A: ["ଆ", "ା"],
  ii: ["ଈ", "ୀ"], I: ["ଈ", "ୀ"], ee: ["ଈ", "ୀ"],
  uu: ["ଊ", "ୂ"], U: ["ଊ", "ୂ"], oo: ["ଊ", "ୂ"],
  ru: ["ଋ", "ୃ"], Ri: ["ଋ", "ୃ"],
  ai: ["ଐ", "ୈ"], au: ["ଔ", "ୌ"], ou: ["ଔ", "ୌ"],
  a: ["ଅ", ""], i: ["ଇ", "ି"], u: ["ଉ", "ୁ"],
  e: ["ଏ", "େ"], o: ["ଓ", "ୋ"],
};

/** Standalone signs that attach to whatever precedes them. */
const SIGN_MAP: Record<string, string> = {
  M: "ଂ", ".n": "ଁ", H: "ଃ", "^": HALANT,
};

const DIGIT_MAP: Record<string, string> = {
  "0": "୦", "1": "୧", "2": "୨", "3": "୩", "4": "୪",
  "5": "୫", "6": "୬", "7": "୭", "8": "୮", "9": "୯",
};

const MAX_TOKEN = 3;

function matchLongest(source: string, at: number, table: Record<string, string | [string, string]>) {
  for (let len = MAX_TOKEN; len >= 1; len--) {
    const slice = source.slice(at, at + len);
    if (slice.length === len && slice in table) return { key: slice, len };
  }
  return null;
}

/**
 * Convert a Roman string to Odia script.
 *
 * Handles the inherent-vowel rule: two consonants in a row are joined with a
 * halant (`ka` + `ta` → କ୍ତ), while a consonant followed by a vowel takes the
 * dependent matra form (`ki` → କି).
 *
 * @example transliterateToOdia("odisha") // ଓଦିଶ
 * @example transliterateToOdia("bande utkala janani") // ବନ୍ଦେ ଉତ୍କଲ ଜନନୀ
 */
export function transliterateToOdia(roman: string): string {
  let out = "";
  let i = 0;
  // True when the last emitted glyph was a consonant still carrying its
  // inherent 'a' — the next vowel becomes a matra, the next consonant a halant.
  let pendingConsonant = false;

  while (i < roman.length) {
    const consonant = matchLongest(roman, i, CONSONANT_MAP);
    if (consonant) {
      if (pendingConsonant) out += HALANT;
      out += CONSONANT_MAP[consonant.key];
      pendingConsonant = true;
      i += consonant.len;
      continue;
    }

    const vowel = matchLongest(roman, i, VOWEL_MAP);
    if (vowel) {
      const [independent, matra] = VOWEL_MAP[vowel.key];
      out += pendingConsonant ? matra : independent;
      pendingConsonant = false;
      i += vowel.len;
      continue;
    }

    const sign = matchLongest(roman, i, SIGN_MAP);
    if (sign) {
      out += SIGN_MAP[sign.key];
      pendingConsonant = false;
      i += sign.len;
      continue;
    }

    const ch = roman[i];
    out += DIGIT_MAP[ch] ?? ch;
    pendingConsonant = false;
    i += 1;
  }

  return out;
}

/* ------------------------------------------------------------------ *
 * Virtual keyboard
 * ------------------------------------------------------------------ */

export type KeyboardKey = { glyph: string; label?: string; wide?: boolean };

/** Layout for the on-screen Odia keyboard, grouped into logical banks. */
export const ODIA_KEYBOARD: { id: string; title: string; titleOdia: string; keys: KeyboardKey[] }[] = [
  {
    id: "vowels",
    title: "Vowels",
    titleOdia: "ସ୍ୱର",
    keys: ODIA_VOWELS.map((glyph) => ({ glyph })),
  },
  {
    id: "matras",
    title: "Vowel signs",
    titleOdia: "ମାତ୍ରା",
    keys: ODIA_MATRAS.map((glyph) => ({ glyph })),
  },
  {
    id: "consonants",
    title: "Consonants",
    titleOdia: "ବ୍ୟଞ୍ଜନ",
    keys: ODIA_CONSONANTS.map((glyph) => ({ glyph })),
  },
  {
    id: "digits",
    title: "Numerals",
    titleOdia: "ସଂଖ୍ୟା",
    keys: ODIA_DIGITS.map((glyph) => ({ glyph })),
  },
];

/* ------------------------------------------------------------------ *
 * Word suggestions
 * ------------------------------------------------------------------ */

export type OdiaWord = { odia: string; roman: string; en: string };

/** Everyday and Odisha-specific vocabulary offered as you type. */
export const ODIA_WORDS: OdiaWord[] = [
  { odia: "ନମସ୍କାର", roman: "namaskara", en: "greetings" },
  { odia: "ଧନ୍ୟବାଦ", roman: "dhanyabada", en: "thank you" },
  { odia: "ଓଡ଼ିଶା", roman: "odisha", en: "Odisha" },
  { odia: "ଓଡ଼ିଆ", roman: "odia", en: "Odia" },
  { odia: "ଉତ୍କଳ", roman: "utkala", en: "Utkala" },
  { odia: "କଳିଙ୍ଗ", roman: "kalinga", en: "Kalinga" },
  { odia: "ଜଗନ୍ନାଥ", roman: "jagannatha", en: "Jagannath" },
  { odia: "ପୁରୀ", roman: "puri", en: "Puri" },
  { odia: "କୋଣାର୍କ", roman: "konarka", en: "Konark" },
  { odia: "ଭୁବନେଶ୍ୱର", roman: "bhubaneswara", en: "Bhubaneswar" },
  { odia: "କଟକ", roman: "kataka", en: "Cuttack" },
  { odia: "ଚିଲିକା", roman: "chilika", en: "Chilika" },
  { odia: "ସମ୍ବଲପୁର", roman: "sambalapura", en: "Sambalpur" },
  { odia: "ମନ୍ଦିର", roman: "mandira", en: "temple" },
  { odia: "ସମୁଦ୍ର", roman: "samudra", en: "sea" },
  { odia: "ନଦୀ", roman: "nadi", en: "river" },
  { odia: "ଜଙ୍ଗଲ", roman: "jangala", en: "forest" },
  { odia: "ପାହାଡ଼", roman: "pahada", en: "hill" },
  { odia: "ପର୍ବ", roman: "parba", en: "festival" },
  { odia: "ରଥଯାତ୍ରା", roman: "rathayatra", en: "Rath Yatra" },
  { odia: "ନୂଆଖାଇ", roman: "nuakhai", en: "Nuakhai" },
  { odia: "ରଜ", roman: "raja", en: "Raja festival" },
  { odia: "ଓଡ଼ିଶୀ", roman: "odishi", en: "Odissi" },
  { odia: "ଛଉ", roman: "chhau", en: "Chhau" },
  { odia: "ପଟ୍ଟଚିତ୍ର", roman: "pattachitra", en: "Pattachitra" },
  { odia: "ଚିତ୍ର", roman: "chitra", en: "painting" },
  { odia: "ସଙ୍ଗୀତ", roman: "sangita", en: "music" },
  { odia: "ନୃତ୍ୟ", roman: "nrutya", en: "dance" },
  { odia: "ଖାଦ୍ୟ", roman: "khadya", en: "food" },
  { odia: "ପଖାଳ", roman: "pakhala", en: "Pakhala" },
  { odia: "ଡାଲମା", roman: "dalama", en: "Dalma" },
  { odia: "ରସଗୋଲା", roman: "rasagola", en: "Rasagola" },
  { odia: "ଛେନାପୋଡ଼", roman: "chhenapoda", en: "Chhena Poda" },
  { odia: "ଇତିହାସ", roman: "itihasa", en: "history" },
  { odia: "ସଂସ୍କୃତି", roman: "sanskruti", en: "culture" },
  { odia: "ଭାଷା", roman: "bhasha", en: "language" },
  { odia: "ପର୍ଯ୍ୟଟନ", roman: "paryatana", en: "tourism" },
  { odia: "ସ୍ୱାଗତ", roman: "swagata", en: "welcome" },
  { odia: "ବନ୍ଦେ", roman: "bande", en: "I salute" },
  { odia: "ଜନନୀ", roman: "janani", en: "mother" },
  { odia: "ମାଟି", roman: "mati", en: "soil" },
  { odia: "ଲୋକ", roman: "loka", en: "people" },
  { odia: "ଗାଁ", roman: "gaa.n", en: "village" },
  { odia: "ସହର", roman: "sahara", en: "city" },
  { odia: "ପ୍ରଶ୍ନ", roman: "prashna", en: "question" },
  { odia: "ଉତ୍ତର", roman: "uttara", en: "answer" },
  { odia: "ନାମ", roman: "nama", en: "name" },
  { odia: "ମତାମତ", roman: "matamata", en: "feedback" },
  { odia: "ଠିକଣା", roman: "thikana", en: "address" },
  { odia: "ଯୋଗାଯୋଗ", roman: "yogayoga", en: "contact" },
];

/**
 * Suggest Odia words for a partial token. Matches on the Odia prefix, the
 * Roman spelling and the English gloss, so "temple", "mandira" and "ମନ୍ଦି"
 * all surface ମନ୍ଦିର.
 */
export function suggestOdiaWords(fragment: string, limit = 6): OdiaWord[] {
  const token = fragment.trim().toLowerCase();
  if (!token) return [];

  const scored = ODIA_WORDS.map((word) => {
    const roman = word.roman.toLowerCase();
    const en = word.en.toLowerCase();
    let score = -1;
    if (word.odia.startsWith(fragment.trim())) score = 0;
    else if (roman.startsWith(token)) score = 1;
    else if (en.startsWith(token)) score = 2;
    else if (roman.includes(token) || en.includes(token)) score = 3;
    return { word, score };
  }).filter((entry) => entry.score >= 0);

  scored.sort((a, b) => a.score - b.score || a.word.roman.localeCompare(b.word.roman));
  return scored.slice(0, limit).map((entry) => entry.word);
}

/** Extract the token currently being typed (everything after the last space). */
export function activeToken(value: string): string {
  const match = value.match(/(\S+)$/);
  return match ? match[1] : "";
}

/** Replace the trailing token with `replacement`, keeping the rest intact. */
export function replaceActiveToken(value: string, replacement: string): string {
  return value.replace(/(\S+)$/, replacement) + " ";
}
