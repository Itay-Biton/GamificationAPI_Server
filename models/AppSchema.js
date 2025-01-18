const mongoose = require('mongoose')

const AppSchema = new mongoose.Schema({
  appID: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true },
  appName: { type: String, required: true },
  players: [{ type: String, ref: 'Player' }],
  achievements: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Achievement' }],
})

module.exports = mongoose.model('App', AppSchema)