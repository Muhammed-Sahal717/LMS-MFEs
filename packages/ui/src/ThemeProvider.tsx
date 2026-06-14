"use client";

/**
 * ThemeProvider — thin re-export wrapper around next-themes.
 * Each MFE zone wraps its root layout with this for class-based dark mode.
 *
 * Usage in layout.tsx:
 *   import { ThemeProvider } from "@lms/ui";
 *   <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
 *     {children}
 *   </ThemeProvider>
 *
 * next-themes is an optional peer dependency. Each app that installs next-themes
 * can use this; the ui package itself does not depend on it.
 */
export { ThemeProvider } from "next-themes";
