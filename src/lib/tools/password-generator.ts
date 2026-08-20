export type PasswordMode = "characters" | "passphrase";
export type RandomUint32 = () => number;

export interface CharacterPasswordOptions {
  length: number;
  quantity: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
  avoidAmbiguous: boolean;
  excluded: string;
}

export interface PassphraseOptions {
  words: number;
  quantity: number;
  separator: "-" | "." | "_" | " ";
  capitalize: boolean;
  numberSuffix: boolean;
}

export interface PasswordGenerationResult {
  values: string[];
  entropyBits: number | null;
  poolSize: number;
  error: string | null;
}

const CHARACTER_CLASSES = {
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  symbols: "!@#$%^&*()_+~`|}{[]:;?><,./-=",
} as const;
const AMBIGUOUS = new Set("Il1O0o|`'\"");
const ADJECTIVES = ["amber", "brisk", "calm", "daring", "eager", "frosty", "gentle", "happy", "ivory", "jolly", "kind", "lively", "mellow", "noble", "orbit", "proud"] as const;
const NOUNS = ["anchor", "badger", "cedar", "delta", "ember", "falcon", "garden", "harbor", "island", "jungle", "kernel", "lantern", "meadow", "nebula", "ocean", "panda"] as const;
const UINT32_RANGE = 0x1_0000_0000;

function browserRandomUint32(): number {
  const value = new Uint32Array(1);
  globalThis.crypto.getRandomValues(value);
  return value[0];
}

export function secureRandomIndex(maxExclusive: number, randomUint32: RandomUint32 = browserRandomUint32): number {
  if (!Number.isInteger(maxExclusive) || maxExclusive < 1 || maxExclusive > UINT32_RANGE) throw new Error("Random range must be an integer from 1 to 2^32.");
  const limit = UINT32_RANGE - (UINT32_RANGE % maxExclusive);
  let value: number;
  do value = randomUint32() >>> 0; while (value >= limit);
  return value % maxExclusive;
}

function filterCharacters(characters: string, excluded: Set<string>, avoidAmbiguous: boolean): string {
  return Array.from(characters).filter((character) => !excluded.has(character) && (!avoidAmbiguous || !AMBIGUOUS.has(character))).join("");
}

function countValidStrings(classSizes: number[], length: number): number {
  const total = classSizes.reduce((sum, size) => sum + size, 0);
  let count = 0;
  for (let mask = 0; mask < 2 ** classSizes.length; mask += 1) {
    let removed = 0;
    let bits = 0;
    for (let index = 0; index < classSizes.length; index += 1) if (mask & (1 << index)) { removed += classSizes[index]; bits += 1; }
    count += (bits % 2 ? -1 : 1) * (total - removed) ** length;
  }
  return count;
}

export function generateCharacterPasswords(options: CharacterPasswordOptions, randomUint32: RandomUint32 = browserRandomUint32): PasswordGenerationResult {
  if (!Number.isInteger(options.length) || options.length < 8 || options.length > 128) return { values: [], entropyBits: null, poolSize: 0, error: "Length must be an integer from 8 to 128." };
  if (!Number.isInteger(options.quantity) || options.quantity < 1 || options.quantity > 50) return { values: [], entropyBits: null, poolSize: 0, error: "Quantity must be an integer from 1 to 50." };
  const excluded = new Set(Array.from(options.excluded));
  const enabled = (["uppercase", "lowercase", "numbers", "symbols"] as const)
    .filter((name) => options[name])
    .map((name) => ({ name, characters: filterCharacters(CHARACTER_CLASSES[name], excluded, options.avoidAmbiguous) }));
  if (!enabled.length) return { values: [], entropyBits: null, poolSize: 0, error: "Select at least one character class." };
  const emptied = enabled.find((item) => !item.characters);
  if (emptied) return { values: [], entropyBits: null, poolSize: 0, error: `The ${emptied.name} class is empty after exclusions.` };
  if (options.length < enabled.length) return { values: [], entropyBits: null, poolSize: 0, error: `Length must be at least ${enabled.length} to include every selected class.` };
  const pool = enabled.map((item) => item.characters).join("");
  const containsEveryClass = (value: string) => enabled.every((item) => Array.from(value).some((character) => item.characters.includes(character)));
  const values: string[] = [];
  for (let item = 0; item < options.quantity; item += 1) {
    let candidate = "";
    let attempts = 0;
    do {
      candidate = Array.from({ length: options.length }, () => pool[secureRandomIndex(pool.length, randomUint32)]).join("");
      attempts += 1;
      if (attempts > 100_000) return { values: [], entropyBits: null, poolSize: pool.length, error: "The selected constraints could not be satisfied. Increase length or enable more characters." };
    } while (!containsEveryClass(candidate));
    values.push(candidate);
  }
  const validCount = countValidStrings(enabled.map((item) => item.characters.length), options.length);
  return { values, entropyBits: validCount > 0 ? Math.log2(validCount) : null, poolSize: pool.length, error: null };
}

export function generatePassphrases(options: PassphraseOptions, randomUint32: RandomUint32 = browserRandomUint32): PasswordGenerationResult {
  if (!Number.isInteger(options.words) || options.words < 4 || options.words > 12) return { values: [], entropyBits: null, poolSize: 256, error: "Compound-word count must be an integer from 4 to 12." };
  if (!Number.isInteger(options.quantity) || options.quantity < 1 || options.quantity > 50) return { values: [], entropyBits: null, poolSize: 256, error: "Quantity must be an integer from 1 to 50." };
  const values = Array.from({ length: options.quantity }, () => {
    const words = Array.from({ length: options.words }, () => {
      const compound = `${ADJECTIVES[secureRandomIndex(ADJECTIVES.length, randomUint32)]}${NOUNS[secureRandomIndex(NOUNS.length, randomUint32)]}`;
      return options.capitalize ? compound[0].toUpperCase() + compound.slice(1) : compound;
    });
    const suffix = options.numberSuffix ? String(secureRandomIndex(100, randomUint32)).padStart(2, "0") : "";
    return `${words.join(options.separator)}${suffix}`;
  });
  return { values, entropyBits: options.words * 8 + (options.numberSuffix ? Math.log2(100) : 0), poolSize: 256, error: null };
}

export function entropyLabel(bits: number | null): string {
  if (bits === null) return "Unavailable";
  if (bits < 40) return "Low";
  if (bits < 60) return "Moderate";
  if (bits < 80) return "Strong";
  return "Very strong";
}
