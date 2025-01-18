const express = require('express')
const router = express.Router()
const validateRequest = require('../middleware/RequestValidetion')
const { requireLogin } = require('../middleware/RequireLogin')
const {
    addNewApp,
    deleteApp,
    setAppName,
    getAppName
} = require('../controllers/AppController')

// Add new app
router.post('/new', addNewApp)

// Remove app
router.post('/delete', requireLogin, deleteApp)

// Set app name
router.post('/appName/set', requireLogin, setAppName)

// Get app name
router.get('/:appID/appName', validateRequest, getAppName)

module.exports = router