const Admin = require('../models/Admin');
const jwt   = require('jsonwebtoken');

const generateToken = (admin) =>
  jwt.sign(
    { id: admin._id, name: admin.name, email: admin.email },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );

// POST /api/auth/login
exports.authAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: 'Email and password are required.' });

    const admin = await Admin.findOne({ email: email.trim().toLowerCase() });

    if (!admin || !(await admin.matchPassword(password)))
      return res.status(401).json({ message: 'Invalid email or password.' });

    res.json({
      _id:   admin._id,
      name:  admin.name,
      email: admin.email,
      token: generateToken(admin),
    });
  } catch {
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
};

// GET /api/auth/profile  (protected)
exports.getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id).select('-password');
    if (!admin) return res.status(404).json({ message: 'Admin not found.' });
    res.json({ _id: admin._id, name: admin.name, email: admin.email });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
