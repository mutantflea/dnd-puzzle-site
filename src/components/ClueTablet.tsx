import { type ReactNode } from "react";
import styles from "../styles/ClueTablet.module.css";

interface ClueTabletProps {
  name: string;
  note?: string;
  children: ReactNode; // the CSS/SVG recreation of the rule
}

/** A stone-tablet card showing a recreated clue. */
export default function ClueTablet({ name, note, children }: ClueTabletProps) {
  return (
    <figure className={styles.tablet}>
      <figcaption className={styles.name}>{name}</figcaption>
      <div className={styles.face}>
        <div className={styles.rule}>{children}</div>
      </div>
      {note && <p className={styles.note}>{note}</p>}
    </figure>
  );
}
