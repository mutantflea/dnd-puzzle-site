import { type ReactNode } from "react";
import styles from "../styles/ClueTablet.module.css";

interface ClueTabletProps {
  name: string;
  note?: string;
  locked?: boolean; // a not-yet-revealed clue
  children: ReactNode; // the CSS/SVG recreation of the rule
}

/** A stone-tablet card showing a recreated clue. */
export default function ClueTablet({ name, note, locked, children }: ClueTabletProps) {
  return (
    <figure className={`${styles.tablet} ${locked ? styles.tabletLocked : ""}`}>
      <figcaption className={styles.name}>{name}</figcaption>
      <div className={`${styles.face} ${locked ? styles.faceLocked : ""}`}>
        <div className={styles.rule}>{children}</div>
      </div>
      {note && <p className={styles.note}>{note}</p>}
    </figure>
  );
}
