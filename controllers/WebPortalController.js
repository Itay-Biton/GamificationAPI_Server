const App = require('../models/AppSchema')
const ApiKey = require('../models/ApiKeySchema')
const Player = require('../models/PlayerSchema')
const Achievement = require('../models/AchievementSchema')

const renderLogin = async (req, res) => {
    res.render('login')
}

const tryLogin = async (req, res) => {
    const { apiKey, appID } = req.body

    if (!appID || !apiKey)
        return res.render('login', { errorMessage: 'appID and api_key are required' })

    try {
        const app = await App.findOne({ appID })
        if (!app) 
            return res.render('login', { errorMessage: 'Invalid appID' })

        const key = await ApiKey.findOne({ key: apiKey })
        if (!key) 
            return res.render('login', { errorMessage: 'Invalid API key' })

        if (key.expiresAt && key.expiresAt < Date.now()) 
            return res.render('login', { errorMessage: 'API key has expired' })

        res.cookie('apiKey', apiKey, { httpOnly: true, sameSite: 'Strict', maxAge: 2 * 60 * 60 * 1000 }) // Expires in 2 hours
        res.cookie('appID', appID, { httpOnly: true, sameSite: 'Strict', maxAge: 2 * 60 * 60 * 1000 }) 
        res.redirect('/analytics')
    } catch (err) {
        return res.render('login', { errorMessage: 'Internal Server Error' })
    }
}

const logout = async (req, res) => {
    res.clearCookie('apiKey')
    res.clearCookie('appID')
    res.redirect('/login')
}

const renderApiManagement = async (req, res) => {
    const { apiKey } = req.cookies

    if (apiKey) {
        try {
            const apiKeyDetails = await ApiKey.findOne({ key: apiKey })

            if (!apiKeyDetails) 
                return res.render('apiManagement')

            res.render('apiManagement', {
                apiKey,
                details: {
                    creationDate: apiKeyDetails.createdAt,
                    expiration: apiKeyDetails.expiresAt
                },
            })
        } catch (err) {
            console.log(err)
            res.status(500).render('apiManagement', {
                error: 'An error occurred while fetching API key details. Please try again later.',
            })
        }
    } 
    else {
        res.render('apiManagement')
    }
}

const renderAnalytics = async (req, res) => {
    const appID = req.cookies.appID

    try {
        const app = await App.findOne({ appID })
        if (!app)
            return res.status(404).render('analytics', { error: 'App not found' })

        const playerCount = await Player.countDocuments({ appID })
        const achievementCount = await Achievement.countDocuments({ appID })
        const topPlayers = await Player.find({ appID })
        .sort({ playerPoints: -1 })
        .limit(20)
        .select('username playerPoints')
        .lean() || []

        res.render('analytics', {
            appID,
            appName: app.appName,
            playerCount,
            achievementCount,
            topPlayers
        })
    } catch (err) {
        res.status(500).render('analytics', { error: 'Internal server error' })
    }
}

const renderAchievements = async (req, res) => {
    const { appID } = req.cookies

    try {
        const achievements = await Achievement.find({ appID }).sort({ pointsNeeded: 1 }).lean()
        res.render('achievements', {
            appID,
            achievements,
        })
    } catch (err) {
        console.error(err)
        res.status(500).render('achievements', { error: 'Internal server error' })
    }
}

const renderAbout = async (req, res) => {
    res.render('about')
}

const renderDocs = async (req, res) => {
    res.render('docs')
}

// Export all controller methods
module.exports = {
    renderLogin,
    tryLogin,
    logout,
    renderApiManagement,
    renderAnalytics,
    renderAchievements,
    renderAbout,
    renderDocs,
}