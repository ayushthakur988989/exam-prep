import React from 'react';
import { useNavigate } from 'react-router';

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="welcome-container" >
      <div className="welcome-content" >
        <h1 className="welcome-title">Welcome to Online Exam Prep</h1>
        <p className="welcome-subtitle">Please select your portal to login and continue</p>

        <div className="portal-cards">
          {/* Student Portal Card */}
          <div className="portal-card" onClick={() => navigate('/userlogin')}>
            <div className="portal-icon user-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <h3 className="portal-name">Student Portal</h3>
            <p className="portal-description">
              Access your scheduled examinations, take tests, and view attempt history.
            </p>
            <button className="portal-btn student-btn">Student Login &rarr;</button>
          </div>

          {/* Admin Portal Card */}
          <div className="portal-card" onClick={() => navigate('/adlogin')}>
            <div className="portal-icon admin-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </div>
            <h3 className="portal-name">Admin Portal</h3>
            <p className="portal-description">
              Manage questions, configure sessions, register examinees, and generate reports.
            </p>
            <button className="portal-btn admin-btn">Admin Login &rarr;</button>
          </div>
        </div>
      </div>
      <div className="welcome-footer">
        &copy; {new Date().getFullYear()} Online Exam Prep. All rights reserved.
      </div>
    </div>
  );
};

export default Welcome;
