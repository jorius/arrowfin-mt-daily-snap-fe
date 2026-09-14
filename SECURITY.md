# Security notes — Frontend widget

The canonical security and PII writeup lives in the backend repository:
<https://github.com/jorius/arrowfin-mt-daily-snap-svc/blob/main/SECURITY.md>.
This file covers only what the browser side does.

Legend: ✍️ written by the candidate · 🤖 drafted from the code with an LLM, reviewed by
the candidate.

## Where the API key lives 🤖✍️

- The opaque key returned by `POST /auth/api/key` is kept in `sessionStorage`
  (tab-scoped, gone when the tab closes). It is sent as `Authorization: Bearer` on
  every request and as `auth.apiKey` in the Socket.IO handshake.
- Trade-off: anything readable by JavaScript is readable by an XSS payload. An
  `httpOnly` cookie would protect the REST path but cannot be attached to a
  cross-origin WebSocket handshake from the browser, and the API key is revocable
  server-side and short-lived (12 h). _(candidate's view: …)_
- The key is never written to `localStorage`, the URL, or logs.

## What the client sends and receives 🤖

- Sends: trader id + secret once (login); account id in the path; nothing over the
  socket. There is no subscribe message, so the client cannot ask for another
  tenant's stream.
- Receives: its own accounts, its own snapshot, and `fill` events containing only
  `{ id, accountId, symbol, side, quantity, price, filledAt }`. No names, balances,
  notes or other traders' data ever reach the browser.

## Rendering 🤖

- All values are rendered through React's escaping; no `dangerouslySetInnerHTML`.
- Numbers come from the server; the client does not compute P&L or risk.

## What would change in production ✍️

_(CSP headers, same-site BFF cookie for REST, key rotation on reconnect, …)_
