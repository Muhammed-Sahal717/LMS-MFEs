import type { Metadata } from "next";
import { AuthProvider } from "@lms/api-client";
import { ThemeProvider } from "@lms/ui";
import { AppFrame } from "./AppFrame";
import "./globals.css";

export const metadata: Metadata = {
  title: "LMS — Course Catalog",
  description: "Browse, search, and enroll in our premium courses.",
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
