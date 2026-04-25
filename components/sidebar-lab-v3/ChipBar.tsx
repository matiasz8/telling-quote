"use client";

import { useRef } from "react";

type Chip = {
  id: string;
  label: string;
  count?: number;
};

type ChipBarProps = {
  chips: Chip[];
  selectedId: string;
  onSelect: (id: string) => void;
};

export default function ChipBar({ chips, selectedId, onSelect }: ChipBarProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className="chip-lab-bar-wrap" role="navigation" aria-label="Filter chips">
      <div ref={scrollRef} className="chip-lab-bar">
        {chips.map((chip) => (
          <button
            key={chip.id}
            type="button"
            onClick={() => onSelect(chip.id)}
            className={`chip-lab-chip ${selectedId === chip.id ? "chip-lab-chip-active" : ""}`}
            aria-pressed={selectedId === chip.id}
          >
            {chip.label}
            {chip.count !== undefined && (
              <span className="chip-lab-chip-count">{chip.count}</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

export type { Chip };
