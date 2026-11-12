import * as React from "react";

import { Glass } from "../glass";
import { Button } from "../button";

export interface WalletCard {
  id: string;
  /** Card product name, e.g. "Glacia Credit". */
  name: string;
  /** Masked number as the customer would see it. */
  number: string;
  holder: string;
  expiry: string;
  /** Brand label shown in the corner. */
  brand?: string;
  /** Two colours for the card's own gradient. */
  gradient?: [string, string];
  /** Highlighted balance, if the card carries one. */
  balance?: string;
}

export interface WalletTransaction {
  id: string;
  merchant: string;
  /** Already formatted, e.g. "-$12.40". */
  amount: string;
  date: string;
  /** Whether the amount is money leaving the account. */
  debit?: boolean;
  category?: string;
}

export interface WalletBlockProps {
  cards: WalletCard[];
  transactions?: WalletTransaction[];
  /** Index of the card shown as selected. */
  selectedIndex?: number;
  onSelectCard?: (index: number) => void;
  className?: string;
}

/**
 * A stack of payment cards over a recent-activity list.
 *
 * The cards overlap deliberately: that is what lets a wallet hold several
 * cards without the block growing to the height of all of them. The selected
 * card is lifted and fully visible, the rest stay as readable edges.
 */
export function WalletBlock({
  cards,
  transactions = [],
  selectedIndex = 0,
  onSelectCard,
  className,
}: WalletBlockProps) {
  const [internal, setInternal] = React.useState(selectedIndex);
  const active = onSelectCard ? selectedIndex : internal;

  const select = (index: number) => {
    if (onSelectCard) onSelectCard(index);
    else setInternal(index);
  };

  return (
    <div className={["gl-wallet-block", className].filter(Boolean).join(" ")}>
      <div className="gl-wallet-stack" role="list" aria-label="Payment cards">
        {cards.map((card, index) => {
          const isActive = index === active;
          const gradient = card.gradient ?? ["#0a84ff", "#5e5ce6"];
          return (
            <div
              key={card.id}
              role="listitem"
              className="gl-wallet-card-slot"
              data-active={isActive ? "" : undefined}
              style={{ zIndex: cards.length - index }}
            >
              <button
                type="button"
                className="gl-wallet-card"
                onClick={() => select(index)}
                aria-pressed={isActive}
                aria-label={`${card.name}, ending ${card.number.slice(-4)}`}
                style={{
                  backgroundImage: `linear-gradient(145deg, ${gradient[0]} 0%, ${gradient[1]} 100%)`,
                }}
              >
                <span className="gl-wallet-card-head">
                  <span className="gl-wallet-card-name">{card.name}</span>
                  {card.brand && <span className="gl-wallet-card-brand">{card.brand}</span>}
                </span>

                {card.balance && <span className="gl-wallet-card-balance">{card.balance}</span>}

                <span className="gl-wallet-card-number">{card.number}</span>

                <span className="gl-wallet-card-foot">
                  <span>
                    <span className="gl-wallet-card-label">Holder</span>
                    <span className="gl-wallet-card-value">{card.holder}</span>
                  </span>
                  <span>
                    <span className="gl-wallet-card-label">Expires</span>
                    <span className="gl-wallet-card-value">{card.expiry}</span>
                  </span>
                </span>
              </button>
            </div>
          );
        })}
      </div>

      <div className="gl-wallet-actions">
        <Button variant="glass" size="sm">
          Add card
        </Button>
        <Button variant="ghost" size="sm">
          Manage
        </Button>
      </div>

      {transactions.length > 0 && (
        <Glass className="gl-wallet-activity">
          <div className="gl-wallet-activity-head">
            <span className="gl-wallet-activity-title">Recent activity</span>
          </div>
          <ul className="gl-wallet-activity-list">
            {transactions.map((tx) => (
              <li key={tx.id} className="gl-wallet-activity-row">
                <span className="gl-wallet-activity-copy">
                  <span className="gl-wallet-activity-merchant">{tx.merchant}</span>
                  <span className="gl-wallet-activity-meta">
                    {tx.date}
                    {tx.category ? ` · ${tx.category}` : ""}
                  </span>
                </span>
                <span className="gl-wallet-activity-amount" data-debit={tx.debit ? "" : undefined}>
                  {tx.amount}
                </span>
              </li>
            ))}
          </ul>
        </Glass>
      )}
    </div>
  );
}
