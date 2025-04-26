import type { Metadata } from "next";
import "./globals.css";
import Header from "@/app/components/Header";

export const metadata: Metadata = {
  title: "Next Samples",
  description: "This is Next samples",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main className="min-h-screen bg-gray-50 flex flex-col items-center py-10 space-y-10">
          {children}
        </main>
      </body>
    </html>
  );
}
