type SidebarItemProps = {
  id: string;
  label: string;
  count?: number;
  active: boolean;
  onSelect: (id: string) => void;
};

export default function SidebarItem({ id, label, count, active, onSelect }: SidebarItemProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(id)}
      className={`sidebar-lab-item ${active ? "sidebar-lab-item-active" : ""}`}
      aria-current={active ? "page" : undefined}
    >
      <span className="sidebar-lab-item-label">{label}</span>
      {typeof count === "number" && <span className="sidebar-lab-item-count">{count}</span>}
    </button>
  );
}
