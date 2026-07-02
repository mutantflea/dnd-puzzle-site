import ClueTablet from "./ClueTablet";
import styles from "../styles/ClueTablet.module.css";

/** A small engraved mini-tile used inside the clue recreations. */
function Mini({ children }: { children: string }) {
  return <span className={styles.miniTile}>{children}</span>;
}

export default function Clues() {
  return (
    <div className={styles.clues}>
      <h2 className={styles.cluesHeading}>The Tablets</h2>

      <ClueTablet
        name="Bernadette"
        note="The 5×5 grid — this is the board in the centre. (Came with an addressed envelope.)"
      >
        <div className={styles.miniGrid}>
          {("EA..D...F..IK.O.Q...V.Y.Z").split("").map((ch, i) => (
            <span
              key={i}
              className={ch === "." ? styles.miniCellEmpty : styles.miniCell}
            >
              {ch === "." ? "" : ch}
            </span>
          ))}
        </div>
      </ClueTablet>

      <ClueTablet name="Fenrick" note="A tile moves right.">
        <div className={styles.ruleRow}>
          <Mini>X</Mini>
          <span className={styles.arrow}>→</span>
          <Mini>O</Mini>
        </div>
      </ClueTablet>

      <ClueTablet name="Aurélia" note="A tile moves up.">
        <div className={styles.ruleCol}>
          <Mini>O</Mini>
          <span className={styles.arrow}>↑</span>
          <Mini>X</Mini>
        </div>
      </ClueTablet>

      <ClueTablet name="Bjorn/Astrid" note="Two swaps, left ↔ right.">
        <div className={styles.ruleStack}>
          <div className={styles.ruleRow}>
            <Mini>O</Mini>
            <span className={styles.arrow}>↔</span>
            <Mini>X</Mini>
          </div>
          <div className={styles.ruleRow}>
            <Mini>X</Mini>
            <span className={styles.arrow}>↔</span>
            <Mini>O</Mini>
          </div>
        </div>
      </ClueTablet>

      <ClueTablet
        name="Rook Wood"
        note="The odd one out — eight marks in four pairs, plus a red envelope."
      >
        <div className={styles.ruleRow}>
          {["XX", "XX", "XX", "XX"].map((pair, i) => (
            <Mini key={i}>{pair}</Mini>
          ))}
        </div>
      </ClueTablet>
    </div>
  );
}
