const express  = require('express');
const dotenv   = require('dotenv');
const cors     = require('cors');
const helmet   = require('helmet');
const morgan   = require('morgan');
const path     = require('path');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Security middleware
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));

// CORS — allow localhost + any Vercel deployment
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:4173',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
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

// Logging (dev only)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Portfolio API is running', status: 'ok' });
});

// ── Temp: force reset admin ───────────────────────────────────────────────────
app.get('/force-reset-admin', async (req, res) => {
  try {
    const Admin = require('./models/Admin');
    await Admin.deleteMany({});
    await Admin.create({ name:'Alebie Ayalew', email:'ayalewalebie@gmail.com', password:'Alex@2130' });
    res.json({ ok: true, message: 'Admin reset. Login with ayalewalebie@gmail.com / Alex@2130' });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// API Routes
app.use('/api/auth',   require('./routes/authRoutes'));
app.use('/api/public', require('./routes/publicRoutes'));
app.use('/api/admin',  require('./routes/adminRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
