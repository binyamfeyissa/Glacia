import { redirect } from "next/navigation";

/** /docs is the entry point; the manual itself lives per platform. */
export default function DocsIndex() {
  redirect("/platform/web");
}
