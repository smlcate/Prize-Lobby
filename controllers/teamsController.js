const db = require('../models/db');

// Create a new team
exports.createTeam = async (req, res) => {
  const { name, bio } = req.body;
  const owner_id = req.user.id;

  try {
    const existing = await db('teams').where({ name }).first();
    if (existing) return res.status(400).json({ error: 'Team name already exists' });

    const [team] = await db('teams').insert({ name, bio, owner_id }).returning('*');
    await db('team_members').insert({ team_id: team.id, user_id: owner_id, role: 'owner' });
    res.status(201).json(team);
  } catch (err) {
    console.error('❌ Failed to create team:', err);
    res.status(500).json({ error: 'Could not create team' });
  }
};

exports.getMyTeams = async (req, res) => {
  const userId = req.user.id;

  try {
    const teams = await db('teams')
      .leftJoin('team_members', 'teams.id', 'team_members.team_id')
      .where('team_members.user_id', userId)
      .select('teams.*');

    res.status(200).json(teams);
  } catch (err) {
    console.error('❌ Failed to fetch user teams:', err);
    res.status(500).json({ error: 'Could not retrieve teams' });
  }
};

exports.getTeamRoster = async (req, res) => {
  const teamId = parseInt(req.params.id);

  if (isNaN(teamId)) {
    return res.status(400).json({ error: 'Invalid team ID' });
  }

  try {
    const members = await db('team_members')
      .join('users', 'users.id', 'team_members.user_id')
      .where('team_members.team_id', teamId)
      .select('users.id', 'users.username', 'team_members.role');

    res.status(200).json(members);
  } catch (err) {
    console.error('❌ Failed to fetch team roster:', err);
    res.status(500).json({ error: 'Could not retrieve team roster' });
  }
};

exports.joinTeam = async (req, res) => {
  const userId = req.user.id;
  const teamId = parseInt(req.params.id);

  if (isNaN(teamId)) {
    return res.status(400).json({ error: 'Invalid team ID' });
  }

  try {
    await db('team_members').insert({ team_id: teamId, user_id: userId, role: 'member' });
    res.status(200).json({ message: 'Joined team successfully' });
  } catch (err) {
    console.error('❌ Failed to join team:', err);
    res.status(500).json({ error: 'Could not join team' });
  }
};

exports.leaveTeam = async (req, res) => {
  const userId = req.user.id;
  const teamId = parseInt(req.params.id);

  if (isNaN(teamId)) {
    return res.status(400).json({ error: 'Invalid team ID' });
  }

  try {
    const team = await db('teams').where({ id: teamId }).first();
    if (team.owner_id === userId) {
      return res.status(403).json({ error: 'Owner cannot leave their own team' });
    }

    await db('team_members').where({ team_id: teamId, user_id: userId }).del();
    res.status(200).json({ message: 'Left team successfully' });
  } catch (err) {
    console.error('❌ Failed to leave team:', err);
    res.status(500).json({ error: 'Could not leave team' });
  }
};

exports.promoteMember = async (req, res) => {
  const userId = req.body.user_id;
  const teamId = parseInt(req.params.id);

  if (isNaN(teamId)) {
    return res.status(400).json({ error: 'Invalid team ID' });
  }

  try {
    await db('team_members').where({ team_id: teamId, user_id: userId }).update({ role: 'captain' });
    res.status(200).json({ message: 'Member promoted to captain' });
  } catch (err) {
    console.error('❌ Failed to promote member:', err);
    res.status(500).json({ error: 'Could not promote member' });
  }
};

exports.kickMember = async (req, res) => {
  const userId = req.body.user_id;
  const teamId = parseInt(req.params.id);

  if (isNaN(teamId)) {
    return res.status(400).json({ error: 'Invalid team ID' });
  }

  try {
    await db('team_members').where({ team_id: teamId, user_id: userId }).del();
    res.status(200).json({ message: 'Member kicked from team' });
  } catch (err) {
    console.error('❌ Failed to kick member:', err);
    res.status(500).json({ error: 'Could not kick member' });
  }
};

exports.disbandTeam = async (req, res) => {
  const teamId = parseInt(req.params.id);
  const userId = req.user.id;

  if (isNaN(teamId)) {
    return res.status(400).json({ error: 'Invalid team ID' });
  }

  try {
    const team = await db('teams').where({ id: teamId, owner_id: userId }).first();
    if (!team) return res.status(403).json({ error: 'Only team owner can disband the team' });

    await db('team_members').where({ team_id: teamId }).del();
    await db('teams').where({ id: teamId }).del();

    res.status(200).json({ message: 'Team disbanded' });
  } catch (err) {
    console.error('❌ Failed to disband team:', err);
    res.status(500).json({ error: 'Could not disband team' });
  }
};

exports.distributeFunds = async (req, res) => {
  try {
    return res.status(200).json({ message: 'Funds distributed (stub).' });
  } catch (err) {
    console.error('❌ Failed to distribute funds:', err);
    res.status(500).json({ error: 'Could not distribute funds' });
  }
};