# PRIZELOBBY PROJECT PRIMER

You are continuing development of **PrizeLobby**, a full-stack web platform for hosting competitive video game tournaments and challenges with real-money stakes.

---

## 🧠 PROJECT GOALS

- Let users create and join paid game challenges (1v1, FFA) and bracketed events.
- Automate results using Tracker.gg (Rocket League, Apex Legends).
- Support internal wallet balances with Stripe funding and manual withdrawal.
- Provide real-time notifications (Socket.IO) for match status, payouts, disputes.
- Enable admin tools to review disputes, control payouts, and manage the ecosystem.
- Maintain **total transparency and fairness** via test coverage and route validation.

---

## ✅ IMPLEMENTED FEATURES

### Authentication
- JWT-based sessions with auth/admin middleware
- Role-based route access (`authenticate.js`, `authorizeAdmin.js`)

### Wallet System
- Cent-based accounting system
- Stripe deposit intent + webhook reconciliation
- Manual withdrawal requests with admin approval system
- Full transaction history (user + exportable admin CSV)

### Gamertag System
- Add/edit/remove gamertags per platform
- Tracker.gg API integration for validation (mocked in test)
- Used for match auto-verification logic

### Events & Challenges
- `Events`: Multi-user brackets with progression
- `Challenges`: Quick 1v1 or FFA matches
- Supports platform checks, countdown timers, dispute submission, and score verification
- Brackets rendered with match advancement logic

### Admin Tools
- View, approve, reject withdrawals
- Force complete or resolve disputes
- Export transaction/withdrawal CSVs
- View all events, challenges, matches

### Match Verification
- `matchVerifier.js` service polls Tracker.gg
- Real vs mock API usage based on environment
- Cron-based polling via `autoVerifyCron.js`

### Notifications
- Real-time via Socket.IO
- Stored in DB (`notificationModel.js`)
- Read/unread status, visible only to owner

### Disputes
- Users can file disputes if match result is contested
- Admins resolve via `/admin/challenges/:id/resolve-dispute`

---

## 🧪 TESTING STANDARDS

- Uses **Jest** for route, controller, service, and model tests
- Seeds provide mock data: `TestUser1`, `NotifyUser`, etc.
- Uses `.env.test` for DB and mock Tracker.gg API toggle
- Routes return correct status codes:
  - `200`/`201` for success
  - `401` for unauthenticated
  - `403` for unauthorized
  - `400` for bad input
  - `404` for missing resource

---

## 📁 STRUCTURE OVERVIEW

```
PrizeLobby/
├── app.js / server.js            # Express app + Socket.IO
├── routes/                       # Feature-based route files
├── controllers/                 # Route handlers
├── services/                    # Business logic layer
├── models/                      # DB layer (Knex)
├── middleware/                  # Auth + validation
├── validators/                  # Joi schemas
├── lib/                         # Helpers (csv, time, etc)
├── migrations/ / seeds/         # Knex migrations + seed data
├── public/                      # AngularJS frontend
├── tests/                       # Jest test suites
├── autoVerifyCron.js            # Tracker.gg poller
```

---

## 📄 DOCUMENTATION INDEX

- `ARCHITECTURE.md` – Full system overview (client/server/services)
- `ROUTES.md` – Every endpoint with method and access level
- `PROJECT_STRUCTURE.md` – Accurate file/folder tree
- `CONTROLLERS_OVERVIEW.md` – Responsibilities of all controllers
- `FEATURES.md` – Implemented and in-progress features
- `ROUTES_OVERVIEW.md` – Quick glance of categorized routes

---

## ⚠️ DEVELOPMENT RULES

- Never duplicate logic across services/controllers.
- Always check if models/services already provide a function before adding new ones.
- No use of MongoDB or Mongoose — **PostgreSQL only via Knex**.
- Use correct status codes and route auth checks.
- Always update markdown documentation if changes affect routes, structure, or features.
- Always provide **individually downloadable files** when delivering updates.
- **Audit the full project context** before responding to any request.
