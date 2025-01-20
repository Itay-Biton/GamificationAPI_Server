const express = require('express')
const router = express.Router()
const validateRequest = require('../middleware/RequestValidetion')
const {
  getAllPlayers,
  getPlayerByID,
  getTopPlayers,
  getPlayerRank,
  incrementPlayerPoints,
  decrementPlayerPoints,
  setPlayerPoints,
  createPlayer,
  deletePlayer,
  setPlayerUsername,
} = require('../controllers/PlayerController')

// Get all players for a specific app
router.get('/:appID', validateRequest, getAllPlayers)

// Get a specific player
router.get('/:appID/player=:playerID', validateRequest, getPlayerByID)

// Get top players
router.get('/:appID/top', validateRequest, getTopPlayers)

// Get player's rank
router.get('/:appID/player=:playerID/rank', validateRequest, getPlayerRank)

// Add points to a player
router.post('/:appID/player=:playerID/points/add', validateRequest, incrementPlayerPoints)

// Reduce points for a player
router.post('/:appID/player=:playerID/points/reduce', validateRequest, decrementPlayerPoints)

// Set points for a player
router.put('/:appID/player=:playerID/points/set', validateRequest, setPlayerPoints)

// Create new player
router.post('/:appID/create/player=:playerID', validateRequest, createPlayer)

// Delete player
router.delete('/:appID/delete/player=:playerID', validateRequest, deletePlayer)

// Set player username
router.put('/:appID/player=:playerID/username/set', validateRequest, setPlayerUsername)

module.exports = router