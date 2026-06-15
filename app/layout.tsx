import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";

import "./globals.css";
import { ThemeProvider } from "./provider";
import { ContextGuard } from "@/components/ContextGuard";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Adrian's Portfolio",
  description: "Modern & Minimal JS Mastery Portfolio",
};

export const viewport: Viewport = {
  themeColor: "#000319",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/jsm-logo.png" sizes="any" />
      </head>
      <body suppressHydrationWarning className={inter.className}>
        <ContextGuard>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </ContextGuard>
      </body>
    </html>
  );
}
