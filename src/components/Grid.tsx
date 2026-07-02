import { useRef, useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import Cell from "./Cell";
import { GRID_SIZE, type Grid as GridState } from "../puzzle";
import styles from "../styles/Grid.module.css";

interface GridProps {
  grid: GridState;
  onMove: (from: number, to: number) => void;
  onSetCell: (index: number, value: string) => void;
}

export default function Grid({ grid, onMove, onSetCell }: GridProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // A small activation distance means a plain click selects the cell (for
  // typing) while a deliberate drag moves the tile.
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  function handleDragStart(e: DragStartEvent) {
    const index = e.active.data.current?.index;
    if (typeof index === "number") setActiveIndex(index);
  }

  function handleDragEnd(e: DragEndEvent) {
    setActiveIndex(null);
    const from = e.active.data.current?.index;
    const to = e.over?.data.current?.index;
    if (typeof from === "number" && typeof to === "number") {
      onMove(from, to);
    }
  }

  function focusCell(index: number) {
    const el = containerRef.current?.querySelector<HTMLElement>(
      `[data-cell-index="${index}"]`,
    );
    el?.focus();
  }

  function handleKey(index: number, key: string) {
    if (/^[a-zA-Z]$/.test(key)) {
      onSetCell(index, key);
      return;
    }
    if (key === "Backspace" || key === "Delete") {
      onSetCell(index, "");
      return;
    }
    const row = Math.floor(index / GRID_SIZE);
    const col = index % GRID_SIZE;
    let target: number | null = null;
    if (key === "ArrowUp" && row > 0) target = index - GRID_SIZE;
    else if (key === "ArrowDown" && row < GRID_SIZE - 1) target = index + GRID_SIZE;
    else if (key === "ArrowLeft" && col > 0) target = index - 1;
    else if (key === "ArrowRight" && col < GRID_SIZE - 1) target = index + 1;
    if (target !== null) {
      setSelected(target);
      focusCell(target);
    }
  }

  const activeLetter = activeIndex !== null ? grid[activeIndex] : "";

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveIndex(null)}
    >
      <div ref={containerRef} className={styles.grid} role="grid" aria-label="Puzzle grid">
        {grid.map((letter, i) => (
          <Cell
            key={i}
            index={i}
            letter={letter}
            selected={selected === i}
            onSelect={setSelected}
            onKey={handleKey}
          />
        ))}
      </div>

      <DragOverlay>
        {activeIndex !== null && activeLetter ? (
          <span className={`${styles.tile} ${styles.tileOverlay}`}>{activeLetter}</span>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
