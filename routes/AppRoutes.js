const express = require('express')
const router = express.Router()
const validateRequest = require('../middleware/RequestValidetion')
const {
    addNewApp,
    deleteApp,
    setAppName,
    getAppName
} = require('../controllers/AppController')

// Add new app
router.post('/new/appName=:appName', validateRequest, addNewApp)

// Remove app
router.delete('/delete/:appID', validateRequest, deleteApp)

// Set app name
router.put('/:appID/appName/set', validateRequest, setAppName)

// Get app name
router.get('/:appID/appName', validateRequest, getAppName)

module.exports = router