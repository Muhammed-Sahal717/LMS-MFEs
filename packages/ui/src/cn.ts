import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind CSS classes safely.
 * Uses clsx for conditional classes + tailwind-merge to resolve conflicts.
 * This is the canonical shadcn/ui `cn` utility.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
