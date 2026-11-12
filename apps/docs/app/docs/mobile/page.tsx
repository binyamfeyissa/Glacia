import { redirect } from "next/navigation";

/** /docs/mobile is a stable alias for the mobile manual. */
export default function DocsMobile() {
  redirect("/platform/mobile");
}
