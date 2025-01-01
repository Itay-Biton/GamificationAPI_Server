const mongoose = require('mongoose');

const AppSchema = new mongoose.Schema({
  appID: { type: String, required: true, unique: true },
  appName: { type: String, required: true },
  players: [{ type: String, ref: 'Player' }],
  achievements: [{ type: String, ref: 'Achievement' }],
});

module.exports = mongoose.model('App', AppSchema);