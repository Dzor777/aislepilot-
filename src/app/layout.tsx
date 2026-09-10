import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AislePilot | Walmart Grocery Route Optimizer",
  description: "Scan your handwritten grocery list, map store-specific Walmart aisles, and walk a single continuous non-crisscrossing route with cold foods last.",
  keywords: ["Walmart", "Grocery Route", "Aisle Finder", "Handwritten OCR", "Grocery List Scanner"],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#020617",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
