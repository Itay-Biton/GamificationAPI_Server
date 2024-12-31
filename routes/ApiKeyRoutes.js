const express = require('express')
const router = express.Router()
const checkAdminAccess = require('../middleware/AdminAccess')
const {
    createApiKey,
    deleteApiKey,
    getApiKey,
} = require('../controllers/ApiKeyController')

// Create new api key
router.post('/new', checkAdminAccess, createApiKey)

// Remove api key
router.delete('/delete/:apiKey', checkAdminAccess, deleteApiKey)

// Get api key by key
router.get('/get/:apiKey', checkAdminAccess, getApiKey)

module.exports = router