const ApiKey = require('../models/ApiKeySchema')
const { v4: uuidv4 } = require('uuid')

// create new api key
const createApiKey = async (req, res) => {
    const { expDate } = req.body

    try {
        const newApiKey = new ApiKey({
            key: uuidv4(),
            createdAt: Date.now(),
            expiresAt: expDate || null
        })
        await newApiKey.save()

        res.status(201).json(newApiKey) 
    } catch (err) {
        res.status(500).json({ message: err.message })
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
    const { apiKey } = req.params

    try {
        const apiKeyToGet = await ApiKey.findOne({ key: apiKey }) 
        if (!apiKeyToGet) return res.status(404).json({ message: 'Api key not found' })

        res.json({ apiKeyToGet })
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