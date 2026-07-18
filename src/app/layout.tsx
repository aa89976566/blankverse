import type { Metadata } from "next";
import { Instrument_Serif, Syne } from "next/font/google";
import "./globals.css";

const display = Syne({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const body = Instrument_Serif({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
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
    <html lang="en" className={`${display.variable} ${body.variable} h-full`}>
      <body className="min-h-full antialiased">{children}</body>
    </html>
  );
}
