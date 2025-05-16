const fetch = require('node-fetch');

function startMatchPolling(challengeId) {
  const interval = setInterval(() => {
    (async () => {
      try {
        const res = await fetch("http://localhost:3000/api/challenges/" + challengeId + "/verify");
        const data = await res.json();

        if (data.status === 'complete') {
          clearInterval(interval);
          console.log(`✅ Challenge ${challengeId} verified. Winner: ${data.winnerId}`);
        } else {
          console.log(`⏳ Challenge ${challengeId} still verifying...`);
        }
      } catch (err) {
        console.error(`Polling error for challenge ${challengeId}:`, err.message);
      }
    })();
  }, 30000); // every 30 seconds
}

module.exports = { startMatchPolling };
