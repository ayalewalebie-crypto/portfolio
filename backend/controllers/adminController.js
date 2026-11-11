const Project      = require('../models/Project');
const Education    = require('../models/Education');
const Certification= require('../models/Certification');
const Message      = require('../models/Message');
const Profile      = require('../models/Profile');
const Skill        = require('../models/Skill');
const Experience   = require('../models/Experience');
const Achievement  = require('../models/Achievement');
const NetworkingLab= require('../models/NetworkingLab');
const Document     = require('../models/Document');
const Admin        = require('../models/Admin');
const bcrypt       = require('bcryptjs');
const path         = require('path');
const fs           = require('fs');
// ── Nodemailer — optional. Server boots even if not yet installed. ────────────
let nodemailer = null;
try { nodemailer = require('nodemailer'); } catch (_) { /* not installed yet */ }

const createTransport = () => {
  if (!nodemailer) throw new Error('nodemailer is not installed. Run: npm install nodemailer@6.10.1 inside the backend folder.');
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
};

// ─── Dashboard ────────────────────────────────────────────────────────────────
exports.getDashboardStats = async (req, res) => {
  try {
    const [projectsCount, educationCount, certificationsCount, messagesCount,
           skillsCount, experienceCount, labsCount, unreadCount] =
      await Promise.all([
        Project.countDocuments(),
        Education.countDocuments(),
        Certification.countDocuments(),
        Message.countDocuments(),
        Skill.countDocuments(),
        Experience.countDocuments(),
        NetworkingLab.countDocuments(),
        Message.countDocuments({ isRead: false }),
      ]);
    const recentMessages = await Message.find().sort('-createdAt').limit(5);
    res.json({
      projectsCount, educationCount, certificationsCount, messagesCount,
      skillsCount, experienceCount, labsCount, unreadCount,
      recentMessages,
    });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.uploadProfilePhoto = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded.' });

    // Upload to Cloudinary
    const cloudinary = require('../config/cloudinary');
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'portfolio/profile', resource_type: 'image' },
        (err, res) => err ? reject(err) : resolve(res)
      );
      stream.end(req.file.buffer);
    });

    const photoPath = result.secure_url;
    let profile = await Profile.findOne();
    if (profile) {
      profile = await Profile.findOneAndUpdate({}, { profilePhoto: photoPath }, { new: true });
    } else {
      profile = await Profile.create({ profilePhoto: photoPath, name:'Admin', title:'Developer', introduction:'', email:'' });
    }
    res.json({ profilePhoto: photoPath, profile });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── Profile ──────────────────────────────────────────────────────────────────
