import { useRef, useState, type ChangeEvent, type KeyboardEvent } from "react";
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
  rolling?: boolean;
}

export default function Grid({ grid, onMove, onSetCell, rolling }: GridProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  // One real input backs all typing: tapping a cell focuses it, so iOS shows
  // its keyboard and every browser routes keys through the same handler.
  const inputRef = useRef<HTMLInputElement>(null);

  // A small activation distance means a plain tap selects the cell (for
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

  function selectCell(index: number) {
    setSelected(index);
    // focus in the same user gesture so iOS raises the software keyboard
    inputRef.current?.focus();
  }

  function moveSelection(key: string) {
    setSelected((cur) => {
      if (cur === null) return 0;
      const row = Math.floor(cur / GRID_SIZE);
      const col = cur % GRID_SIZE;
      if (key === "ArrowUp" && row > 0) return cur - GRID_SIZE;
      if (key === "ArrowDown" && row < GRID_SIZE - 1) return cur + GRID_SIZE;
      if (key === "ArrowLeft" && col > 0) return cur - 1;
      if (key === "ArrowRight" && col < GRID_SIZE - 1) return cur + 1;
      return cur;
    });
  }

  function handleInputKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key.startsWith("Arrow")) {
      e.preventDefault(); // stop the browser scrolling as well
      moveSelection(e.key);
    } else if (e.key === "Backspace" || e.key === "Delete") {
      if (selected !== null) {
        e.preventDefault();
        onSetCell(selected, "");
      }
    }
    // letters are handled in onChange so mobile keyboards work too
  }

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    const ch = e.target.value.slice(-1);
    if (selected !== null && /[a-zA-Z]/.test(ch)) {
      onSetCell(selected, ch);
    }
    // the input is controlled to "" so it never accumulates text
  }

  const activeLetter = activeIndex !== null ? grid[activeIndex] : "";

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveIndex(null)}
    >
      <div
        className={`${styles.grid} ${rolling ? styles.gridRolling : ""}`}
        role="grid"
        aria-label="Puzzle grid"
      >
        <input
          ref={inputRef}
          className={styles.hiddenInput}
          value=""
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          inputMode="text"
          autoCapitalize="characters"
          autoCorrect="off"
          autoComplete="off"
          spellCheck={false}
          aria-label="Type a letter for the selected square"
        />
        {grid.map((letter, i) => (
          <Cell
            key={i}
            index={i}
            letter={letter}
            selected={selected === i}
            onSelect={selectCell}
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
