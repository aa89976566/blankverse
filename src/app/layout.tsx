import type { Metadata } from "next";
import { Syne, Manrope } from "next/font/google";
import "./globals.css";

const display = Syne({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["600", "700", "800"],
});

const body = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Blank Verse Films",
  description:
    "Blank Verse Films — UK & India production house by sisters Meghna & Udbhavi Upadhyay. for the love of filmmaking.",
  metadataBase: new URL("https://www.blankversefilms.com"),
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        <div className="site-shell">{children}</div>
      </body>
    </html>
  );
}
