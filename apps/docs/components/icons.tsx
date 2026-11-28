import type { SVGProps } from "react";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import SnowflakeIconData from "@hugeicons/core-free-icons/SnowflakeIcon";
import Home01Icon from "@hugeicons/core-free-icons/Home01Icon";
import Layout01Icon from "@hugeicons/core-free-icons/Layout01Icon";
import Search01Icon from "@hugeicons/core-free-icons/Search01Icon";
import ArrowRight01Icon from "@hugeicons/core-free-icons/ArrowRight01Icon";
import ArrowUpRight01Icon from "@hugeicons/core-free-icons/ArrowUpRight01Icon";
import Copy01Icon from "@hugeicons/core-free-icons/Copy01Icon";
import CheckIconData from "@hugeicons/core-free-icons/CheckIcon";
import Sun01Icon from "@hugeicons/core-free-icons/Sun01Icon";
import Moon01Icon from "@hugeicons/core-free-icons/Moon01Icon";
import GithubIconData from "@hugeicons/core-free-icons/GithubIcon";
import Menu01Icon from "@hugeicons/core-free-icons/Menu01Icon";
import Cancel01Icon from "@hugeicons/core-free-icons/Cancel01Icon";
import ChevronDownIconData from "@hugeicons/core-free-icons/ChevronDownIcon";
import Layers01Icon from "@hugeicons/core-free-icons/Layers01Icon";
import SparklesIcon from "@hugeicons/core-free-icons/SparklesIcon";
import SmartPhone01Icon from "@hugeicons/core-free-icons/SmartPhone01Icon";
import Shield01Icon from "@hugeicons/core-free-icons/Shield01Icon";
import CodeIconData from "@hugeicons/core-free-icons/CodeIcon";
import GridIconData from "@hugeicons/core-free-icons/GridIcon";
import FavouriteIcon from "@hugeicons/core-free-icons/FavouriteIcon";
import Upload01Icon from "@hugeicons/core-free-icons/Upload01Icon";
import MoreVerticalIconData from "@hugeicons/core-free-icons/MoreVerticalIcon";

/**
 * Site icons, all from Hugeicons free (Stroke Rounded) — the same set the
 * mobile templates use. Each icon is imported by its own subpath so the
 * bundle only carries the icons actually used, never the 6,107-icon index.
 * Every export keeps the name and width/height props the site already uses.
 */
type IconProps = SVGProps<SVGSVGElement>;

function makeIcon(icon: IconSvgElement) {
  return function Icon({ width, height, strokeWidth, ...props }: IconProps) {
    return (
      <HugeiconsIcon
        icon={icon}
        size={width ?? height ?? 24}
        strokeWidth={strokeWidth !== undefined ? Number(strokeWidth) : 1.6}
        aria-hidden="true"
        {...props}
      />
    );
  };
}

export const SnowflakeIcon = makeIcon(SnowflakeIconData);
export const HomeIcon = makeIcon(Home01Icon);
export const TemplateIcon = makeIcon(Layout01Icon);
export const SearchIcon = makeIcon(Search01Icon);
export const ArrowRightIcon = makeIcon(ArrowRight01Icon);
export const ArrowUpRightIcon = makeIcon(ArrowUpRight01Icon);
export const CopyIcon = makeIcon(Copy01Icon);
export const CheckIcon = makeIcon(CheckIconData);
export const SunIcon = makeIcon(Sun01Icon);
export const MoonIcon = makeIcon(Moon01Icon);
export const GithubIcon = makeIcon(GithubIconData);
export const MenuIcon = makeIcon(Menu01Icon);
export const CloseIcon = makeIcon(Cancel01Icon);
export const ChevronDownIcon = makeIcon(ChevronDownIconData);
export const LayersIcon = makeIcon(Layers01Icon);
export const SparkIcon = makeIcon(SparklesIcon);
export const PhoneIcon = makeIcon(SmartPhone01Icon);
export const ShieldIcon = makeIcon(Shield01Icon);
export const CodeIcon = makeIcon(CodeIconData);
export const GridIcon = makeIcon(GridIconData);

/** Heart with a filled "liked" state (fills red, as the old glyph did). */
export function HeartIcon({ filled = false, width, height, strokeWidth, ...props }: IconProps & { filled?: boolean }) {
  return (
    <HugeiconsIcon
      icon={FavouriteIcon}
      size={width ?? height ?? 24}
      strokeWidth={strokeWidth !== undefined ? Number(strokeWidth) : 1.6}
      color={filled ? "#ff375f" : undefined}
      fill={filled ? "#ff375f" : undefined}
      aria-hidden="true"
      {...props}
    />
  );
}

/** Share action: the old glyph was an upload-out-of-tray arrow. */
export const ShareIcon = makeIcon(Upload01Icon);

/** Vertical three-dot "more" menu. */
export const MoreIcon = makeIcon(MoreVerticalIconData);
