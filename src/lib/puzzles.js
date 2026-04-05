// 119 validated puzzles — all verified by BFS with optimal paths of 2-5 steps.
// Days 1-119: curated puzzles. Day 120+: procedurally generated via seeded PRNG + BFS.
import { WORDS } from "./words.js";
import { getNeighbors, bfsPath } from "./bfs.js";

const PUZZLES = [
  { start: "cold", end: "warm", hint: "Temperature", optimalSteps: 4 },
  { start: "love", end: "hate", hint: "Opposites", optimalSteps: 3 },
  { start: "head", end: "tail", hint: "Flip", optimalSteps: 5 },
  { start: "lost", end: "find", hint: "Seek", optimalSteps: 5 },
  { start: "wild", end: "calm", hint: "Zen", optimalSteps: 4 },
  { start: "word", end: "game", hint: "Meta", optimalSteps: 5 },
  { start: "read", end: "book", hint: "Library", optimalSteps: 5 },
  { start: "king", end: "fool", hint: "Shakespeare", optimalSteps: 5 },
  { start: "bone", end: "meat", hint: "Dinner", optimalSteps: 5 },
  { start: "ship", end: "boat", hint: "At Sea", optimalSteps: 5 },
  { start: "dark", end: "dawn", hint: "Nightfall", optimalSteps: 2 },
  { start: "fall", end: "rise", hint: "Gravity", optimalSteps: 4 },
  { start: "bold", end: "meek", hint: "Courage", optimalSteps: 5 },
  { start: "fore", end: "back", hint: "Direction", optimalSteps: 4 },
  { start: "land", end: "sail", hint: "Voyage", optimalSteps: 3 },
  { start: "rest", end: "wake", hint: "Sleep", optimalSteps: 5 },
  { start: "gold", end: "rust", hint: "Decay", optimalSteps: 5 },
  { start: "home", end: "road", hint: "Journey", optimalSteps: 5 },
  { start: "burn", end: "cool", hint: "Heat", optimalSteps: 5 },
  { start: "harm", end: "heal", hint: "Medicine", optimalSteps: 4 },
  { start: "lake", end: "pond", hint: "Water", optimalSteps: 5 },
  { start: "sand", end: "dust", hint: "Desert", optimalSteps: 5 },
  { start: "silk", end: "wool", hint: "Fabric", optimalSteps: 5 },
  { start: "cake", end: "diet", hint: "Temptation", optimalSteps: 5 },
  { start: "fist", end: "palm", hint: "Hand", optimalSteps: 5 },
  { start: "rock", end: "sand", hint: "Beach", optimalSteps: 4 },
  { start: "nest", end: "home", hint: "Shelter", optimalSteps: 5 },
  { start: "mare", end: "colt", hint: "Horses", optimalSteps: 4 },
  { start: "code", end: "hack", hint: "Cyber", optimalSteps: 5 },
  { start: "fame", end: "doom", hint: "Fortune", optimalSteps: 5 },
  { start: "punk", end: "folk", hint: "Music", optimalSteps: 5 },
  { start: "warm", end: "cool", hint: "Climate", optimalSteps: 5 },
  { start: "hate", end: "love", hint: "Reversal", optimalSteps: 3 },
  { start: "hard", end: "soft", hint: "Texture", optimalSteps: 5 },
  { start: "lock", end: "door", hint: "Security", optimalSteps: 4 },
  { start: "boat", end: "dock", hint: "Marina", optimalSteps: 4 },
  { start: "cold", end: "heat", hint: "Season", optimalSteps: 4 },
  { start: "card", end: "game", hint: "Casino", optimalSteps: 3 },
  { start: "milk", end: "meal", hint: "Morning", optimalSteps: 4 },
  { start: "song", end: "tune", hint: "Melody", optimalSteps: 4 },
  { start: "mail", end: "post", hint: "Delivery", optimalSteps: 5 },
  { start: "boot", end: "shoe", hint: "Footwear", optimalSteps: 3 },
  { start: "seed", end: "tree", hint: "Growth", optimalSteps: 5 },
  { start: "dime", end: "coin", hint: "Money", optimalSteps: 5 },
  { start: "talk", end: "sing", hint: "Voice", optimalSteps: 4 },
  { start: "mold", end: "rust", hint: "Aging", optimalSteps: 4 },
  { start: "wand", end: "wilt", hint: "Magic", optimalSteps: 3 },
  { start: "mood", end: "calm", hint: "Mindful", optimalSteps: 5 },
  { start: "fork", end: "road", hint: "Crossroads", optimalSteps: 4 },
  { start: "core", end: "rind", hint: "Fruit", optimalSteps: 5 },
  { start: "bake", end: "cook", hint: "Oven", optimalSteps: 5 },
  { start: "loom", end: "knit", hint: "Craft", optimalSteps: 5 },
  { start: "rust", end: "gold", hint: "Alchemy", optimalSteps: 5 },
  { start: "dawn", end: "noon", hint: "Daytime", optimalSteps: 4 },
  { start: "haze", end: "mist", hint: "Morning Dew", optimalSteps: 5 },
  { start: "tale", end: "myth", hint: "Legend", optimalSteps: 4 },
  { start: "fort", end: "wall", hint: "Castle", optimalSteps: 5 },
  { start: "cape", end: "mask", hint: "Hero", optimalSteps: 3 },
  { start: "gulf", end: "cove", hint: "Coast", optimalSteps: 5 },
  { start: "gale", end: "wind", hint: "Storm", optimalSteps: 5 },
  { start: "silk", end: "lace", hint: "Elegant", optimalSteps: 4 },
  { start: "lime", end: "mint", hint: "Fresh", optimalSteps: 3 },
  { start: "peak", end: "base", hint: "Mountain", optimalSteps: 5 },
  { start: "foam", end: "wave", hint: "Surf", optimalSteps: 5 },
  { start: "soot", end: "coal", hint: "Chimney", optimalSteps: 4 },
  { start: "mead", end: "wine", hint: "Medieval", optimalSteps: 4 },
  { start: "dune", end: "sand", hint: "Sahara", optimalSteps: 3 },
  { start: "lair", end: "cave", hint: "Hidden", optimalSteps: 5 },
  { start: "cork", end: "wine", hint: "Bottle", optimalSteps: 4 },
  { start: "woke", end: "rise", hint: "Awaken", optimalSteps: 4 },
  { start: "bear", end: "deer", hint: "Wildlife", optimalSteps: 2 },
  { start: "cast", end: "role", hint: "Theater", optimalSteps: 4 },
  { start: "lane", end: "road", hint: "Street", optimalSteps: 5 },
  { start: "base", end: "fort", hint: "Military", optimalSteps: 4 },
  { start: "east", end: "west", hint: "Compass", optimalSteps: 3 },
  { start: "melt", end: "cold", hint: "Winter", optimalSteps: 3 },
  { start: "coal", end: "warm", hint: "Furnace", optimalSteps: 5 },
  { start: "hunt", end: "find", hint: "Search", optimalSteps: 3 },
  { start: "seed", end: "farm", hint: "Harvest", optimalSteps: 5 },
  { start: "mist", end: "haze", hint: "Foggy", optimalSteps: 5 },
  { start: "bead", end: "ring", hint: "Jewelry", optimalSteps: 4 },
  { start: "meal", end: "wine", hint: "Feast", optimalSteps: 5 },
  { start: "goat", end: "wolf", hint: "Prey", optimalSteps: 5 },
  { start: "lore", end: "tale", hint: "Story", optimalSteps: 4 },
  { start: "noon", end: "dark", hint: "Eclipse", optimalSteps: 5 },
  { start: "grit", end: "sand", hint: "Rough", optimalSteps: 5 },
  { start: "tame", end: "wild", hint: "Safari", optimalSteps: 5 },
  { start: "dose", end: "cure", hint: "Remedy", optimalSteps: 4 },
  { start: "wage", end: "earn", hint: "Paycheck", optimalSteps: 3 },
  { start: "tide", end: "wave", hint: "Ocean", optimalSteps: 3 },
  { start: "duke", end: "king", hint: "Royalty", optimalSteps: 5 },
  { start: "maze", end: "path", hint: "Puzzle", optimalSteps: 3 },
  { start: "fume", end: "rage", hint: "Anger", optimalSteps: 4 },
  { start: "coal", end: "gold", hint: "Treasure", optimalSteps: 4 },
  { start: "bolt", end: "lock", hint: "Secure", optimalSteps: 4 },
  { start: "vane", end: "wind", hint: "Rooftop", optimalSteps: 3 },
  { start: "reed", end: "pond", hint: "Wetland", optimalSteps: 3 },
  { start: "cork", end: "seal", hint: "Preserve", optimalSteps: 5 },
  { start: "sore", end: "well", hint: "Healing", optimalSteps: 5 },
  { start: "fold", end: "deal", hint: "Poker", optimalSteps: 5 },
  { start: "tomb", end: "bone", hint: "Ancient", optimalSteps: 3 },
  { start: "bale", end: "barn", hint: "Haystack", optimalSteps: 2 },
  { start: "fort", end: "moat", hint: "Castle", optimalSteps: 3 },
  { start: "helm", end: "mast", hint: "Nautical", optimalSteps: 5 },
  { start: "wick", end: "wane", hint: "Candle", optimalSteps: 3 },
  { start: "silt", end: "sand", hint: "Riverbed", optimalSteps: 4 },
  { start: "lure", end: "hook", hint: "Angler", optimalSteps: 5 },
  { start: "reed", end: "fern", hint: "Swamp", optimalSteps: 5 },
  { start: "mead", end: "beer", hint: "Tavern", optimalSteps: 3 },
  { start: "well", end: "deep", hint: "Wishing", optimalSteps: 4 },
  { start: "yoke", end: "bond", hint: "Union", optimalSteps: 4 },
  { start: "dawn", end: "rise", hint: "Sunrise", optimalSteps: 5 },
  { start: "coal", end: "soot", hint: "Fireplace", optimalSteps: 4 },
  { start: "mint", end: "gold", hint: "Treasury", optimalSteps: 4 },
  { start: "colt", end: "mare", hint: "Stable", optimalSteps: 4 },
  { start: "weed", end: "vine", hint: "Overgrown", optimalSteps: 5 },
  { start: "mane", end: "tail", hint: "Lion", optimalSteps: 4 },
  { start: "dusk", end: "moon", hint: "Evening", optimalSteps: 5 },
  { start: "lace", end: "silk", hint: "Luxury", optimalSteps: 4 },
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
 * Days 0-118: curated puzzles. Day 119+: procedurally generated.
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
