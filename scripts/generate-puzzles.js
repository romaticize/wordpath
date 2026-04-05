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

function bfsPath(start, end) {
  if (start === end) return [start];
  if (!WORDS.has(start) || !WORDS.has(end)) return null;
  const queue = [[start]];
  const visited = new Set([start]);
  while (queue.length) {
    const path = queue.shift();
    const current = path[path.length - 1];
    for (const neighbor of getNeighbors(current)) {
      if (neighbor === end) return [...path, end];
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push([...path, neighbor]);
      }
    }
  }
  return null;
}

// --- Candidate pairs from the build prompt ---
const candidates = [
  ["cold","warm","Temperature"],
  ["love","hate","Opposites"],
  ["head","tail","Flip"],
  ["lost","find","Seek"],
  ["wild","calm","Zen"],
  ["word","game","Meta"],
  ["read","book","Library"],
  ["king","fool","Shakespeare"],
  ["bone","meat","Dinner"],
  ["ship","boat","At Sea"],
  ["dark","dawn","Nightfall"],
  ["hide","seek","Childhood"],
  ["fall","rise","Gravity"],
  ["slow","fast","Speed"],
  ["bold","meek","Courage"],
  ["fore","back","Direction"],
  ["hope","fear","Emotion"],
  ["fire","rain","Elements"],
  ["land","sail","Voyage"],
  ["moon","star","Night Sky"],
  ["dusk","dawn","Twilight"],
  ["sail","dock","Harbor"],
  ["rest","wake","Sleep"],
  ["gold","rust","Decay"],
  ["home","road","Journey"],
  ["burn","cool","Heat"],
  ["harm","heal","Medicine"],
  ["lake","pond","Water"],
  ["sand","dust","Desert"],
  ["silk","wool","Fabric"],
  ["cake","diet","Temptation"],
  ["mind","soul","Philosophy"],
  ["wall","door","Room"],
  ["rain","snow","Weather"],
  ["fist","palm","Hand"],
  ["rock","sand","Beach"],
  ["nest","home","Shelter"],
  ["mare","colt","Horses"],
  ["code","hack","Cyber"],
  ["food","diet","Nutrition"],
  ["wine","beer","Drinks"],
  ["cook","meal","Kitchen"],
  ["fame","doom","Fortune"],
  ["punk","folk","Music"],
  // Additional pairs to reach 90+
  ["warm","cool","Climate"],
  ["hate","love","Reversal"],
  ["work","play","Balance"],
  ["rich","poor","Wealth"],
  ["dawn","dusk","Horizon"],
  ["hard","soft","Texture"],
  ["lock","door","Security"],
  ["fish","bird","Animal"],
  ["wine","dine","Evening"],
  ["boat","dock","Marina"],
  ["coal","mine","Industry"],
  ["ring","bell","Sound"],
  ["pine","tree","Forest"],
  ["cold","heat","Season"],
  ["card","game","Casino"],
  ["milk","meal","Morning"],
  ["song","tune","Melody"],
  ["worm","bird","Garden"],
  ["mail","post","Delivery"],
  ["boot","shoe","Footwear"],
  ["horn","bell","Alarm"],
  ["seed","tree","Growth"],
  ["cage","free","Liberty"],
  ["mist","rain","Fog"],
  ["rope","knot","Sailing"],
  ["dime","coin","Money"],
  ["talk","sing","Voice"],
  ["mold","rust","Aging"],
  ["tomb","dead","Gothic"],
  ["wine","vine","Vineyard"],
  ["wand","wilt","Magic"],
  ["mood","calm","Mindful"],
  ["hunt","prey","Safari"],
  ["wolf","lamb","Fable"],
  ["fork","road","Crossroads"],
  ["core","rind","Fruit"],
  ["bake","cook","Oven"],
  ["loom","knit","Craft"],
  ["rust","gold","Alchemy"],
  ["dawn","noon","Daytime"],
  ["helm","sail","Captain"],
  ["haze","mist","Morning Dew"],
  ["tale","myth","Legend"],
  ["fort","wall","Castle"],
  ["cape","mask","Hero"],
  ["gulf","cove","Coast"],
  ["weed","seed","Planting"],
  ["gale","wind","Storm"],
  ["silk","lace","Elegant"],
  ["moor","lake","Highland"],
  ["fawn","deer","Woodland"],
  ["harp","drum","Orchestra"],
  ["lime","mint","Fresh"],
  ["peak","base","Mountain"],
  ["foam","wave","Surf"],
  ["veil","mask","Disguise"],
  ["soot","coal","Chimney"],
  ["mead","wine","Medieval"],
  ["lure","bait","Fishing"],
  ["dune","sand","Sahara"],
  ["lair","cave","Hidden"],
  ["fern","moss","Undergrowth"],
  ["sore","heal","Recovery"],
  ["glow","dark","Firefly"],
  ["pork","beef","Butcher"],
  ["cork","wine","Bottle"],
  ["woke","rise","Awaken"],
];

console.log("Validating puzzles against word dictionary...\n");
console.log(`Dictionary size: ${WORDS.size} words\n`);

const valid = [];
const rejected = [];

for (const [start, end, hint] of candidates) {
  if (!WORDS.has(start)) {
    rejected.push({ start, end, hint, reason: `"${start}" not in dictionary` });
    continue;
  }
  if (!WORDS.has(end)) {
    rejected.push({ start, end, hint, reason: `"${end}" not in dictionary` });
    continue;
  }

  const path = bfsPath(start, end);
  if (!path) {
    rejected.push({ start, end, hint, reason: "no path exists" });
    continue;
  }

  const steps = path.length - 1;
  if (steps > 5) {
    rejected.push({ start, end, hint, reason: `optimal path too long (${steps} steps)` });
    continue;
  }
  if (steps < 2) {
    rejected.push({ start, end, hint, reason: `too easy (${steps} step)` });
    continue;
  }

  // Verify every word in the path is in the dictionary
  const missingWords = path.filter(w => !WORDS.has(w));
  if (missingWords.length > 0) {
    rejected.push({ start, end, hint, reason: `path words not in dict: ${missingWords.join(", ")}` });
    continue;
  }

  valid.push({ start, end, hint, optimalSteps: steps, path });
}

console.log(`=== VALID PUZZLES: ${valid.length} ===\n`);
for (const p of valid) {
  console.log(`  ${p.start} → ${p.end}  (${p.optimalSteps} steps)  "${p.hint}"  path: ${p.path.join(" → ")}`);
}

console.log(`\n=== REJECTED: ${rejected.length} ===\n`);
for (const r of rejected) {
  console.log(`  ${r.start} → ${r.end}  "${r.hint}"  — ${r.reason}`);
}

// Output JS array for copy-paste into puzzles.js
console.log(`\n\n=== COPY THIS INTO puzzles.js ===\n`);
console.log("const PUZZLES = [");
for (const p of valid) {
  console.log(`  { start: "${p.start}", end: "${p.end}", hint: "${p.hint}", optimalSteps: ${p.optimalSteps} },`);
}
console.log("];");
