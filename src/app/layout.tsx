import type { Metadata } from "next";
import { Instrument_Serif, Manrope } from "next/font/google";
import "./globals.css";

const display = Instrument_Serif({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
});

const sans = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Blank Verse Films",
  description:
    "Blank Verse Films is a production house operating across the UK and India. Short films, features, and responsible storytelling that resonates across borders.",
  metadataBase: new URL("https://www.blankversefilms.com"),
  openGraph: {
    title: "Blank Verse Films",
    description: "for the love of filmmaking",
    url: "https://www.blankversefilms.com",
    siteName: "Blank Verse Films",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} h-full`}>
      <body className="min-h-full antialiased">{children}</body>
    </html>
  );
}
