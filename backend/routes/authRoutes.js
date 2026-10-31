const express   = require('express');
const rateLimit = require('express-rate-limit');
const router    = express.Router();
const { authAdmin, getAdminProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Rate limiter — only active in production
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max:      process.env.NODE_ENV === 'production' ? 10 : 100,
  standardHeaders: true,
  legacyHeaders:   false,
  skipSuccessfulRequests: true,
  message: { message: 'Too many login attempts. Please wait 15 minutes and try again.' },
});

router.post('/login',   loginLimiter, authAdmin);
router.get ('/profile', protect, getAdminProfile);

module.exports = router;
