# ARCHITECTURE.md

## Frontend (AngularJS)

- Built using the `mainApp` AngularJS module.
- Uses `ui-router` with HTML5 mode routing.
- Modular design with partials and controllers:
  - `authController`, `navController`: Authentication and session flow.
  - `walletController`: Stripe deposits, withdrawals, balance fetch.
  - `profileController`: Gamertag management and Tracker.gg validation.
  - `bracketController`: Bracket rendering and match result tracking.
  - `eventsController`: Creation, joining, and participation in events.
  - `challengesController`: Creating and managing 1v1 and FFA challenges.
  - `transactionsController`: View wallet transaction history.
  - `notificationsController`: Real-time match and system alerts.
  - `adminController`: Admin tools for users, payouts, events, disputes.
- Uses Socket.IO for real-time updates and notifications.
- Includes countdown timers, result submission, dispute UI.

## Backend (Node.js + Express)

- Structured in modular directories:
  - `/routes`: API routes
  - `/controllers`: Thin controllers forwarding to services
  - `/services`: Core logic for matches, users, payouts, etc.
  - `/models`: Database interaction via Knex
  - `/middleware`: Auth, admin checks, validation
  - `/validators`: Joi-based input schema validation
  - `/lib`: Utility helpers and logic modules
- PostgreSQL accessed via Knex.js
- JWT authentication with middleware protection
- Stripe integration for wallet funding and webhooks
- Tracker.gg used for automatic match verification (Rocket League, Apex Legends)
- `autoVerifyCron.js` polls Tracker.gg periodically for match updates

### Notable Backend Services

- `stripeService.js`: Handles payment intent creation and webhook logic
- `matchVerifier.js`: Polls Tracker.gg and verifies match outcomes
- `notificationService.js`: Pushes and stores user notifications
- `disputeService.js`: Processes player disputes and resolutions
- `teamService.js`: Team creation and join/leave logic
- `bracketService.js`: Manages bracket matches and progression
- `eventService.js`: Handles event creation, joining, flow
- `challengeService.js`: Handles 1v1 and FFA challenge logic

## Testing

- Uses Jest for all unit and integration tests.
- Tests located in `/tests/` and cover:
  - Controllers (API routes)
  - Services (business logic)
  - Match flow and verification
  - Wallet and transaction integrity
- Mock seed users and data for reproducible test environments.

## Deployment

- Deployed to DigitalOcean droplet.
- Uses HTTPS with SSL configured.
- Stripe webhook configured for secure payment reconciliation.
- `.env` files control environment-specific behavior.
