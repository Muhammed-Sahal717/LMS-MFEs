import type { Metadata } from "next";
import { AuthProvider } from "@lms/api-client";
import { ThemeProvider } from "@lms/ui";
import { AppFrame } from "./AppFrame";
import { AdminNav } from "./AdminNav";
import { AdminGuard } from "./AdminGuard";
import "./globals.css";

export const metadata: Metadata = {
  title: "LMS — Admin",
  description: "Admin panel for managing users, courses, and platform settings.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <AppFrame>
              <AdminGuard>
                <div className="mx-auto max-w-6xl">
                  <AdminNav />
                  {children}
                </div>
              </AdminGuard>
            </AppFrame>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
