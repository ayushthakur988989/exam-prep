import React from 'react'
import { Outlet } from 'react-router'

const UserDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    localStorage.removeItem('id');
    localStorage.removeItem('role');
    window.location.href = '/';
  };

  return (
    <>
      {/* Sidebar Overlay */}
      <div className={`sidebar-overlay ${isSidebarOpen ? 'active' : ''}`} onClick={() => setIsSidebarOpen(false)}></div>

      {/* Dash-nav */}
      <div className="container-fluid g-0 ">
        <div className="Dash-nav d-flex align-items-center justify-content-between px-3">
          <div className="d-flex align-items-center">
            {/* Hamburger Toggle Button */}
            <button className="sidebar-toggle me-3" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
            <div className="div1 text-sm-start py-3"><h3 className="m-0 text-white">Good Morning</h3></div>
          </div>
          <div className="div2 text-sm-end py-3"><h1 className="m-0 text-white">user Dashboard</h1></div>
        </div>

        {/* <!-- Sidebar --> */}
        <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
          <div className="sidebar-header">
            <h2>Exam Prep</h2>
            {/* Close button inside sidebar */}
            <button className="sidebar-close" onClick={() => setIsSidebarOpen(false)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <a href="/userdashboard/myexam" onClick={() => setIsSidebarOpen(false)}>My Exams</a>
          <a href="/userdashboard/myresult" onClick={() => setIsSidebarOpen(false)}>My Results</a>
          <a href="/userdashboard/changepassword" onClick={() => setIsSidebarOpen(false)}>Change Password</a>
          <a href="#" onClick={(e) => { e.preventDefault(); setIsSidebarOpen(false); handleLogout(); }}>Logout</a>
        </div>

        {/* <!-- Main Content --> */}
        <div className="main">
          <Outlet/>
        </div>
        
      </div>
    </>
  );
};

export default UserDashboard