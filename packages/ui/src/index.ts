// Utilities
export { cn } from "./cn";

// Primitive components
export { Button, buttonVariants, type ButtonProps } from "./Button";
export { Input, type InputProps } from "./Input";
export { Select, type SelectProps } from "./Select";
export { Badge, badgeVariants, type BadgeProps } from "./Badge";
export { Loader, type LoaderProps } from "./Loader";
export { Skeleton, type SkeletonProps } from "./Skeleton";
export { Separator, type SeparatorProps } from "./Separator";
export { ProgressBar, type ProgressBarProps } from "./ProgressBar";
export { Avatar, type AvatarProps } from "./Avatar";

// Card compound components
export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  // Backward-compat single-component
  SimpleCard,
  type CardProps,
} from "./Card";

// Table compound components
export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from "./Table";

// Tabs compound components
export {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  type TabsProps,
  type TabsTriggerProps,
  type TabsContentProps,
} from "./Tabs";

// Overlay / modal
export { Modal, type ModalProps } from "./Modal";

// Empty state
export { EmptyState, type EmptyStateProps } from "./EmptyState";

// Layout / navigation
export { Navbar, type NavbarProps, type NavLink } from "./Navbar";
export { Sidebar, type SidebarProps, type SidebarItem } from "./Sidebar";
export { AppShell, type AppShellProps } from "./AppShell";
export { navLinks, sidebarItems } from "./navConfig";

// Theming
export { ThemeProvider } from "./ThemeProvider";
export { ThemeToggle, type ThemeToggleProps } from "./ThemeToggle";
