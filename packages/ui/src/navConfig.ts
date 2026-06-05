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
  { label: "Courses", href: "/courses", permission: "course:read" },
  { label: "My Learning", href: "/learn", permission: "lesson:read" },
  { label: "Assignments", href: "/assignments", permission: "assignment:read" },
  { label: "Dashboard", href: "/dashboard" },
];

export const sidebarItems: SidebarItem[] = [
  { label: "Home", href: "/", icon: "🏠" },
  { label: "Courses", href: "/courses", icon: "📚", permission: "course:read" },
  { label: "My Learning", href: "/learn", icon: "🎥", permission: "lesson:read" },
  { label: "Assignments", href: "/assignments", icon: "📝", permission: "assignment:read" },
  { label: "Dashboard", href: "/dashboard", icon: "📊" },
  { label: "Admin", href: "/admin", icon: "⚙️", permission: "admin:access" },
];
