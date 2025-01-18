const ApiKey = require('../models/ApiKeySchema')
const App = require('../models/AppSchema')

const requireLogin = async (req, res, next) => {
  try {
    const { apiKey, appID } = req.cookies

    if (!apiKey || !appID) {
      res.locals.loggedIn = false
      return res.redirect('/login')
    }

    const existingApiKey = await ApiKey.findOne({ key: apiKey })
    const existingApp = await App.findOne({ appID })

    if (!existingApiKey || !existingApp) {
      res.locals.loggedIn = false
      return res.redirect('/login')
    }

    res.locals.loggedIn = true
    next()
  } catch (error) {
    console.error('Error during login check:', error)
    res.status(500).send('Internal Server Error') 
  }
}

const checkLogin = async (req, res, next) => {
  try {
    const { apiKey, appID } = req.cookies

    if (!apiKey || !appID) {
      res.locals.loggedIn = false
      next()
    }

    const existingApiKey = await ApiKey.findOne({ key: apiKey })
    const existingApp = await App.findOne({ appID })

    if (!existingApiKey || !existingApp) {
      res.locals.loggedIn = false
      next()
    }

    res.locals.loggedIn = true
    next()
  } catch (error) {
    console.error('Error during login check:', error)
    res.status(500).send('Internal Server Error') 
  }
}

module.exports = {
  requireLogin, 
  checkLogin,
}