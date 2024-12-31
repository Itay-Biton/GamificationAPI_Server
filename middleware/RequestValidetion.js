const App = require('../models/AppSchema')
const ApiKey = require('../models/ApiKeySchema')

const validateRequest = async (req, res, next) => {
  const { appID } = req.params
  const apiKey = req.headers['api_key']

  if (!appID || !apiKey) 
    return res.status(400).json({ message: 'appID and api_key are required' })

  try {
    const app = await App.findOne({ appID })
    if (!app) 
      return res.status(403).json({ message: 'Invalid appID' })

    const key = await ApiKey.findOne({ key: apiKey })
    if (!key) 
      return res.status(403).json({ message: 'Invalid API key' })
    if (key.expiresAt && key.expiresAt < Date.now()) 
      return res.status(403).json({ message: 'API key has expired' })

    next()
  } catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err.message })
  }
}

module.exports = validateRequest