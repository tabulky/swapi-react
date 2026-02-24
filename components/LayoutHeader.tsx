import Link from "next/link";

import { ThemeToggle } from "./ThemeToggle";
import { appNavigationList } from "./appNavigationList";

export default function LayoutHeader() {
  return (
    <header className="h-14 flex items-center justify-between px-6 bg-background border-b border-foreground/10">
      <span className="text-lg font-bold tracking-wide">SWAPI</span>

      <nav>
        <ul className="flex items-center gap-6">
          {appNavigationList.map(({ label, href }) => (
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
