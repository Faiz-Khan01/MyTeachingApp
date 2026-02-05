
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
import CourseCard from '../components/CourseCard';
import toast from 'react-hot-toast';

const Dashboard = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    
    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [courseToRemove, setCourseToRemove] = useState(null);
    const [isRemoving, setIsRemoving] = useState(false);

    const openConfirmModal = (courseId) => {
        setCourseToRemove(courseId);
        setShowModal(true);
    };

    const handleRemove = async () => {
        if (!courseToRemove) return;
        
        setIsRemoving(true);
        try {
            await API.delete(`/users/unenroll/${courseToRemove}`);
            
            // Update UI list
            setEnrolledCourses(prev => prev.filter(c => c.id !== courseToRemove));
            
            // Update profile stats locally
            setProfile(prev => ({
                ...prev, 
                enrolledCoursesCount: (prev.enrolledCoursesCount || 1) - 1
            }));
            
            toast.success("Successfully removed from Hub");
        } catch (error) {
            console.error("Delete failed:", error);
            toast.error("Failed to remove course. Please try again.");
        } finally {
            setIsRemoving(false);
            setShowModal(false);
            setCourseToRemove(null);
        }
    };

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [profileRes, coursesRes] = await Promise.all([
                    API.get('/users/me'),
                    API.get('/users/me/courses')
                ]);
                setProfile(profileRes.data);
                setEnrolledCourses(coursesRes.data);
            } catch (error) {
                console.error("Data fetch failed", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center min-vh-100">
            <div className="spinner-grow text-primary" role="status"></div>
        </div>
    );

    return (
        <div className="min-vh-100 bg-light pb-5">
            {/* Custom Modal Overlay */}
            {showModal && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 1060 }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
                            <div className="modal-body p-5 text-center">
                                <div className="mb-4 text-danger">
                                    <i className="bi bi-trash3" style={{ fontSize: '3.5rem' }}></i>
                                </div>
                                <h4 className="fw-bold text-dark">Remove Course?</h4>
                                <p className="text-muted">This will remove the course from your learning hub. You'll need to re-enroll to access it again.</p>
                                
                                <div className="d-flex gap-3 justify-content-center mt-4">
                                    <button 
                                        className="btn btn-light rounded-pill px-4 fw-semibold" 
                                        onClick={() => setShowModal(false)}
                                        disabled={isRemoving}
                                    >
                                        Keep It
                                    </button>
                                    <button 
                                        className="btn btn-danger rounded-pill px-4 fw-semibold d-flex align-items-center gap-2" 
                                        onClick={handleRemove}
                                        disabled={isRemoving}
                                    >
                                        {isRemoving ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm"></span>
                                                Removing...
                                            </>
                                        ) : "Yes, Remove"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ... Rest of your Navbar and Layout ... */}
            <div className="container mt-4">
                <div className="row g-4">
                    {/* Profile Section */}
                    <div className="col-lg-4">
                        <div className="card border-0 shadow-sm rounded-4 text-center p-4">
                             <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" 
                                  style={{width: '80px', height: '80px', fontSize: '2rem'}}>
                                {profile?.username?.charAt(0)}
                             </div>
                             <h5 className="fw-bold">{profile?.username}</h5>
                             <p className="text-muted small">{profile?.email}</p>
                        </div>
                    </div>

                    {/* Courses List */}
                    <div className="col-lg-8">
                        <div className="card border-0 shadow-sm rounded-4 p-4">
                            <h5 className="fw-bold mb-4">My Enrolled Courses</h5>
                            <div className="row g-3">
                                {enrolledCourses.map(course => (
                                    <div key={course.id} className="col-md-6">
                                        <CourseCard 
                                            course={course} 
                                            isEnrolled={true} 
                                            onRemove={() => openConfirmModal(course.id)} 
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;