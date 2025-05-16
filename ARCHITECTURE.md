# ARCHITECTURE.md

## Frontend (AngularJS)
- Uses `mainApp` module with partials routed by `ui-router`.
- Socket.IO integration for notifications and real-time updates.
- Key Controllers:
  - `walletController`: Manages deposits and withdrawals.
  - `transactionsController`: User transaction history.
  - `adminTransactionsController`: Admin view of transactions.
  - `adminWithdrawalsController`: Admin approve/reject withdrawal.
  - `matchController`: Manages match result submission and bracket flow.
  - `bracketController`: Bracket rendering and update logic.
  - `navController`: Navigation and user auth.
  - `challengesController`: (To Be Implemented) List and join public challenges.

## Backend (Node.js + Express)
- Knex.js + PostgreSQL for query building.
- Stripe used for deposits with webhook crediting user wallet.
- Routes organized under `/routes/` with separation by feature.
- `middleware/auth.js` manages JWT token parsing.
- `webhook.js` handles Stripe webhook and updates wallet + logs transaction.

## Database
- `users`: Stores auth and profile data.
- `wallets`: Each user has one wallet, balance in cents.
- `transactions`: Logs deposits, withdrawals, prize payouts.
- `withdrawals`: User-initiated requests processed by admin.
- `events`, `event_participants`: Event metadata and registrants.
- `challenges`, `challenge_participants`: Challenge-style competitions.
- `bracket_matches`: Used for bracket-based event flow.
- `match_verifications`: Result automation using Tracker.gg.

## Game Integration
- Apex and Rocket League support started.
- Tracker.gg mock logic in place; real endpoints available via `trackerService.js`.

## Stripe Flow
1. Client calls `/wallet/deposit/intent`.
2. Stripe returns `client_secret` to frontend.
3. Webhook `/webhook` listens for `payment_intent.succeeded`.
4. Updates wallet, logs transaction, and notifies frontend.

## Missing / Upcoming
- Public challenge UI (list/join/start).
- Gamertag validation on challenge join.
- Score validation for Apex + Rocket League.
- Finalize voting and chat for match dispute.
- Host fee revenue accounting for admin dashboard.

## Testing
- Jest setup in progress.
- Live testing with real 1v1 Apex challenge encouraged.