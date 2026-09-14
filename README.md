# ArrowFin — Trader Daily Snapshot · Frontend widget

Next.js 16 (App Router) + Tailwind 4 + TanStack Query widget that renders a trader's
daily snapshot and updates it live from a tenant-scoped Socket.IO stream.

**Submission documents** (Background, time and LLM disclosure, reconnect behaviour, security
writeup, code review, reflection): <https://github.com/jorius/arrowfin-llm-usage-docs>. Companion repository (NestJS API):
<https://github.com/jorius/arrowfin-mt-daily-snap-svc>.

---

## What this is

1. `/login` — trader id + secret → `POST /auth/api/key` → opaque API key kept in
   `sessionStorage` for the tab.
2. `/snapshot` — account selector, then the widget: positions table, day P&L cards,
   risk gauge, connection badge. Loading, error and empty states are handled.
3. A Socket.IO client connects once per key with the key in the handshake. Every
   `fill` event for the selected account invalidates the snapshot query, so the
   numbers on screen always come from the server, never from client-side math.
4. Risk above 75 is unmissable: red pulsing banner, red gauge, assertive live region.
5. Two themes built on ArrowFin's palette: dark by default (background #0a0a12, cards
   #1a1a24, cyan #00f2ff accent) and a light theme (white surfaces, purple #7b2cbf accent
   with a darkened cyan for highlights). Every component uses semantic tokens (`bg-card`,
   `text-fg`, `border-line`, `text-danger`) defined once in `app/globals.css` and mapped into
   Tailwind 4, so a theme is a set of CSS variables, not a second set of classes. The choice
   is stored in the browser and applied before first paint by a tiny inline script
   (`lib/theme.tsx`), so there is no flash on reload. High risk stays red in both themes.
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

Client-side security notes and the reconnect-behaviour answer are in the submission repository: <https://github.com/jorius/arrowfin-llm-usage-docs>.

## Running it locally

| Variable | Purpose | Default |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | Backend REST base URL | `http://localhost:3001` |
| `NEXT_PUBLIC_WS_URL` | Backend Socket.IO URL | `http://localhost:3001` |
| `NEXT_PUBLIC_WS_RECONNECT_DELAY_MS` | Socket.IO client reconnection back-off, first retry (ms) | `1000` |
| `NEXT_PUBLIC_WS_RECONNECT_DELAY_MAX_MS` | Cap the back-off grows to (ms) | `5000` |
| `NEXT_PUBLIC_WS_STALE_AFTER_MS` | Time without a connection before figures are marked stale (ms) | `5000` |

These are read at build time (`NEXT_PUBLIC_*`), so a change means a rebuild; on Netlify set
them in the site's environment variables. The server-side heartbeat trio
(`WS_PING_INTERVAL_MS`, `WS_PING_TIMEOUT_MS`, `WS_CONNECT_TIMEOUT_MS`) lives in the backend
and is announced to the client over the socket, which is what the Connection panel displays.

```bash
cp .env.example .env.local
npm ci
npm run dev        # http://localhost:3000
npm run lint
npm run build
```

Start the backend first (see its README), seed it, and log in with a trader id from
the dataset and the secret produced by the seed.

## Structure

| Path | Responsibility |
| --- | --- |
| `app/layout.tsx` | Dark theme, `QueryClientProvider` |
| `app/login/page.tsx` | Credentials form |
| `app/snapshot/page.tsx` | Account selector + `SnapshotWidget` |
| `components/snapshot/` | `SnapshotWidget`, `PositionsTable`, `PnlCards`, `RiskGauge`, `ConnectionBadge`, state components |
| `hooks/` | `useAccounts`, `useSnapshot` (TanStack Query), `useFillStream` (socket lifecycle) |
| `lib/` | `api.ts` (fetch with Bearer), `auth.ts` (key store), `socket.ts` (client factory), `format.ts` |
| `lib/theme.tsx` | Theme provider, `useTheme()`, the pre-paint init script |
| `lib/i18n/` | `en.ts`, `es.ts` dictionaries; provider, `useT()`, `useLocale()`, `useFormat()` |
| `components/ThemeToggle.tsx`, `components/LanguageSelector.tsx` | Header controls |
| `components/snapshot/ConnectionPanel.tsx` | Socket settings and heartbeat announced by the server |
