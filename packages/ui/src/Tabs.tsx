"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
  type HTMLAttributes,
} from "react";
import { cn } from "./cn";

/* ─── Context ─── */
interface TabsContextValue {
  activeTab: string;
  setActiveTab: (id: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext() {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error("Tabs compound components must be used within <Tabs>");
  return ctx;
}

/* ─── Components ─── */

export interface TabsProps extends HTMLAttributes<HTMLDivElement> {
  defaultValue: string;
}

export function Tabs({ defaultValue, className, children, ...props }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultValue);
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={cn("w-full", className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

export function TabsList({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      role="tablist"
      className={cn(
        "inline-flex items-center justify-start rounded-[var(--radius-md)]",
        "bg-[hsl(var(--muted))] p-1 text-[hsl(var(--muted-foreground))]",
        className,
      )}
      {...props}
    />
  );
}

export interface TabsTriggerProps extends HTMLAttributes<HTMLButtonElement> {
  value: string;
}

export function TabsTrigger({ value, className, children, ...props }: TabsTriggerProps) {
  const { activeTab, setActiveTab } = useTabsContext();
  const isActive = activeTab === value;
  return (
    <button
      role="tab"
      aria-selected={isActive}
      onClick={() => setActiveTab(value)}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-[var(--radius-sm)]",
        "px-3 py-1.5 text-sm font-medium transition-all duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
        isActive
          ? "bg-[hsl(var(--background))] text-[hsl(var(--foreground))] shadow-[var(--shadow-sm)]"
          : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export interface TabsContentProps extends HTMLAttributes<HTMLDivElement> {
  value: string;
}

export function TabsContent({ value, className, ...props }: TabsContentProps) {
  const { activeTab } = useTabsContext();
  if (activeTab !== value) return null;
  return (
    <div
      role="tabpanel"
      className={cn(
        "mt-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))]",
        "animate-in fade-in duration-200",
        className,
      )}
      {...props}
    />
  );
}
