const express = require('express')
const router = express.Router()
const validateRequest = require('../middleware/RequestValidetion')
const {
    createApiKey,
    deleteApiKey,
    getApiKey,
} = require('../controllers/ApiKeyController')

// Create new api key
router.post('/new', validateRequest, createApiKey)

// Remove api key
router.delete('/delete/:apiKey', validateRequest, deleteApiKey)

// Get api key by key
router.get('/get/:apiKey', validateRequest, getApiKey)

module.exports = router