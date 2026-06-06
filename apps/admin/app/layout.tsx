import type { Metadata } from "next";
import { AuthProvider } from "@lms/api-client";
import { AppFrame } from "./AppFrame";
import { AdminNav } from "./AdminNav";
import { AdminGuard } from "./AdminGuard";
import "./globals.css";

export const metadata: Metadata = {
  title: "LMS — Admin",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <AppFrame>
            <AdminGuard>
              <div className="mx-auto max-w-5xl">
                <AdminNav />
                {children}
              </div>
            </AdminGuard>
          </AppFrame>
        </AuthProvider>
      </body>
    </html>
  );
}
