const express = require('express')
const router = express.Router()
const {
    createApiKey,
    deleteApiKey,
    getApiKey,
} = require('../controllers/ApiKeyController')

// Create new api key
router.post('/new', createApiKey)

// Remove api key
router.delete('/delete/:apiKey', deleteApiKey)

// Get api key by key
router.post('/get', getApiKey)

module.exports = router