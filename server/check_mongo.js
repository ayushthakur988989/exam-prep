// Quick diagnostic script to check MongoDB connection
const mongoose = require('mongoose');
require('dotenv').config();

const URL = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/exam_prep';

console.log('🔍 Checking MongoDB connection...');
console.log('   Connection string:', URL);

mongoose.connect(URL, { serverSelectionTimeoutMS: 5000 })
  .then(async () => {
    console.log('✅ MongoDB is CONNECTED and working!');
    
    // List existing databases
    const admin = mongoose.connection.db.admin();
    const dbs = await admin.listDatabases();
    console.log('\n📂 Existing databases:');
    dbs.databases.forEach(db => console.log(`   - ${db.name} (${(db.sizeOnDisk / 1024).toFixed(1)} KB)`));
    
    // Check exam_prep collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('\n📋 Collections in exam_prep:');
    if (collections.length === 0) {
      console.log('   (none yet - database is empty)');
    } else {
      for (const col of collections) {
        const count = await mongoose.connection.db.collection(col.name).countDocuments();
        console.log(`   - ${col.name}: ${count} documents`);
      }
    }
    
    await mongoose.disconnect();
    process.exit(0);
  })
  .catch((err) => {
    console.log('❌ MongoDB connection FAILED!');
    console.log('   Error:', err.message);
    console.log('\n🔧 DIAGNOSIS:');
    
    if (err.message.includes('ECONNREFUSED')) {
      console.log('   MongoDB server is NOT running on your machine.');
      console.log('\n   FIX OPTIONS:');
      console.log('   1. Open Windows Services (Win+R → services.msc) → Find "MongoDB Server" → Right-click → Start');
      console.log('   2. Or open CMD as Administrator and run: net start MongoDB');
      console.log('   3. If MongoDB is not installed, download from: https://www.mongodb.com/try/download/community');
      console.log('   4. Or use MongoDB Atlas (cloud) - update MONGO_URI in .env file');
    } else if (err.message.includes('authentication')) {
      console.log('   MongoDB requires authentication. Check your MONGO_URI credentials.');
    } else {
      console.log('   Unknown error. Check if MongoDB is properly installed.');
    }
    
    process.exit(1);
  });
