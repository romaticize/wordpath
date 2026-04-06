// 85 validated puzzles — all verified by BFS with optimal paths of 3-5 steps.
// Each pair has a clear relationship; hints describe the connection without giving away the answer.
// Interleaved so no repeated words or themes appear back-to-back.
// Days 0-84: curated puzzles. Day 85+: procedurally generated via seeded PRNG + BFS.
import { WORDS } from "./words.js";
import { getNeighbors, bfsPath } from "./bfs.js";

const PUZZLES = [
  { start: "cold", end: "warm", hint: "Thermostat", optimalSteps: 4 },
  { start: "bark", end: "leaf", hint: "Tree", optimalSteps: 5 },
  { start: "maze", end: "path", hint: "Labyrinth", optimalSteps: 3 },
  { start: "head", end: "tail", hint: "Coin", optimalSteps: 5 },
  { start: "song", end: "tune", hint: "Jukebox", optimalSteps: 4 },
  { start: "foam", end: "wave", hint: "Surf", optimalSteps: 5 },
  { start: "band", end: "ring", hint: "Jeweler", optimalSteps: 3 },
  { start: "bold", end: "fear", hint: "Courage", optimalSteps: 5 },
  { start: "read", end: "book", hint: "Library", optimalSteps: 4 },
  { start: "seed", end: "tree", hint: "Orchard", optimalSteps: 5 },
  { start: "tomb", end: "bone", hint: "Pharaoh", optimalSteps: 3 },
  { start: "dawn", end: "dusk", hint: "Horizon", optimalSteps: 5 },
  { start: "cork", end: "wine", hint: "Cellar", optimalSteps: 4 },
  { start: "king", end: "fool", hint: "Court Jester", optimalSteps: 5 },
  { start: "melt", end: "cold", hint: "Ice", optimalSteps: 3 },
  { start: "boat", end: "pier", hint: "Marina", optimalSteps: 5 },
  { start: "tale", end: "myth", hint: "Folklore", optimalSteps: 4 },
  { start: "home", end: "road", hint: "Wanderlust", optimalSteps: 5 },
  { start: "cave", end: "dark", hint: "Spelunking", optimalSteps: 3 },
  { start: "burn", end: "cool", hint: "Kiln", optimalSteps: 5 },
  { start: "mane", end: "tail", hint: "Horse", optimalSteps: 4 },
  { start: "sand", end: "dust", hint: "Desert", optimalSteps: 5 },
  { start: "coal", end: "gold", hint: "Mine", optimalSteps: 3 },
  { start: "rest", end: "wake", hint: "Alarm", optimalSteps: 5 },
  { start: "silk", end: "lace", hint: "Bridal", optimalSteps: 4 },
  { start: "fame", end: "doom", hint: "Hubris", optimalSteps: 5 },
  { start: "dune", end: "sand", hint: "Sahara", optimalSteps: 3 },
  { start: "hawk", end: "dove", hint: "Diplomacy", optimalSteps: 5 },
  { start: "hull", end: "mast", hint: "Vessel", optimalSteps: 4 },
  { start: "code", end: "hack", hint: "Cipher", optimalSteps: 5 },
  { start: "mask", end: "cape", hint: "Disguise", optimalSteps: 3 },
  { start: "lake", end: "pond", hint: "Still Water", optimalSteps: 5 },
  { start: "goat", end: "wolf", hint: "Fable", optimalSteps: 4 },
  { start: "vine", end: "weed", hint: "Garden", optimalSteps: 5 },
  { start: "fort", end: "moat", hint: "Castle", optimalSteps: 3 },
  { start: "bell", end: "noon", hint: "Clocktower", optimalSteps: 5 },
  { start: "word", end: "page", hint: "Writing", optimalSteps: 4 },
  { start: "lair", end: "cave", hint: "Dragon", optimalSteps: 5 },
  { start: "tide", end: "wave", hint: "Shore", optimalSteps: 3 },
  { start: "mood", end: "calm", hint: "Meditation", optimalSteps: 5 },
  { start: "ship", end: "sail", hint: "Voyage", optimalSteps: 4 },
  { start: "lost", end: "find", hint: "Treasure Hunt", optimalSteps: 5 },
  { start: "head", end: "bone", hint: "Skull", optimalSteps: 4 },
  { start: "gale", end: "wind", hint: "Storm", optimalSteps: 5 },
  { start: "duke", end: "king", hint: "Throne", optimalSteps: 4 },
  { start: "bone", end: "dust", hint: "Ancient", optimalSteps: 5 },
  { start: "rage", end: "calm", hint: "Temper", optimalSteps: 4 },
  { start: "core", end: "rind", hint: "Orange", optimalSteps: 5 },
  { start: "well", end: "deep", hint: "Wishing", optimalSteps: 4 },
  { start: "bark", end: "root", hint: "Tree", optimalSteps: 5 },
  { start: "colt", end: "mare", hint: "Stable", optimalSteps: 4 },
  { start: "gold", end: "rust", hint: "Metal", optimalSteps: 5 },
  { start: "dawn", end: "noon", hint: "Sundial", optimalSteps: 4 },
  { start: "fork", end: "meal", hint: "Dinner", optimalSteps: 5 },
  { start: "bolt", end: "lock", hint: "Secure", optimalSteps: 4 },
  { start: "warm", end: "cool", hint: "Breeze", optimalSteps: 5 },
  { start: "woke", end: "rise", hint: "Morning", optimalSteps: 4 },
  { start: "silk", end: "wool", hint: "Textile", optimalSteps: 5 },
  { start: "wild", end: "calm", hint: "Taming", optimalSteps: 4 },
  { start: "leaf", end: "root", hint: "Tree", optimalSteps: 5 },
  { start: "sail", end: "wind", hint: "Regatta", optimalSteps: 4 },
  { start: "burn", end: "food", hint: "Oven", optimalSteps: 5 },
  { start: "yoke", end: "bond", hint: "Joined", optimalSteps: 4 },
  { start: "loom", end: "knit", hint: "Craft", optimalSteps: 5 },
  { start: "mint", end: "gold", hint: "Coin Press", optimalSteps: 4 },
  { start: "peak", end: "base", hint: "Mountain", optimalSteps: 5 },
  { start: "fist", end: "palm", hint: "Hand", optimalSteps: 5 },
  { start: "dusk", end: "moon", hint: "Twilight", optimalSteps: 5 },
  { start: "bear", end: "hare", hint: "Wildlife", optimalSteps: 5 },
  { start: "sore", end: "well", hint: "Recovery", optimalSteps: 5 },
  { start: "harp", end: "song", hint: "Ballad", optimalSteps: 5 },
  { start: "bake", end: "cook", hint: "Kitchen", optimalSteps: 5 },
  { start: "meal", end: "wine", hint: "Feast", optimalSteps: 5 },
  { start: "drum", end: "beat", hint: "Rhythm", optimalSteps: 5 },
  { start: "bell", end: "tone", hint: "Chime", optimalSteps: 5 },
  { start: "hard", end: "soft", hint: "Clay", optimalSteps: 5 },
  { start: "mail", end: "post", hint: "Letterbox", optimalSteps: 5 },
  { start: "rust", end: "gold", hint: "Alchemy", optimalSteps: 5 },
  { start: "fold", end: "deal", hint: "Poker", optimalSteps: 5 },
  { start: "cork", end: "seal", hint: "Bottle", optimalSteps: 5 },
  { start: "dawn", end: "rise", hint: "Rooster", optimalSteps: 5 },
  { start: "fort", end: "wall", hint: "Siege", optimalSteps: 5 },
  { start: "gulf", end: "cove", hint: "Coastline", optimalSteps: 5 },
  { start: "cake", end: "diet", hint: "Willpower", optimalSteps: 5 },
  { start: "boat", end: "helm", hint: "Captain", optimalSteps: 5 },
];

