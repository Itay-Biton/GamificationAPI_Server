const mongoose = require('mongoose')

const AchievementSchema = new mongoose.Schema({
  appID: { type: String, required: true },
  achievementID: { type: String, required: true },
  title: { type: String, required: true },
  pointsNeeded: { type: Number, required: true },
  playerIdsAchieved: [String],
})

AchievementSchema.index({ appID: 1, achievementID: 1 }, { unique: true })

module.exports = mongoose.model('Achievement', AchievementSchema)