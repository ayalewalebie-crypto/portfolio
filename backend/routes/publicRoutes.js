const express = require('express');
const router  = express.Router();
const {
  getPublicProfile,
  getPublicProjects,
  getPublicSkills,
  getPublicExperience,
  getPublicEducation,
  getPublicCertifications,
  getPublicLabs,
  getPublicCV,
  downloadPublicCV,
  getPublicStats,
  submitMessage,
  aiChat,
} = require('../controllers/publicController');

router.get ('/profile',        getPublicProfile);
router.get ('/projects',       getPublicProjects);
router.get ('/skills',         getPublicSkills);
router.get ('/experience',     getPublicExperience);
router.get ('/education',      getPublicEducation);
router.get ('/certifications', getPublicCertifications);
router.get ('/labs',           getPublicLabs);
router.get ('/cv',             getPublicCV);
router.get ('/cv/download',    downloadPublicCV);
router.get ('/stats',          getPublicStats);
router.post('/contact',        submitMessage);
router.post('/ai-chat',        aiChat);

module.exports = router;
