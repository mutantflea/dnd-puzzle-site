import { type Grid as GridState } from "../puzzle";
import styles from "../styles/LetterTable.module.css";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

interface LetterTableProps {
  grid: GridState;
  highlight: string | null;
  onHighlight: (letter: string | null) => void;
}

/** Live readout of which letters are missing from the grid and which are
 *  duplicated. Clicking a duplicate highlights its cells on the board. */
export default function LetterTable({ grid, highlight, onHighlight }: LetterTableProps) {
  const counts = new Map<string, number>();
  for (const ch of grid) {
    if (ch) counts.set(ch, (counts.get(ch) ?? 0) + 1);
  }
  const missing = ALPHABET.filter((l) => !counts.has(l));
  const duplicate = ALPHABET.filter((l) => (counts.get(l) ?? 0) >= 2);

  return (
    <div className={styles.card}>
      <div className={styles.table}>
        <div className={styles.colHead}>Missing</div>
        <div className={styles.colHead}>Duplicate</div>

        <div className={styles.col}>
          {missing.length === 0 ? (
            <span className={styles.empty}>none</span>
          ) : (
            missing.map((l) => (
              <span key={l} className={styles.tile}>
                {l}
              </span>
            ))
          )}
        </div>

        <div className={styles.col}>
          {duplicate.length === 0 ? (
            <span className={styles.empty}>none</span>
          ) : (
            duplicate.map((l) => (
              <button
                key={l}
                type="button"
                className={`${styles.tile} ${styles.tileButton} ${
                  highlight === l ? styles.tileActive : ""
                }`}
                aria-pressed={highlight === l}
                onClick={() => onHighlight(l)}
              >
                {l}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
