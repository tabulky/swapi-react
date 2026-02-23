import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";

const NAV_LINKS = [
  { label: "Planets", href: "#planets" },
  { label: "People", href: "#people" },
  { label: "Species", href: "#species" },
  { label: "Starships", href: "#starships" },
  { label: "Vehicles", href: "#vehicles" },
  { label: "Films", href: "#films" },
] as const;

export default function LayoutHeader() {
  return (
    <header className="h-14 flex items-center justify-between px-6 bg-background border-b border-foreground/10">
      <span className="text-lg font-bold tracking-wide">SWAPI</span>

      <nav>
        <ul className="flex items-center gap-6">
          {NAV_LINKS.map(({ label, href }) => (
            <li key={href}>
              <Link
                href={href}
                className="text-sm transition-colors hover:text-foreground/60"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <ThemeToggle />
    </header>
  );
}
