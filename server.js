require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path')

const app = express();

app.set('view engine', 'pug');
app.set('views', './views'); 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Connect to the database
connectDB();

// Middleware for parsing JSON
app.use(express.json());

// Base route for health check
app.get('/', (req, res) => {
  res.send('Gamification SDK server is running!');
});

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')))

// Import routes
const playersRoutes = require('./routes/PlayerRoutes');
const achievementsRoutes = require('./routes/AchievementRoutes');
const appRoutes = require('./routes/AppRoutes');
const apikeyRoutes = require('./routes/ApiKeyRoutes');
const WebPortalRoutes = require('./routes/WebPortalRoutes');

// Use routes
app.use('/players', playersRoutes);
app.use('/achievements', achievementsRoutes);
app.use('/app', appRoutes);
app.use('/apikey', apikeyRoutes);
app.use('/', WebPortalRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
