"use client";

import { useMemo, useState } from "react";
import { GripVertical } from "lucide-react";

import type { TableState } from "./useTableState";

// ---------------------------------------------------------------------------
// ColumnPanel – drag-reorder with insertion indicator
//
// Instead of reordering the DOM while dragging (which causes flickering
// feedback loops with native DnD), pills stay in place and a colored bar
// indicates where the dragged pill will land.
// ---------------------------------------------------------------------------

export default function ColumnPanel<T extends Record<string, unknown>>({
  tableState,
}: {
  tableState: TableState<T>;
}) {
  const { allColumns, visibleColumns, toggleColumn, setColumnOrder } =
    tableState;

  const [dragSourceId, setDragSourceId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  // Which side of the hovered pill should the indicator appear on?
  const insertSide = useMemo<"before" | "after" | null>(() => {
    if (!dragSourceId || !dragOverId || dragSourceId === dragOverId) {
      return null;
    }
    const ids = allColumns.map((c) => c.column.id);
    const srcIdx = ids.indexOf(dragSourceId);
    const tgtIdx = ids.indexOf(dragOverId);
    if (srcIdx === -1 || tgtIdx === -1) return null;
    return srcIdx < tgtIdx ? "after" : "before";
  }, [allColumns, dragSourceId, dragOverId]);

  // --- Drag handlers ---

  const onDragStart = (e: React.DragEvent, columnId: string) => {
    e.dataTransfer.effectAllowed = "move";
    setDragSourceId(columnId);
  };

  const onDragEnd = () => {
    setDragSourceId(null);
    setDragOverId(null);
  };

  // Use onDragOver (not onDragEnter) with a same-value bail-out so that
  // high-frequency calls don't cause extra renders.
  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    setDragOverId((prev) => (prev === columnId ? prev : columnId));
  };

  const onDrop = () => {
    if (dragSourceId && dragOverId && dragSourceId !== dragOverId) {
      const ids = allColumns.map((c) => c.column.id);
      const srcIdx = ids.indexOf(dragSourceId);
      const tgtIdx = ids.indexOf(dragOverId);
      if (srcIdx !== -1 && tgtIdx !== -1) {
        ids.splice(srcIdx, 1);
        ids.splice(tgtIdx, 0, dragSourceId);
        setColumnOrder(ids);
      }
    }
    setDragSourceId(null);
    setDragOverId(null);
  };

  const isLastVisible = visibleColumns.length <= 1;
  const isDragging = dragSourceId !== null;

  return (
    <div className="flex flex-wrap items-center gap-1.5 px-2 py-1.5">
      {allColumns.map(({ column, visible }) => {
        const isSource = column.id === dragSourceId;
        const isOver = column.id === dragOverId && isDragging && !isSource;
        const showBefore = isOver && insertSide === "before";
        const showAfter = isOver && insertSide === "after";

        // Box-shadow indicator — doesn't affect layout, no reflow
        const indicatorStyle: React.CSSProperties | undefined = showBefore
          ? { boxShadow: "-4px 0 0 -1px #3b82f6" }
          : showAfter
          ? { boxShadow: "4px 0 0 -1px #3b82f6" }
          : undefined;

        return visible
          ? (
            <button
              key={column.id}
              type="button"
              aria-label={`Hide ${column.header} column`}
              draggable={!isLastVisible}
              disabled={isLastVisible}
              onDragStart={(e) => onDragStart(e, column.id)}
              onDragEnd={onDragEnd}
              onDragOver={(e) => handleDragOver(e, column.id)}
              onDrop={onDrop}
              onClick={() => !isDragging && toggleColumn(column.id)}
              style={indicatorStyle}
              className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-xs font-medium
              select-none transition-shadow duration-150 ${
                isLastVisible
                  ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 cursor-not-allowed"
                  : isSource
                  ? "bg-foreground/10 opacity-30 cursor-grabbing"
                  : "bg-foreground/10 hover:bg-foreground/20 cursor-grab active:cursor-grabbing"
              }`}
            >
              <GripVertical
                size={12}
                className="opacity-40 pointer-events-none"
                aria-hidden
              />
              <span className="pointer-events-none">{column.header}</span>
            </button>
          )
          : (
            <button
              key={column.id}
              type="button"
              aria-label={`Show ${column.header} column`}
              draggable
              onDragStart={(e) => onDragStart(e, column.id)}
              onDragEnd={onDragEnd}
              onDragOver={(e) => handleDragOver(e, column.id)}
              onDrop={onDrop}
              onClick={() => !isDragging && toggleColumn(column.id)}
              style={indicatorStyle}
              className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-xs font-medium
              border border-dashed border-foreground/20
              select-none transition-shadow duration-150 cursor-pointer ${
                isSource
                  ? "opacity-20"
                  : "opacity-50 hover:opacity-80 hover:bg-foreground/5"
              }`}
            >
              <GripVertical
                size={12}
                className="opacity-40 pointer-events-none"
                aria-hidden
              />
              <span className="pointer-events-none">{column.header}</span>
            </button>
          );
      })}
    </div>
  );
}
