import type { Metadata } from "next";
import { Inter, Modak } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "700"],
});

const modak = Modak({
  subsets: ["latin"],
  variable: "--font-modak",
  weight: "400",
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
    <html lang="en" className={`${inter.variable} ${modak.variable}`}>
      <body>
        <div className="noise" aria-hidden />
        <div className="app-root">{children}</div>
      </body>
    </html>
  );
}
