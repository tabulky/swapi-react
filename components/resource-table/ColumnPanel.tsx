"use client";

import { useRef } from "react";
import { GripVertical } from "lucide-react";

import type { TableState } from "./useTableState";

// ---------------------------------------------------------------------------
// ColumnPanel
// ---------------------------------------------------------------------------

export default function ColumnPanel<T extends Record<string, unknown>>({
  tableState,
}: {
  tableState: TableState<T>;
}) {
  const { allColumns, visibleColumns, toggleColumn, setColumnOrder } =
    tableState;

  const dragId = useRef<string | null>(null);

  // --- Drag handlers (visible pills only) ---

  const onDragStart = (columnId: string) => {
    dragId.current = columnId;
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const onDrop = (targetId: string) => {
    const srcId = dragId.current;
    dragId.current = null;
    if (!srcId || srcId === targetId) return;

    const ids = visibleColumns.map((c) => c.id);
    const srcIdx = ids.indexOf(srcId);
    const tgtIdx = ids.indexOf(targetId);
    if (srcIdx === -1 || tgtIdx === -1) return;

    // Move src to tgt position
    ids.splice(srcIdx, 1);
    ids.splice(tgtIdx, 0, srcId);
    setColumnOrder(ids);
  };

  return (
    <div className="flex flex-wrap items-center gap-1.5 px-2 py-1.5">
      {allColumns.map(({ column, visible }) =>
        visible ? (
          <button
            key={column.id}
            type="button"
            draggable
            onDragStart={() => onDragStart(column.id)}
            onDragOver={onDragOver}
            onDrop={() => onDrop(column.id)}
            onClick={() => toggleColumn(column.id)}
            className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-xs font-medium
              bg-foreground/10 hover:bg-foreground/20 cursor-grab active:cursor-grabbing
              select-none transition-colors"
          >
            <GripVertical size={12} className="opacity-40" />
            {column.header}
          </button>
        ) : (
          <button
            key={column.id}
            type="button"
            onClick={() => toggleColumn(column.id)}
            className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-xs font-medium
              border border-dashed border-foreground/20 opacity-50
              hover:opacity-80 hover:bg-foreground/5
              select-none transition-colors cursor-pointer"
          >
            + {column.header}
          </button>
        ),
      )}
    </div>
  );
}
