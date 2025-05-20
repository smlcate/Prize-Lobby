# PROJECT_STRUCTURE.md

## PrizeLobby Directory Structure

This file outlines the full project structure of the PrizeLobby platform.

```
PrizeLobby/
├── app.js                      # Main Express app configuration
├── server.js                   # Entry point, binds app + Socket.IO
├── knexfile.js                 # Knex database configuration
├── package.json                # NPM dependencies and scripts
├── autoVerifyCron.js           # Cron script to poll Tracker.gg
├── check-db.js                 # DB readiness check for startup
├── test-db-connection.js       # Used by Jest to test DB connectivity
├── jest.config.js              # Jest setup
├── jest.setup.js               # Jest global mocks
├── .env                        # Main environment file
├── .env.test                   # Testing-specific environment file

├── routes/                     # Express routes
│   ├── auth.js
│   ├── wallet.js
│   ├── users.js
│   ├── teams.js
│   ├── events.js
│   ├── challenges.js
│   ├── notifications.js
│   ├── disputes.js
│   ├── bracket.js
│   ├── transactions.js
│   ├── withdrawals.js
│   ├── tracker.js
│   ├── dev.js
│   └── admin.js

├── controllers/                # Route-level logic controllers
│   ├── authController.js
│   ├── walletController.js
│   ├── userController.js
│   ├── teamController.js
│   ├── eventController.js
│   ├── challengeController.js
│   ├── notificationController.js
│   ├── disputeController.js
│   ├── bracketController.js
│   ├── transactionController.js
│   ├── withdrawalController.js
│   ├── trackerController.js
│   └── adminController.js

├── services/                   # Core business logic (non-DB)
│   ├── stripeService.js
│   ├── matchVerifier.js
│   ├── teamService.js
│   ├── eventService.js
│   ├── challengeService.js
│   ├── notificationService.js
│   ├── bracketService.js
│   ├── transactionService.js
│   ├── disputeService.js
│   ├── withdrawalService.js
│   └── cronService.js

├── models/                     # Knex DB interaction models
│   ├── walletModel.js
│   ├── disputeModel.js
│   ├── notificationModel.js
│   ├── transactionModel.js
│   ├── teamModel.js
│   ├── userModel.js
│   ├── eventModel.js
│   ├── challengeModel.js
│   ├── bracketModel.js
│   └── withdrawalModel.js

├── middleware/                 # Express middleware
│   ├── authenticate.js
│   ├── authorizeAdmin.js
│   └── errorHandler.js

├── validators/                 # Joi schemas for validating input
│   ├── walletValidator.js
│   ├── challengeValidator.js
│   ├── eventValidator.js
│   ├── teamValidator.js
│   ├── withdrawalValidator.js
│   └── disputeValidator.js

├── lib/                        # Shared utility functions
│   ├── csvExporter.js
│   ├── logger.js
│   └── timeUtils.js

├── migrations/                 # Knex migration files
├── seeds/                      # Knex seed files
├── public/                     # AngularJS frontend (HTML, JS, CSS)
├── tests/                      # Jest test suites
```
