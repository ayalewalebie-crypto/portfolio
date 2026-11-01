const path          = require('path');
const fs            = require('fs');
const Project       = require('../models/Project');
const Profile       = require('../models/Profile');
const Skill         = require('../models/Skill');
const Experience    = require('../models/Experience');
const Education     = require('../models/Education');
const Certification = require('../models/Certification');
const NetworkingLab = require('../models/NetworkingLab');
const Document      = require('../models/Document');
const Message       = require('../models/Message');

const ok  = (res, data) => {
  // Prevent browser/proxy caching so social links update immediately
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.json(data);
};
const err = (res, e)    => res.status(500).json({ message: e.message });

exports.getPublicProfile        = async (req, res) => { try { ok(res, await Profile.findOne({ isPublished: true }) || {}); } catch(e){ err(res,e); } };
exports.getPublicProjects       = async (req, res) => { try { ok(res, await Project.find({ isPublished: true }).sort('order')); } catch(e){ err(res,e); } };
exports.getPublicSkills         = async (req, res) => { try { ok(res, await Skill.find({ isPublished: true }).sort('order')); } catch(e){ err(res,e); } };
exports.getPublicExperience     = async (req, res) => { try { ok(res, await Experience.find({ isPublished: true }).sort('-startDate')); } catch(e){ err(res,e); } };
exports.getPublicEducation      = async (req, res) => { try { ok(res, await Education.find({ isPublished: true }).sort('-startDate')); } catch(e){ err(res,e); } };
exports.getPublicCertifications = async (req, res) => { try { ok(res, await Certification.find({ isPublished: true }).sort('order')); } catch(e){ err(res,e); } };
exports.getPublicLabs           = async (req, res) => { try { ok(res, await NetworkingLab.find({ isPublished: true }).sort('order')); } catch(e){ err(res,e); } };

exports.getPublicStats = async (req, res) => {
  try {
    const [projectsCount, skillsCount, certificationsCount, profile] = await Promise.all([
      Project.countDocuments({ isPublished: true }),
      Skill.countDocuments({ isPublished: true }),
      Certification.countDocuments({ isPublished: true }),
      Profile.findOne({ isPublished: true }).select('yearsExp'),
    ]);
    ok(res, {
      yearsExp:         profile?.yearsExp || 0,
      projectsCount,
      skillsCount,
      certificationsCount,
    });
  } catch(e){ err(res,e); }
};

exports.getPublicCV = async (req, res) => {
  try {
    const profile = await Profile.findOne({ isPublished: true }).populate('cvDocument');
    let cv = profile?.cvDocument;
    if (!cv) {
      cv = await Document.findOne({ type: 'CV', isPublished: true }).sort('-createdAt');
    }
    ok(res, cv || null);
  } catch(e){ err(res,e); }
};

exports.downloadPublicCV = async (req, res) => {
  try {
    const profile = await Profile.findOne({ isPublished: true }).populate('cvDocument');
    let cv = profile?.cvDocument;
    if (!cv) {
      cv = await Document.findOne({ type: 'CV', isPublished: true }).sort('-createdAt');
    }
    if (!cv) return res.status(404).json({ message: 'No CV uploaded yet.' });
    const filePath = path.join(__dirname, '..', 'uploads', cv.filename);
    if (!fs.existsSync(filePath)) return res.status(404).json({ message: 'CV file not found on server.' });

    const downloadName = cv.name ? (cv.name.endsWith('.pdf') ? cv.name : `${cv.name}.pdf`) : 'Abrham_Desalegn_CV.pdf';
    res.download(filePath, downloadName);
  } catch(e){ err(res,e); }
};

exports.submitMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) return res.status(400).json({ message: 'Name, email, and message are required.' });
    await Message.create({ name, email, subject, message });
    res.status(201).json({ success: true, message: 'Message received. Thank you!' });
  } catch(e){ err(res,e); }
};

