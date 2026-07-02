import { useDraggable } from "@dnd-kit/core";
import styles from "../styles/Grid.module.css";

interface TileProps {
  index: number;
  letter: string;
}

/** A draggable engraved letter tile. Lives inside a Cell droppable. */
export default function Tile({ index, letter }: TileProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `tile-${index}`,
    data: { index },
  });

  return (
    <span
      ref={setNodeRef}
      className={`${styles.tile} ${isDragging ? styles.tileDragging : ""}`}
      {...listeners}
      {...attributes}
      aria-hidden="true"
    >
      {letter}
    </span>
  );
}
