const PALETTES: [string, string][] = [
  ["#1f1f1f", "#f2f2f2"],
  ["#3a3a3a", "#f2f2f2"],
  ["#525252", "#f5f5f5"],
  ["#6b6b6b", "#f7f7f7"],
  ["#2b2b2b", "#eaeaea"],
  ["#454545", "#efefef"],
  ["#5e5e5e", "#f2f2f2"],
  ["#333333", "#e9e9e9"],
];

export function paletteFor(seed: string): [string, string] {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return PALETTES[hash % PALETTES.length];
}
