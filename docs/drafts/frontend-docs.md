# Frontend documentation drafts

Drafted from the code for the candidate to review and merge into `README.md`
(section "Reconnect behaviour") and `SECURITY.md`. Every claim points at a file.

## README → Reconnect behaviour

**What the client does today.** `hooks/useFillStream.ts` opens one Socket.IO
connection per API key with the client's built-in reconnection (`lib/socket.ts`:
infinite attempts, back-off capped at 5 s). The connection badge is the only thing on
screen that claims liveness:

| Event | Badge | Figures |
| --- | --- | --- |
| socket `connect` (first time) | `Live` | normal |
| socket `disconnect` | `Reconnecting` (amber) | unchanged, still bright |
| 5 s without a connection | `Disconnected — figures may be stale` (red) | whole widget dimmed to 60 % |
| socket `connect` after a drop | `Live` | every snapshot query is invalidated and refetched (`↻ updating` shows while it runs) |
| handshake refused (`unauthorized`) | `Session expired` | session cleared, redirect to `/login` |

**How the client knows whether it missed fills.** It does not try to find out from
the stream. A `fill` event is a *hint to refetch*, never data to apply: the hook
invalidates the TanStack Query entry for the selected account and the server
recomputes the snapshot from the `fills` table (`components/snapshot/SnapshotWidget.tsx`
renders only server numbers; there is no client-side P&L math). A gap in the stream
therefore cannot corrupt what is shown, it can only delay it, and the reconnect
refetch closes the gap. The snapshot also carries `lastFillId`, so a stricter client
could compare the id of the last event it saw with the `lastFillId` of the refetched
snapshot and raise a warning when they differ; that comparison is not built.

**Where this would show stale numbers, honestly.**

1. Between the `disconnect` event and the 5 s stale timer the last figures stay
   bright with only the amber badge as a signal. A shorter timer trades false alarms
   for faster warnings; 5 s matches Socket.IO's own reconnection back-off.
2. The badge is pessimistic by design: if only the WebSocket is down, REST may still
   refresh the numbers on window focus (`refetchOnWindowFocus`) while the badge says
   stale. Stale-but-fresh is acceptable; live-but-stale is not.
3. A fill event whose refetch fails (a network blip on the REST call) is recovered
   only by the next event, a window focus, or a reconnect. There is no retry queue.
4. Browsers throttle timers in background tabs, so the stale badge can appear late
   when the tab is not visible.

**With a second day.** Give every fill a monotonically increasing `seq` per account,
include the latest `seq` in the snapshot, and on reconnect send `since=<seq>` so the
server replays the gap (or answers "too far behind, refetch"). That turns "did I miss
something?" into arithmetic instead of a full refetch, and lets the client render
fill-by-fill without trusting its own math.

## SECURITY.md → client-side notes

**Where the API key lives.** `lib/auth.ts` keeps the opaque key returned by
`POST /auth/api/key` in `sessionStorage` (tab-scoped, gone when the tab closes). It
is sent as `Authorization: Bearer` by `lib/api.ts` and as `auth.apiKey` in the
Socket.IO handshake by `lib/socket.ts`. It is never written to `localStorage`, the
URL, or a log line. The client never compares `expiresAt` with its own clock: expiry
and revocation are the server's decision, and any `401` clears the session and
redirects to `/login` (`app/snapshot/page.tsx`, `signOut`).

**Trade-off accepted.** Anything JavaScript can read, an XSS payload can read. An
`httpOnly` cookie would protect the REST path but cannot be attached to a
cross-origin WebSocket handshake from the browser; the mitigation here is a key that
is revocable server-side and short-lived, plus rendering that never bypasses React's
escaping (no `dangerouslySetInnerHTML`; API error messages are rendered as text).

**What the client sends.** Trader id and secret once, at login; an account id in a
path; nothing over the socket. `hooks/useFillStream.ts` only registers listeners:
there is no subscribe message, so there is nothing a modified client could send to
ask for another tenant's stream. The `event.accountId === selectedAccount` check in
the hook is a UX filter, not a security boundary: the server only ever emits to rooms
derived from the authenticated trader's own accounts.

**What the client receives.** Its own account list (`id`, number, type, status), its
own snapshot, and `fill` events limited to
`{ id, accountId, symbol, side, quantity, price, filledAt }`. No names, contact data,
notes or other traders' rows reach the browser; the only regulated figure shown is
the trader's own balance, inside the snapshot.

**In production.** A Content-Security-Policy with `connect-src` pinned to the API
origin; a backend-for-frontend so REST uses a same-site `httpOnly` cookie and the
socket gets a single-use, seconds-lived ticket minted by that BFF; key rotation on
every reconnect; and a build-time check that `NEXT_PUBLIC_*` values point at the
expected environment.
