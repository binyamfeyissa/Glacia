import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function Base({ children, ...props }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export function SnowflakeIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M12 2v20" />
      <path d="M3.3 7l17.4 10" />
      <path d="M20.7 7L3.3 17" />
      <path d="M9.4 3.6L12 6.2l2.6-2.6" />
      <path d="M9.4 20.4L12 17.8l2.6 2.6" />
      <path d="M3.7 11.2L6.9 12l-1 3.1" />
      <path d="M20.3 11.2L17.1 12l1 3.1" />
    </Base>
  );
}

export function SearchIcon(props: IconProps) {
  return (
    <Base {...props}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="M16 16l4.5 4.5" />
    </Base>
  );
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M4.5 12h15" />
      <path d="M13.5 6l6 6-6 6" />
    </Base>
  );
}

export function ArrowUpRightIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M7 17L17 7" />
      <path d="M8 7h9v9" />
    </Base>
  );
}

export function CopyIcon(props: IconProps) {
  return (
    <Base {...props}>
      <rect x="9" y="9" width="11" height="11" rx="2.5" />
      <path d="M15 5.5A2.5 2.5 0 0012.5 3h-6A3.5 3.5 0 003 6.5v6A2.5 2.5 0 005.5 15" />
    </Base>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M4.5 12.5l5 5 10-11" />
    </Base>
  );
}

export function SunIcon(props: IconProps) {
  return (
    <Base {...props}>
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2v2.4M12 19.6V22M4.2 4.2l1.7 1.7M18.1 18.1l1.7 1.7M2 12h2.4M19.6 12H22M4.2 19.8l1.7-1.7M18.1 5.9l1.7-1.7" />
    </Base>
  );
}

export function MoonIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M20 14.4A8.4 8.4 0 019.6 4a8.5 8.5 0 1010.4 10.4z" />
    </Base>
  );
}

export function GithubIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 1.8a10.2 10.2 0 00-3.23 19.88c.51.1.7-.22.7-.49v-1.9c-2.84.62-3.44-1.2-3.44-1.2-.47-1.18-1.14-1.5-1.14-1.5-.93-.63.07-.62.07-.62 1.03.07 1.57 1.06 1.57 1.06.91 1.57 2.4 1.12 2.98.86.09-.66.36-1.12.65-1.37-2.27-.26-4.66-1.14-4.66-5.05 0-1.12.4-2.03 1.05-2.74-.1-.26-.46-1.3.1-2.7 0 0 .86-.28 2.81 1.05a9.7 9.7 0 015.12 0c1.95-1.33 2.8-1.05 2.8-1.05.57 1.4.21 2.44.1 2.7.66.71 1.05 1.62 1.05 2.74 0 3.92-2.39 4.79-4.67 5.04.37.32.7.95.7 1.91v2.83c0 .27.18.6.71.49A10.2 10.2 0 0012 1.8z" />
    </svg>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </Base>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M6 6l12 12M18 6L6 18" />
    </Base>
  );
}

export function ChevronDownIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M6 9.5l6 6 6-6" />
    </Base>
  );
}

export function LayersIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M12 3l9 5-9 5-9-5 9-5z" />
      <path d="M3 12.5l9 5 9-5" />
      <path d="M3 17l9 5 9-5" />
    </Base>
  );
}

export function SparkIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z" />
      <path d="M18.5 15.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2z" />
    </Base>
  );
}

export function PhoneIcon(props: IconProps) {
  return (
    <Base {...props}>
      <rect x="7" y="2.5" width="10" height="19" rx="3" />
      <path d="M10.5 5.5h3" />
    </Base>
  );
}

export function ShieldIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M12 3l7.5 3v5.5c0 4.4-3.1 7.6-7.5 9.5-4.4-1.9-7.5-5.1-7.5-9.5V6L12 3z" />
      <path d="M9 12l2 2 4-4" />
    </Base>
  );
}

export function CodeIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M8.5 8L4 12l4.5 4" />
      <path d="M15.5 8L20 12l-4.5 4" />
      <path d="M13.5 5l-3 14" />
    </Base>
  );
}

export function GridIcon(props: IconProps) {
  return (
    <Base {...props}>
      <rect x="3.5" y="3.5" width="7" height="7" rx="2" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="2" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="2" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="2" />
    </Base>
  );
}
