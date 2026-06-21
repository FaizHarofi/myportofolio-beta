import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { GeistSans } from "geist/font/sans";

import "./globals.css";
import { ThemeProvider } from "./provider";
import { ContextGuard } from "@/components/ContextGuard";
import { CursorGate } from "@/components/CursorGate";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FaizHarofi's Portfolio",
  description:
    "About FaizHarofi — web developer from Pekanbaru, Riau, Indonesia.",
  icons: {
    icon: [{ url: "/nl-logo.png", sizes: "any", type: "image/png" }],
    shortcut: "/nl-logo.png",
    apple: "/nl-logo.png",
  },
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
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.className} ${GeistSans.variable}`}
    >
      <body suppressHydrationWarning className={inter.className}>
        <ContextGuard>
          <ThemeProvider>
            <CursorGate />
            {children}
          </ThemeProvider>
        </ContextGuard>
      </body>
    </html>
  );
}
