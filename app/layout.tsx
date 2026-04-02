import type { Metadata } from "next";
import "./globals.css";
import Navigation from "@/components/Navigation";

export const metadata: Metadata = {
  title: "ExpenseAI – Track smarter",
  description: "A modern expense tracking application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 antialiased">
        <Navigation />
        {/* Desktop: offset for sidebar; Mobile: offset for top/bottom bars */}
        <main className="lg:ml-64 pt-14 lg:pt-0 pb-20 lg:pb-0 min-h-screen">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 lg:py-8">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
