const App = require('../models/AppSchema')
const Player = require('../models/PlayerSchema')
const Achievement = require('../models/AchievementSchema')
const { v4: uuidv4 } = require('uuid')

// Add new app
const addNewApp = async (req, res) => {
    const { appName } = req.params

    try {
        const newApp = new App({
            appID: uuidv4(),
            appName,
            players: [],
            achievements: [],
        })
        await newApp.save()

        res.status(201).json(newApp) 
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// Remove app
const deleteApp = async (req, res) => {
    const { appID } = req.params

    try {
        const appToDelete = await App.findOne({ appID })
        if (!appToDelete) return res.status(404).json({ message: 'App not found' })

        await Achievement.deleteMany({ appID })

        await Player.deleteMany({ appID })

        await App.deleteOne({ _id: appToDelete._id })

        res.json({ message: 'App and related data deleted successfully' })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// Set app name
const setAppName = async (req, res) => {
    const { appID } = req.params
    const { appName } = req.query 

    if (!appName)
        return res.status(400).json({ message: 'appName is required' })

    try {
        const app = await App.findOneAndUpdate(
            { appID },
            { $set: { appName } },
            { new: true, runValidators: true }
        )

        if (!app) 
            return res.status(404).json({ message: 'App not found' })

        res.json(app)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// Get app name
const getAppName = async (req, res) => {
    const { appID } = req.params

    try {
        const app = await App.findOne({ appID }) 
        if (!app) return res.status(404).json({ message: 'App not found' })

        res.json({ appName: app.appName })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// Export all controller methods
module.exports = {
    addNewApp,
    deleteApp,
    setAppName,
    getAppName,
}