import { redirect } from "next/navigation";

/** /docs/web is a stable alias for the web manual. */
export default function DocsWeb() {
  redirect("/platform/web");
}
