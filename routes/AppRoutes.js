const express = require('express')
const router = express.Router()
const validateRequest = require('../middleware/RequestValidetion')
const checkAdminAccess = require('../middleware/AdminAccess')
const {
    addNewApp,
    deleteApp,
    setAppName,
    getAppName
} = require('../controllers/AppController')

// Add new app
router.post('/new/appName=:appName', checkAdminAccess, addNewApp)

// Remove app
router.delete('/delete/:appID', checkAdminAccess, deleteApp)

// Set app name
router.put('/:appID/appName/set', validateRequest, setAppName)

// Get app name
router.get('/:appID/appName', validateRequest, getAppName)

module.exports = router