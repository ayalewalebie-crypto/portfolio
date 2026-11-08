const Admin = require('../models/Admin');

/**
 * Called once at server startup.
 * Creates the default admin in Atlas if none exists.
 */
const seedAdmin = async () => {
  try {
    const count = await Admin.countDocuments();
    if (count > 0) return; // admin already exists

    await Admin.create({
      name:     'Alebie Ayalew',
      email:    'ayalewalebie@gmail.com',
      password: 'Alex@2130',
    });
    console.log('✅ Default admin created in Atlas');
  } catch (e) {
    console.error('Admin seed error:', e.message);
  }
};

module.exports = seedAdmin;
