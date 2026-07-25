"use client";

import { useState } from "react";
import SettingsModal from "@/components/SettingsModal";
import KeyboardShortcutsModal from "@/components/KeyboardShortcutsModal";
import SignInModal from "@/components/SignInModal";
import UserMenu from "@/components/UserMenu";
import { useSettings } from "@/hooks/useSettings";
import { useAuth } from "@/hooks/useAuth";
import { resetTutorial } from "@/lib/tutorial";
import { deleteAccount } from "@/lib/firebase/auth";
import { deleteAllUserData } from "@/lib/firebase/firestore";
import { DashboardTheme } from "@/lib/dashboard/theme";

type ProjectFilter = "all" | "active" | "completed" | "favorites";

type NavItem = {
  key: ProjectFilter;
  label: string;
  count: number;
  icon: React.ReactNode;
};

interface DashboardSidebarProps {
  dash: DashboardTheme;
  filter: ProjectFilter;
  onFilterChange: (filter: ProjectFilter) => void;
  counts: { all: number; active: number; completed: number; favorites: number };
  tags: string[];
  activeTag: string | null;
  onTagChange: (tag: string | null) => void;
  query: string;
  onQueryChange: (query: string) => void;
  onNewProject: () => void;
  isOpen: boolean;
  onClose: () => void;
}

function Icon({ path }: { path: string }) {
  return (
    <svg
      className="w-5 h-5 shrink-0"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={path} />
    </svg>
  );
}

