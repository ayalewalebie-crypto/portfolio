const mongoose = require('mongoose');

const networkingLabSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  objectives: [{ type: String }],
  topologyImage: { type: String },
  technologies: [{ type: String }],
  addressingTable: [{
    device: String,
    interface: String,
    ipAddress: String,
    subnetMask: String,
    defaultGateway: String
  }],
  implementationSteps: [{ type: String }],
  configurations: [{
    device: String,
    config: String
  }],
  explanations: { type: String },
  results: { type: String },
  troubleshooting: { type: String },
  lessonsLearned: { type: String },
  packetTracerFile: { type: mongoose.Schema.Types.ObjectId, ref: 'Document' },
  isFeatured: { type: Boolean, default: false },
  isPublished: { type: Boolean, default: true },
  order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('NetworkingLab', networkingLabSchema);