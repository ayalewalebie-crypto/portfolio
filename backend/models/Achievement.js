const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  issuer:      { type: String },
  date:        { type: Date },
  description: { type: String },
  image:       { type: String, default: '' },   // uploaded certificate / award image
  order:       { type: Number, default: 0 },
  isPublished: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Achievement', achievementSchema);