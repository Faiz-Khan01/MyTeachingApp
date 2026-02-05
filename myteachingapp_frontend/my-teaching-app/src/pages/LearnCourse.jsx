import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import API from '../api/axiosInstance';

const LearnCourse = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);

    useEffect(() => {
        API.get(`/courses/${id}`)
            .then(res => setCourse(res.data))
            .catch(() => {
                console.error("Error loading course content");
                navigate('/dashboard');
            });
    }, [id, navigate]);

    if (!course) {
        return (
            <div className="container mt-5 text-center py-5">
                <div className="spinner-border text-primary" role="status"></div>
                <p className="mt-3 fw-bold text-muted">Preparing your classroom... 📚</p>
            </div>
        );
    }

    return (
        <div className="container mt-4 mb-5">
            {/* Top Navigation */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <button 
                    onClick={() => navigate('/dashboard')} 
                    className="btn btn-outline-secondary btn-sm rounded-pill px-3 shadow-sm"
                >
                    ← Back to Dashboard
                </button>
                <span className="badge bg-success rounded-pill px-3 py-2 shadow-sm">
                    Status: Learning ✍️
                </span>
            </div>

            <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
                {/* Modern Header Section */}
                <div className="bg-primary p-5 text-white text-center">
                    <h1 className="display-6 fw-bold mb-2">{course.title} 🚀</h1>
                    <p className="lead opacity-75">Welcome back! Let's conquer this module today.</p>
                </div>

                {/* Main Content Area */}
                <div className="card-body p-lg-5 p-4">
                    <div className="row g-4">
                        {/* Video / Content Column */}
                        <div className="col-lg-8">
                            <h4 className="fw-bold mb-3">Today's Lesson 📺</h4>
                            <div 
                                className="ratio ratio-16x9 bg-dark rounded-4 mb-4 d-flex align-items-center justify-content-center border shadow-inner"
                                style={{ background: 'linear-gradient(45deg, #1a1a1a, #333)' }}
                            >
                                <div className="text-center text-white-50">
                                    <span className="fs-1 d-block mb-2">▶️</span>
                                    <p className="mb-0">Video Player Loading...</p>
                                </div>
                            </div>
                            
                            <div className="p-3 bg-light rounded-4">
                                <h5 className="fw-bold">About this module 📖</h5>
                                <p className="text-muted mb-0">{course.description}</p>
                            </div>
                        </div>
                        
                        {/* Progress / Sidebar Column */}
                        <div className="col-lg-4">
                            <h5 className="fw-bold mb-3 d-flex align-items-center">
                                Your Progress 📊
                            </h5>
                            <div className="list-group list-group-flush rounded-4 border shadow-sm overflow-hidden">
                                <button className="list-group-item list-group-item-action active py-3">
                                    <span className="me-2">✅</span> 1. Course Introduction
                                </button>
                                <button className="list-group-item list-group-item-action py-3">
                                    <span className="me-2">🔘</span> 2. Basic Principles
                                </button>
                                <button className="list-group-item list-group-item-action py-3">
                                    <span className="me-2">🔘</span> 3. Hands-on Project
                                </button>
                                <button className="list-group-item list-group-item-action py-3">
                                    <span className="me-2">🔘</span> 4. Final Assessment
                                </button>
                            </div>

                            <div className="card mt-4 border-0 bg-info bg-opacity-10 rounded-4">
                                <div className="card-body">
                                    <h6 className="fw-bold text-info">Need help? 🙋‍♂️</h6>
                                    <p className="small text-muted mb-0">Join our community Discord for instant support on this course.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LearnCourse;