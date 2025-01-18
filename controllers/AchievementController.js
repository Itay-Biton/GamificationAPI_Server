const Achievement = require('../models/AchievementSchema')
const App = require('../models/AppSchema')
const Player = require('../models/PlayerSchema')
const mongoose = require('mongoose')

// Get all achievements for a specific app
const getAllAchievements = async (req, res) => {
    const { appID } = req.params

    try {
        const achievements = await Achievement.find({ appID }).sort({ pointsNeeded: 1 })
        if (!achievements) return res.status(404).json({ message: 'Achievements not found' })

        res.json(achievements)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// Get achievement by points needed
const getAchievementByPoints = async (req, res) => {
    const { appID } = req.params
    const points = parseInt(req.params.points, 10) 

    if (isNaN(points)) {
        return res.status(400).json({ message: 'Points must be a valid number' })
    }

    try {
        const achievement = await Achievement.findOne({ appID, pointsNeeded: points })

        if (!achievement)
            return res.status(404).json({ message: 'Achievement not found' })

        res.json(achievement)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// Get achievement by title
const getAchievementByTitle = async (req, res) => {
    const { appID, title } = req.params

    try {
        const achievement = await Achievement.findOne({
            appID,
            title: { $regex: new RegExp(title, 'i') } // Case-insensitive search
        })

        if (!achievement) {
            return res.status(404).json({ message: 'Achievement not found' })
        }

        res.json(achievement)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// Get player's done achievements
const getPlayerDoneAchievements = async (req, res) => {
    const { appID, playerID } = req.params

    try {
        const achievements = await Achievement.find({
            appID,
            playerIdAchievedList: { $in: [playerID] },
        }).sort({ pointsNeeded: 1 })

        res.json(achievements)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// Get player's unfinished achievements
const getPlayerTodoAchievements = async (req, res) => {
    const { appID, playerID } = req.params

    try {
        const achievements = await Achievement.find({
            appID,
            playerIdAchievedList: { $nin: [playerID] },
        }).sort({ pointsNeeded: 1 })

        res.json(achievements)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// Check if the player has achieved a specific achievement
const checkPlayerAchievement = async (req, res) => {
    const { appID, playerID, achievementID } = req.params

    try {
        const achievement = await Achievement.findOne({
            appID,
            achievementID,
            playerIdAchievedList: { $in: [playerID] },
        })

        if (achievement) 
            res.json({ value : true }) 
        else 
            res.json({ value : false }) 
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// Add achievement to player
const addAchievement = async (req, res) => {
    const { appID, playerID, achievementID } = req.params

    const achievement = await Achievement.findOne({ appID, achievementID })
    if (!achievement) return res.status(404).json({ message: 'Achievement not found' })

    try {
        const player = await Player.findOne({ appID, playerID })
        if (!player) return res.status(404).json({ message: 'Player not found' })

        if (player.achievementIds.includes(achievementID)) {
            return res.status(400).json({ message: 'Achievement already added' })
        }

        player.achievementIds.push(achievementID)
        await player.save()

        achievement.playerIdsAchieved.push(playerID)
        await achievement.save()

        res.json(player)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// Remove achievement from player
const removeAchievement = async (req, res) => {
    const { appID, playerID, achievementID } = req.params

    const achievement = await Achievement.findOne({ appID, achievementID })
    if (!achievement) return res.status(404).json({ message: 'Achievement not found' })

    try {
        const player = await Player.findOne({ appID, playerID })
        if (!player) return res.status(404).json({ message: 'Player not found' })

        if (!player.achievementIds.includes(achievementID))
            return res.status(400).json({ message: 'Achievement wasn\'t added' })

        const index = player.achievementIds.indexOf(achievementID)
        if (index !== -1) 
            player.achievementIds.splice(index, 1)

        await player.save()

        res.json(player)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// Create achievement
const createAchievement = async (req, res) => {
    const { appID } = req.cookies
    const { title, pointsNeeded } = req.body

    try {
        if (!title || !pointsNeeded) 
            return res.status(400).json({ message: 'Title and points needed are required.' })

        if (pointsNeeded <= 0) 
            return res.status(400).json({ message: 'Points needed must be greater than 0.' })

        const newAchievement = new Achievement({ 
            appID, 
            achievementID: new mongoose.Types.ObjectId().toString(), 
            title, 
            pointsNeeded, 
            playerIdsAchieved: [] 
        })
        await newAchievement.save()
        
        await App.updateOne(
            { appID },
            { $push: { achievements: newAchievement.achievementID } }
        )
        res.redirect('/achievements')
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message })
    }
}

// Delete achievement by ID
const deleteAchievement = async (req, res) => {
    const { appID } = req.cookies
    const { achievementID } = req.params

    try {
        const achievement = await Achievement.findOne({ appID, achievementID })
        if (!achievement) 
            return res.status(404).json({ message: 'Achievement not found' })

        await App.updateOne(
            { appID },
            { $pull: { achievements: achievementID } }
        )

        // For each of the achievement's finished players, remove the achievement ID from the achievementIds array
        await Player.updateMany(
            { achievementIds: achievementID },
            { $pull: { achievementIds: achievementID } } 
        )

        await Achievement.deleteOne({ achievementID })
        
        res.json({ message: 'Success' })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// Update achievement by ID
const updateAchievement = async (req, res) => {
    const { appID } = req.cookies
    const { achievementID } = req.params
    const { title, pointsNeeded } = req.body 

    try {
        if (!title || !pointsNeeded) 
            return res.status(400).json({ message: 'Title and points needed are required.' })

        const updatedAchievement = await Achievement.findOneAndUpdate(
            { appID, achievementID },
            { $set: { title, pointsNeeded } }, 
            { new: true, runValidators: true } 
        )

        if (!updatedAchievement)
            return res.status(404).json({ message: 'Achievement not found' })

        res.json(updatedAchievement)
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Internal server error', error: err.message })
    }
}

// Export all controller methods
module.exports = {
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
}