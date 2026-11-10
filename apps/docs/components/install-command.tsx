"use client";

import { useEffect, useState } from "react";
import { CheckIcon, ChevronDownIcon, CopyIcon } from "./icons";

export type PackageId = "glacia" | "glacia-native" | "glacia-tokens";

export const PACKAGES: Record<
  PackageId,
  {
    id: PackageId;
    name: string;
    tag: string;
    summary: string;
    /** Installs the package itself. */
    install: Partial<Record<Manager, string>>;
    /** Extra step shown next to the install command, when one is needed. */
    extra?: string;
    /** What you get after installing. */
    includes: string;
    /** Link that opens the published package. */
    href: string;
  }
> = {
  glacia: {
    id: "glacia",
    name: "glacia",
    tag: "React & Next.js web",
    summary: "All 81 liquid glass components for the web.",
    install: {
      npm: "npm install glacia",
      pnpm: "pnpm add glacia",
      yarn: "yarn add glacia",
      bun: "bun add glacia",
    },
    includes: "81 components · ESM + CJS · TypeScript types · glacia/styles.css",
    href: "https://www.npmjs.com/package/glacia",
  },
  "glacia-native": {
    id: "glacia-native",
    name: "glacia-native",
    tag: "React Native & Expo",
    summary: "Apple's real UIGlassEffect on iOS 26, matched fallbacks elsewhere.",
    install: {
      npm: "npm install glacia-native",
      pnpm: "pnpm add glacia-native",
      yarn: "yarn add glacia-native",
      bun: "bun add glacia-native",
    },
    extra: "npx expo install @callstack/liquid-glass",
    includes: "Native glass surfaces + controls · React Native ≥ 0.80 · Expo SDK 54+",
    href: "https://www.npmjs.com/package/glacia-native",
  },
  "glacia-tokens": {
    id: "glacia-tokens",
    name: "glacia-tokens",
    tag: "Design tokens",
    summary: "Optic indices, spring curves, and blur values shared by web and native.",
    install: {
      npm: "npm install glacia-tokens",
      pnpm: "pnpm add glacia-tokens",
      yarn: "yarn add glacia-tokens",
      bun: "bun add glacia-tokens",
    },
    includes: "Installed automatically with glacia. Standalone for custom builds.",
    href: "https://www.npmjs.com/package/glacia-tokens",
  },
};

const MANAGERS = ["npm", "pnpm", "yarn", "bun"] as const;
type Manager = (typeof MANAGERS)[number];

const MANAGER_STORAGE_KEY = "glacia-pm";

function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard can be unavailable */
    }
  };

  return (
    <button type="button" className="install-copy" onClick={copy} aria-label={`Copy ${label}`}>
      {copied ? <CheckIcon width={15} height={15} /> : <CopyIcon width={15} height={15} />}
      <span>{copied ? "Copied" : "Copy"}</span>
    </button>
  );
}

function usePackageManager() {
  const [manager, setManager] = useState<Manager>("npm");

  useEffect(() => {
    const saved = window.localStorage.getItem(MANAGER_STORAGE_KEY) as Manager | null;
    if (saved && MANAGERS.includes(saved)) setManager(saved);
  }, []);

  const change = (next: Manager) => {
    setManager(next);
    try {
      window.localStorage.setItem(MANAGER_STORAGE_KEY, next);
    } catch {
      /* storage can be blocked */
    }
  };

  return [manager, change] as const;
}

/** Package-manager switcher shared by the hero and the install section. */
export function ManagerTabs({
  manager,
  onChange,
  label = "Package manager",
}: {
  manager: Manager;
  onChange: (manager: Manager) => void;
  label?: string;
}) {
  return (
    <div className="install-managers" role="tablist" aria-label={label}>
      {MANAGERS.map((item) => (
        <button
          key={item}
          type="button"
          role="tab"
          aria-selected={manager === item}
          className="install-manager"
          data-active={manager === item}
          onClick={() => onChange(item)}
        >
          {item}
        </button>
      ))}
    </div>
  );
}

