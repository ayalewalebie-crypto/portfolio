const fs = require('fs');
const path = require('path');

const controllersDir = path.join(__dirname, 'backend', 'controllers');
const routesDir = path.join(__dirname, 'backend', 'routes');

if (!fs.existsSync(controllersDir)) fs.mkdirSync(controllersDir, { recursive: true });
if (!fs.existsSync(routesDir)) fs.mkdirSync(routesDir, { recursive: true });

const files = {
  'controllers/publicController.js': `
const Project = require('../models/Project');
const Profile = require('../models/Profile');

exports.getPublicProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ isPublished: true });
    res.json(profile || {});
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getPublicProjects = async (req, res) => {
  try {
    const projects = await Project.find({ isPublished: true }).sort('order');
    res.json(projects);
  } catch (err) { res.status(500).json({ message: err.message }); }
};
  `,
  'controllers/adminController.js': `
const Project = require('../models/Project');

exports.getDashboardStats = async (req, res) => {
  res.json({ message: 'Dashboard stats' });
};

exports.createProject = async (req, res) => {
  try {
    const project = new Project(req.body);
    await project.save();
    res.status(201).json(project);
  } catch (err) { res.status(500).json({ message: err.message }); }
};
  `,
  'routes/publicRoutes.js': `
const express = require('express');
const router = express.Router();
const { getPublicProfile, getPublicProjects } = require('../controllers/publicController');

router.get('/profile', getPublicProfile);
router.get('/projects', getPublicProjects);

module.exports = router;
  `,
  'routes/adminRoutes.js': `
const express = require('express');
const router = express.Router();
const { getDashboardStats, createProject } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
router.get('/dashboard/stats', getDashboardStats);
router.post('/projects', createProject);

module.exports = router;
  `
};

for (const [filename, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(__dirname, 'backend', filename), content.trim());
}
console.log('Controllers and Routes generated');