const EPOCH = new Date("2026-04-05T00:00:00Z").getTime();

// ---------------------------------------------------------------------------
// Seeded PRNG (mulberry32) — deterministic from a 32-bit integer seed
// ---------------------------------------------------------------------------
function mulberry32(seed) {
  let t = (seed | 0) + 0x6d2b79f5;
  return function () {
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ---------------------------------------------------------------------------
// Category map for hint generation
// ---------------------------------------------------------------------------
const CATEGORY_MAP = {
  // Animals
  bear: "Animals", bird: "Animals", deer: "Animals", duck: "Animals",
  fish: "Animals", goat: "Animals", hawk: "Animals", lamb: "Animals",
  lion: "Animals", wolf: "Animals", bull: "Animals", calf: "Animals",
  colt: "Animals", crab: "Animals", crow: "Animals", fawn: "Animals",
  frog: "Animals", hare: "Animals", mare: "Animals", mink: "Animals",
  mole: "Animals", moth: "Animals", mule: "Animals", orca: "Animals",
  swan: "Animals", toad: "Animals", vole: "Animals", worm: "Animals",
  wren: "Animals",

  // Weather
  cold: "Weather", cool: "Weather", heat: "Weather", rain: "Weather",
  snow: "Weather", warm: "Weather", wind: "Weather", gale: "Weather",
  gust: "Weather", hail: "Weather", haze: "Weather", mist: "Weather",
  smog: "Weather", thaw: "Weather",

  // Body
  back: "Body", bone: "Body", face: "Body", foot: "Body",
  hair: "Body", hand: "Body", head: "Body", knee: "Body",
  neck: "Body", palm: "Body", shin: "Body", skin: "Body",
  limb: "Body", heel: "Body", chin: "Body", hips: "Body",
  ribs: "Body",

  // Food
  beef: "Food", brew: "Food", cake: "Food", cook: "Food",
  corn: "Food", diet: "Food", dine: "Food", food: "Food",
  meal: "Food", meat: "Food", milk: "Food", rice: "Food",
  salt: "Food", soup: "Food", stew: "Food", bean: "Food",
  pork: "Food", tofu: "Food", tuna: "Food", veal: "Food",
  wine: "Food", beer: "Food",

  // Nature
  cave: "Nature", dawn: "Nature", dune: "Nature", dust: "Nature",
  fern: "Nature", foam: "Nature", lake: "Nature", leaf: "Nature",
  moon: "Nature", moss: "Nature", pond: "Nature", rock: "Nature",
  sand: "Nature", soil: "Nature", star: "Nature", tide: "Nature",
  tree: "Nature", vine: "Nature", wave: "Nature", wood: "Nature",
  clay: "Nature", reef: "Nature", root: "Nature", seed: "Nature",
  weed: "Nature",

  // Home
  bath: "Home", cook: "Home", desk: "Home", door: "Home",
  hall: "Home", home: "Home", lamp: "Home", lock: "Home",
  roof: "Home", room: "Home", wall: "Home", yard: "Home",
  barn: "Home", shed: "Home", sofa: "Home", oven: "Home",
  bed: "Home",

  // Emotion
  bold: "Emotion", calm: "Emotion", fear: "Emotion", fury: "Emotion",
  glad: "Emotion", grim: "Emotion", hate: "Emotion", hope: "Emotion",
  keen: "Emotion", love: "Emotion", mood: "Emotion", rage: "Emotion",
  envy: "Emotion", glee: "Emotion", woe: "Emotion",

  // Music
  band: "Music", bass: "Music", beat: "Music", bell: "Music",
  drum: "Music", horn: "Music", jazz: "Music", note: "Music",
  sing: "Music", song: "Music", tune: "Music", hymn: "Music",

  // Color
  blue: "Color", gold: "Color", gray: "Color", grey: "Color",
  jade: "Color", lime: "Color", pink: "Color", rose: "Color",
  ruby: "Color", teal: "Color",

  // Travel
  boat: "Travel", cart: "Travel", dock: "Travel", helm: "Travel",
  lane: "Travel", mast: "Travel", path: "Travel", port: "Travel",
  road: "Travel", ride: "Travel", sail: "Travel", ship: "Travel",
  trip: "Travel", tour: "Travel", trek: "Travel",

  // Time
  date: "Time", dusk: "Time", hour: "Time", noon: "Time",
  week: "Time", year: "Time", aged: "Time",

  // Combat
  arms: "Combat", bomb: "Combat", duel: "Combat", fist: "Combat",
  fort: "Combat", hunt: "Combat", raid: "Combat", sword: "Combat",
  trap: "Combat", war: "Combat",
};

// Common, recognizable 4-letter words suitable as puzzle start/end words.
// Filtered to avoid obscure or offensive words.
const COMMON_WORDS = [
  "able","ache","back","bake","bald","ball","band","bank","bare","bark",
  "barn","base","bath","bead","beam","bean","bear","beat","bell","belt",
  "bend","best","bike","bill","bind","bird","bite","blow","blue","blur",
  "boat","bold","bolt","bomb","bond","bone","book","boom","boot","bore",
  "born","boss","bowl","burn","bush","cage","cake","call","calm","came",
  "camp","cane","cape","card","care","cart","case","cash","cast","cave",
  "chef","chin","chip","city","clam","clan","clap","claw","clay","clip",
  "club","clue","coal","coat","code","coin","cold","cole","colt","comb",
  "come","cone","cook","cool","cope","copy","cord","core","cork","corn",
  "cost","cove","crew","crop","crow","cube","cure","curl","cute","dare",
  "dark","dart","dash","date","dawn","deaf","deal","dear","deck","deed",
  "deep","deer","dial","dice","diet","dime","dine","dirt","dock","does",
  "doll","dome","done","doom","door","dose","dove","down","drag","draw",
  "drew","drip","drop","drum","duck","duke","dull","dumb","dump","dune",
  "dust","each","earl","earn","ears","ease","east","easy","edge","edit",
  "emit","epic","even","evil","exam","exit","face","fact","fade","fail",
  "fair","fake","fall","fame","fare","farm","fast","fate","fear","feat",
  "feed","feel","feet","fell","felt","fern","file","fill","film","find",
  "fine","fire","firm","fish","fist","five","flag","flat","fled","flew",
  "flip","flog","flow","foam","foil","fold","folk","fond","food","fool",
  "foot","ford","fore","fork","form","fort","foul","four","fowl","free",
  "frog","from","fuel","full","fume","fund","fuse","gain","gale","game",
  "gang","gate","gave","gaze","gear","gene","gift","girl","glad","glow",
  "glue","goat","goes","gold","golf","gone","good","grab","gray","grew",
  "grid","grim","grin","grip","grit","grow","gulf","guns","gust","guts",
  "hack","hail","hair","half","hall","halt","hand","hang","hard","harm",
  "harp","hash","hate","have","haze","head","heal","heap","hear","heat",
  "heed","heel","held","help","herb","herd","here","hero","hers","hide",
  "high","hike","hill","hint","hire","hits","hold","hole","holy","home",
  "hone","hood","hook","hope","horn","hose","host","hour","huge","hull",
  "hump","hunt","hurt","hush","iced","icon","idea","idle","inch","info",
  "into","iron","isle","itch","item","jack","jail","jams","jars","jaws",
  "jazz","jerk","jobs","join","joke","jump","junk","jury","just","keen",
  "keep","kept","keys","kick","kids","kill","kind","king","kiss","kite",
  "knee","knew","knit","knob","knot","know","lace","lack","laid","lair",
  "lake","lamb","lame","lamp","land","lane","laps","lark","lash","last",
  "late","lawn","laws","lazy","lead","leaf","leak","lean","leap","left",
  "lend","lens","lent","less","liar","lick","lied","lies","life","lift",
  "like","limb","lime","limp","line","link","lion","lips","list","live",
  "load","loaf","loan","lock","loft","logo","logs","lone","long","look",
  "loop","lord","lore","lose","loss","lost","lots","loud","love","luck",
  "lump","lung","lure","lush","lust","made","maid","mail","main","make",
  "male","mall","malt","many","maps","mark","mars","mash","mask","mass",
  "mast","mate","math","maze","mead","meal","mean","meat","meet","meld",
  "melt","memo","mend","menu","mere","mesh","mess","mild","mile","milk",
  "mill","mind","mine","mint","miss","mist","moan","moat","mock","mode",
  "mold","mood","moon","more","moss","most","moth","move","much","mule",
  "muse","must","myth","nail","name","navy","near","neat","neck","need",
  "nest","nets","news","next","nice","nine","node","none","noon","norm",
  "nose","note","nude","oath","oats","obey","odds","oils","once","ones",
  "only","onto","open","opts","orca","ores","ours","outs","oval","oven",
  "over","owed","pace","pack","pact","page","paid","pail","pain","pair",
  "pale","palm","pals","pane","pans","park","part","pass","past","path",
  "pave","pawn","pays","peak","pear","peas","peel","peer","pens","perk",
  "pest","pets","pick","pier","pies","pigs","pile","pill","pine","pink",
  "pins","pipe","pits","pity","plan","play","plot","plow","plug","plum",
  "plus","poem","poet","poke","pole","poll","polo","pond","pony","pool",
  "poor","pope","pops","pore","pork","port","pose","post","pots","pour",
  "pray","prep","prod","prop","pubs","puff","pull","pump","pure","push",
  "race","rack","rage","rags","raid","rail","rain","rake","rank","rare",
  "rash","rate","rats","rays","read","real","rear","reed","reel","rent",
  "rest","rice","rich","ride","rids","rigs","ring","ripe","rips","rise",
  "risk","road","roam","roar","robe","rock","rode","rods","role","roll",
  "roof","room","root","rope","rose","rows","rude","rugs","ruin","rule",
  "runs","rush","rust","sack","safe","saga","sage","said","sail","sake",
  "sale","salt","same","sand","sane","sang","save","scan","scar","seal",
  "seam","seas","seat","seed","seek","seem","seen","self","sell","semi",
  "send","sent","sets","shed","shin","ship","shoe","shop","shot","show",
  "shut","sick","side","sigh","sign","silk","sing","sink","site","sits",
  "size","skin","slam","slap","slim","slip","slot","slow","snap","snow",
  "soak","soap","soar","sock","soda","sofa","soft","soil","sold","sole",
  "solo","some","song","sons","soon","soot","sore","sort","soul","soup",
  "sour","span","sped","spin","spit","spot","spun","stab","star","stay",
  "stem","step","stir","stop","such","suit","sums","suns","sure","swan",
  "swap","swim","tabs","tags","tail","take","tale","talk","tall","tame",
  "tank","tans","tape","taps","task","taxi","team","tear","teas","tech",
  "tell","temp","tend","tens","tent","term","test","text","them","then",
  "they","thin","this","thus","tide","tied","ties","tile","till","time",
  "tins","tiny","tips","tire","toad","toes","toil","told","toll","tone",
  "tons","took","tool","tops","tore","torn","toss","tour","town","toys",
  "trap","tray","tree","trek","trim","trio","trip","trot","true","tube",
  "tuck","tuna","tune","turn","twin","type","ugly","unit","upon","urge",
  "used","user","uses","vain","vary","vase","vast","veal","veil","vein",
  "vent","verb","very","vest","vets","vice","view","vine","visa","void",
  "volt","vote","wade","wage","wail","wait","wake","walk","wall","want",
  "ward","warm","warn","wars","wash","wave","ways","weak","wear","weed",
  "week","well","went","were","west","what","when","wide","wife","wild",
  "will","wilt","wind","wine","wing","wins","wipe","wire","wise","wish",
  "with","woke","wolf","wood","wool","word","wore","work","worm","worn",
  "wrap","yard","yarn","yawn","year","yell","yoga","yoke","your","yule",
  "zeal","zero","zest","zone","zoom",
];

// ---------------------------------------------------------------------------
// Procedural puzzle generation for a given day number (deterministic)
// ---------------------------------------------------------------------------
function generatePuzzle(dayNumber) {
  const rng = mulberry32(dayNumber * 2654435761); // spread seeds via Knuth mult

  // Shuffle helper (Fisher-Yates with seeded rng)
  function shuffled(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  const candidates = shuffled(COMMON_WORDS);

  // Try candidates as start words until we find a valid puzzle
  for (const start of candidates) {
    if (!WORDS.has(start)) continue;

    // BFS from start, collecting words reachable in 2-5 steps
    const dist = new Map();
    dist.set(start, 0);
    const queue = [start];
    const reachable = []; // {word, steps}

    let qi = 0;
    while (qi < queue.length) {
      const current = queue[qi++];
      const d = dist.get(current);
      if (d >= 5) continue; // don't expand beyond 5

      for (const neighbor of getNeighbors(current)) {
        if (!dist.has(neighbor)) {
          const nd = d + 1;
          dist.set(neighbor, nd);
          queue.push(neighbor);
          if (nd >= 2 && nd <= 5) {
            reachable.push({ word: neighbor, steps: nd });
          }
        }
      }
    }

    if (reachable.length === 0) continue;

    // Shuffle reachable and pick first common word
    const shuffledReachable = shuffled(reachable);
    for (const { word: end, steps } of shuffledReachable) {
      // Must be in COMMON_WORDS and different from start
      if (end === start) continue;
      if (!COMMON_WORDS.includes(end)) continue;

      // Generate hint
      const hint = generateHint(start, end, steps);

      return { start, end, hint, optimalSteps: steps };
    }
  }

  // Absolute fallback (should never happen with a good word list)
  return { start: "word", end: "game", hint: "Puzzle", optimalSteps: 5 };
}

// ---------------------------------------------------------------------------
// Hint generation based on category map
// ---------------------------------------------------------------------------
function generateHint(start, end, steps) {
  // Prefer the target word's category, then the start word's
  const endCategory = CATEGORY_MAP[end];
  if (endCategory) return endCategory;

  const startCategory = CATEGORY_MAP[start];
  if (startCategory) return startCategory;

  // Generic hints based on path length
  if (steps <= 2) return "Short Path";
  if (steps <= 3) return "Quick Shift";
  if (steps <= 4) return "Steady Chain";
  return "Long Chain";
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Get the puzzle for a specific day number (0-indexed from EPOCH).
 * Days 0-84: curated puzzles. Day 85+: procedurally generated.
 */
export function getPuzzleForDay(dayNumber) {
  const idx = dayNumber;

  if (dayNumber >= 0 && dayNumber < PUZZLES.length) {
    // Curated puzzle
    return { ...PUZZLES[dayNumber], idx, dayNumber };
  }

  // Procedurally generated puzzle
  const puzzle = generatePuzzle(dayNumber);
  return { ...puzzle, idx, dayNumber };
}

/**
 * Get today's daily puzzle based on UTC date.
 */
export function getDailyPuzzle() {
  const now = Date.now();
  const dayNumber = Math.floor((now - EPOCH) / 86400000);
  return getPuzzleForDay(dayNumber);
}

export { PUZZLES };
