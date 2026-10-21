import { useState } from "react";
import { DEX_URL, DOCS_URL, SITE_URL, SOCIALS } from "./config";

const STATS = [
  { label: "Net P&L", hint: "All closed trades" },
  { label: "Win rate", hint: "Winning trades / total" },
  { label: "Avg R", hint: "Average R-multiple" },
  { label: "Profit factor", hint: "Gross profit / gross loss" },
  { label: "Max drawdown", hint: "Peak-to-trough" },
  { label: "Best trade", hint: "Largest single win" },
  { label: "Worst trade", hint: "Largest single loss" },
  { label: "Trades", hint: "Imported + manual" },
];

const COLUMNS = ["Date", "Market", "Side", "Entry", "Exit", "P&L", "R", "Setup"];

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [notice, setNotice] = useState(false);

  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>

      <header className="site-header">
        <div className="wrap">
          <nav className="nav" aria-label="Primary navigation">
            <a className="brand" href={SITE_URL} aria-label="Vorqexa home">
              <img src="/assets/logo-sm.webp" alt="Vorqexa" height={32} decoding="async" />
              <span className="brand-tag mono">Journal</span>
            </a>

            <div className="nav-links">
              <a href={SITE_URL}>Home</a>
              <a href={DOCS_URL}>Docs</a>
              <a href={DEX_URL} rel="noopener noreferrer">
                Trade
              </a>
            </div>

            <div className="nav-cta">
              <button type="button" className="btn btn-primary" onClick={() => setNotice(true)}>
                Connect wallet
              </button>
            </div>

            <button
              type="button"
              className="menu-toggle"
              aria-label="Toggle navigation"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen((v) => !v)}
            >
              <span />
              <span />
              <span />
            </button>
          </nav>
        </div>
        <nav
          id="mobile-menu"
          className="mobile-menu"
          aria-label="Mobile navigation"
          hidden={!menuOpen}
        >
          <a href={SITE_URL}>Home</a>
          <a href={DOCS_URL}>Docs</a>
          <a href={DEX_URL} rel="noopener noreferrer">
            Trade
          </a>
        </nav>
      </header>

      <main id="main" className="main">
        <div className="wrap">
          <section className="hero">
            <p className="kicker mono">TRADING JOURNAL</p>
            <h1>Every trade, journaled automatically.</h1>
            <p className="lede">
              Connect the wallet you trade with on Vorqexa and your history flows in on its own. Add
              notes, tag your setups, log trades from elsewhere, and see what is actually working.
            </p>
            <div className="hero-actions">
              <button type="button" className="btn btn-primary" onClick={() => setNotice(true)}>
                Connect wallet
              </button>
              <button type="button" className="btn btn-ghost" onClick={() => setNotice(true)}>
                Add a manual trade
              </button>
            </div>
            {notice && (
              <p className="notice mono" role="status">
                Wallet connect and trade import are coming in the next build.
              </p>
            )}
          </section>

          <section aria-labelledby="stats-title" className="section">
            <h2 id="stats-title" className="section-title">
              Performance
            </h2>
            <div className="stats">
              {STATS.map((s) => (
                <div className="card stat" key={s.label}>
                  <span className="stat-label">{s.label}</span>
                  <span className="stat-value mono">—</span>
                  <span className="stat-hint">{s.hint}</span>
                </div>
              ))}
            </div>
          </section>

          <section aria-labelledby="equity-title" className="section">
            <h2 id="equity-title" className="section-title">
              Equity curve
            </h2>
            <div className="card empty">
              <p className="empty-title">No trades yet</p>
              <p className="empty-text">Your equity curve appears here once trades are imported or added.</p>
            </div>
          </section>

          <section aria-labelledby="trades-title" className="section">
            <h2 id="trades-title" className="section-title">
              Trades
            </h2>
            <div className="card table-card">
              <div className="table-scroll">
                <table>
                  <thead>
                    <tr>
                      {COLUMNS.map((c) => (
                        <th key={c} scope="col" className="mono">
                          {c}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan={COLUMNS.length} className="table-empty">
                        Connect your wallet to import trades, or add one manually.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>
      </main>

      <footer className="site-footer">
        <div className="wrap">
          <div className="foot-row">
            <a className="brand" href={SITE_URL} aria-label="Vorqexa home">
              <img src="/assets/logo-sm.webp" alt="Vorqexa" height={42} loading="lazy" decoding="async" />
            </a>
            <div className="foot-links">
              {SOCIALS.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer">
                  {s.label}
                </a>
              ))}
              <a href={DOCS_URL}>Docs</a>
            </div>
          </div>
          <p className="foot-copy">
            Vorqexa
            <br />
            Perpetual trading, made clear.
          </p>
        </div>
      </footer>
    </>
  );
}
