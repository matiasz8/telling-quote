import { Theme } from "@/types";

/**
 * Centralized class strings for the redesigned dashboard app-shell.
 * Keeps the four supported themes (light / dark / detox / high-contrast)
 * consistent across the sidebar, project list and details panel.
 */
export type DashboardTheme = {
  shell: string;
  sidebar: string;
  sidebarBorder: string;
  surface: string;
  surfaceHover: string;
  border: string;
  divider: string;
  textPrimary: string;
  textMuted: string;
  textSubtle: string;
  primaryBtn: string;
  ghostBtn: string;
  dangerBtn: string;
  navActive: string;
  navIdle: string;
  input: string;
  chip: string;
  chipActive: string;
  accent: string;
  accentHover: string;
  selected: string;
};

const LIGHT: DashboardTheme = {
  shell: "bg-slate-50",
  sidebar: "bg-white",
  sidebarBorder: "border-slate-200",
  surface: "bg-white",
  surfaceHover: "hover:border-emerald-300 hover:shadow-md",
  border: "border border-slate-200",
  divider: "border-slate-200",
  textPrimary: "text-slate-900",
  textMuted: "text-slate-500",
  textSubtle: "text-slate-400",
  primaryBtn: "bg-emerald-600 text-white hover:bg-emerald-700",
  ghostBtn: "text-slate-600 hover:bg-slate-100",
  dangerBtn: "text-rose-600 hover:bg-rose-50",
  navActive: "bg-emerald-50 text-emerald-700",
  navIdle: "text-slate-600 hover:bg-slate-100",
  input:
    "bg-slate-100 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-emerald-400",
  chip: "bg-slate-100 text-slate-600 hover:bg-slate-200",
  chipActive: "bg-emerald-600 text-white",
  accent: "text-amber-500",
  accentHover: "hover:text-amber-500",
  selected: "ring-2 ring-emerald-500 border-emerald-500",
};

const DARK: DashboardTheme = {
  shell: "bg-slate-950",
  sidebar: "bg-slate-900",
  sidebarBorder: "border-slate-800",
  surface: "bg-slate-900",
  surfaceHover: "hover:border-emerald-700 hover:shadow-lg hover:shadow-black/30",
  border: "border border-slate-800",
  divider: "border-slate-800",
  textPrimary: "text-slate-100",
  textMuted: "text-slate-400",
  textSubtle: "text-slate-500",
  primaryBtn: "bg-emerald-500 text-white hover:bg-emerald-400",
  ghostBtn: "text-slate-300 hover:bg-slate-800",
  dangerBtn: "text-rose-400 hover:bg-rose-500/10",
  navActive: "bg-emerald-500/10 text-emerald-400",
  navIdle: "text-slate-300 hover:bg-slate-800",
  input:
    "bg-slate-800 border border-slate-700 text-slate-100 placeholder:text-slate-500 focus:border-emerald-500",
  chip: "bg-slate-800 text-slate-300 hover:bg-slate-700",
  chipActive: "bg-emerald-500 text-white",
  accent: "text-amber-400",
  accentHover: "hover:text-amber-400",
  selected: "ring-2 ring-emerald-500 border-emerald-500",
};

const DETOX: DashboardTheme = {
  shell: "bg-gray-50",
  sidebar: "bg-white",
  sidebarBorder: "border-gray-200",
  surface: "bg-white",
  surfaceHover: "hover:border-gray-400 hover:shadow-md",
  border: "border border-gray-200",
  divider: "border-gray-200",
  textPrimary: "text-gray-900",
  textMuted: "text-gray-500",
  textSubtle: "text-gray-400",
  primaryBtn: "bg-gray-900 text-white hover:bg-gray-800",
  ghostBtn: "text-gray-600 hover:bg-gray-100",
  dangerBtn: "text-gray-900 hover:bg-gray-200",
  navActive: "bg-gray-100 text-gray-900",
  navIdle: "text-gray-600 hover:bg-gray-100",
  input:
    "bg-gray-100 border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-gray-400",
  chip: "bg-gray-100 text-gray-600 hover:bg-gray-200",
  chipActive: "bg-gray-900 text-white",
  accent: "text-gray-700",
  accentHover: "hover:text-gray-700",
  selected: "ring-2 ring-gray-900 border-gray-900",
};

const HIGH_CONTRAST: DashboardTheme = {
  shell: "bg-black",
  sidebar: "bg-black",
  sidebarBorder: "border-white",
  surface: "bg-black",
  surfaceHover: "hover:bg-white/10",
  border: "border-2 border-white",
  divider: "border-white",
  textPrimary: "text-white",
  textMuted: "text-gray-300",
  textSubtle: "text-gray-400",
  primaryBtn: "bg-white text-black hover:bg-gray-200",
  ghostBtn: "text-white hover:bg-white hover:text-black",
  dangerBtn: "text-white hover:bg-white hover:text-black",
  navActive: "bg-white text-black",
  navIdle: "text-white hover:bg-white/10",
  input:
    "bg-black border-2 border-white text-white placeholder:text-gray-400 focus:border-white",
  chip: "bg-black border border-white text-white hover:bg-white hover:text-black",
  chipActive: "bg-white text-black",
  accent: "text-white",
  accentHover: "hover:text-white",
  selected: "ring-2 ring-white border-white",
};

export function getDashboardTheme(theme: Theme): DashboardTheme {
  switch (theme) {
    case "dark":
      return DARK;
    case "detox":
      return DETOX;
    case "high-contrast":
      return HIGH_CONTRAST;
    default:
      return LIGHT;
  }
}
