const App = require('../models/AppSchema')
const Player = require('../models/PlayerSchema')
const Achievement = require('../models/AchievementSchema')
const mongoose = require('mongoose')

// Add new app
const addNewApp = async (req, res) => {
    const { apiKey } = req.cookies
    const { appName } = req.body
    
    if (!apiKey)
        return res.status(401).json({ message: 'API key is required' })

    try {
        const newApp = new App({
            appID: new mongoose.Types.ObjectId().toString(),
            appName,
            players: [],
            achievements: [],
        })
        await newApp.save()

        res.cookie('appID', newApp.appID, { httpOnly: true, sameSite: 'Strict', maxAge: 2 * 60 * 60 * 1000 })
        res.cookie('apiKey', apiKey, { httpOnly: true, sameSite: 'Strict', maxAge: 2 * 60 * 60 * 1000 })
        res.redirect('/analytics')
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// Remove app
const deleteApp = async (req, res) => {
    const { appID } = req.cookies

    try {
        const appToDelete = await App.findOne({ appID })
        if (!appToDelete) return res.status(404).json({ message: 'App not found' })

        await Achievement.deleteMany({ appID })

        await Player.deleteMany({ appID })

        await App.deleteOne({ _id: appToDelete._id })

        res.redirect('/logout')
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// Set app name
const setAppName = async (req, res) => {
    const { appID } = req.cookies
    const { appName } = req.body

    try {
        if (!appName) 
            return res.status(400).json({ message: 'New app name is required' })

        const app = await App.findOneAndUpdate(
            { appID },
            { $set: { appName } },
            { new: true, runValidators: true }
        )
        if (!app) 
            return res.status(404).json({ message: 'App not found' })

        res.redirect('/analytics')
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Internal server error', error: err.message })
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