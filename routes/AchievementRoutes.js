const express = require('express');
const router = express.Router();

// Import Achievement model
const Achievement = require('../models/AchievementSchema');

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

// Get all achievements for a specific app
router.get('/:appID', validateRequest, async (req, res) => {
  const { appID } = req.params;

  try {
    const achievements = await Achievement.find({ appID });
    if (!achievements) return res.status(404).json({ message: 'Achievements not found' });

    res.json(achievements);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get player's done achievements
router.get('/:appID/player=:playerID/done', validateRequest, async (req, res) => {
  const { appID, playerID } = req.params;

  try {
    const achievements = await Achievement.find({
      appID,
      playerIdAchievedList: { $in: [playerID] },
    });

    if (!achievements) return res.status(404).json({ message: 'No done achievements found' });

    res.json(achievements);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get player's unfinished achievements
router.get('/:appID/player=:playerID/todo', validateRequest, async (req, res) => {
  const { appID, playerID } = req.params;

  try {
    const achievements = await Achievement.find({
      appID,
      playerIdAchievedList: { $nin: [playerID] }, // Exclude the player from the list of players who achieved it
    });

    if (!achievements) return res.status(404).json({ message: 'No unfinished achievements found' });

    res.json(achievements);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Check if the player has achieved a specific achievement
router.get('/:appID/player=:playerID/check/:achievementID', validateRequest, async (req, res) => {
  const { appID, playerID, achievementID } = req.params;

  try {
    const achievement = await Achievement.findOne({
      appID,
      _id: achievementID,
      playerIdAchievedList: { $in: [playerID] },
    });

    if (achievement) {
      res.json({ value : true }); 
    } else {
      res.json({ value : false }); 
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;