export default function DashboardSidebar({
  dash,
  filter,
  onFilterChange,
  counts,
  tags,
  activeTag,
  onTagChange,
  query,
  onQueryChange,
  onNewProject,
  isOpen,
  onClose,
}: DashboardSidebarProps) {
  const { settings, setSettings } = useSettings();
  const { user } = useAuth();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isSignInOpen, setIsSignInOpen] = useState(false);

  const navItems: NavItem[] = [
    {
      key: "all",
      label: "Todos los proyectos",
      count: counts.all,
      icon: (
        <Icon path="M4 6a2 2 0 012-2h4l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" />
      ),
    },
    {
      key: "active",
      label: "Activos",
      count: counts.active,
      icon: (
        <Icon path="M13 10V3L4 14h7v7l9-11h-7z" />
      ),
    },
    {
      key: "completed",
      label: "Completados",
      count: counts.completed,
      icon: <Icon path="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />,
    },
    {
      key: "favorites",
      label: "Favoritos",
      count: counts.favorites,
      icon: (
        <Icon path="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      ),
    },
  ];

  const handleExportData = () => {
    const readings = localStorage.getItem("readings");
    const settingsData = localStorage.getItem("settings");
    const data = {
      readings: readings ? JSON.parse(readings) : [],
      settings: settingsData ? JSON.parse(settingsData) : {},
      exportDate: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tellingquote-export-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    const confirmed = window.confirm(
      "¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer y se eliminarán todos tus datos."
    );
    if (confirmed) {
      try {
        await deleteAllUserData(user.uid);
        await deleteAccount();
        alert("Cuenta eliminada exitosamente");
      } catch (error) {
        console.error("Error deleting account:", error);
        alert("Error al eliminar la cuenta. Por favor intenta de nuevo.");
      }
    }
  };

  const iconButtonClass = `p-2 rounded-lg transition-colors ${dash.ghostBtn}`;

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-40 flex h-full w-72 flex-col border-r
          ${dash.sidebar} ${dash.sidebarBorder}
          transform transition-transform duration-300 ease-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:static lg:translate-x-0 lg:z-auto
        `}
        aria-label="Navegación de proyectos"
      >
        {/* Brand */}
        <div className={`flex items-center justify-between px-5 h-16 border-b ${dash.sidebarBorder}`}>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white font-bold">
              t
            </span>
            <span className={`text-lg font-bold tracking-tight ${dash.textPrimary}`}>
              tellingQuote
            </span>
          </div>
          <button
            onClick={onClose}
            className={`lg:hidden ${iconButtonClass}`}
            aria-label="Cerrar menú"
          >
            <Icon path="M6 18L18 6M6 6l12 12" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-5">
          {/* New project */}
          <button
            onClick={onNewProject}
            data-tour="new-reading-button"
            className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 font-semibold shadow-sm transition-all ${dash.primaryBtn}`}
          >
            <Icon path="M12 4v16m8-8H4" />
            Nuevo proyecto
          </button>

          {/* Search */}
          <div className="relative mt-5">
            <span className={`pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 ${dash.textSubtle}`}>
              <Icon path="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
            </span>
            <input
              type="search"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="Buscar proyectos..."
              aria-label="Buscar proyectos"
              className={`w-full rounded-lg py-2.5 pl-10 pr-3 text-sm outline-none transition-colors ${dash.input}`}
            />
          </div>

          {/* Navigation */}
          <nav className="mt-6 space-y-1">
            <p className={`px-3 pb-2 text-xs font-semibold uppercase tracking-wider ${dash.textSubtle}`}>
              Biblioteca
            </p>
            {navItems.map((item) => {
              const active = filter === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => onFilterChange(item.key)}
                  aria-current={active ? "page" : undefined}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    active ? dash.navActive : dash.navIdle
                  }`}
                >
                  {item.icon}
                  <span className="flex-1 text-left">{item.label}</span>
                  <span
                    className={`min-w-[1.5rem] rounded-full px-2 py-0.5 text-center text-xs font-semibold ${
                      active ? "bg-black/10" : dash.chip
                    }`}
                  >
                    {item.count}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="mt-6">
              <p className={`px-3 pb-2 text-xs font-semibold uppercase tracking-wider ${dash.textSubtle}`}>
                Etiquetas
              </p>
              <div className="flex flex-wrap gap-2 px-2">
                {tags.map((tag) => {
                  const active = activeTag === tag;
                  return (
                    <button
                      key={tag}
                      onClick={() => onTagChange(active ? null : tag)}
                      className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                        active ? dash.chipActive : dash.chip
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer: account + settings */}
        <div className={`border-t px-4 py-4 ${dash.sidebarBorder}`}>
          <div className="mb-3 flex items-center gap-1">
            <button
              onClick={() => setIsSettingsOpen(true)}
              data-tour="settings-button"
              className={iconButtonClass}
              title="Ajustes"
              aria-label="Ajustes"
            >
              <Icon path="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            </button>
            <button
              onClick={() => setIsShortcutsOpen(true)}
              data-tour="keyboard-shortcuts"
              className={iconButtonClass}
              title="Atajos de teclado (?)"
              aria-label="Atajos de teclado"
            >
              <Icon path="M9 9h.01M15 9h.01M9 13h6M5 6h14a1 1 0 011 1v10a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1z" />
            </button>
            <button
              onClick={() => resetTutorial()}
              data-tour="tutorial-button"
              className={iconButtonClass}
              title="Ver tutorial"
              aria-label="Ver tutorial"
            >
              <Icon path="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </button>
          </div>

          {user ? (
            <UserMenu
              user={user}
              onExportData={handleExportData}
              onDeleteAccount={handleDeleteAccount}
            />
          ) : (
            <button
              onClick={() => setIsSignInOpen(true)}
              data-tour="sign-in-button"
              className={`flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 font-medium transition-all ${dash.primaryBtn}`}
            >
              <Icon path="M11 16l-4-4m0 0l4-4m-4 4h14M3 12a9 9 0 1118 0 9 9 0 01-18 0z" />
              Iniciar sesión
            </button>
          )}
        </div>
      </aside>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSave={setSettings}
      />
      <KeyboardShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />
      <SignInModal
        isOpen={isSignInOpen}
        onClose={() => setIsSignInOpen(false)}
        onMigrate={() => setIsSignInOpen(false)}
      />
    </>
  );
}
