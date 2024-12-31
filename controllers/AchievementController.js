const Achievement = require('../models/AchievementSchema')
const { v4: uuidv4 } = require('uuid')

// Get all achievements for a specific app
const getAllAchievements = async (req, res) => {
    const { appID } = req.params

    try {
        const achievements = await Achievement.find({ appID })
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

        if (!achievement) {
            return res.status(404).json({ message: 'Achievement not found' })
        }

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
        })

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
        })

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
            _id: achievementID,
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

// Create achievement
const createAchievement = async (req, res) => {
    const { appID } = req.params
    const { title, pointsNeeded } = req.body 
    
    try {
        const newAchievement = new Achievement({
            appID,
            achievementID: uuidv4(),
            title,
            pointsNeeded,
            playerIdsAchieved: [],
        })
        
        await newAchievement.save()
        
        await App.updateOne(
            { _id: appID },
            { $push: { achievements: newAchievement.achievementID } }
        )
        
        res.status(201).json(newAchievement)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// Delete achievement by ID
const deleteAchievement = async (req, res) => {
    const { appID, achievementID } = req.params

    try {
        const achievement = await Achievement.findOne({ appID, achievementID })
        if (!achievement) 
            return res.status(404).json({ message: 'Achievement not found' })

        await App.updateOne(
            { _id: appID },
            { $pull: { achievements: achievementID } }
        )

        // For each of the achievement's finished players, remove the achievement ID from the achievementIds array
        await Player.updateMany(
            { achievementIds: achievementID },
            { $pull: { achievementIds: achievementID } } 
        )

        await Achievement.deleteOne({ _id: achievement._id })

        res.json({ message: 'Achievement deleted successfully' })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// Update achievement by ID
const updateAchievement = async (req, res) => {
    const { appID, achievementID } = req.params
    const { title, pointsNeeded } = req.body 

    try {
        if (!title && pointsNeeded === undefined) 
            return res.status(400).json({ message: 'At least one field must be provided' })

        const updatedAchievement = await Achievement.findOneAndUpdate(
            { appID, achievementID },
            { $set: { title, pointsNeeded } }, 
            { new: true, runValidators: true } 
        )

        if (!updatedAchievement)
            return res.status(404).json({ message: 'Achievement not found' })

        res.json(updatedAchievement)
    } catch (err) {
        res.status(500).json({ message: err.message })
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
    createAchievement,
    deleteAchievement,
    updateAchievement,
}