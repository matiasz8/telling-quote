import SidebarLab from "./SidebarLab";
import { SidebarLabModel } from "@/lib/dashboard/sidebarLabModel";

type SidebarDrawerProps = {
  open: boolean;
  onClose: () => void;
  model: SidebarLabModel;
  selectedId: string;
  onSelect: (id: string) => void;
};

export default function SidebarDrawer({
  open,
  onClose,
  model,
  selectedId,
  onSelect,
}: SidebarDrawerProps) {
  const handleSelect = (id: string) => {
    onSelect(id);
    onClose();
  };

  return (
    <div className={`sidebar-lab-drawer-wrap ${open ? "sidebar-lab-drawer-open" : ""}`} aria-hidden={!open}>
      <button
        type="button"
        className="sidebar-lab-drawer-backdrop"
        onClick={onClose}
        aria-label="Close sidebar"
      />
      <aside className="sidebar-lab-drawer-panel" role="dialog" aria-modal="true" aria-label="Sidebar menu">
        <div className="sidebar-lab-drawer-header">
          <p>Navigation</p>
          <button type="button" onClick={onClose} className="sidebar-lab-drawer-close" aria-label="Close menu">
            Close
          </button>
        </div>
        <SidebarLab model={model} selectedId={selectedId} onSelect={handleSelect} />
      </aside>
    </div>
  );
}