exports.getProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne();
    res.json(profile || {});
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.updateProfile = async (req, res) => {
  try {
    // Use $set so new fields (telegram, instagram, etc.) always get written
    // even if they didn't exist in the original document
    const allowed = [
      'name','title','introduction','about',
      'email','phone','location',
      'github','linkedin','twitter','telegram','instagram','facebook',
      'profilePhoto','yearsExp',
    ];
    const update = {};
    allowed.forEach(k => {
      if (k in req.body) update[k] = req.body[k] ?? '';
    });

    let profile = await Profile.findOne();
    if (profile) {
      profile = await Profile.findOneAndUpdate(
        {},
        { $set: update },
        { new: true, runValidators: true }
      );
    } else {
      profile = await Profile.create(req.body);
    }
    res.json(profile);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// ─── Password Change ──────────────────────────────────────────────────────────
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword)
      return res.status(400).json({ message: 'Both current and new password are required.' });
    if (newPassword.length < 6)
      return res.status(400).json({ message: 'New password must be at least 6 characters.' });

    const adminDoc = await Admin.findById(req.admin._id);
    const match = await adminDoc.matchPassword(currentPassword);
    if (!match) return res.status(401).json({ message: 'Current password is incorrect.' });

    adminDoc.password = newPassword;
    await adminDoc.save();

    // Re-issue JWT so token stays valid with latest name/email
    const jwt = require('jsonwebtoken');
    const newToken = jwt.sign(
      { id: adminDoc._id, name: adminDoc.name, email: adminDoc.email },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({ message: 'Password updated successfully.', token: newToken });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// ─── Get Admin Account (login name + email) ──────────────────────────────────
exports.getAdminAccount = async (req, res) => {
  try {
    const adminDoc = await Admin.findById(req.admin._id).select('name email');
    if (!adminDoc) return res.status(404).json({ message: 'Admin not found.' });
    res.json({ name: adminDoc.name, email: adminDoc.email });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
exports.updateAdminAccount = async (req, res) => {
  try {
    const { name, email, currentPassword } = req.body;

    if (!name || !email)
      return res.status(400).json({ message: 'Name and email are required.' });
    if (!currentPassword)
      return res.status(400).json({ message: 'Current password is required to update account credentials.' });

    const adminDoc = await Admin.findById(req.admin._id);
    const match = await adminDoc.matchPassword(currentPassword);
    if (!match) return res.status(401).json({ message: 'Current password is incorrect.' });

    // Check email not already taken by another admin
    const existing = await Admin.findOne({ email, _id: { $ne: adminDoc._id } });
    if (existing) return res.status(400).json({ message: 'This email is already in use.' });

    adminDoc.name  = name.trim();
    adminDoc.email = email.trim().toLowerCase();
    await adminDoc.save();

    // Re-issue JWT with updated name + email
    const jwt = require('jsonwebtoken');
    const newToken = jwt.sign(
      { id: adminDoc._id, name: adminDoc.name, email: adminDoc.email },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({ message: 'Account updated successfully.', token: newToken, name: adminDoc.name, email: adminDoc.email });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// ─── Projects ─────────────────────────────────────────────────────────────────
exports.getProjects = async (req, res) => {
  try { res.json(await Project.find().sort('order')); }
  catch (err) { res.status(500).json({ message: err.message }); }
};
exports.createProject = async (req, res) => {
  try { res.status(201).json(await Project.create(req.body)); }
  catch (err) { res.status(500).json({ message: err.message }); }
};
exports.updateProject = async (req, res) => {
  try {
    const p = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!p) return res.status(404).json({ message: 'Not found' });
    res.json(p);
  } catch (err) { res.status(500).json({ message: err.message }); }
};
exports.deleteProject = async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// ─── Skills ───────────────────────────────────────────────────────────────────
exports.getSkills = async (req, res) => {
  try { res.json(await Skill.find().sort('order')); }
  catch (err) { res.status(500).json({ message: err.message }); }
};
exports.createSkill = async (req, res) => {
  try { res.status(201).json(await Skill.create(req.body)); }
  catch (err) { res.status(500).json({ message: err.message }); }
};
exports.updateSkill = async (req, res) => {
  try {
    const s = await Skill.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!s) return res.status(404).json({ message: 'Not found' });
    res.json(s);
  } catch (err) { res.status(500).json({ message: err.message }); }
};
exports.deleteSkill = async (req, res) => {
  try { await Skill.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); }
  catch (err) { res.status(500).json({ message: err.message }); }
};

// ─── Experience ───────────────────────────────────────────────────────────────
exports.getExperience = async (req, res) => {
  try { res.json(await Experience.find().sort('-startDate')); }
  catch (err) { res.status(500).json({ message: err.message }); }
};
exports.createExperience = async (req, res) => {
  try { res.status(201).json(await Experience.create(req.body)); }
  catch (err) { res.status(500).json({ message: err.message }); }
};
exports.updateExperience = async (req, res) => {
  try {
    const e = await Experience.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!e) return res.status(404).json({ message: 'Not found' });
    res.json(e);
  } catch (err) { res.status(500).json({ message: err.message }); }
};
exports.deleteExperience = async (req, res) => {
  try { await Experience.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); }
  catch (err) { res.status(500).json({ message: err.message }); }
};

// ─── Education ────────────────────────────────────────────────────────────────
exports.getEducation = async (req, res) => {
  try { res.json(await Education.find().sort('-startDate')); }
  catch (err) { res.status(500).json({ message: err.message }); }
};
exports.createEducation = async (req, res) => {
  try { res.status(201).json(await Education.create(req.body)); }
  catch (err) { res.status(500).json({ message: err.message }); }
};
exports.updateEducation = async (req, res) => {
  try {
    const e = await Education.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!e) return res.status(404).json({ message: 'Not found' });
    res.json(e);
  } catch (err) { res.status(500).json({ message: err.message }); }
};
exports.deleteEducation = async (req, res) => {
  try { await Education.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); }
  catch (err) { res.status(500).json({ message: err.message }); }
};

// ─── Certifications ───────────────────────────────────────────────────────────
exports.getCertifications = async (req, res) => {
  try { res.json(await Certification.find().sort('order')); }
  catch (err) { res.status(500).json({ message: err.message }); }
};
exports.createCertification = async (req, res) => {
  try { res.status(201).json(await Certification.create(req.body)); }
  catch (err) { res.status(500).json({ message: err.message }); }
};
exports.updateCertification = async (req, res) => {
  try {
    const c = await Certification.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!c) return res.status(404).json({ message: 'Not found' });
    res.json(c);
  } catch (err) { res.status(500).json({ message: err.message }); }
};
exports.deleteCertification = async (req, res) => {
  try { await Certification.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); }
  catch (err) { res.status(500).json({ message: err.message }); }
};

// ─── Achievements ─────────────────────────────────────────────────────────────
exports.getAchievements = async (req, res) => {
  try { res.json(await Achievement.find().sort('order')); }
  catch (err) { res.status(500).json({ message: err.message }); }
};
exports.createAchievement = async (req, res) => {
  try { res.status(201).json(await Achievement.create(req.body)); }
  catch (err) { res.status(500).json({ message: err.message }); }
};
exports.updateAchievement = async (req, res) => {
  try {
    const a = await Achievement.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!a) return res.status(404).json({ message: 'Not found' });
    res.json(a);
  } catch (err) { res.status(500).json({ message: err.message }); }
};
exports.deleteAchievement = async (req, res) => {
  try { await Achievement.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); }
  catch (err) { res.status(500).json({ message: err.message }); }
};

