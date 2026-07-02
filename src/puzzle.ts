// The puzzle grid is a fixed 5x5. Each cell holds either a single uppercase
// letter (a movable "tile") or an empty string (a blank cell / drop target).

export const GRID_SIZE = 5;
export const CELL_COUNT = GRID_SIZE * GRID_SIZE; // 25

export type Grid = string[]; // length 25, "" = blank

// Bernadette's starting board. "." marks a blank cell.
//   Row 1:  E A . . D
//   Row 2:  . . . F .
//   Row 3:  . I K . O
//   Row 4:  . Q . . .
//   Row 5:  V . Y . Z
const INITIAL_STRING = "EA..D" + "...F." + ".IK.O" + ".Q..." + "V.Y.Z";

export const INITIAL_GRID: Grid = stringToGrid(INITIAL_STRING);

/** Convert a 25-char layout string ("." or " " = blank) into a Grid. */
export function stringToGrid(s: string): Grid {
  const grid: Grid = [];
  for (let i = 0; i < CELL_COUNT; i++) {
    const ch = s[i] ?? ".";
    grid.push(ch === "." || ch === " " ? "" : ch.toUpperCase());
  }
  return grid;
}

/** Convert a Grid into a 25-char layout string (blanks become "."). */
export function gridToString(grid: Grid): string {
  let s = "";
  for (let i = 0; i < CELL_COUNT; i++) s += grid[i] || ".";
  return s;
}

/**
 * Move the tile at `from` to `to`.
 * - Target blank -> tile moves into it (source becomes blank).
 * - Target occupied -> the two tiles swap.
 * Returns a new Grid (never mutates the input).
 */
export function moveTile(grid: Grid, from: number, to: number): Grid {
  if (from === to || !inBounds(from) || !inBounds(to)) return grid;
  const next = grid.slice();
  const tmp = next[to];
  next[to] = next[from];
  next[from] = tmp; // swap; when target was blank this leaves `from` blank
  return next;
}

/** Set a single cell (letter or "" to clear). Returns a new Grid. */
export function setCell(grid: Grid, index: number, value: string): Grid {
  if (!inBounds(index)) return grid;
  const next = grid.slice();
  next[index] = value ? value.toUpperCase().slice(0, 1) : "";
  return next;
}

function inBounds(i: number): boolean {
  return Number.isInteger(i) && i >= 0 && i < CELL_COUNT;
}

// --- Share-link encoding -------------------------------------------------
// Grid state travels in the URL hash as `#g=<encoded>` so a link reproduces
// the exact board. We URL-safe base64 the 25-char layout string.

export function encodeGrid(grid: Grid): string {
  const raw = gridToString(grid);
  return btoa(raw).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function decodeGrid(encoded: string): Grid | null {
  try {
    const b64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
    const raw = atob(b64);
    if (raw.length !== CELL_COUNT) return null;
    return stringToGrid(raw);
  } catch {
    return null;
  }
}
