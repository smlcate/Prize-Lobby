# PrizeLobby Feature Overview

This file documents all implemented and planned features for PrizeLobby.

---

## ✅ Implemented Features

### 👤 Authentication & User Profile
- JWT-based authentication (1-hour expiration)
- Secure session handling via HTTP-only tokens
- Gamertag system with platform and game support
- Tracker.gg integration for Rocket League and Apex Legends (mocked in test)
- Profile UI: view gamertags, wallet balance, joined events/challenges

---

### 💵 Wallet & Payments
- Stripe.js integration for wallet-based funding
- Internal wallet system (cent-based integer accounting)
- Manual withdrawal request system
- Admin review and approval/rejection of withdrawals
- Wallet transaction history for users
- Admin-exportable transaction and withdrawal CSVs

---

### 🏆 Game Competition System
- **Events**: Multi-user bracket tournaments
- **Challenges**: 1v1, FFA, or team-based quick matches
- Game + platform metadata enforcement
- Match countdowns with ready-up and timer logic
- Bracket rendering on frontend with match progression
- Automatic score validation from Tracker.gg
- Manual score submission with dispute handling
- Prize payout logic for winners (events and challenges)

---

### ⚖ Dispute Resolution
- Users may submit disputes with reason
- Match state and ownership validated before submission
- Admins can view, manually resolve, or force-complete disputed matches

---

### 🔔 Notifications
- Real-time Socket.IO notifications
- Stored alerts (DB model) for match, payout, dispute, and system events
- Users can mark notifications as read
- Notification access restricted to rightful user only

---

### 🛡 Security & Permissions
- JWT authentication + middleware protection
- Admin route access protected via role-based control
- Proper use of 401 (unauthenticated) and 403 (unauthorized) responses
- Joi input validators on sensitive routes (creation, disputes, wallet)

---

### ⚙ Development & Test Features
- Full Jest test coverage of core routes, services, and controllers
- Dev-only seed and mock payout/test routes
- Cron-based polling for match verification (`autoVerifyCron.js`)
- Support for mocked vs live validation via environment flags

---

## 🔄 In Progress / Future Work
- Full real-time match status polling for all games
- Enhanced team tournament logic
- Match voting/feedback system
- In-app settings management (UI)
- Multi-platform FFA event logic
