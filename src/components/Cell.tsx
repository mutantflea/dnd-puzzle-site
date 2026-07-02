import { useDroppable } from "@dnd-kit/core";
import Tile from "./Tile";
import styles from "../styles/Grid.module.css";

interface CellProps {
  index: number;
  letter: string;
  selected: boolean;
  onSelect: (index: number) => void;
  onKey: (index: number, key: string) => void;
}

/**
 * A single grid square. Always a drop target. When it holds a letter it also
 * renders a draggable Tile. The square itself is focusable so it can be edited
 * from the keyboard (free-type): type A–Z to set, Backspace/Delete to clear,
 * arrow keys to move focus.
 */
export default function Cell({
  index,
  letter,
  selected,
  onSelect,
  onKey,
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
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      ref={setNodeRef}
      className={className}
      data-cell-index={index}
      tabIndex={0}
      role="gridcell"
      aria-label={
        letter ? `Cell ${index + 1}, letter ${letter}` : `Cell ${index + 1}, empty`
      }
      onMouseDown={() => onSelect(index)}
      onFocus={() => onSelect(index)}
      onKeyDown={(e) => {
        // Let dnd-kit's own keyboard handling through if a drag is active;
        // otherwise treat keys as editing input.
        onKey(index, e.key);
      }}
    >
      {letter && <Tile index={index} letter={letter} />}
    </div>
  );
}
