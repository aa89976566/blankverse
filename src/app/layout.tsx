import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const display = localFont({
  src: "./fonts/display.woff2",
  variable: "--font-display",
  weight: "300",
  display: "swap",
});

const sans = localFont({
  src: "./fonts/sans.woff2",
  variable: "--font-sans",
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Blank Verse Films",
  description:
    "Blank Verse Films is a production house operating across the UK and India.",
  metadataBase: new URL("https://www.blankversefilms.com"),
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
