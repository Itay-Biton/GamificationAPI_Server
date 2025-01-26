const express = require('express')
const router = express.Router()
const {
    requireLogin, 
    checkLogin,
} = require('../middleware/RequireLogin')

const {
    renderLogin,
    tryLogin,
    logout,
    renderApiManagement,
    renderAnalytics,
    renderAchievements,
    renderAbout,
    renderDocs,
} = require('../controllers/WebPortalController')

// Login Page
router.get('/login', renderLogin)

// Login 
router.post('/login', tryLogin)

// Logout
router.get('/logout', requireLogin, logout)

// API Management Page
router.get('/api-management', checkLogin, renderApiManagement)

// Analytics Page
router.get('/analytics', requireLogin, renderAnalytics)

// Achievement Management Page
router.get('/achievements', requireLogin, renderAchievements)

// About Page
router.get('/about', renderAbout)

// Documentation Page
router.get('/docs', renderDocs)

module.exports = router