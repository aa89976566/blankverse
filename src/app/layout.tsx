import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en">
      <body>
        <div className="app-root">{children}</div>
      </body>
    </html>
  );
}
