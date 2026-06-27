require('dotenv').config();
const express = require('express');  // it work like a waiter
const cors= require('cors');         //data can be fetched from backend to frontend and vice_versa
const mongoose=require('mongoose');// " It is specifically used to connect and interact with MongoDB database.
const app=express();  //express function start


// Configure CORS to allow production Vercel frontend and local development origins
const allowedOrigins = [
  'https://exam-prep-tau-five.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:5000'
];

app.use(cors({
  origin: true, // Allows all origins dynamically (great for easy deployment on Vercel/Netlify)
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
const URL = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/exam_prep'// mongodb me connection stablish ker rha hai aur 'exam_prep' name ka database bna rha hai
mongoose.connect(URL)
    .then(()=>{  //ye is liye hai ki future me connect hoga to print krega 
        console.log("MongoDb is connected")
    })
    .catch((er)=>{ // agar error hoga to error dega ki kahan error hai
        console.log(er)
    })
//api started
app.use('/api/admin',require('./routes/adminRoute'))
app.use('/api/session/',require('./routes/sessionRoute'));
app.use('/api/subject/',require('./routes/subjectRoute'));
app.use('/api/exams/',require('./routes/examinationRoute'));
app.use('/api/question/',require('./routes/questionBankRoute'));
app.use('/api/examinee/',require('./routes/examineeRoutes'));
app.use('/api/admindashboard', require('./routes/adminDashboardRoute'));
// app.use('/api/adminchangepassword/',require('./routes/adminchangepassword'));


//http://localhost:5000/api/admin

//api end

// --- AUTO SEED LOGIC ---
const Admin = require('./models/Admin');
const Examinee = require('./models/Examinee');
const Session = require('./models/Session');

const autoSeed = async () => {
  try {
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      console.log('Database is empty. Seeding initial data...');
      let session = await Session.findOne({ name: '2024-2025' });
      if (!session) {
        session = await Session.create({ name: '2024-2025' });
      }
      await Admin.create({ name: 'Super Admin', email: 'admin@examprep.com', password: 'admin123' });
      await Examinee.create({
        name: 'Test Student', email: 'user@examprep.com', college: 'Test College',
        course: 'B.Tech', branch: 'Computer Science', phone: '9876543210',
        session: session._id, password: 'user123', status: 'active'
      });
      console.log('Database seeded automatically.');
    }
  } catch (error) {
    console.error('Error auto-seeding:', error);
  }
};
autoSeed();
// --- END AUTO SEED ---

const PORT = process.env.PORT || 5000;
app.listen(PORT,()=>{
    console.log(`server is running on http://localhost:${PORT}/`)
})