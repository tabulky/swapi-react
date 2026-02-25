import { ThemeProvider } from "next-themes";
import { SwapiFetchProvider } from "@/lib/swapi/createSwapiStore";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import LayoutHeader from "@/components/LayoutHeader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Star Wars Planet Explorer",
  description:
    "Browse Star Wars planets, people, and more using the SWAPI API.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SwapiFetchProvider>
            <LayoutHeader />
            {children}
          </SwapiFetchProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
