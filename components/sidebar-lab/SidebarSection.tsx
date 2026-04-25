type SidebarSectionProps = {
  title: string;
  children: React.ReactNode;
};

export default function SidebarSection({ title, children }: SidebarSectionProps) {
  return (
    <section className="sidebar-lab-section" aria-label={title}>
      <h2 className="sidebar-lab-section-title">{title}</h2>
      <div className="sidebar-lab-section-content">{children}</div>
    </section>
  );
}
