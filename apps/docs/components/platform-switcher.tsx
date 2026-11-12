"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { PLATFORMS, PLATFORM_ORDER, counterpartPath, platformFromPathname } from "../data/platforms";

/**
 * Web | Mobile. Rendered as two links rather than a client-side toggle so each
 * platform has its own URL, can be deep-linked and opened in a new tab, and
 * works without JavaScript. The active side is marked with aria-current, which
 * is also what styles the selected pill.
 */
export function PlatformSwitcher({ className }: { className?: string }) {
  const pathname = usePathname() || "/";
  const current = platformFromPathname(pathname);

  return (
    <nav className={["platform-switch", className].filter(Boolean).join(" ")} aria-label="Platform">
      {PLATFORM_ORDER.map((id) => {
        const platform = PLATFORMS[id];
        const active = current === id;
        return (
          <Link
            key={id}
            href={counterpartPath(pathname, id)}
            className="platform-switch-option"
            aria-current={active ? "true" : undefined}
            data-active={active ? "true" : undefined}
            title={`${platform.label} — ${platform.pkg}`}
          >
            {platform.label}
          </Link>
        );
      })}
    </nav>
  );
}
