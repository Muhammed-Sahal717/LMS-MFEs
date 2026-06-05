import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LMS — Sign in",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen items-center justify-center p-4">{children}</div>
      </body>
    </html>
  );
}
