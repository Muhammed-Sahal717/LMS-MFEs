import type { Metadata } from "next";
import { AuthProvider } from "@lms/api-client";
import "./globals.css";
import { AppFrame } from "./AppFrame";

export const metadata: Metadata = {
  title: "LMS",
  description: "Micro-frontend Learning Management System",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <AppFrame>{children}</AppFrame>
        </AuthProvider>
      </body>
    </html>
  );
}
