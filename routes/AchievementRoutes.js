const express = require('express')
const router = express.Router()
const validateRequest = require('../middleware/RequestValidetion')
const {
  getAllAchievements,
  getAchievementByPoints,
  getAchievementByTitle,
  getPlayerDoneAchievements,
  getPlayerTodoAchievements,
  checkPlayerAchievement,
  addAchievement,
  removeAchievement,
  createAchievement,
  deleteAchievement,
  updateAchievement,
} = require('../controllers/AchievementController')

// Get all achievements for a specific app
router.get('/:appID', validateRequest, getAllAchievements)

// Get achievement by points needed
router.get('/:appID/points=:points', validateRequest, getAchievementByPoints)

// Get achievement by title
router.get('/:appID/title=:title', validateRequest, getAchievementByTitle)

// Get player's done achievements
router.get('/:appID/player=:playerID/done', validateRequest, getPlayerDoneAchievements)

// Get player's unfinished achievements
router.get('/:appID/player=:playerID/todo', validateRequest, getPlayerTodoAchievements)

// Check if the player has achieved a specific achievement
router.get('/:appID/player=:playerID/check/:achievementID', validateRequest, checkPlayerAchievement)

// Add achievement to player
router.put('/:appID/player=:playerID/achievement=:achievementID/add', validateRequest, addAchievement)

// Remove achievement from player
router.put('/:appID/player=:playerID/achievement=:achievementID/remove', validateRequest, removeAchievement)

// Create new achievement
router.post('/:appID/create', validateRequest, createAchievement)

// Delete achievement
router.delete('/:appID/delete/achievement=:achievementID', validateRequest, deleteAchievement)

// Update achievement
router.put('/:appID/update/achievement=:achievementID', validateRequest, updateAchievement)

module.exports = router