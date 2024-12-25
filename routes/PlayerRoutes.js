const express = require('express')
const router = express.Router()
const Player = require('../models/PlayerSchema')
const validateRequest = require('../middleware/RequestValidetion')

// Get all players for a specific app
router.get('/:appID', validateRequest, async (req, res) => {
  const { appID } = req.params

  try {
    const players = await Player.find({ appID })
    res.json(players)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Get a specific player
router.get('/:appID/player=:playerID', validateRequest, async (req, res) => {
  const { appID, playerID } = req.params

  try {
    const player = await Player.findOne({ appID, playerID })
    if (!player) return res.status(404).json({ message: 'Player not found' })
    res.json(player)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Get top players
router.get('/:appID/top', validateRequest, async (req, res) => {
  const { appID } = req.params
  const limit = parseInt(req.query.limit, 10) || 10

  try {
    const players = await Player.find({ appID })
      .sort({ playerPoints: -1 })
      .limit(limit)
    res.json(players)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Add points to a player
router.post('/:appID/player=:playerID/points/add', validateRequest, async (req, res) => {
  const { appID, playerID } = req.params
  const { amount } = req.body

  try {
    const player = await Player.findOne({ appID, playerID })
    if (!player) return res.status(404).json({ message: 'Player not found' })

    player.playerPoints += amount
    await player.save()
    res.status(204).send()
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Reduce points for a player
router.post('/:appID/player=:playerID/points/reduce', validateRequest, async (req, res) => {
  const { appID, playerID } = req.params
  const { amount } = req.body

  try {
    const player = await Player.findOne({ appID, playerID })
    if (!player) return res.status(404).json({ message: 'Player not found' })

    player.playerPoints = Math.max(0, player.playerPoints - amount)
    await player.save()
    res.status(204).send()
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Set points for a player
router.put('/:appID/player=:playerID/points/set', validateRequest, async (req, res) => {
  const { appID, playerID } = req.params
  const { amount } = req.body

  try {
    const player = await Player.findOne({ appID, playerID })
    if (!player) return res.status(404).json({ message: 'Player not found' })

    player.playerPoints = amount
    await player.save()
    res.status(204).send()
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router