// Central place for values that will be reused across the app.

export const BROKER_ID = "vorqexa";

// Links back to the rest of the Vorqexa ecosystem.
// NOTE: SITE_URL is an assumption. Change it if your marketing site lives elsewhere.
export const SITE_URL = "https://vorqexa.xyz";
export const DEX_URL = "https://dex.vorqexa.xyz";
export const DOCS_URL = `${SITE_URL}/docs/`;

export const SOCIALS = [
  { label: "X / Twitter", href: "https://x.com/vorqexa?s=11" },
  { label: "Telegram", href: "https://t.me/VORQEXACOMMUNITY" },
  { label: "GitHub", href: "https://github.com/vorqexa" },
  { label: "YouTube", href: "https://www.youtube.com/@vorqexa-DEX" },
] as const;
