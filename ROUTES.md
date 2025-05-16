# ROUTES.md

## Public Routes

### Challenges
- `GET /api/challenges`: List all open challenges.
- `POST /api/challenges`: Create a new challenge.
- `GET /api/challenges/:id`: Get a specific challenge.
- `POST /api/challenges/:id/join`: Join a challenge.
- `POST /api/challenges/:id/submit`: Submit result for a challenge.

## Admin Routes

### Withdrawals
- `GET /api/admin/withdrawals`: View all withdrawal requests.
- `PUT /api/admin/withdrawals/:id/approve`: Approve withdrawal.
- `PUT /api/admin/withdrawals/:id/reject`: Reject and refund withdrawal.

### Transactions
- `GET /api/admin/transactions`: View all transaction logs.

### Settings
- `GET /api/admin/settings/platform-fee`: Get current fee setting.
- `POST /api/admin/settings/platform-fee`: Update fee setting.

## Wallet
- `GET /api/wallet/balance`: Get user's wallet balance.
- `POST /api/wallet/deposit/intent`: Create a Stripe payment intent.
- `POST /webhook`: Stripe webhook handler.

## Users
- `GET /api/auth/me`: Get current authenticated user.
- `GET /api/users/me`: Get user profile, events, challenges.

## Events & Brackets
- `GET /api/events`: List events.
- `POST /api/events`: Create event.
- `GET /api/events/:id`: Get event.
- `GET /api/events/:id/bracket`: Get bracket structure.
- `POST /api/events/:id/match/:matchId/submit`: Submit score.

## Verification
- `POST /api/match/:matchId/verify`: Manual or auto verify match.