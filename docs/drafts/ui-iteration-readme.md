# README additions for the UI iteration (paste into README.md, edit to taste)

## Under "What this is" (new bullets)

5. Two themes built on ArrowFin's palette: dark by default (background #0a0a12, cards
   #1a1a24, cyan #00f2ff accent) and a light theme (white surfaces, purple #7b2cbf accent
   with a darkened cyan for highlights). Every component uses semantic tokens
   (`bg-card`, `text-fg`, `border-line`, `text-danger`, …) defined once in
   `app/globals.css` and mapped into Tailwind 4, so a theme is a set of CSS variables, not a
   second set of classes. The choice is stored in the browser and applied before first paint
   by a tiny inline script (`lib/theme.tsx`), so there is no flash on reload. HIGH risk stays
   red in both themes.
6. English and Spanish. A dependency-free dictionary layer (`lib/i18n/`) with typed keys, a
   segmented EN/ES selector in the header, the browser language as the default, and
   `<html lang>` kept in sync. Numbers, percentages and money follow the locale through
   `Intl` (money stays USD); timestamps stay UTC in ISO order, the trading convention.
7. A Connection panel under the session panel shows the socket settings the demo is running
   with: status, negotiated transport, the server heartbeat announced by the backend's
   `hello` event (ping interval and timeout), connect timeout, the client's reconnect
   back-off, the stale threshold, rooms joined, server time and the last event time. If the
   backend never sends `hello` the panel shows the client values and "server: n/a".
8. Responsive down to phone width: the header wraps to two rows with a full-width account
   selector, P&L cards go two per row, the positions table scrolls horizontally, and the
   right column stacks under the left.

## Under "Running it locally" (new rows in the variables table)

| Variable | Purpose | Default |
| --- | --- | --- |
| `NEXT_PUBLIC_WS_RECONNECT_DELAY_MS` | Socket.IO client reconnection back-off, first retry (ms) | `1000` |
| `NEXT_PUBLIC_WS_RECONNECT_DELAY_MAX_MS` | Cap the back-off grows to (ms) | `5000` |
| `NEXT_PUBLIC_WS_STALE_AFTER_MS` | Time without a connection before figures are marked stale (ms) | `5000` |

These are read at build time (`NEXT_PUBLIC_*`), so a change means a rebuild; on Netlify set
them in the site's environment variables. The server-side heartbeat trio
(`WS_PING_INTERVAL_MS`, `WS_PING_TIMEOUT_MS`, `WS_CONNECT_TIMEOUT_MS`) lives in the backend
and is announced to the client over the socket, which is what the Connection panel displays.

## Under "Structure" (new rows)

| Path | Responsibility |
| --- | --- |
| `lib/theme.tsx` | Theme provider, `useTheme()`, the pre-paint init script |
| `lib/i18n/` | `en.ts`, `es.ts` dictionaries; provider, `useT()`, `useLocale()`, `useFormat()` |
| `components/ThemeToggle.tsx`, `components/LanguageSelector.tsx` | Header controls |
| `components/snapshot/ConnectionPanel.tsx` | Socket settings and heartbeat announced by the server |

## Under "Reconnect behaviour" (one added sentence)

The stale threshold and the client back-off are configuration
(`NEXT_PUBLIC_WS_STALE_AFTER_MS`, `NEXT_PUBLIC_WS_RECONNECT_DELAY_MS`,
`NEXT_PUBLIC_WS_RECONNECT_DELAY_MAX_MS`), and the values in effect are visible in the
Connection panel during a demo.
