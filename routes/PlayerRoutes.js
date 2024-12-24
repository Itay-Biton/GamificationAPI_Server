const express = require('express');
const router = express.Router();

// Import Player model
const Player = require('../models/PlayerSchema');

// Middleware to validate appID and apiKey (optional, implement as needed)
const validateRequest = (req, res, next) => {
  const { appID } = req.params;
  const apiKey = req.headers['api_key'];

  if (!appID || !apiKey) {
    return res.status(400).json({ message: 'appID and api_key are required' });
  }

  // Implement your logic to validate appID and apiKey here
  // Example: check against a database or configuration
  // if (!isValidAppID(appID) || !isValidApiKey(apiKey)) {
  //   return res.status(403).json({ message: 'Invalid appID or api_key' });
  // }

  next();
};

// Get all players for a specific app
router.get('/:appID', validateRequest, async (req, res) => {
  const { appID } = req.params;

  try {
    const players = await Player.find({ appID });
    res.json(players);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a specific player
router.get('/:appID/player=:playerID', validateRequest, async (req, res) => {
  const { appID, playerID } = req.params;

  try {
    const player = await Player.findOne({ appID, playerID });
    if (!player) return res.status(404).json({ message: 'Player not found' });
    res.json(player);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get top players
router.get('/:appID/top', validateRequest, async (req, res) => {
  const { appID } = req.params;
  const limit = parseInt(req.query.limit, 10) || 10;

  try {
    const players = await Player.find({ appID })
      .sort({ playerPoints: -1 })
      .limit(limit);
    res.json(players);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add points to a player
router.post('/:appID/player=:playerID/points/add', validateRequest, async (req, res) => {
  const { appID, playerID } = req.params;
  const { amount } = req.body;

  try {
    const player = await Player.findOne({ appID, playerID });
    if (!player) return res.status(404).json({ message: 'Player not found' });

    player.playerPoints += amount;
    await player.save();
    res.json({ message: 'Points added successfully', player });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Reduce points for a player
router.post('/:appID/player=:playerID/points/reduce', validateRequest, async (req, res) => {
  const { appID, playerID } = req.params;
  const { amount } = req.body;

  try {
    const player = await Player.findOne({ appID, playerID });
    if (!player) return res.status(404).json({ message: 'Player not found' });

    player.playerPoints = Math.max(0, player.playerPoints - amount);
    await player.save();
    res.json({ message: 'Points reduced successfully', player });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Set points for a player
router.put('/:appID/player=:playerID/points/set', validateRequest, async (req, res) => {
  const { appID, playerID } = req.params;
  const { amount } = req.body;

  try {
    const player = await Player.findOne({ appID, playerID });
    if (!player) return res.status(404).json({ message: 'Player not found' });

    player.playerPoints = amount;
    await player.save();
    res.json({ message: 'Points set successfully', player });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;