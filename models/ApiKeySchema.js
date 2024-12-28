const mongoose = require('mongoose');

const ApiKeySchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  createdAt: { type: Number, default: Date.now }, // Stored as milliseconds
  expiresAt: { type: Number } // Optional: If not set, the key never expires
});

module.exports = mongoose.model('ApiKey', ApiKeySchema);