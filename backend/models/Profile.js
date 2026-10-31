const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  title: { type: String, required: true },
  introduction: { type: String, required: true },
  about: { type: String },
  email: { type: String, required: true },
  phone: { type: String },
  location: { type: String },
  github:    { type: String },
  linkedin:  { type: String },
  twitter:   { type: String },
  telegram:  { type: String },
  instagram: { type: String },
  facebook:  { type: String },
  profilePhoto: { type: String },
  cvDocument: { type: mongoose.Schema.Types.ObjectId, ref: 'Document' },
  isPublished: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Profile', profileSchema);
