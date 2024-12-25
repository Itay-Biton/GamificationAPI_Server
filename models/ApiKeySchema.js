const mongoose = require('mongoose');

const ApiKeySchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date } // Optional: If not set, the key never expires
});

module.exports = mongoose.model('ApiKey', ApiKeySchema);