import React from "react";
import { Outlet } from "react-router";

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const role = localStorage.getItem('role')
  if (role == "Admin") {
    var email = localStorage.getItem('adminEmail')
  }
  else {
    window.location.href = '/adlogin';
  }
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const handlelogout = () => {
    localStorage.removeItem('adminEmail')
    localStorage.removeItem('id')
    localStorage.removeItem('role')
    window.location.href = '/admindashboard'
  }
  return (
    <>
      {/* Sidebar Overlay */}
      <div className={`sidebar-overlay ${isSidebarOpen ? 'active' : ''}`} onClick={() => setIsSidebarOpen(false)}></div>

      {/* Dash-nav */}
      <div className="container-fluid g-0 py-0 my-0">
        <div className="Dash-nav">
          {/* Hamburger Toggle Button */}
          <button className="sidebar-toggle" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
          <h1>Admin Dashboard</h1>
        </div>

        {/* <!-- Sidebar --> */}
        <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
          <div className="sidebar-header">
            <h2>Admin</h2>
            {/* Close button inside sidebar */}
            <button className="sidebar-close" onClick={() => setIsSidebarOpen(false)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <a href="/admindashboard" onClick={() => setIsSidebarOpen(false)}>Dashboard Overview</a>
          <a href="/admindashboard/Session" onClick={() => setIsSidebarOpen(false)}>Sessions</a>
          <a href="/admindashboard/Subject" onClick={() => setIsSidebarOpen(false)}>Subjects</a>
          <a href="/admindashboard/Examination" onClick={() => setIsSidebarOpen(false)}>Examination</a>
          <a href="/admindashboard/Examinee" onClick={() => setIsSidebarOpen(false)}>Examinee</a>
          <a href="/admindashboard/Question" onClick={() => setIsSidebarOpen(false)}>Question Bank</a>
          <a href="/admindashboard/reportGeneration" onClick={() => setIsSidebarOpen(false)}>Reports</a>
          <a href="/admindashboard/adminchangepassword" onClick={() => setIsSidebarOpen(false)}>Change Password</a>
          <a onClick={() => { setIsSidebarOpen(false); handlelogout(); }} style={{ cursor: 'pointer' }}>Logout</a>
        </div>

        {/* <!-- Main Content --> */}
        <div className="main">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
