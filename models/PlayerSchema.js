const mongoose = require('mongoose')

const PlayerSchema = new mongoose.Schema({
  appID: { type: mongoose.Schema.Types.ObjectId, required: true },
  playerID: { type: String, required: true },
  username: { type: String, required: true },
  playerPoints: { type: Number, default: 0 },
  achievementIds: [mongoose.Schema.Types.ObjectId],
})

PlayerSchema.index({ appID: 1, playerID: 1 }, { unique: true })

module.exports = mongoose.model('Player', PlayerSchema)