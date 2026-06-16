
require('dotenv').config();
const express = require('express');  // it work like a waiter
const cors= require('cors');         //data can be fetched from backend to frontend and vice_versa
const mongoose=require('mongoose');// ” It is specifically used to connect and interact with MongoDB database.
const app=express();  //express function start


app.use(cors()); //ye data ko backend aur frontend me aane jaane deta hai
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
// app.use('/api/admindashboardhome/',require('./routes/adminDashboardRoute'));
// app.use('/api/adminchangepassword/',require('./routes/adminchangepassword'));


//http://localhost:5000/api/admin

//api end

const PORT = process.env.PORT || 5000;
app.listen(PORT,()=>{
    console.log(`server is running on http://localhost:${PORT}/`)
})