import ClueTablet from "./ClueTablet";
import styles from "../styles/ClueTablet.module.css";

// Bernadette's starting board (the main 5x5).
const BERNADETTE_LAYOUT = "EA..D...F..IK.O.Q...V.Y.Z";

// --- Clue positions on the 5x5 grid --------------------------------------
// row/col are 1-indexed (row 1 = top, col 1 = left). These are BEST-GUESS
// positions read off the photographed tablets — edit freely to re-align.
type Mark = { row: number; col: number; symbol: "X" | "O" };
type Arrow = { from: [number, number]; to: [number, number]; double?: boolean };

const FENRICK: { marks: Mark[]; arrows: Arrow[] } = {
  // X -> O, moving right along row 4 (col 3 -> col 5)
  marks: [
    { row: 4, col: 3, symbol: "X" },
    { row: 4, col: 5, symbol: "O" },
  ],
  arrows: [{ from: [4, 3], to: [4, 5] }],
};

const AURELIA: { marks: Mark[]; arrows: Arrow[] } = {
  // X -> O, moving up column 4 (row 4 -> row 2)
  marks: [
    { row: 2, col: 4, symbol: "O" },
    { row: 4, col: 4, symbol: "X" },
  ],
  arrows: [{ from: [4, 4], to: [2, 4] }],
};

const BJORN_ASTRID: { marks: Mark[]; arrows: Arrow[] } = {
  // two horizontal swaps near the corners
  marks: [
    { row: 2, col: 1, symbol: "O" },
    { row: 2, col: 5, symbol: "X" },
    { row: 4, col: 1, symbol: "X" },
    { row: 4, col: 5, symbol: "O" },
  ],
  arrows: [
    { from: [2, 1], to: [2, 5], double: true },
    { from: [4, 1], to: [4, 5], double: true },
  ],
};

// Cell-centre coordinates in a 0..100 square (1-indexed).
const cx = (col: number) => ((col - 0.5) / 5) * 100;
const cy = (row: number) => ((row - 0.5) / 5) * 100;

/** Pull an arrow's endpoints in toward each other so the heads sit between
 *  the mark tiles rather than under them. */
function endpoints(a: Arrow, pad = 7) {
  const x1 = cx(a.from[1]);
  const y1 = cy(a.from[0]);
  const x2 = cx(a.to[1]);
  const y2 = cy(a.to[0]);
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  return { x1: x1 + ux * pad, y1: y1 + uy * pad, x2: x2 - ux * pad, y2: y2 - uy * pad };
}

/** A square 5x5 clue grid with X/O marks placed in cells and arrows drawn
 *  between them — so the positions line up with the main board. */
function GridClue({ marks, arrows }: { marks: Mark[]; arrows: Arrow[] }) {
  return (
    <div className={styles.clueGrid}>
      {Array.from({ length: 25 }).map((_, i) => (
        <span key={i} className={styles.clueGridCell} />
      ))}

      <svg className={styles.clueArrows} viewBox="0 0 100 100">
        <defs>
          <marker
            id="clueArrowHead"
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="4"
            markerHeight="4"
            orient="auto-start-reverse"
          >
            <path d="M0,0 L10,5 L0,10 z" fill="currentColor" />
          </marker>
        </defs>
        {arrows.map((a, i) => {
          const p = endpoints(a);
          return (
            <line
              key={i}
              x1={p.x1}
              y1={p.y1}
              x2={p.x2}
              y2={p.y2}
              stroke="currentColor"
              strokeWidth={2}
              markerEnd="url(#clueArrowHead)"
              markerStart={a.double ? "url(#clueArrowHead)" : undefined}
            />
          );
        })}
      </svg>

      {marks.map((m, i) => (
        <span
          key={i}
          className={styles.clueMark}
          style={{ left: `${cx(m.col)}%`, top: `${cy(m.row)}%` }}
        >
          {m.symbol}
        </span>
      ))}
    </div>
  );
}

export default function Clues() {
  return (
    <div className={styles.clues}>
      <h2 className={styles.cluesHeading}>The Tablets</h2>

      <ClueTablet
        name="Rook Wood"
        note="The odd one out — eight marks in four pairs, plus a red envelope."
      >
        <div className={styles.ruleRow}>
          {["XX", "XX", "XX", "XX"].map((pair, i) => (
            <span key={i} className={styles.miniTile}>
              {pair}
            </span>
          ))}
        </div>
      </ClueTablet>

      <ClueTablet
        name="Bernadette"
        note="The 5×5 grid — this is the board in the centre. (Came with an addressed envelope.)"
      >
        <div className={styles.miniGrid}>
          {BERNADETTE_LAYOUT.split("").map((ch, i) => (
            <span
              key={i}
              className={ch === "." ? styles.miniCellEmpty : styles.miniCell}
            >
              {ch === "." ? "" : ch}
            </span>
          ))}
        </div>
      </ClueTablet>

      <ClueTablet name="Bjorn/Astrid" note="Two swaps, left ↔ right.">
        <GridClue marks={BJORN_ASTRID.marks} arrows={BJORN_ASTRID.arrows} />
      </ClueTablet>

      <ClueTablet name="Fenrick" note="A tile moves right.">
        <GridClue marks={FENRICK.marks} arrows={FENRICK.arrows} />
      </ClueTablet>

      <ClueTablet name="Aurélia" note="A tile moves up.">
        <GridClue marks={AURELIA.marks} arrows={AURELIA.arrows} />
      </ClueTablet>

      {[0, 1].map((n) => (
        <ClueTablet key={`sealed-${n}`} name="? ? ?" note="Sealed — will be revealed soon." locked>
          <div className={styles.sealed}>
            <span className={styles.sealedGlyph}>?</span>
          </div>
        </ClueTablet>
      ))}
    </div>
  );
}
