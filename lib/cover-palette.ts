const PALETTES: [string, string][] = [
  ["#7a3b33", "#f3e4d7"],
  ["#3f6b4f", "#eeeadb"],
  ["#8a5a3b", "#fbf1de"],
  ["#4b4a6b", "#edeaf5"],
  ["#9c7a1e", "#fbf6e9"],
  ["#5f3c26", "#f6efe3"],
  ["#33545e", "#e7f0f1"],
  ["#6b2f4d", "#f6e6ee"],
];

export function paletteFor(seed: string): [string, string] {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return PALETTES[hash % PALETTES.length];
}
