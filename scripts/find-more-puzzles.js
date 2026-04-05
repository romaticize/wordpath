// Find additional good puzzle pairs by scanning the dictionary for
// pairs with optimal paths of 2-5 steps and thematic connections.

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
  if (start === end) return 0;
  const queue = [[start, 0]];
  const visited = new Set([start]);
  while (queue.length) {
    const [current, dist] = queue.shift();
    if (dist >= 5) continue; // stop searching beyond 5
    for (const neighbor of getNeighbors(current)) {
      if (neighbor === end) return dist + 1;
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push([neighbor, dist + 1]);
      }
    }
  }
  return -1; // no path within 5 steps
}

// Thematic pairs to try — common words, evocative pairings
const moreCandidates = [
  ["dawn","dusk","Twilight"],  // might need to check reversed direction
  ["warm","ward","Guardian"],
  ["bear","deer","Wildlife"],
  ["cast","role","Theater"],
  ["lane","road","Street"],
  ["base","fort","Military"],
  ["east","west","Compass"],
  ["melt","cold","Winter"],
  ["coal","warm","Furnace"],
  ["bond","free","Release"],
  ["veil","bare","Reveal"],
  ["dull","keen","Blade"],
  ["good","evil","Morality"],
  ["wail","moan","Grief"],
  ["hunt","find","Search"],
  ["seed","farm","Harvest"],
  ["mist","haze","Foggy"],
  ["sole","pair","Shoes"],
  ["bead","ring","Jewelry"],
  ["meal","wine","Feast"],
  ["goat","wolf","Prey"],
  ["lore","tale","Story"],
  ["noon","dark","Eclipse"],
  ["grit","sand","Rough"],
  ["roam","home","Wander"],
  ["soar","dive","Flight"],
  ["tame","wild","Safari"],
  ["mute","loud","Volume"],
  ["dose","cure","Remedy"],
  ["wage","earn","Paycheck"],
  ["dirt","road","Country"],
  ["tide","wave","Ocean"],
  ["duke","king","Royalty"],
  ["maze","path","Puzzle"],
  ["slab","tile","Patio"],
  ["glow","fade","Sunset"],
  ["fume","rage","Anger"],
  ["coal","gold","Treasure"],
  ["bolt","lock","Secure"],
  ["slim","bulk","Fitness"],
  ["vane","wind","Rooftop"],
  ["reed","pond","Wetland"],
  ["cork","seal","Preserve"],
  ["sore","well","Healing"],
  ["fold","deal","Poker"],
  ["vine","wine","Harvest"],
  ["tomb","bone","Ancient"],
  ["bale","barn","Haystack"],
  ["fort","moat","Castle"],
  ["cove","pier","Seaside"],
  ["helm","mast","Nautical"],
  ["wick","wane","Candle"],
  ["pale","glow","Moonlit"],
  ["pine","coal","Campfire"],
  ["silt","sand","Riverbed"],
  ["brew","wine","Cellar"],
  ["gust","calm","Breeze"],
  ["lure","hook","Angler"],
  ["surf","sand","Tropical"],
  ["wolf","bear","Predator"],
  ["reed","fern","Swamp"],
  ["oar","sail","Rowboat"],  // 3 letters, skip
  ["mead","beer","Tavern"],
  ["dome","arch","Cathedral"],
  ["well","deep","Wishing"],
  ["hive","nest","Colony"],
  ["yoke","bond","Union"],
  ["dawn","rise","Sunrise"],
  ["robe","gown","Dress"],
  ["coal","soot","Fireplace"],
  ["mint","gold","Treasury"],
  ["colt","mare","Stable"],
  ["weed","vine","Overgrown"],
  ["bark","howl","Canine"],
  ["mane","tail","Lion"],
  ["claw","fang","Beast"],
  ["toad","frog","Pond Life"],
  ["dusk","moon","Evening"],
  ["lace","silk","Luxury"],
  ["roar","purr","Feline"],
  ["knot","rope","Marine"],
  ["herd","flock","Pastoral"],
];

const valid = [];
for (const [start, end, hint] of moreCandidates) {
  if (start.length !== 4 || end.length !== 4) continue;
  if (!WORDS.has(start) || !WORDS.has(end)) continue;
  const dist = bfsDist(start, end);
  if (dist >= 2 && dist <= 5) {
    valid.push({ start, end, hint, optimalSteps: dist });
  }
}

console.log(`Found ${valid.length} additional valid puzzles:\n`);
for (const p of valid) {
  console.log(`  { start: "${p.start}", end: "${p.end}", hint: "${p.hint}", optimalSteps: ${p.optimalSteps} },`);
}
