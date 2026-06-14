import type { Metadata } from "next";
import { ThemeProvider } from "@lms/ui";
import "./globals.css";

export const metadata: Metadata = {
  title: "LMS — Sign in",
  description: "Sign in to your LMS account.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="flex min-h-screen items-center justify-center bg-[hsl(var(--background))] p-4">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
