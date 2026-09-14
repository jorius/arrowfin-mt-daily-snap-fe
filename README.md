# ArrowFin — Trader Daily Snapshot · Frontend widget

Next.js 16 (App Router) + Tailwind 4 + TanStack Query widget that renders a trader's
daily snapshot and updates it live from a tenant-scoped Socket.IO stream.

Companion repository (NestJS API, canonical README with the **Background**, **time and
LLM disclosure**, **Task 4 code review** and **Task 5 reflection**):
<https://github.com/jorius/arrowfin-mt-daily-snap-svc>

Legend: ✍️ written by the candidate · 🤖 drafted from the code with an LLM, reviewed by
the candidate.

---

## Background, time and LLM disclosure ✍️

See the backend README: <https://github.com/jorius/arrowfin-mt-daily-snap-svc#background>.

_(If you prefer the reviewer to see it here too, copy the section over.)_

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

Client-side security notes: [SECURITY.md](./SECURITY.md).

## Running it locally

| Variable | Purpose | Default |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | Backend REST base URL | `http://localhost:3001` |
| `NEXT_PUBLIC_WS_URL` | Backend Socket.IO URL | `http://localhost:3001` |

```bash
cp .env.example .env.local
npm ci
npm run dev        # http://localhost:3000
npm run lint
npm run build
```

Start the backend first (see its README), seed it, and log in with a trader id from
the dataset and the secret produced by the seed.

## Structure 🤖

| Path | Responsibility |
| --- | --- |
| `app/layout.tsx` | Dark theme, `QueryClientProvider` |
| `app/login/page.tsx` | Credentials form |
| `app/snapshot/page.tsx` | Account selector + `SnapshotWidget` |
| `components/snapshot/` | `SnapshotWidget`, `PositionsTable`, `PnlCards`, `RiskGauge`, `ConnectionBadge`, state components |
| `hooks/` | `useAccounts`, `useSnapshot` (TanStack Query), `useFillStream` (socket lifecycle) |
| `lib/` | `api.ts` (fetch with Bearer), `auth.ts` (key store), `socket.ts` (client factory), `format.ts` |

## Reconnect behaviour ✍️🤖

_Our feeds drop. When the socket disconnects and comes back, how does the client know
whether it missed fills while it was gone, and what does it do about it? If the
implementation would silently show stale numbers, say so._

_(Draft after the build: connection badge goes `reconnecting` → `stale`; on
`reconnect` the snapshot query is refetched; gap detection compares the snapshot's
`lastFillId` with the last event seen; what is honest about the limits.)_

## Task 4 and Task 5

Written in the backend README, which is the canonical submission document.
