#!/bin/bash

echo "🔄 Running PrizeLobby seed sequence..."

npx knex seed:run --specific=01_seed_users.js
npx knex seed:run --specific=02_seed_wallets.js
npx knex seed:run --specific=03_seed_gamertags.js
npx knex seed:run --specific=04_seed_events.js
npx knex seed:run --specific=05_seed_event_participants.js
npx knex seed:run --specific=06_seed_challenges.js
npx knex seed:run --specific=07_seed_challenge_participants.js
npx knex seed:run --specific=08_seed_bracket_matches.js
npx knex seed:run --specific=09_seed_transactions.js
npx knex seed:run --specific=10_seed_withdrawals.js
npx knex seed:run --specific=11_seed_disputes.js

echo "✅ All seed data inserted successfully."
