import { BlockBackdrop } from "../internal/block-backdrop";
import * as React from "react";
import { Glass } from "../glass";
import { Button } from "../button";
import { Switch } from "../switch";
import { Badge } from "../badge";

export interface PricingBlockProps {
  /** Backdrop image behind the block. */
  image?: string;
}

export function PricingBlock({ image }: PricingBlockProps) {
  const [annual, setAnnual] = React.useState(true);

  const tiers = [
    {
      name: "Community",
      description: "For personal experiments and indie designers exploring liquid glass.",
      price: annual ? "$0" : "$0",
      period: "forever",
      featured: false,
      buttonText: "Start Free",
      buttonVariant: "glass" as const,
      features: [
        "All 113 Liquid Glass web components",
        "11 React Native components, charts included",
        "Chromium SVG optical refraction layer",
        "Community Discord access",
        "MIT open-source license",
      ],
    },
    {
      name: "Pro Studio",
      description: "For modern production apps demanding authentic Apple HIG fidelity.",
      price: annual ? "$24" : "$29",
      period: "per user / month",
      featured: true,
      buttonText: "Upgrade to Pro",
      buttonVariant: "filled" as const,
      badge: "Most Popular",
      features: [
        "Everything in Community",
        "14 Pre-composed production Blocks",
        "Custom SVG refraction displacement maps",
        "Figma design kit with Apple tokens",
        "Direct engineer Slack & GitHub priority",
        "Commercial enterprise SLA support",
      ],
    },
    {
      name: "Enterprise",
      description: "Custom design systems and bespoke Apple platform implementations.",
      price: "Custom",
      period: "billed annually",
      featured: false,
      buttonText: "Contact Engineering",
      buttonVariant: "glass" as const,
      features: [
        "Everything in Pro Studio",
        "Custom shader / WebGL2 refraction engine",
        "Dedicated UI/UX design architecture review",
        "On-premise registry & private npm feeds",
        "Custom legal & security agreements",
      ],
    },
  ];

  return (
    <BlockBackdrop image={image}>
    <div className="gl-pricing-block">
      <div className="gl-pricing-header">
        <Badge variant="default" className="gl-pricing-badge">
          Pricing Plans
        </Badge>
        <h2 className="gl-pricing-title">Architected for Speed & Optics</h2>
        <p className="gl-pricing-subtitle">
          Scale from prototype to production with authentic Apple Liquid Glass ergonomics.
        </p>

        <div className="gl-pricing-billing-switch">
          <span className={`gl-billing-label ${!annual ? "gl-active" : ""}`}>Monthly</span>
          <Switch checked={annual} onCheckedChange={setAnnual} />
          <span className={`gl-billing-label ${annual ? "gl-active" : ""}`}>
            Annual <span className="gl-discount-tag">Save 20%</span>
          </span>
        </div>
      </div>

      <div className="gl-pricing-cards-grid">
        {tiers.map((tier) => (
          <Glass
            key={tier.name}
            className={`gl-pricing-card ${tier.featured ? "gl-pricing-featured" : ""}`}
          >
            {tier.badge && (
              <div className="gl-pricing-card-badge-wrap">
                <Badge variant="default" className="gl-pricing-featured-badge">
                  {tier.badge}
                </Badge>
              </div>
            )}

            <div className="gl-pricing-card-head">
              <h3 className="gl-pricing-tier-name">{tier.name}</h3>
              <p className="gl-pricing-tier-desc">{tier.description}</p>
            </div>

            <div className="gl-pricing-amount-wrap">
              <span className="gl-pricing-amount">{tier.price}</span>
              <span className="gl-pricing-period">{tier.period}</span>
            </div>

            <Button
              variant={tier.buttonVariant}
              className="gl-pricing-cta-btn"
            >
              {tier.buttonText}
            </Button>

            <div className="gl-pricing-features-list">
              <span className="gl-pricing-features-title">What's included:</span>
              {tier.features.map((feat, idx) => (
                <div key={idx} className="gl-pricing-feature-row">
                  <svg className="gl-pricing-check-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </Glass>
        ))}
      </div>
    </div>
    </BlockBackdrop>
  );
}
