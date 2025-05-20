const axios = require('axios');
const db = require('../models/db');

const RIOT_API_KEY = process.env.RIOT_API_KEY || 'mock-api-key';
const RIOT_BASE_URL = 'https://na1.api.riotgames.com/lol';

const getLeagueAccount = async (req, res) => {
  const { summonerName } = req.params;
  const region = req.query.region || 'na1';

  try {
    const result = await axios.get(`https://${region}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${encodeURIComponent(summonerName)}`, {
      headers: { 'X-Riot-Token': RIOT_API_KEY }
    });

    const { name, puuid } = result.data;

    const existing = await db('league_accounts').where({ user_id: req.user.id }).first();
    if (existing) {
      await db('league_accounts').where({ user_id: req.user.id }).update({ summoner_name: name, riot_puuid: puuid, region });
    } else {
      await db('league_accounts').insert({ user_id: req.user.id, summoner_name: name, riot_puuid: puuid, region });
    }

    res.json({ message: 'League account linked', summoner: name });
  } catch (err) {
    console.error('❌ Riot API error:', err.response?.data || err.message);
    res.status(500).json({ error: 'Could not verify summoner' });
  }
};

const mockMatchVerification = async (req, res) => {
  const { challengeId } = req.params;

  try {
    const challenge = await db('challenges').where({ id: challengeId }).first();
    if (!challenge) return res.status(404).json({ error: 'Challenge not found' });

    const participants = await db('challenge_participants').where({ challenge_id: challengeId });
    if (participants.length < 2) return res.status(400).json({ error: 'Not enough participants' });

    const [player1, player2] = participants;

    // Simulate mock win for player 1
    await db('challenges').where({ id: challengeId }).update({
      winner_id: player1.user_id,
      status: 'completed'
    });

    await db('challenge_results').insert({
      challenge_id: challengeId,
      reported_by: player1.user_id,
      winner_id: player1.user_id,
      verified: true,
      auto_verified: true
    });

    res.json({ message: 'Mock match verified. Winner: Player 1.' });
  } catch (err) {
    console.error('Mock verification failed:', err);
    res.status(500).json({ error: 'Mock match verification failed' });
  }
};

module.exports = {
  getLeagueAccount,
  mockMatchVerification
};
