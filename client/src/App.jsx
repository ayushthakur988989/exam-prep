import "./App.css";
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
// import Login0 from "./pages/Login0";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminHome from "./pages/admin/AdminHome";

import AdminLogin from "./pages/AdminLogin";
import Session from "./pages/admin/Session";
import Subject from "./pages/admin/Subject";
import Examination from "./pages/admin/Examination";
import Question from "./pages/admin/Question";
import Registration from "./pages/user/Registration";
import Ulogin from "./pages/user/Ulogin";
import UserDashboard from "./pages/user/UserDashboard";
import Welcome from "./pages/Welcome";
import MyExam from "./pages/user/MyExam";
import MyResult from "./pages/user/MyResult";
import Getexams from "./pages/user/Getexams";
import UserChangePassword from "./pages/user/UserChangePassword";
import AdminChangePassword from "./pages/admin/AdminChangepassword";
import ReportGeneration from "./pages/admin/ReportGeneration";
import Examinee from "./pages/admin/Examinee";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/registration" element={<Registration/>}></Route>
          <Route path="/" element={<Welcome />}></Route>
          <Route path="/userlogin" element={<Ulogin />}></Route>
          <Route path="/adlogin" element={<AdminLogin />}></Route>
          <Route path="/admindashboard" element={<AdminDashboard />}>
            <Route index element={<AdminHome />} />
            <Route path="Session" element={<Session />}></Route>
            <Route path="Subject" element={<Subject />}></Route>
            <Route path="adminchangepassword" element={<AdminChangePassword />}></Route>
            <Route path="Examination" element={<Examination />}></Route>
            <Route path="Question" element={<Question/>}></Route>
            <Route path="reportGeneration" element={<ReportGeneration/>}></Route>
            <Route path="Examinee" element={<Examinee/>}></Route>
          </Route>
          <Route path="/userdashboard" element={<UserDashboard/>}>
            <Route index element={<Navigate to="myexam" replace />} />
            <Route path="myexam" element={<MyExam/>}></Route>
            <Route path="getexams/:id" element={<Getexams/>}></Route>
            <Route path="myresult" element={<MyResult/>}></Route>
            <Route path="changepassword" element={<UserChangePassword/>}></Route>
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
