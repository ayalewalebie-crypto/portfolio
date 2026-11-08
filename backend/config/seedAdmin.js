const Admin = require('../models/Admin');

const seedAdmin = async () => {
  try {
    const count = await Admin.countDocuments();
    if (count > 0) {
      console.log('ℹ️  Admin already exists in Atlas');
      return;
    }
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
