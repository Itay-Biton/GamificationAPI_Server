const mongoose = require('mongoose')

const PlayerSchema = new mongoose.Schema({
  appID: { type: String, required: true },
  playerID: { type: String, required: true },
  username: { type: String, required: true },
  playerPoints: { type: Number, default: 0 },
  achievementIds: [String],
})

PlayerSchema.index({ appID: 1, playerID: 1 }, { unique: true })

module.exports = mongoose.model('Player', PlayerSchema)