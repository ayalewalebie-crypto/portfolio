const express    = require('express');
const router     = express.Router();
const multer     = require('multer');
const path       = require('path');
const cloudinary = require('../config/cloudinary');
const {
  getDashboardStats,
  getProfile, updateProfile, changePassword, uploadProfilePhoto,
  updateAdminAccount, getAdminAccount,
  getProjects, createProject, updateProject, deleteProject,
  uploadProjectImage,
  getSkills, createSkill, updateSkill, deleteSkill,
  getExperience, createExperience, updateExperience, deleteExperience,
  getEducation, createEducation, updateEducation, deleteEducation,
  getCertifications, createCertification, updateCertification, deleteCertification,
  getLabs, createLab, updateLab, deleteLab,
  getDocuments, uploadDocument, deleteDocument,
  getMessages, markMessageRead, deleteMessage, replyMessage,
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');

// ── File upload config ────────────────────────────────────────────────────────
// Use memory storage — file is uploaded to Cloudinary, not local disk
const memStorage = multer.memoryStorage();
const upload = multer({
  storage: memStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (req, file, cb) => {
    const allowed = ['.pdf', '.doc', '.docx', '.png', '.jpg', '.jpeg', '.gif', '.webp', '.pkt'];
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, allowed.includes(ext));
  },
});

// ── Helper: upload buffer to Cloudinary ──────────────────────────────────────
const uploadToCloudinary = (buffer, folder, resourceType = 'auto') =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: resourceType },
      (err, result) => err ? reject(err) : resolve(result)
    );
    stream.end(buffer);
  });

// All admin routes require auth
router.use(protect);

// Dashboard
router.get('/dashboard/stats', getDashboardStats);

// Profile
router.get ('/profile',           getProfile);
router.put ('/profile',           updateProfile);
router.put ('/change-password',   changePassword);
router.get ('/account',           getAdminAccount);
router.put ('/account',           updateAdminAccount);
router.post('/profile/photo',     upload.single('photo'), uploadProfilePhoto);

// Projects — image upload MUST come before the generic POST /projects
router.post  ('/projects/upload-image',  upload.single('image'), uploadProjectImage);
router.get   ('/projects',               getProjects);
router.post  ('/projects',               createProject);
router.put   ('/projects/:id',           updateProject);
router.delete('/projects/:id',           deleteProject);

// Skills
router.get   ('/skills',     getSkills);
router.post  ('/skills',     createSkill);
router.put   ('/skills/:id', updateSkill);
router.delete('/skills/:id', deleteSkill);

// Experience
router.get   ('/experience',     getExperience);
router.post  ('/experience',     createExperience);
router.put   ('/experience/:id', updateExperience);
router.delete('/experience/:id', deleteExperience);

// Education
router.get   ('/education',     getEducation);
router.post  ('/education',     createEducation);
router.put   ('/education/:id', updateEducation);
router.delete('/education/:id', deleteEducation);

// Certifications
router.get   ('/certifications',     getCertifications);
router.post  ('/certifications',     createCertification);
router.put   ('/certifications/:id', updateCertification);
router.delete('/certifications/:id', deleteCertification);

// Networking Labs
router.get   ('/labs',     getLabs);
router.post  ('/labs',     createLab);
router.put   ('/labs/:id', updateLab);
router.delete('/labs/:id', deleteLab);

// Documents / CV
router.get   ('/documents',     getDocuments);
router.post  ('/documents',     upload.single('file'), uploadDocument);
router.delete('/documents/:id', deleteDocument);

// Messages
router.get   ('/messages',          getMessages);
router.put   ('/messages/:id/read', markMessageRead);
router.post  ('/messages/:id/reply',replyMessage);
router.delete('/messages/:id',      deleteMessage);

module.exports = router;
