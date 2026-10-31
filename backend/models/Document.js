const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  filename:    { type: String, required: true },
  path:        { type: String, required: true },
  mimetype:    { type: String, required: true },
  size:        { type: Number, required: true },
  type:        { type: String, enum: ['CV', 'Achievement', 'Lab', 'Image', 'Other'], default: 'Other' },
  isPublished: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Document', documentSchema);