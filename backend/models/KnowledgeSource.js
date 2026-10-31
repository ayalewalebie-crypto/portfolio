const mongoose = require('mongoose');

const knowledgeSourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  sourceType: { type: String, enum: ['Document', 'Text', 'Database'], default: 'Text' },
  isIndexed: { type: Boolean, default: false },
  metadata: { type: mongoose.Schema.Types.Mixed }
}, { timestamps: true });

module.exports = mongoose.model('KnowledgeSource', knowledgeSourceSchema);