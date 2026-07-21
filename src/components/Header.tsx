import Link from "next/link";
import { site } from "@/lib/content";

export function Header({ aboutHref = "/about" }: { aboutHref?: string }) {
  return (
    <header className="header">
      <Link href="/" className="header__brand">
        {site.name}
      </Link>
      <Link href={aboutHref} className="header__about">
        About
      </Link>
    </header>
  );
}
