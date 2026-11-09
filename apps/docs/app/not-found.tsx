import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRightIcon } from "../components/icons";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <div className="not-found">
      <div className="not-found-glow" aria-hidden="true" />
      <div className="not-found-inner">
        <p className="not-found-code">404</p>
        <p className="not-found-kicker">Route not found</p>
        <h1 className="not-found-title">This page drifted out of orbit.</h1>
        <p className="not-found-desc">
          The link may be outdated, or the page has moved. Everything in the
          library is still one step away.
        </p>
        <div className="not-found-actions">
          <Link href="/" className="btn btn-primary">
            Back to overview
            <ArrowRightIcon width={16} height={16} className="arrow" />
          </Link>
          <Link href="/components/button" className="btn btn-glass">
            Browse components
          </Link>
        </div>
      </div>
    </div>
  );
}
