import { WORDS } from "./words.js";

export function getNeighbors(word) {
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

export function bfsPath(start, end) {
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

export function countDiff(a, b) {
  let d = 0;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) d++;
  return d;
}
