const Player = require('../models/PlayerSchema')
const Achievement = require('../models/AchievementSchema')
const App = require('../models/AppSchema')

// Get all players
const getAllPlayers = async (req, res) => {
    const { appID } = req.params

    try {
        const players = await Player.find({ appID })
        res.json(players)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// Get Top players
const getTopPlayers = async (req, res) => {
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
}

// Get player's rank
const getPlayerRank = async (req, res) => {
    const { appID, playerID } = req.params

    try {
        const player = await Player.findOne({ appID, playerID })
        if (!player) 
            return res.status(404).json({ message: 'Player not found' })

        const players = await Player.find({ appID }).sort({ playerPoints: -1 })

        const rank = players.findIndex(p => p.playerID === playerID) + 1

        res.status(200).send(rank.toString())
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// Get player by ID
const getPlayerByID = async (req, res) => {
    const { appID, playerID } = req.params

    try {
        const player = await Player.findOne({ appID, playerID })
        if (!player) 
            return res.status(404).json({ message: 'Player not found' })

        res.json(player)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// Set player points
const setPlayerPoints = async (req, res) => {
    const { appID, playerID } = req.params
    const amount = parseInt(req.query.amount, 10) || 1

    try {
        const player = await Player.findOne({ appID, playerID })
        if (!player) 
            return res.status(404).json({ message: 'Player not found' })

        player.playerPoints = amount
        await player.save()

        res.json(player)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// Increment player points
const incrementPlayerPoints = async (req, res) => {
    const { appID, playerID } = req.params
    const amount = parseInt(req.query.amount, 10) || 1

    try {
        const player = await Player.findOne({ appID, playerID })
        if (!player) 
            return res.status(404).json({ message: 'Player not found' })

        player.playerPoints += amount
        await player.save()

        res.json(player)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// Decrement player points
const decrementPlayerPoints = async (req, res) => {
    const { appID, playerID } = req.params
    const amount = parseInt(req.query.amount, 10) || 1

    try {
        const player = await Player.findOne({ appID, playerID })
        if (!player) 
            return res.status(404).json({ message: 'Player not found' })

        player.playerPoints -= amount
        await player.save()

        res.json(player)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// Create player with ID
const createPlayer = async (req, res) => {
    const { appID, playerID } = req.params
    const { username = "New User", playerPoints = 0, achievementIds = [] } = req.body

    try {
        const existingApp = await App.findOne({ appID })
        if (!existingApp)
            return res.status(400).json({ message: 'App with this appID doesn\'t exists' })

        const existingPlayer = await Player.findOne({ appID, playerID })
        if (existingPlayer)
            return res.status(400).json({ message: 'Player already exists' })

        const player = new Player({
            appID,
            playerID,
            username,
            playerPoints,
            achievementIds,
        })
        await player.save()
        
        await App.updateOne(
            { appID },
            { $push: { players: player.playerID } }
        )
        res.status(201).json(player)
    } 
    catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// Delete player by ID
const deletePlayer = async (req, res) => {
    const { appID, playerID } = req.params

    try {
        const existingApp = await App.findOne({ appID })
        if (!existingApp)
            return res.status(400).json({ message: 'App with this appID doesn\'t exists' })
        
        const player = await Player.findOne({ appID, playerID })
        if (!player) 
            return res.status(404).json({ message: 'Player not found' })

        // Remove player from App's players array
        await App.updateOne(
            { appID },
            { $pull: { players: playerID } }
        )

        // For each of the player's achievements, remove the player ID from the playerIdsAchieved array
        await Achievement.updateMany(
            { appID, playerIdsAchieved: { $in: [playerID] } },
            { $pull: { playerIdsAchieved: playerID } }
        )

        await Player.deleteOne({ _id: player._id })

        res.json({ value : true })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// Set player username
const setPlayerUsername = async (req, res) => {
    const { appID, playerID } = req.params
    const newUsername = req.query.username

    try {
        const player = await Player.findOne({ appID, playerID })
        if (!player) 
            return res.status(404).json({ message: 'Player not found' })

        player.username = newUsername
        await player.save()

        res.json(player)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// Export all controller methods
module.exports = {
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
}