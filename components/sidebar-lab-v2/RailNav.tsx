"use client";

type RailSection = {
  id: string;
  label: string;
};

type RailNavProps = {
  sections: RailSection[];
  activeSection: string;
  onSelect: (id: string) => void;
};

const ICONS: Record<string, React.ReactNode> = {
  nav: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  tags: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  ),
  views: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </svg>
  ),
};

export default function RailNav({ sections, activeSection, onSelect }: RailNavProps) {
  return (
    <nav className="rail-lab-rail" aria-label="Section rail">
      {sections.map((section) => (
        <button
          key={section.id}
          type="button"
          onClick={() => onSelect(section.id)}
          className={`rail-lab-rail-btn ${activeSection === section.id ? "rail-lab-rail-btn-active" : ""}`}
          aria-label={section.label}
          title={section.label}
        >
          {ICONS[section.id] ?? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
            </svg>
          )}
          <span className="rail-lab-rail-label">{section.label}</span>
        </button>
      ))}
    </nav>
  );
}

export type { RailSection };
