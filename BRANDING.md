# Vorqexa Brand & Style Notes

Derived from `styles.css` (first ~80 lines plus a token grep) and the `index.html` header/footer markup. Anything not seen is listed under "Not yet verified".

## Identity

- **Name:** Vorqexa
- **Tagline:** "Perpetual trading, made clear."
- **Page title pattern:** `Vorqexa — Perpetual Trading, Made Clear.`
- **Tone:** focused, calm, precise. Dark, minimal, data-first.
- **Logos:** `assets/logo-sm.webp` (header 32px tall, footer 42px tall), `assets/logo.webp` (full). Favicons: `favicon.png`, `favicon-192.png`.

## Colour tokens (`:root`)

| Token | Value | Use |
|---|---|---|
| `--bg` | `#030504` | Page background (near-black with a green tint) |
| `--panel` | `#0B0F0D` | Cards, panels |
| `--panel-2` | `#0F1512` | Raised or secondary panels |
| `--line` | `#1C2620` | Borders, dividers |
| `--mint` | `#B6FAD1` | Primary accent, CTAs, kickers, links on hover |
| `--mint-bright` | `#B6FAD1` | Hover accent (currently identical to `--mint`) |
| `--text` | `#EDF5F0` | Primary text |
| `--muted` | `#7C9089` | Secondary text, nav links, labels |
| `--red` | `#E28A7F` | Negative / warning (soft coral, not pure red) |
| `--shadow-soft` | `0 18px 50px rgba(0,0,0,.22)` | Soft elevation |
| `--shadow-card` | `0 14px 38px rgba(0,0,0,.18)` | Card elevation |

Button text on mint: `#04140D`.
Semantic mapping for trading UI: mint = positive/profit, `--red` = negative/loss.

## Typography

- **Headings (`h1, h2, h3, .display`):** Space Grotesk, weights 400-700
- **Body:** Inter, weights 400-600
- **Numbers, labels, step indexes (`.mono`):** JetBrains Mono, weights 400-500
- Brand wordmark text: 19px, weight 600, letter-spacing -0.02em
- Nav links: 14.5px, muted, brighten to `--text` on hover (0.15s ease)
- Font smoothing: antialiased
- Loaded from Google Fonts with `display=swap`

## Layout

- **Container:** `.wrap`, max-width 1180px, centred, 32px side padding
- **Header:** sticky, `z-index:50`, background `rgba(3,5,4,0.82)`, `backdrop-filter: blur(10px)`, 1px `--line` bottom border, nav padding 18px 0
- **Hero:** 2-column grid (1.05fr / 0.95fr), 50px gap, padding 88px 0 100px, fluid side padding `clamp(12px, 2vw, 28px)`
- **Page backdrop:** fixed `body::before` with two soft radial green glows (top-right and left-middle), `z-index:0`, non-interactive. Page content needs `position:relative; z-index:1` to sit above it.

## Components

- **`.btn`:** inline-flex, padding 11px 22px, radius 7px, 14.5px, weight 600, 1px transparent border, 0.15s transitions
- **`.btn-primary`:** mint fill, dark text; hover adds a 4px mint halo (`rgba(127,226,197,0.15)`)
- **`.btn-ghost`:** transparent, `--line` border; hover turns border and text mint
- **`.kicker`:** small mint label above headings
- **`.step .n`:** mint, 13px, JetBrains Mono
- **Footer:** `.foot-row` (brand + `.foot-links` social icons: X, Telegram, GitHub, YouTube, Docs) and `.foot-copy`
- **Accessibility helpers:** `.vq-skip` skip link, `.sr-only`, mobile menu `.vq-mobile-toggle` / `.vq-mobile-menu`
- **Radii and borders:** 7px on buttons, 1px `--line` borders, no heavy shadows

## Header and footer structure (to reuse on new pages)

- Header: `.wrap > nav[aria-label="Primary navigation"]` containing `.brand` (logo), `.nav-links`, `.nav-cta` (Launch app button), mobile toggle. Followed by a separate `nav.vq-mobile-menu#vq-mobile-menu[hidden]`.
- Nav links: Features, How it works, Infrastructure, Docs (`docs/`). Section links are in-page anchors (`#features` etc.), so on other pages they would need `index.html#...`.
- Footer: `<footer> > .wrap > .foot-row + p.foot-copy`
- Page `<head>` includes a strict CSP (self + Google Fonts, `https:` for images and connect), `theme-color #030504`, and cache-busted assets (`styles.css?v=...`, `script.js?v=...`).

## Inconsistencies worth knowing

1. **Two greens.** Glows and the button halo use `rgba(127,226,197,...)` (about `#7FE2C5`), but the brand mint is `#B6FAD1`. New work should use `#B6FAD1`-based values.
2. **Duplicate token blocks.** Around lines 711-781 of `styles.css`, brand tokens are redefined (`--vorqexa-brand-green`, `--accent-green`, `--brand-green`, `--brand-color`) and the core palette is repeated. They all resolve to `#B6FAD1`, but there are several names for one colour.
3. **`--mint` and `--mint-bright` are identical,** so hover states change nothing except the halo.
4. **Inline styles on logos** in the markup (`height:32px`, `height:42px`) override CSS.

## Not yet verified

I have not seen: cards/panels styling, section headings and spacing scale, the mobile menu CSS, footer CSS, form/input styling, table styling, breakpoints, or anything in `script.js` (theme or menu logic). Share those parts of `styles.css` if you want them documented too.