/** Compact, fixed-to-web install line for the hero. */
export function InstallCommand({ compact = false }: { compact?: boolean }) {
  const [manager, setManager] = usePackageManager();
  const command = PACKAGES.glacia.install[manager] ?? "npm install glacia";

  return (
    <div className={`install ${compact ? "install-compact" : ""}`}>
      {!compact && <ManagerTabs manager={manager} onChange={setManager} />}
      <code className="install-command">{command}</code>
      <CopyButton value={command} label="install command" />
    </div>
  );
}

/**
 * The full install chooser: pick the package you actually need, then copy the
 * exact command. Everything is a real published package name.
 */
export function InstallPicker() {
  const [manager, setManager] = usePackageManager();
  const [active, setActive] = useState<PackageId>("glacia");
  const pkg = PACKAGES[active];
  const command = pkg.install[manager] ?? pkg.install.npm!;

  return (
    <div className="installer">
      <div className="installer-options" role="tablist" aria-label="Which package do you need?">
        {(Object.keys(PACKAGES) as PackageId[]).map((id) => {
          const option = PACKAGES[id];
          return (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={active === id}
              data-active={active === id}
              className="installer-option"
              onClick={() => setActive(id)}
            >
              <span className="installer-option-head">
                <code className="installer-option-name">{option.name}</code>
                <span className="installer-option-tag">{option.tag}</span>
              </span>
              <span className="installer-option-desc">{option.summary}</span>
            </button>
          );
        })}
      </div>

      <div className="installer-panel">
        <div className="installer-panel-bar">
          <ManagerTabs manager={manager} onChange={setManager} />
          <a
            className="installer-npm-link"
            href={pkg.href}
            target="_blank"
            rel="noreferrer"
          >
            npmjs.com/package/{pkg.name}
          </a>
        </div>

        <div className="installer-command">
          <span className="installer-prompt" aria-hidden="true">
            $
          </span>
          <code>{command}</code>
          <CopyButton value={command} label={`${pkg.name} install command`} />
        </div>

        {pkg.extra && (
          <div className="installer-command installer-command-extra">
            <span className="installer-prompt" aria-hidden="true">
              $
            </span>
            <code>{pkg.extra}</code>
            <CopyButton value={pkg.extra} label="native peer install command" />
          </div>
        )}

        <p className="installer-includes">
          <span className="installer-includes-label">Includes</span>
          {pkg.includes}
        </p>

        {pkg.id === "glacia-native" && (
          <p className="installer-hint">
            Expo: use <code>npx expo install glacia-native @callstack/liquid-glass</code> so both
            versions match your SDK.
          </p>
        )}

        <CliBlock />
      </div>
    </div>
  );
}

/**
 * The copy-your-own-source path, shown as a disclosure so it never competes
 * with the normal install command.
 */
export function CliBlock({ slug }: { slug?: string }) {
  const [open, setOpen] = useState(false);
  const command = slug ? `npx glacia add ${slug}` : "npx glacia add <component>";

  return (
    <div className="cli-block" data-open={open}>
      <button
        type="button"
        className="cli-toggle"
        aria-expanded={open}
        aria-controls="glacia-cli-panel"
        onClick={() => setOpen((value) => !value)}
      >
        <ChevronDownIcon width={13} height={13} className="cli-toggle-chevron" />
        <span>
          Or copy this {slug ? "component’s" : "component’s"} source into your project
        </span>
        <code>npx glacia</code>
      </button>

      {open && (
        <div className="cli-panel" id="glacia-cli-panel">
          <div className="installer-command">
            <span className="installer-prompt" aria-hidden="true">
              $
            </span>
            <code>{command}</code>
            <CopyButton value={command} label="CLI copy command" />
          </div>
          <ul className="cli-notes">
            <li>
              Writes the real <code>.tsx</code> source to <code>components/ui/</code> — you own and
              can edit it.
            </li>
            <li>
              Other names: <code>npx glacia add card dialog tabs</code>, or{" "}
              <code>npx glacia add all</code>.
            </li>
            <li>
              Copied files still import shared helpers, so keep <code>glacia</code> installed.
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
