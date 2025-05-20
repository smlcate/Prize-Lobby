# CONTROLLERS OVERVIEW

This document outlines the backend controllers in PrizeLobby and their responsibilities.

---

## authController.js
**Location:** `/controllers/authController.js`  
**Purpose:** Handles registration, login, token validation, and retrieving authenticated user info.

---

## userController.js
**Location:** `/controllers/userController.js`  
**Purpose:** Retrieves user profile data, settings, and recent match completions.

---

## walletController.js
**Location:** `/controllers/walletController.js`  
**Purpose:** Manages wallet operations including deposits (Stripe), balance lookups, and withdrawal requests.

---

## transactionController.js
**Location:** `/controllers/transactionController.js`  
**Purpose:** Returns wallet transaction history for users or exports for admins.

---

## eventController.js
**Location:** `/controllers/eventController.js`  
**Purpose:** Creates, joins, and views tournaments/events with brackets and participants.

---

## challengeController.js
**Location:** `/controllers/challengeController.js`  
**Purpose:** Handles challenge creation (1v1/FFA), joining, result submission, and validation.

---

## bracketController.js
**Location:** `/controllers/bracketController.js`  
**Purpose:** Manages match results and updates tournament brackets accordingly.

---

## teamController.js
**Location:** `/controllers/teamController.js`  
**Purpose:** Allows users to create teams, join, or leave them.

---

## notificationController.js
**Location:** `/controllers/notificationController.js`  
**Purpose:** Sends and retrieves notifications, including match alerts and dispute updates.

---

## disputeController.js
**Location:** `/controllers/disputeController.js`  
**Purpose:** Submits and manages disputes over match results.

---

## withdrawalController.js
**Location:** `/controllers/withdrawalController.js`  
**Purpose:** Handles user withdrawal requests and pushes them to admin review.

---

## trackerController.js
**Location:** `/controllers/trackerController.js`  
**Purpose:** Polls Tracker.gg (or mock) for match results and match validation metadata.

---

## adminController.js
**Location:** `/controllers/adminController.js`  
**Purpose:** Administrative tools including viewing/approving withdrawals, force-closing matches, resolving disputes, and CSV exports.
