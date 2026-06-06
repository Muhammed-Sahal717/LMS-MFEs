import { Home, BookOpen, Video, FileText, BarChart, Settings } from "lucide-react";
import type { NavLink } from "./Navbar";
import type { SidebarItem } from "./Sidebar";

/**
 * Canonical LMS navigation, shared by EVERY zone. Under Multi-Zones each zone
 * is a separate app and renders its own chrome, so they import this to stay
 * identical. All hrefs are absolute zone prefixes → cross-zone <a> nav.
 *
 * `permission` gates visibility: AppShell hides items the user can't access
 * (also approximates licensed-module visibility — an unlicensed module's
 * permissions won't be granted).
 */
export const navLinks: NavLink[] = [
  { label: "Courses", href: "/courses" }, // Public
  { label: "My Learning", href: "/learn", permission: "lesson:read" },
  { label: "Assignments", href: "/assignments", permission: "assignment:read" },
  { label: "Dashboard", href: "/dashboard", permission: "lesson:read" }, // Hidden from guests
];

export const sidebarItems: SidebarItem[] = [
  { label: "Home", href: "/", icon: <Home size={18} /> }, // Public
  { label: "Courses", href: "/courses", icon: <BookOpen size={18} /> }, // Public
  { label: "My Learning", href: "/learn", icon: <Video size={18} />, permission: "lesson:read" },
  { label: "Assignments", href: "/assignments", icon: <FileText size={18} />, permission: "assignment:read" },
  { label: "Dashboard", href: "/dashboard", icon: <BarChart size={18} />, permission: "lesson:read" }, // Hidden from guests
  { label: "Admin", href: "/admin", icon: <Settings size={18} />, permission: "admin:access" },
];
