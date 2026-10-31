const jwt   = require('jsonwebtoken');
const Admin = require('../models/Admin');

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorised — no token provided.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Verify the admin still exists in the database
    const admin = await Admin.findById(decoded.id).select('-password');
    if (!admin) {
      return res.status(401).json({ message: 'Not authorised — account no longer exists.' });
    }

    req.admin = admin;
    next();
  } catch (err) {
    // Covers: JsonWebTokenError, TokenExpiredError, NotBeforeError
    const msg = err.name === 'TokenExpiredError'
      ? 'Session expired. Please sign in again.'
      : 'Not authorised — invalid token.';
    return res.status(401).json({ message: msg });
  }
};

module.exports = { protect };
