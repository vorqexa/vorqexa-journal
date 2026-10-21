import { useEffect, useRef, useState, type FormEvent } from "react";
import { asset, DEX_URL, DOCS_URL, SITE_URL, SOCIALS } from "./config";
import { fetchFills, isEvmAddress, type Fill } from "./orderly";
import { connectWallet, onAccountsChanged } from "./wallet";

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

const COLUMNS = ["Date", "Market", "Side", "Price", "Size", "Fee", "Role"];
const MAX_ROWS = 50;

const short = (a: string) => `${a.slice(0, 6)}…${a.slice(-4)}`;
const market = (s: string) => s.replace(/^PERP_(.+)_USDC$/, "$1-PERP");
const num = (v: string, d: number) => Number(v).toLocaleString(undefined, { maximumFractionDigits: d });

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [notice, setNotice] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [fills, setFills] = useState<Fill[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const reqId = useRef(0);
  const viaWallet = useRef(false);

  async function load(addr: string) {
    const id = ++reqId.current;
    setAddress(addr);
    setLoading(true);
    setError("");
    setFills([]);
    try {
      const rows = await fetchFills(addr, 90);
      if (id === reqId.current) setFills(rows);
    } catch (e) {
      if (id === reqId.current) setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      if (id === reqId.current) setLoading(false);
    }
  }

  function disconnect() {
    reqId.current++;
    viaWallet.current = false;
    setAddress(null);
    setFills([]);
    setError("");
    setLoading(false);
    setInput("");
  }

  async function onConnect() {
    setError("");
    try {
      const addr = await connectWallet();
      viaWallet.current = true;
      await load(addr);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not connect.");
    }
  }

  function onLookup(ev: FormEvent) {
    ev.preventDefault();
    const v = input.trim();
    if (!isEvmAddress(v)) {
      setError("Enter a valid wallet address (0x followed by 40 characters).");
      return;
    }
    viaWallet.current = false;
    void load(v);
  }

  // If the user switches account in their wallet, follow it (only when connected via wallet).
  useEffect(
    () =>
      onAccountsChanged((a) => {
        if (!viaWallet.current) return;
        if (a) void load(a);
        else disconnect();
      }),
    [],
  );

  const emptyMessage = loading
    ? "Loading trades…"
    : address && !error
      ? "No trades found for this wallet in the last 90 days."
      : "Connect your wallet to import trades, or paste an address.";

  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>

      <header className="site-header">
        <div className="wrap">
          <nav className="nav" aria-label="Primary navigation">
            <a className="brand" href={SITE_URL} aria-label="Vorqexa home">
              <img src={asset("assets/logo.png")} alt="Vorqexa" height={32} decoding="async" />
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
              {address ? (
                <>
                  <span className="addr mono">{short(address)}</span>
                  <button type="button" className="btn btn-ghost" onClick={disconnect}>
                    Disconnect
                  </button>
                </>
              ) : (
                <button type="button" className="btn btn-primary" onClick={onConnect}>
                  Connect wallet
                </button>
              )}
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
              {!address && (
                <button type="button" className="btn btn-primary" onClick={onConnect}>
                  Connect wallet
                </button>
              )}
              <button type="button" className="btn btn-ghost" onClick={() => setNotice(true)}>
                Add a manual trade
              </button>
            </div>
            {!address && (
              <form className="lookup" onSubmit={onLookup}>
                <input
                  className="input mono"
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="…or paste any wallet address (0x…)"
                  aria-label="Wallet address"
                  spellCheck={false}
                  autoComplete="off"
                />
                <button type="submit" className="btn btn-ghost">
                  View trades
                </button>
              </form>
            )}
            {error && (
              <p className="alert" role="alert">
                {error}
              </p>
            )}
            {notice && (
              <p className="notice mono" role="status">
                Manual trade entry is coming in a later build.
              </p>
            )}
            <p className="privacy mono">
              Read-only: we only read public trade history. We never ask for a signature.
            </p>
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
              Fills
            </h2>
            {address && (
              <p className="table-meta mono">
                Wallet {short(address)} · {fills.length} fills (last 90 days)
                {fills.length > MAX_ROWS ? ` · showing latest ${MAX_ROWS}` : ""}
              </p>
            )}
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
                    {fills.length === 0 ? (
                      <tr>
                        <td colSpan={COLUMNS.length} className="table-empty">
                          {emptyMessage}
                        </td>
                      </tr>
                    ) : (
                      fills.slice(0, MAX_ROWS).map((f) => (
                        <tr key={f.id}>
                          <td className="mono">{new Date(f.executed_timestamp).toLocaleString()}</td>
                          <td className="mono">{market(f.symbol)}</td>
                          <td className={`mono ${f.side === "BUY" ? "pos" : "neg"}`}>{f.side}</td>
                          <td className="mono">{num(f.executed_price, 2)}</td>
                          <td className="mono">{num(f.executed_quantity, 4)}</td>
                          <td className="mono">
                            {num(f.fee, 4)} {f.fee_asset}
                          </td>
                          <td className="mono">{f.is_maker ? "Maker" : "Taker"}</td>
                        </tr>
                      ))
                    )}
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
              <img src={asset("assets/logo.png")} alt="Vorqexa" height={42} loading="lazy" decoding="async" />
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