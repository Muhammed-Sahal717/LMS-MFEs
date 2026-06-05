import type { Metadata } from "next";
import { AuthProvider } from "@lms/api-client";
import { AppFrame } from "./AppFrame";
import { AdminNav } from "./AdminNav";
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
            <div className="mx-auto max-w-5xl">
              <AdminNav />
              {children}
            </div>
          </AppFrame>
        </AuthProvider>
      </body>
    </html>
  );
}
