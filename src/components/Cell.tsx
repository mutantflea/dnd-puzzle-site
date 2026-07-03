import { useDroppable } from "@dnd-kit/core";
import Tile from "./Tile";
import styles from "../styles/Grid.module.css";

interface CellProps {
  index: number;
  letter: string;
  selected: boolean;
  highlighted: boolean;
  onSelect: (index: number) => void;
}

/**
 * A single grid square. Always a drop target. When it holds a letter it also
 * renders a draggable Tile. Tapping/clicking selects the cell and hands focus
 * to the grid's hidden input, which is what actually captures typing (so the
 * software keyboard appears on iOS and key handling is consistent everywhere).
 */
export default function Cell({
  index,
  letter,
  selected,
  highlighted,
  onSelect,
}: CellProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: `cell-${index}`,
    data: { index },
  });

  const className = [
    styles.cell,
    letter ? styles.cellFilled : styles.cellEmpty,
    isOver ? styles.cellOver : "",
    selected ? styles.cellSelected : "",
    highlighted ? styles.cellHighlight : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      ref={setNodeRef}
      className={className}
      role="gridcell"
      aria-label={
        letter ? `Cell ${index + 1}, letter ${letter}` : `Cell ${index + 1}, empty`
      }
      onClick={() => onSelect(index)}
    >
      {letter && <Tile index={index} letter={letter} />}
    </div>
  );
}
