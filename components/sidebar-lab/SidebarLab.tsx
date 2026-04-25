import SidebarItem from "./SidebarItem";
import SidebarSection from "./SidebarSection";
import { SidebarLabModel } from "@/lib/dashboard/sidebarLabModel";

type SidebarLabProps = {
  model: SidebarLabModel;
  selectedId: string;
  onSelect: (id: string) => void;
};

export default function SidebarLab({ model, selectedId, onSelect }: SidebarLabProps) {
  return (
    <nav className="sidebar-lab" aria-label="Reading workspace sidebar">
      <div className="sidebar-lab-brand">
        <p className="sidebar-lab-eyebrow">tellingQuote Lab</p>
        <h1 className="sidebar-lab-title">Reading Workspace</h1>
      </div>

      <SidebarSection title="Navigation">
        {model.nav.map((item) => (
          <SidebarItem
            key={item.id}
            id={item.id}
            label={item.label}
            count={item.count}
            active={selectedId === item.id}
            onSelect={onSelect}
          />
        ))}
      </SidebarSection>

      <SidebarSection title="Top Tags">
        {model.tags.length === 0 && <p className="sidebar-lab-empty">No tags yet</p>}
        {model.tags.slice(0, 8).map((tag) => (
          <SidebarItem
            key={tag.id}
            id={tag.id}
            label={tag.label}
            count={tag.count}
            active={selectedId === tag.id}
            onSelect={onSelect}
          />
        ))}
      </SidebarSection>

      <SidebarSection title="Saved Views">
        {model.savedViews.map((view) => (
          <button
            key={view.id}
            type="button"
            onClick={() => onSelect(view.id)}
            className={`sidebar-lab-saved ${selectedId === view.id ? "sidebar-lab-saved-active" : ""}`}
          >
            <span>{view.label}</span>
            <small>{view.helper}</small>
          </button>
        ))}
      </SidebarSection>
    </nav>
  );
}
