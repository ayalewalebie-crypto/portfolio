const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  problemBackground: { type: String },
  objectives: { type: String },
  solution: { type: String },
  features: [{ type: String }],
  technologies: [{ type: String }],
  myContribution: { type: String },
  architectureWorkflow: { type: String },
  results: { type: String },
  challenges: { type: String },
  lessonsLearned: { type: String },
  githubLink: { type: String },
  demoLink: { type: String },
  documentationLink: { type: String },
  screenshots: [{ type: String }],
  isFeatured: { type: Boolean, default: false },
  isPublished: { type: Boolean, default: true },
  order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);