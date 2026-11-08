const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Security middleware
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

// Enable CORS
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:4173',
  process.env.FRONTEND_URL, // set this in Render env vars
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── ONE-TIME setup route — creates admin in Atlas ────────────────────────────
// Visit: https://your-render-url.onrender.com/setup-admin-x9k2
let adminSeeded = false;
app.get('/setup-admin-x9k2', async (req, res) => {
  if (adminSeeded) return res.json({ message: 'Already done.' });
  try {
    const Admin = require('./models/Admin');
    const existing = await Admin.findOne({ email: 'ayalewalebie@gmail.com' });
    if (existing) {
      adminSeeded = true;
      return res.json({ message: 'Admin already exists — login works!' });
    }
    await Admin.create({
      name:     'Alebie Ayalew',
      email:    'ayalewalebie@gmail.com',
      password: 'Alex@2130',
    });
    adminSeeded = true;
    res.json({ message: '✅ Admin created! You can now login.' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Basic route
app.get('/', (req, res) => {
  res.send('Portfolio API is running...');
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/public', require('./routes/publicRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Error handler middleware (to be created)
// app.use(require('./middleware/error'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
