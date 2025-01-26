require('dotenv').config()
const express = require('express')
const connectDB = require('./config/db')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const path = require('path')
const axios = require('axios') 

const app = express()

app.set('view engine', 'pug')
app.set('views', './views') 
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())

// Connect to the database
connectDB()

// Middleware for parsing JSON
app.use(express.json())

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')))

// Import routes
const playersRoutes = require('./routes/PlayerRoutes')
const achievementsRoutes = require('./routes/AchievementRoutes')
const appRoutes = require('./routes/AppRoutes')
const apikeyRoutes = require('./routes/ApiKeyRoutes')
const WebPortalRoutes = require('./routes/WebPortalRoutes')

// Use routes
app.get('/health', (req, res) => {
  res.status(200).send()
})
app.get('/', (req, res) => {
  res.redirect('/login')
})
app.use('/players', playersRoutes)
app.use('/achievements', achievementsRoutes)
app.use('/app', appRoutes)
app.use('/apikey', apikeyRoutes)
app.use('/', WebPortalRoutes)

// Start the server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on https://gamificationsdk-server.onrender.com`)
})

// Function to send a keep-alive request to the server itself
const sendKeepAliveRequest = async () => {
  if (process.env.KEEP_ALIVE === "KEEP_ALIVE")
    try {
      const response = await axios.get(`https://gamificationsdk-server.onrender.com/health`)
      console.log(`Keep-alive successful: ${response.status}`)
    } catch (error) {
      console.error('Keep-alive failed:', error.message)
    }
}

// Send the keep-alive request every 5 minutes
setInterval(sendKeepAliveRequest, 5 * 60 * 1000)