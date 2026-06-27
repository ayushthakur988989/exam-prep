import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminHome = () => {
    const [data, setData] = useState({
        totalExams: 0,
        totalExaminees: 0,
        totalSubject: 0,
        totalQuestions: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const handleFetch = async () => { 
        try {
            setLoading(true);
            const res = await axios.get('https://exam-prep-1v8x.onrender.com/api/admindashboard');
            setData(res.data);
            setError('');
        } catch (err) {
            console.error(err);
            setError('Failed to fetch dashboard statistics.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        handleFetch();
    }, []);

    const stats = [
        {
            title: "Total Examinations",
            value: data.totalExams,
            icon: "📝",
            color: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            desc: "Active & scheduled exams"
        },
        {
            title: "Registered Examinees",
            value: data.totalExaminees,
            icon: "👥",
            color: "linear-gradient(135deg, #2af598 0%, #009efd 100%)",
            desc: "Active student accounts"
        },
        {
            title: "Subjects Offered",
            value: data.totalSubject,
            icon: "📚",
            color: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)",
            textColor: "#4a5568",
            desc: "Courses & departments"
        },
        {
            title: "Question Bank",
            value: data.totalQuestions,
            icon: "💡",
            color: "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
            textColor: "#4a5568",
            desc: "Pool of active questions"
        }
    ];

    return (
        <div className="container-fluid py-4">
            {/* Header section */}
            <div className="p-4 mb-4 text-white rounded-3 shadow-sm" style={{ background: 'linear-gradient(135deg, #4f46e5, #4d2a6e)' }}>
                <h1 className="display-6 fw-bold m-0">System Overview</h1>
                <p className="col-md-8 fs-6 mt-2 mb-0 opacity-75">
                    Real-time monitoring of examinees, active sessions, exam question pools, and overall system status.
                </p>
            </div>

            {error && (
                <div className="alert alert-danger" role="alert">
                    ⚠️ {error}
                </div>
            )}

            {/* Stats Cards Grid */}
            <div className="row g-4">
                {stats.map((stat, idx) => (
                    <div className="col-12 col-sm-6 col-xl-3" key={idx}>
                        <div 
                            className="card border-0 h-100 shadow-sm position-relative overflow-hidden" 
                            style={{ 
                                background: stat.color, 
                                color: stat.textColor || 'white',
                                borderRadius: '15px',
                                transition: 'all 0.3s ease',
                                cursor: 'default'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-5px)';
                                e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.15)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 3px 6px rgba(0,0,0,0.1)';
                            }}
                        >
                            <div className="card-body p-4 d-flex flex-column justify-content-between">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h6 className="card-title text-uppercase m-0 fw-bold opacity-75" style={{ fontSize: '0.85rem', letterSpacing: '0.5px' }}>
                                        {stat.title}
                                    </h6>
                                    <span style={{ fontSize: '1.8rem' }}>{stat.icon}</span>
                                </div>
                                <div>
                                    <h2 className="display-5 fw-bold mb-1">
                                        {loading ? (
                                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                        ) : (
                                            stat.value
                                        )}
                                    </h2>
                                    <p className="card-text small m-0 opacity-75">{stat.desc}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Actions Panel */}
            <div className="card border-0 shadow-sm mt-4 p-4" style={{ borderRadius: '15px' }}>
                <h4 className="fw-bold mb-3">Quick Navigation</h4>
                <div className="row g-3">
                    <div className="col-6 col-md-3">
                        <a href="/admindashboard/Session" className="btn btn-outline-primary w-100 py-3 fw-semibold">
                            📅 Manage Sessions
                        </a>
                    </div>
                    <div className="col-6 col-md-3">
                        <a href="/admindashboard/Subject" className="btn btn-outline-primary w-100 py-3 fw-semibold">
                            📚 Manage Subjects
                        </a>
                    </div>
                    <div className="col-6 col-md-3">
                        <a href="/admindashboard/Examination" className="btn btn-outline-primary w-100 py-3 fw-semibold">
                            📝 Manage Exams
                        </a>
                    </div>
                    <div className="col-6 col-md-3">
                        <a href="/admindashboard/Question" className="btn btn-outline-primary w-100 py-3 fw-semibold">
                            💡 Question Bank
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminHome;