import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const sans = Plus_Jakarta_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "LMS Demo — Headless learning platform",
  description: "Referenčná implementácia headless LMS pre integrátorov",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sk" className="h-full">
      <body
        className={`${sans.variable} min-h-full bg-background font-sans text-foreground antialiased`}
      >
        <div className="site-bg min-h-full">{children}</div>
      </body>
    </html>
  );
}
