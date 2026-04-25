"use client";

import { SidebarLabModel } from "@/lib/dashboard/sidebarLabModel";

type RailPanelProps = {
  section: string;
  model: SidebarLabModel;
  selectedId: string;
  onSelect: (id: string) => void;
};

export default function RailPanel({ section, model, selectedId, onSelect }: RailPanelProps) {
  return (
    <div className="rail-lab-panel" role="navigation" aria-label="Filter panel">
      {section === "nav" && (
        <>
          <p className="rail-lab-panel-title">Navigation</p>
          {model.nav.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item.id)}
              className={`rail-lab-panel-item ${selectedId === item.id ? "rail-lab-panel-item-active" : ""}`}
            >
              <span>{item.label}</span>
              {item.count !== undefined && (
                <span className="rail-lab-panel-count">{item.count}</span>
              )}
            </button>
          ))}
        </>
      )}

      {section === "tags" && (
        <>
          <p className="rail-lab-panel-title">Tags</p>
          {model.tags.length === 0 && (
            <p className="rail-lab-panel-empty">No tags yet</p>
          )}
          {model.tags.map((tag) => (
            <button
              key={tag.id}
              type="button"
              onClick={() => onSelect(tag.id)}
              className={`rail-lab-panel-item ${selectedId === tag.id ? "rail-lab-panel-item-active" : ""}`}
            >
              <span>{tag.label}</span>
              <span className="rail-lab-panel-count">{tag.count}</span>
            </button>
          ))}
        </>
      )}

      {section === "views" && (
        <>
          <p className="rail-lab-panel-title">Saved Views</p>
          {model.savedViews.map((view) => (
            <button
              key={view.id}
              type="button"
              onClick={() => onSelect(view.id)}
              className={`rail-lab-panel-item rail-lab-panel-item-card ${selectedId === view.id ? "rail-lab-panel-item-active" : ""}`}
            >
              <span className="rail-lab-panel-item-name">{view.label}</span>
              <small className="rail-lab-panel-item-helper">{view.helper}</small>
            </button>
          ))}
        </>
      )}
    </div>
  );
}
