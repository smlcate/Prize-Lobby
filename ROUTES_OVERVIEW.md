# ROUTES_OVERVIEW.md

## API Route Categories

This file provides a categorized overview of key API routes used in the PrizeLobby backend.

---

### 👤 User & Gamertag Routes
- `GET /api/users/me` – Get current user profile
- `GET /api/profile/recent-completed` – Recent completed matches
- `GET /api/settings` – Get user settings
- `POST /api/settings` – Update settings
- `POST /api/gamertags` – Add new gamertag
- `PATCH /api/gamertags/:id` – Update gamertag
- `DELETE /api/gamertags/:id` – Remove gamertag

---

### 💰 Wallet & Transactions
- `GET /api/wallet/balance` – Wallet + transaction history
- `POST /api/wallet/deposit/intent` – Start Stripe intent
- `POST /api/wallet/checkout` – Confirm deposit
- `POST /api/wallet/withdraw` – Submit withdrawal
- `GET /api/transactions` – List transaction history

---

### 🏆 Events & Brackets
- `GET /api/events` – View all events
- `GET /api/events/:id` – View single event
- `POST /api/events` – Create event
- `POST /api/events/:id/join` – Join event
- `GET /api/bracket/:event_id` – View event bracket

---

### 🎮 Challenges
- `GET /api/challenges` – View all open challenges
- `POST /api/challenges` – Create challenge
- `POST /api/challenges/:id/join` – Join challenge
- `POST /api/challenges/:id/start` – Start challenge
- `GET /api/challenges/:id/result` – Get result
- `POST /api/challenges/:id/dispute` – Dispute result

---

### 🤝 Teams
- `POST /api/teams` – Create team
- `POST /api/teams/:id/join` – Join team
- `POST /api/teams/:id/leave` – Leave team

---

### ⚖ Disputes
- `POST /api/disputes` – Submit a new dispute

---

### 📢 Notifications
- `GET /api/notifications` – Get notifications
- `POST /api/notifications/:id/read` – Mark as read

---

### 🔍 Match Verification
- `GET /api/verification/:id/verify` – Trigger manual check
- `GET /api/tracker/rocket-league/match/:eventId` – Fetch match stats

---

### 🔁 Stripe Webhook
- `POST /webhook` – Stripe payment reconciliation

---

### 🔧 Admin Tools
- `GET /api/admin/events` – All events
- `GET /api/admin/challenges` – All challenges
- `GET /api/admin/withdrawals` – Withdrawal requests
- `PATCH /api/admin/withdrawals/:id/approve` – Approve withdrawal
- `PATCH /api/admin/withdrawals/:id/reject` – Reject withdrawal
- `POST /api/admin/challenges/:id/force-complete` – Force-complete match
- `POST /api/admin/challenges/:id/resolve-dispute` – Resolve challenge dispute
- `GET /api/admin/export/transactions` – Export transactions
- `GET /api/admin/export/withdrawals` – Export withdrawals

---

### 🧪 Dev & Testing
- `POST /api/dev/seed-test-challenge` – Create mock challenge
- `POST /api/mock/payout/challenge/:id` – Simulate challenge payout
- `POST /api/mock/verify/:challengeId` – Simulate match validation
