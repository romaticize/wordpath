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

function bfsDist(start, end) {
  if (start === end) return { dist: 0, path: [start] };
  const queue = [[start]];
  const visited = new Set([start]);
  while (queue.length) {
    const path = queue.shift();
    const current = path[path.length - 1];
    if (path.length > 6) return null;
    for (const n of getNeighbors(current)) {
      if (n === end) return { dist: path.length, path: [...path, end] };
      if (!visited.has(n)) {
        visited.add(n);
        queue.push([...path, n]);
      }
    }
  }
  return null;
}

// Thematic groups — words that share a theme but aren't direct antonyms/synonyms
// The trick: multiple words could be the answer, so the hint doesn't give it away
const themes = {
  "Woodland": ["bark","bear","bird","bush","deer","fawn","fern","hawk","hare","leaf","moss","nest","pine","root","seed","tree","vine","wild","wolf","wood","wren"],
  "Dockside": ["boat","cape","cove","dock","fish","foam","gulf","helm","hull","mast","pier","port","reef","rope","sail","seal","ship","surf","tide","wave","oar"],
  "Bakery": ["bake","bran","burn","cake","chef","cook","dine","dish","feed","food","fork","heat","herb","loaf","meal","menu","mill","mint","oven","rice","salt","soup","stew","tart","warm","yolk"],
  "Workshop": ["axle","belt","bolt","clad","cord","file","ford","gear","grit","hack","iron","kiln","knob","knot","lamp","lead","lock","mill","nail","pipe","plug","rack","rust","sand","slab","slot","stem","tank","tool","vise","weld","wire","worm","zinc"],
  "Dungeon": ["arch","bold","cave","dark","doom","door","duel","evil","fate","fear","fist","fort","grim","hall","helm","hide","hunt","iron","jail","king","lair","lock","lore","mace","moat","monk","myth","oath","rage","robe","ruin","sage","tomb","trap","veil","wall","ward","wand"],
  "Apothecary": ["balm","bark","brew","cure","dose","drug","fern","herb","leaf","lime","mint","mold","moss","ooze","pill","root","sage","salt","seed","stem","veil","vine","weed","wort"],
  "Tailor": ["bold","cape","clad","cord","darn","dull","dyed","felt","fine","fold","gown","hemp","knit","lace","loom","mend","robe","seam","shed","silk","slim","snug","spin","suit","taut","trim","veil","vest","warm","wear","welt","wide","wilt","wool","wove","yarn"],
  "Clocktower": ["bell","bolt","chop","dawn","dial","dusk","face","gear","gong","half","hand","hour","iron","knob","late","lock","long","moon","noon","pace","past","peal","ring","rise","slow","spin","stop","tick","time","toll","tone","turn","wake","wane","week","wind","year"],
  "Smithy": ["anvil","band","bell","bolt","burn","cast","coal","coil","cord","dent","edge","file","fire","ford","glow","grit","hack","hard","heat","helm","iron","kiln","lead","mace","malt","meld","mold","nail","rust","slag","slug","soft","soot","tank","weld","zinc"],
  "Harbour": ["bale","barn","beam","bell","bolt","brig","buoy","cape","clam","coal","coil","crab","crew","dock","dune","fish","flag","foam","ford","gale","gulf","gust","haul","helm","hook","hull","junk","keel","knot","lake","load","lock","loft","lure","mast","moor","nets","oars","palm","pier","plod","port","raft","reef","rope","rust","sail","salt","sand","seal","ship","silt","surf","swan","tack","tank","tide","toad","toss","tow","trap","tuna","vane","wade","wake","warp","wave","weed","whip","wind","yard"],
  "Crypt": ["arch","bare","bone","cold","dark","dead","deep","doom","dusk","dust","echo","evil","fade","fear","glow","grim","haze","hide","howl","iron","jade","lair","lock","lore","mist","moan","monk","mood","moss","mute","myth","oath","omen","pale","pall","rust","sage","seal","shed","sigh","silt","soul","step","still","stir","tale","toll","tomb","urge","veil","void","wail","wane","ward","wary","weep"],
  "Circus": ["arch","ball","band","bear","bell","bold","cage","cape","clap","crew","dart","drum","duel","face","fair","fame","feat","flag","flip","foil","folk","fool","gait","glow","grab","grin","hoop","hurl","jest","jolt","jump","kick","king","knot","lark","lead","leap","lion","lure","mane","mask","mime","moan","oath","pace","palm","peal","pole","pose","prop","pull","rage","rank","ring","robe","rode","role","roll","rope","roar","seal","show","skip","slam","slip","snap","solo","spar","spin","spot","star","step","stir","stun","sway","tame","tent","tilt","toil","toll","toss","tour","trap","trim","trio","trot","tune","turn","twin","veil","wave","whim","whip","wild","wilt","wind","wink","yell","zeal","zoom"],
};

console.log("Searching for hard thematic puzzles (4-5 steps)...\n");

const results = [];

for (const [theme, words] of Object.entries(themes)) {
  const inDict = words.filter(w => WORDS.has(w));

  for (let i = 0; i < inDict.length; i++) {
    for (let j = i + 1; j < inDict.length; j++) {
      const s = inDict[i], e = inDict[j];
      const r = bfsDist(s, e);
      if (r && r.dist >= 4 && r.dist <= 5) {
        results.push({ start: s, end: e, hint: theme, steps: r.dist, path: r.path.join(" > ") });
      }
    }
  }
}

// Deduplicate and pick best per theme
const byTheme = {};
for (const r of results) {
  if (!byTheme[r.hint]) byTheme[r.hint] = [];
  byTheme[r.hint].push(r);
}

console.log("=== RESULTS BY THEME ===\n");
let total = 0;
for (const [theme, puzzles] of Object.entries(byTheme)) {
  // Pick up to 12 per theme, preferring 5-step
  puzzles.sort((a, b) => b.steps - a.steps);
  const picked = puzzles.slice(0, 12);
  console.log(`--- ${theme} (${picked.length} puzzles) ---`);
  for (const p of picked) {
    console.log(`  { start: "${p.start}", end: "${p.end}", hint: "${p.hint}", optimalSteps: ${p.steps} },  // ${p.path}`);
    total++;
  }
}
console.log("\nTotal: " + total);
