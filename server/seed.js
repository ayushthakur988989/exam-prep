/**
 * 🌱 Seed Script - Creates default Admin and User accounts in MongoDB
 * 
 * Run: node seed.js
 * 
 * This will create:
 *   Admin  → email: admin@examprep.com   password: admin123
 *   User   → email: user@examprep.com    password: user123
 *   Session → "2024-2025" (needed for user registration)
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/Admin');
const Examinee = require('./models/Examinee');
const Session = require('./models/Session');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/exam_prep';

async function seed() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    console.log('   URI:', MONGO_URI);
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB!\n');

    // ─── 1. Seed a Session (needed for Examinee) ──────────────────────────
    let session = await Session.findOne({ name: '2024-2025' });
    if (!session) {
      session = await Session.create({ name: '2024-2025' });
      console.log('📅 Session created: 2024-2025');
    } else {
      console.log('📅 Session already exists: 2024-2025');
    }

    // ─── 2. Seed Admin ────────────────────────────────────────────────────
    const adminEmail = 'admin@examprep.com';
    const existingAdmin = await Admin.findOne({ email: adminEmail });
    if (!existingAdmin) {
      await Admin.create({
        name: 'Super Admin',
        email: adminEmail,
        password: 'admin123',
      });
      console.log('👤 Admin created:');
      console.log('   Email:    admin@examprep.com');
      console.log('   Password: admin123');
    } else {
      console.log('👤 Admin already exists: admin@examprep.com');
    }

    // ─── 3. Seed User (Examinee) ──────────────────────────────────────────
    const userEmail = 'user@examprep.com';
    const existingUser = await Examinee.findOne({ email: userEmail });
    if (!existingUser) {
      await Examinee.create({
        name: 'Test Student',
        email: userEmail,
        college: 'Test College',
        course: 'B.Tech',
        branch: 'Computer Science',
        phone: '9876543210',
        session: session._id,
        password: 'user123',
        status: 'active',
      });
      console.log('🎓 User (Examinee) created:');
      console.log('   Email:    user@examprep.com');
      console.log('   Password: user123');
    } else {
      console.log('🎓 User already exists: user@examprep.com');
    }

    console.log('\n🎉 Seeding complete! You can now log in with these credentials.');
    console.log('\n   Admin Login → http://localhost:5173/adlogin');
    console.log('   User Login  → http://localhost:5173/userlogin');

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('\n❌ Seeding FAILED:', err.message);

    if (err.message.includes('ECONNREFUSED')) {
      console.log('\n🔧 MongoDB is NOT running! Fix it by:');
      console.log('   1. Press Win+R → type "services.msc" → Enter');
      console.log('   2. Find "MongoDB Server" in the list');
      console.log('   3. Right-click → Start');
      console.log('   4. Then run this script again: node seed.js');
    }

    await mongoose.disconnect().catch(() => {});
    process.exit(1);
  }
}

seed();
