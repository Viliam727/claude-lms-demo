import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LMS Demo",
  description: "Headless LMS backend demo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sk" className="h-full">
      <body className={`${inter.className} min-h-full bg-white text-gray-900 antialiased`}>
        {children}
      </body>
    </html>
  );
}
