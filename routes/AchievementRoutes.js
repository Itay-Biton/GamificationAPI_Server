const express = require('express')
const router = express.Router()
const Achievement = require('../models/AchievementSchema')
const validateRequest = require('../middleware/RequestValidetion')

// Get all achievements for a specific app
router.get('/:appID', validateRequest, async (req, res) => {
  const { appID } = req.params

  try {
    const achievements = await Achievement.find({ appID })
    if (!achievements) return res.status(404).json({ message: 'Achievements not found' })

    res.json(achievements)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Get player's done achievements
router.get('/:appID/player=:playerID/done', validateRequest, async (req, res) => {
  const { appID, playerID } = req.params

  try {
    const achievements = await Achievement.find({
      appID,
      playerIdAchievedList: { $in: [playerID] },
    })

    res.json(achievements)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Get player's unfinished achievements
router.get('/:appID/player=:playerID/todo', validateRequest, async (req, res) => {
  const { appID, playerID } = req.params

  try {
    const achievements = await Achievement.find({
      appID,
      playerIdAchievedList: { $nin: [playerID] }, // Exclude the player from the list of players who achieved it
    })

    res.json(achievements)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Check if the player has achieved a specific achievement
router.get('/:appID/player=:playerID/check/:achievementID', validateRequest, async (req, res) => {
  const { appID, playerID, achievementID } = req.params

  try {
    const achievement = await Achievement.findOne({
      appID,
      _id: achievementID,
      playerIdAchievedList: { $in: [playerID] },
    })

    if (achievement) {
      res.json({ value : true }) 
    } else {
      res.json({ value : false }) 
    }
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router