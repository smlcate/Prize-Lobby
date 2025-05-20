# ROUTES.md

## 🔓 Public Routes

### Authentication
- `POST /api/auth/register` — Register new user
- `POST /api/auth/login` — Authenticate and return JWT
- `GET /api/auth/me` — Return user info from token

### Match Verification (read-only)
- `GET /api/verification/:id/verify` — Trigger manual verification
- `GET /api/tracker/rocket-league/match/:eventId` — Rocket League stat fetch

---

## 🔐 Authenticated Routes (JWT Required)

### Users / Profile
- `GET /api/users/me` — Get own user profile
- `GET /api/profile/recent-completed` — Recently completed matches
- `GET /api/settings` — Get user settings
- `POST /api/settings` — Update user settings

### Gamertags
- `POST /api/gamertags` — Add gamertag
- `DELETE /api/gamertags/:id` — Remove gamertag
- `PATCH /api/gamertags/:id` — Update gamertag info

### Wallet
- `GET /api/wallet/balance` — Get current wallet and history
- `POST /api/wallet/deposit/intent` — Start Stripe payment intent
- `POST /api/wallet/checkout` — Confirm deposit
- `POST /api/wallet/withdraw` — Request withdrawal
- `GET /api/wallet/ping` — Test wallet route (dev)

### Transactions
- `GET /api/transactions` — Wallet transaction history

### Events
- `GET /api/events` — List all events
- `GET /api/events/:id` — View single event
- `POST /api/events` — Create event
- `POST /api/events/:id/join` — Join event

### Challenges
- `GET /api/challenges` — List open challenges
- `POST /api/challenges` — Create challenge
- `POST /api/challenges/:id/start` — Start challenge
- `POST /api/challenges/:id/join` — Join challenge
- `GET /api/challenges/:id/result` — View result
- `POST /api/challenges/:id/dispute` — Submit dispute

### Disputes
- `POST /api/disputes` — Submit new dispute

### Teams
- `POST /api/teams` — Create team
- `POST /api/teams/:id/join` — Join team
- `POST /api/teams/:id/leave` — Leave team

### Notifications
- `GET /api/notifications` — Fetch all notifications
- `POST /api/notifications/:id/read` — Mark notification as read

### Brackets
- `GET /api/bracket/:event_id` — View bracket by event

---

## 🔁 Webhooks

- `POST /webhook` — Stripe webhook for deposit reconciliation

---

## 🧪 Developer Routes (Dev/Test Only)
- `POST /api/dev/seed-test-challenge` — Populate test data
- `POST /api/mock/payout/challenge/:id` — Simulate challenge payout
- `POST /api/mock/payout/event/:id` — Simulate event payout
- `POST /api/mock/verify/:challengeId` — Simulate match verification

---

## 🛡 Admin Routes (Admin Only)

### Management
- `GET /api/admin/events` — View all events
- `GET /api/admin/challenges` — View all challenges
- `GET /api/admin/bracket-matches` — View all bracket matches
- `GET /api/admin/withdrawals` — View withdrawal requests
- `PATCH /api/admin/withdrawals/:id/approve` — Approve withdrawal
- `PATCH /api/admin/withdrawals/:id/reject` — Reject withdrawal
- `POST /api/admin/challenges/:id/force-complete` — Force complete a challenge
- `POST /api/admin/challenges/:id/resolve-dispute` — Resolve dispute manually

### Exports
- `GET /api/admin/export/transactions` — Export all transactions CSV
- `GET /api/admin/export/withdrawals` — Export withdrawals CSV