exports.aiChat = async (req, res) => {
  try {
    const { message: userMsg } = req.body;
    if (!userMsg || typeof userMsg !== 'string') return res.status(400).json({ message: 'Message is required.' });
    const q = userMsg.toLowerCase().trim();

    const [profile, skills, experiences, educations, certifications, projects, achievements, labs] = await Promise.all([
      Profile.findOne({ isPublished: true }),
      Skill.find({ isPublished: true }).sort('order'),
      Experience.find({ isPublished: true }).sort('-startDate'),
      Education.find({ isPublished: true }).sort('-startDate'),
      Certification.find({ isPublished: true }).sort('order'),
      Project.find({ isPublished: true }).sort('order'),
      Achievement.find({ isPublished: true }).sort('order'),
      NetworkingLab.find({ isPublished: true }).sort('order'),
    ]);

    let reply = '';

    if (/^(hi|hello|hey|good\s*(morning|afternoon|evening)|howdy|greetings)/.test(q)) {
      reply = `Hello! 👋 I'm the AI assistant for **${profile?.name || 'this portfolio'}**. Ask me about skills, projects, experience, education, certifications, networking labs, or contact info!`;
    } else if (/who (are you|is (this|he|she|they))|introduce|tell me about (yourself|him|her|them|the owner)/.test(q)) {
      reply = profile ? `**${profile.name}** — ${profile.title}. ${profile.introduction || ''} ${profile.location ? `Based in ${profile.location}.` : ''}` : `A professional portfolio showcasing skills, projects, and background.`;
    } else if (/about|background|bio|story/.test(q)) {
      reply = profile?.about ? `About ${profile.name}: ${profile.about}` : `Check the About section for more info!`;
    } else if (/skill|tech|technolog|stack|proficient|good at/.test(q)) {
      if (skills.length > 0) {
        const g = skills.reduce((a, s) => { (a[s.category] = a[s.category] || []).push(s.name); return a; }, {});
        reply = `**${profile?.name || 'They'}** is skilled in:\n\n${Object.entries(g).map(([c,n]) => `**${c}**: ${n.join(', ')}`).join('\n')}`;
      } else reply = `Skills include React, Node.js, MongoDB, Tailwind CSS, Express.js, networking, and more.`;
    } else if (/experience|work|job|position|role|career|compan|internship/.test(q)) {
      if (experiences.length > 0) {
        reply = `Work experience:\n\n${experiences.map(e => `• **${e.title}** at ${e.company} (${e.current ? 'Present' : new Date(e.endDate).getFullYear()})`).join('\n')}`;
      } else reply = `Currently focused on academic and freelance project work.`;
    } else if (/educat|study|universit|degree|school/.test(q)) {
      if (educations.length > 0) {
        reply = `Education:\n\n${educations.map(e => `• **${e.degree}** — ${e.institution} (${new Date(e.startDate).getFullYear()}–${e.current ? 'Present' : new Date(e.endDate).getFullYear()})`).join('\n')}`;
      } else reply = `Studying Information Systems at Bahir Dar University.`;
    } else if (/certif|badge|credential/.test(q)) {
      if (certifications.length > 0) {
        reply = `Certifications:\n\n${certifications.map(c => `• **${c.name}** — ${c.issuer}`).join('\n')}`;
      } else reply = `Check the Certifications section on this page!`;
    } else if (/achievement|award|honor|prize|recognition/.test(q)) {
      if (achievements.length > 0) {
        reply = `Achievements:\n\n${achievements.map(a => `• **${a.title}**${a.issuer ? ` — ${a.issuer}` : ''}`).join('\n')}`;
      } else reply = `Check the Achievements section for awards and recognitions!`;
    } else if (/network|lab|cisco|packet tracer|topology|router|switch/.test(q)) {
      if (labs.length > 0) {
        reply = `Networking labs:\n\n${labs.map(l => `• **${l.title}**${l.technologies?.length ? ` (${l.technologies.slice(0,3).join(', ')})` : ''}`).join('\n')}`;
      } else reply = `Networking lab work includes Cisco Packet Tracer simulations, campus network design, and routing configurations.`;
    } else if (/project|build|built|creat|develop|app/.test(q)) {
      if (projects.length > 0) {
        reply = `Key projects:\n\n${projects.slice(0,5).map(p => `• **${p.title}**${p.technologies?.length ? ` (${p.technologies.slice(0,3).join(', ')})` : ''}`).join('\n')}\n\nSee the Projects section for full details!`;
      } else reply = `Check the Projects section for full-stack apps, IoT systems, and more!`;
    } else if (/contact|email|reach|hire|connect|linkedin|github|telegram/.test(q)) {
      const lines = [];
      if (profile?.email)    lines.push(`📧 ${profile.email}`);
      if (profile?.linkedin) lines.push(`💼 LinkedIn: ${profile.linkedin}`);
      if (profile?.github)   lines.push(`💻 GitHub: ${profile.github}`);
      if (profile?.telegram) lines.push(`✈️ Telegram: @${profile.telegram}`);
      reply = lines.length ? `Reach **${profile?.name || 'them'}** via:\n\n${lines.join('\n')}` : `Use the Contact section to send a message!`;
    } else if (/availab|hire|freelanc|open to|opportunit/.test(q)) {
      reply = `**${profile?.name || 'They'}** is open to new projects, freelance work, and full-time roles. ${profile?.email ? `Reach out at ${profile.email}` : 'Use the contact form!'}`;
    } else if (/cv|resume|download/.test(q)) {
      reply = `A CV is available to view in the CV section of this portfolio. Contact directly for a downloadable copy.`;
    } else if (/where|locat|based|country|city/.test(q)) {
      reply = profile?.location ? `**${profile?.name || 'They'}** is based in **${profile.location}**.` : `Location info isn't currently listed.`;
    } else {
      reply = `I can answer questions about **skills**, **experience**, **education**, **projects**, **certifications**, **networking labs**, **achievements**, and **contact info**. What would you like to know?`;
    }

    res.json({ reply });
  } catch(e) {
    console.error('AI Chat error:', e);
    res.status(500).json({ reply: 'Sorry, something went wrong. Please try again!' });
  }
};
