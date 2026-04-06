import { WORDS } from "../src/lib/words.js";

function getNeighbors(word) {
  const neighbors = [];
  for (let i = 0; i < word.length; i++) {
    for (let c = 97; c <= 122; c++) {
      const ch = String.fromCharCode(c);
      if (ch === word[i]) continue;
      const next = word.slice(0, i) + ch + word.slice(i + 1);
      if (WORDS.has(next)) neighbors.push(next);
    }
  }
  return neighbors;
}

function bfsPath(s, e) {
  if (s === e) return [s];
  if (!WORDS.has(s) || !WORDS.has(e)) return null;
  const q = [[s]], v = new Set([s]);
  while (q.length) {
    const p = q.shift(), c = p[p.length - 1];
    for (const n of getNeighbors(c)) {
      if (n === e) return [...p, e];
      if (!v.has(n)) { v.add(n); q.push([...p, n]); }
    }
  }
  return null;
}

const puzzles = [
  // Parts of a tree
  ["bark", "leaf", "Tree"],
  ["bark", "root", "Tree"],
  ["leaf", "root", "Tree"],
  // Two sides of a coin
  ["head", "tail", "Coin"],
  // Parts of a book
  ["read", "book", "Library"],
  ["word", "page", "Writing"],
  ["tale", "myth", "Folklore"],
  // Temperature spectrum
  ["cold", "warm", "Thermostat"],
  ["burn", "cool", "Kiln"],
  ["melt", "cold", "Ice"],
  ["warm", "cool", "Breeze"],
  // Emotion pairs
  ["bold", "fear", "Courage"],
  ["mood", "calm", "Meditation"],
  ["fame", "doom", "Hubris"],
  ["rage", "calm", "Temper"],
  // Time of day
  ["dawn", "dusk", "Horizon"],
  ["bell", "noon", "Clocktower"],
  ["bell", "toll", "Cathedral"],
  ["dusk", "moon", "Twilight"],
  ["dawn", "noon", "Sundial"],
  // Body
  ["fist", "palm", "Hand"],
  ["head", "bone", "Skull"],
  ["shin", "knee", "Leg"],
  ["mane", "tail", "Horse"],
  // Food & kitchen
  ["bake", "cook", "Kitchen"],
  ["burn", "food", "Oven"],
  ["meal", "wine", "Feast"],
  ["salt", "soup", "Broth"],
  ["cake", "diet", "Willpower"],
  ["fork", "meal", "Dinner"],
  // Nature
  ["foam", "wave", "Surf"],
  ["sand", "dust", "Desert"],
  ["lake", "pond", "Still Water"],
  ["seed", "tree", "Orchard"],
  ["gale", "wind", "Storm"],
  ["dune", "sand", "Sahara"],
  ["vine", "weed", "Garden"],
  ["fern", "moss", "Forest Floor"],
  // Sea & ships
  ["boat", "pier", "Marina"],
  ["boat", "helm", "Captain"],
  ["hull", "mast", "Vessel"],
  ["ship", "sail", "Voyage"],
  ["sail", "wind", "Regatta"],
  ["gulf", "cove", "Coastline"],
  ["tide", "wave", "Shore"],
  ["cork", "wine", "Cellar"],
  // Metal & craft
  ["gold", "rust", "Metal"],
  ["rust", "gold", "Alchemy"],
  ["iron", "rust", "Corrosion"],
  ["silk", "wool", "Textile"],
  ["silk", "lace", "Bridal"],
  ["loom", "knit", "Craft"],
  ["band", "ring", "Jeweler"],
  ["bolt", "lock", "Secure"],
  // Dark & mystery
  ["bone", "dust", "Ancient"],
  ["tomb", "bone", "Pharaoh"],
  ["lair", "cave", "Dragon"],
  ["cave", "dark", "Spelunking"],
  ["mask", "cape", "Disguise"],
  ["veil", "mask", "Hidden"],
  ["code", "hack", "Cipher"],
  ["maze", "path", "Labyrinth"],
  // Opposites/contrasts
  ["home", "road", "Wanderlust"],
  ["rest", "wake", "Alarm"],
  ["lost", "find", "Treasure Hunt"],
  ["wild", "calm", "Taming"],
  ["hard", "soft", "Clay"],
  ["peak", "base", "Mountain"],
  // Sound & music
  ["bell", "tone", "Chime"],
  ["song", "tune", "Jukebox"],
  ["drum", "beat", "Rhythm"],
  ["harp", "song", "Ballad"],
  // Animals
  ["goat", "wolf", "Fable"],
  ["bear", "hare", "Wildlife"],
  ["hawk", "dove", "Diplomacy"],
  ["colt", "mare", "Stable"],
  ["bark", "wolf", "Howl"],
  // Misc clever
  ["king", "fool", "Court Jester"],
  ["duke", "king", "Throne"],
  ["coal", "gold", "Mine"],
  ["core", "rind", "Orange"],
  ["woke", "rise", "Morning"],
  ["dawn", "rise", "Rooster"],
  ["cork", "seal", "Bottle"],
  ["well", "deep", "Wishing"],
  ["fold", "deal", "Poker"],
  ["sore", "well", "Recovery"],
  ["mail", "post", "Letterbox"],
  ["mint", "gold", "Coin Press"],
  ["fort", "wall", "Siege"],
  ["fort", "moat", "Castle"],
  ["yoke", "bond", "Joined"],
];

console.log("Validating puzzles...\n");
const valid = [];
const invalid = [];

for (const [s, e, hint] of puzzles) {
  if (!WORDS.has(s)) { invalid.push(`${s} → ${e} "${hint}" — "${s}" not in dictionary`); continue; }
  if (!WORDS.has(e)) { invalid.push(`${s} → ${e} "${hint}" — "${e}" not in dictionary`); continue; }
  const path = bfsPath(s, e);
  if (!path) { invalid.push(`${s} → ${e} "${hint}" — no path`); continue; }
  const steps = path.length - 1;
  if (steps < 3 || steps > 5) { invalid.push(`${s} → ${e} "${hint}" — ${steps} steps (want 3-5)`); continue; }
  valid.push({ start: s, end: e, hint, optimalSteps: steps, path: path.join(" > ") });
}

console.log(`VALID: ${valid.length}\n`);
for (const p of valid) {
  console.log(`  { start: "${p.start}", end: "${p.end}", hint: "${p.hint}", optimalSteps: ${p.optimalSteps} },  // ${p.path}`);
}

if (invalid.length) {
  console.log(`\nINVALID: ${invalid.length}\n`);
  for (const i of invalid) console.log(`  ${i}`);
}

// Stats
const by = {3:0,4:0,5:0};
for (const p of valid) by[p.optimalSteps]++;
console.log(`\nDifficulty mix: 3-step: ${by[3]}, 4-step: ${by[4]}, 5-step: ${by[5]}`);