// ─── Networking Labs ──────────────────────────────────────────────────────────
exports.getLabs = async (req, res) => {
  try { res.json(await NetworkingLab.find().sort('order')); }
  catch (err) { res.status(500).json({ message: err.message }); }
};
exports.createLab = async (req, res) => {
  try { res.status(201).json(await NetworkingLab.create(req.body)); }
  catch (err) { res.status(500).json({ message: err.message }); }
};
exports.updateLab = async (req, res) => {
  try {
    const l = await NetworkingLab.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!l) return res.status(404).json({ message: 'Not found' });
    res.json(l);
  } catch (err) { res.status(500).json({ message: err.message }); }
};
exports.deleteLab = async (req, res) => {
  try { await NetworkingLab.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); }
  catch (err) { res.status(500).json({ message: err.message }); }
};

// ─── Achievement image upload ─────────────────────────────────────────────────
exports.uploadAchievementImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded.' });
    res.status(201).json({ url: `/uploads/${req.file.filename}` });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// ─── Project image upload ─────────────────────────────────────────────────────
exports.uploadProjectImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded.' });
    const cloudinary = require('../config/cloudinary');
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'portfolio/projects', resource_type: 'image' },
        (err, res) => err ? reject(err) : resolve(res)
      );
      stream.end(req.file.buffer);
    });
    res.status(201).json({ url: result.secure_url });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// ─── Documents / CV ───────────────────────────────────────────────────────────
exports.getDocuments = async (req, res) => {
  try { res.json(await Document.find().sort('-createdAt')); }
  catch (err) { res.status(500).json({ message: err.message }); }
};

exports.uploadDocument = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded.' });

    // Upload to Cloudinary
    const cloudinary = require('../config/cloudinary');
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'portfolio/documents', resource_type: 'auto' },
        (err, res) => err ? reject(err) : resolve(res)
      );
      stream.end(req.file.buffer);
    });

    const doc = await Document.create({
      name:        req.body.name || req.file.originalname,
      filename:    result.public_id,
      path:        result.secure_url,
      mimetype:    req.file.mimetype,
      size:        req.file.size,
      type:        req.body.type || 'CV',
      isPublished: true,
    });
    if (doc.type === 'CV') {
      await Profile.findOneAndUpdate({}, { cvDocument: doc._id });
    }
    res.status(201).json(doc);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.deleteDocument = async (req, res) => {
  try {
    const doc = await Document.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Not found' });
    // Remove file from Cloudinary
    if (doc.filename) {
      try {
        const cloudinary = require('../config/cloudinary');
        await cloudinary.uploader.destroy(doc.filename, { resource_type: 'raw' });
      } catch (_) { /* ignore cloudinary delete errors */ }
    }
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// ─── Messages ─────────────────────────────────────────────────────────────────
exports.getMessages = async (req, res) => {
  try { res.json(await Message.find().sort('-createdAt')); }
  catch (err) { res.status(500).json({ message: err.message }); }
};
exports.markMessageRead = async (req, res) => {
  try {
    const m = await Message.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
    if (!m) return res.status(404).json({ message: 'Not found' });
    res.json(m);
  } catch (err) { res.status(500).json({ message: err.message }); }
};
exports.replyMessage = async (req, res) => {
  try {
    const { replyText } = req.body;
    if (!replyText || !replyText.trim())
      return res.status(400).json({ message: 'Reply text is required.' });

    const msg = await Message.findById(req.params.id);
    if (!msg) return res.status(404).json({ message: 'Message not found.' });

    if (!process.env.SMTP_USER || process.env.SMTP_USER === 'your_email@gmail.com')
      return res.status(503).json({ message: 'SMTP is not configured yet. Add SMTP_USER and SMTP_PASS to your .env file.' });

    const profile = await Profile.findOne();
    const fromName = process.env.SMTP_FROM_NAME || profile?.name || 'Portfolio Admin';

    const transporter = createTransport();

    await transporter.sendMail({
      from: `"${fromName}" <${process.env.SMTP_USER}>`,
      to:   `"${msg.name}" <${msg.email}>`,
      subject: `Re: ${msg.subject || 'Your message'}`,
      text: replyText,
      html: `
        <div style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto">
          <p>${replyText.replace(/\n/g, '<br/>')}</p>
          <hr style="margin:24px 0;border:none;border-top:1px solid #e2e8f0"/>
          <blockquote style="border-left:3px solid #6366f1;padding-left:12px;color:#64748b;font-size:13px">
            <p><strong>Original message from ${msg.name}:</strong></p>
            <p>${msg.message}</p>
          </blockquote>
        </div>
      `,
    });

    // Mark as read after replying
    await Message.findByIdAndUpdate(req.params.id, { isRead: true });

    res.json({ success: true, message: `Reply sent to ${msg.email}` });
  } catch (err) {
    console.error('Reply email error:', err);
    res.status(500).json({ message: err.message || 'Failed to send reply.' });
  }
};

exports.deleteMessage = async (req, res) => {
  try { await Message.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); }
  catch (err) { res.status(500).json({ message: err.message }); }
};
