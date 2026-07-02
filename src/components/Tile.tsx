import { useDraggable } from "@dnd-kit/core";
import styles from "../styles/Grid.module.css";

interface TileProps {
  index: number;
  letter: string;
}

/** A draggable engraved letter tile. Lives inside a Cell droppable. */
export default function Tile({ index, letter }: TileProps) {
  // Only pointer listeners — we deliberately omit dnd-kit's `attributes`
  // (which add a tabIndex/role) so the tile doesn't become a competing focus
  // target; the grid's hidden input owns keyboard interaction.
  const { listeners, setNodeRef, isDragging } = useDraggable({
    id: `tile-${index}`,
    data: { index },
  });

  return (
    <span
      ref={setNodeRef}
      className={`${styles.tile} ${isDragging ? styles.tileDragging : ""}`}
      {...listeners}
      aria-hidden="true"
    >
      {letter}
    </span>
  );
}
