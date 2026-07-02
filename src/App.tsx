import { useCallback, useEffect, useState } from "react";
import Grid from "./components/Grid";
import Clues from "./components/Clues";
import {
  INITIAL_GRID,
  decodeGrid,
  encodeGrid,
  moveTile,
  setCell,
  type Grid as GridState,
} from "./puzzle";
import styles from "./styles/App.module.css";

const STORAGE_KEY = "dnd-puzzle-grid";
const CB_KEY = "dnd-puzzle-colourblind";

/** Load order: URL hash (#g=...) -> localStorage -> Bernadette's initial grid. */
function loadInitialGrid(): GridState {
  const hash = window.location.hash;
  const match = hash.match(/[#&]g=([^&]+)/);
  if (match) {
    const fromUrl = decodeGrid(match[1]);
    if (fromUrl) return fromUrl;
  }
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length === INITIAL_GRID.length) {
        return parsed as GridState;
      }
    }
  } catch {
    /* ignore corrupt storage */
  }
  return INITIAL_GRID;
}

export default function App() {
  const [grid, setGrid] = useState<GridState>(loadInitialGrid);
  const [copied, setCopied] = useState(false);
  const [colourBlind, setColourBlind] = useState(
    () => localStorage.getItem(CB_KEY) === "1",
  );

  // Auto-save on every change.
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(grid));
  }, [grid]);

  // Apply the colour-blind theme by toggling a class on <html>, and remember it.
  useEffect(() => {
    document.documentElement.classList.toggle("cb", colourBlind);
    localStorage.setItem(CB_KEY, colourBlind ? "1" : "0");
  }, [colourBlind]);

  const handleMove = useCallback(
    (from: number, to: number) => setGrid((g) => moveTile(g, from, to)),
    [],
  );

  const handleSetCell = useCallback(
    (index: number, value: string) => setGrid((g) => setCell(g, index, value)),
    [],
  );

  function handleReset() {
    setGrid(INITIAL_GRID);
    history.replaceState(null, "", window.location.pathname + window.location.search);
  }

  async function handleShare() {
    const encoded = encodeGrid(grid);
    const url = `${window.location.origin}${window.location.pathname}${window.location.search}#g=${encoded}`;
    history.replaceState(null, "", `#g=${encoded}`);
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked (e.g. insecure context) — the URL bar still updated.
      window.prompt("Copy this shareable link:", url);
    }
  }

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1 className={styles.title}>The Tablets</h1>
        <p className={styles.subtitle}>
          A shared scratchpad for the puzzle. Drag tiles to move them (drop onto
          another tile to swap), or click a square and type to edit it.
        </p>
      </header>

      <main className={styles.layout}>
        <aside className={styles.sidebar}>
          <Clues />
        </aside>

        <section className={styles.board}>
          <div className={styles.toolbar}>
            <button
              type="button"
              className={`${styles.button} ${styles.buttonDanger}`}
              onClick={handleReset}
            >
              Reset to original
            </button>
            <button type="button" className={styles.button} onClick={handleShare}>
              {copied ? "Link copied!" : "Copy shareable link"}
            </button>
            <button
              type="button"
              className={`${styles.button} ${colourBlind ? styles.buttonOn : styles.buttonDanger}`}
              onClick={() => setColourBlind((v) => !v)}
              aria-pressed={colourBlind}
            >
              Fenrick mode: {colourBlind ? "on" : "off"}
            </button>
          </div>
          <Grid grid={grid} onMove={handleMove} onSetCell={handleSetCell} />
          <p className={styles.hint}>
            Tip: use the arrow keys to move between squares, letters to fill them,
            and Backspace to clear.
          </p>
        </section>
      </main>
    </div>
  );
}
