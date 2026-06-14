import type { Metadata } from "next";
import { AuthProvider } from "@lms/api-client";
import { ThemeProvider } from "@lms/ui";
import "./globals.css";
import { AppFrame } from "./AppFrame";

export const metadata: Metadata = {
  title: "LMS — Learning Management System",
  description: "A premium micro-frontend Learning Management System for modern enterprises.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <AppFrame>{children}</AppFrame>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
