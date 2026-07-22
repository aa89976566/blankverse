import Link from "next/link";
import { site } from "@/lib/content";

export function Header({
  aboutHref = "/about/",
  label = "About",
}: {
  aboutHref?: string;
  label?: string;
}) {
  return (
    <header className="js-header">
      <Link href="/" className="js-header__brand">
        {site.name}
      </Link>
      <Link href={aboutHref} className="js-header__about">
        {label}
      </Link>
    </header>
  );
}
