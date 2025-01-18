const ApiKey = require('../models/ApiKeySchema')
const mongoose = require('mongoose')

// create new api key
const createApiKey = async (req, res) => {
    const { expiration } = req.body

    let expDate = null
    if (expiration === '1w') 
        expDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 1 week
    else if (expiration === '1m')
        expDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 1 month
    
    try {
        const newApiKey = new ApiKey({
            key: new mongoose.Types.ObjectId().toString(),
            createdAt: Date.now(),
            expiresAt: expDate
        })
        await newApiKey.save()

        res.cookie('apiKey', newApiKey.key, { httpOnly: true, sameSite: 'Strict', maxAge: 2 * 60 * 60 * 1000 })
        res.render('apiManagement', {
            apiKey: newApiKey.key,
            details: {
                creationDate: newApiKey.createdAt,
                expiration: newApiKey.expiresAt,
            },
        })
    } catch (err) {
        console.log(err)
        res.status(500).render('apiManagement', {
            error: 'An error occurred while creating a new API key. Please try again later.',
        })
    }
}

// Remove api key
const deleteApiKey = async (req, res) => {
    const { apiKey } = req.params

    try {
        const apiKeyToDelete = await ApiKey.findOne({ key: apiKey })
        if (!apiKeyToDelete) return res.status(404).json({ message: 'Api key not found' })

        await ApiKey.deleteOne({ _id: apiKeyToDelete._id })

        res.json({ message: 'Api key deleted successfully' })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// Get api key by key
const getApiKey = async (req, res) => {
    const { apiKey } = req.body

    try {
        const apiKeyToGet = await ApiKey.findOne({ key: apiKey }) 
        if (!apiKeyToGet) return res.status(404).json({ message: 'Api key not found' })

        res.cookie('apiKey', apiKeyToGet.key, { httpOnly: true, sameSite: 'Strict', maxAge: 2 * 60 * 60 * 1000 })
        res.render('apiManagement', {
            apiKey: apiKeyToGet.key,
            details: {
                creationDate: apiKeyToGet.createdAt,
                expiration: apiKeyToGet.expiresAt,
            },
        })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// Export all controller methods
module.exports = {
    createApiKey,
    deleteApiKey,
    getApiKey,
}