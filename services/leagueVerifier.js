const axios = require('axios');
const db = require('../models/db');

const RIOT_API_KEY = process.env.RIOT_API_KEY;
const RIOT_BASE_MATCH_URL = 'https://americas.api.riotgames.com/lol/match/v5/matches';

async function pollLeagueMatch(challengeId) {
  try {
    const challenge = await db('challenges').where({ id: challengeId }).first();
    if (!challenge || challenge.status !== 'started') return;

    const participants = await db('challenge_participants').where({ challenge_id: challengeId });
    if (participants.length !== 2) {
      console.log(`Challenge ${challengeId} does not have exactly 2 participants`);
      return;
    }

    const [p1, p2] = participants;
    const p1League = await db('league_accounts').where({ user_id: p1.user_id }).first();
    const p2League = await db('league_accounts').where({ user_id: p2.user_id }).first();

    if (!p1League || !p2League) {
      console.log(`Missing league account info for one or both participants in challenge ${challengeId}`);
      return;
    }

    const p1Matches = await axios.get(
      `https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/${p1League.riot_puuid}/ids?count=10`,
      { headers: { 'X-Riot-Token': RIOT_API_KEY } }
    );

    for (const matchId of p1Matches.data) {
      const match = await axios.get(`${RIOT_BASE_MATCH_URL}/${matchId}`, {
        headers: { 'X-Riot-Token': RIOT_API_KEY }
      });

      const players = match.data.info.participants;
      const p1Data = players.find(p => p.puuid === p1League.riot_puuid);
      const p2Data = players.find(p => p.puuid === p2League.riot_puuid);

      if (p1Data && p2Data) {
        const winnerId = p1Data.win ? p1.user_id : p2.user_id;
        const winnerName = p1Data.win ? p1Data.summonerName : p2Data.summonerName;

        await db('challenges').where({ id: challengeId }).update({
          winner_id: winnerId,
          status: 'completed'
        });

        await db('challenge_results').insert({
          challenge_id: challengeId,
          reported_by: winnerId,
          winner_id: winnerId,
          verified: true,
          auto_verified: true
        });

        console.log(`✅ Verified League match for Challenge ${challengeId}. Winner: ${winnerName} (${winnerId})`);
        const { distributeChallengeReward } = require('./challengePayoutService');
        await distributeChallengeReward(challengeId);
        return;
      }
    }

    console.log(`⏳ No common League match found for Challenge ${challengeId} yet.`);
  } catch (err) {
    console.error('❌ League match poll error:', err.response?.data || err.message);
  }
}

module.exports = { pollLeagueMatch };
