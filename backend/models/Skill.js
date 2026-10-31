const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  category:    { type: String, required: true },
  level:       { type: Number, min: 1, max: 100 },
  description: { type: String },          // what the admin knows / has built with this skill
  icon:        { type: String },
  order:       { type: Number, default: 0 },
  isPublished: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Skill', skillSchema);