import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
import PaymentModal from '../components/PaymentModal';
import toast from 'react-hot-toast';
import { formatCoursePrice } from '../api/razorpay';

const CourseDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [enrolled, setEnrolled] = useState(false);
    const [relatedCourses, setRelatedCourses] = useState([]);
    const [showPaymentModal, setShowPaymentModal] = useState(false);

    // Fetch course details
    useEffect(() => {
        setLoading(true);
        API.get(`/courses/${id}`)
            .then(res => {
                setCourse(res.data);
                setLoading(false);

                // Fetch related courses after course loads
                API.get(`/courses/related/${res.data.id}`)
                    .then(resp => setRelatedCourses(resp.data))
                    .catch(() => setRelatedCourses([]));
            })
            .catch(() => {
                toast.error("Course not found");
                navigate('/');
            });

        // Check if user is already enrolled
        API.get(`/courses/${id}/enrolled`)
            .then(res => setEnrolled(res.data))
            .catch(() => setEnrolled(false));
    }, [id, navigate]);

       // Handle enrollment
      const handleEnroll = async () => {
        if (!user) {
            toast.error('Please login to enroll');
            navigate('/login');
            return;
        }
        setShowPaymentModal(true);
    };

    const handlePaymentSuccess = async (paymentData) => {
        try {
            // Call enrollment endpoint after successful payment
            const response = await API.post(`/users/enroll/${id}`, {
                paymentId: paymentData.paymentId,
                razorpayOrderId: paymentData.orderId,
                razorpaySignature: paymentData.signature,
            });
            
            toast.success(response.data || "Enrolled Successfully!");
            setEnrolled(true);
            setShowPaymentModal(false);
        } catch (err) {
            const errorMsg = err.response?.data || "Enrollment failed.";
            toast.error(typeof errorMsg === 'string' ? errorMsg : "Enrollment failed.");
        }
    };

    // Insert the guard 
    if (loading || !course) {
        return (
            <div className="d-flex justify-content-center align-items-center min-vh-100">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <h4 className="ms-3 text-muted">Loading course details...</h4>
            </div>
        );
    }


    return (
        <>
            <div className="bg-light min-vh-100">
            {/* Hero Header */}
            <div className="bg-dark text-white py-5 mb-5">
                <div className="container px-4">
                    <button onClick={() => navigate(-1)} className="btn btn-outline-light btn-sm mb-4 rounded-pill px-3">
                        ← Back to Courses
                    </button>
                    <div className="row align-items-center">
                        <div className="col-lg-8">
                            <h1 className="display-4 fw-bold mb-3">{course.title}</h1>
                            <p className="lead opacity-75 mb-4">{course.description}</p>
                            <div className="d-flex align-items-center gap-3 mb-3">
                                <span className="badge bg-primary px-3 py-2">Bestseller</span>
                                <span>Instructed by <strong>{course.instructorName}</strong></span>
                            </div>

                            {/* Instructor Profile (Conditional) */}
                            {course.instructor_profile && (
                                <div className="d-flex align-items-center gap-3 mt-4 p-3 bg-secondary bg-opacity-10 rounded-3" style={{ maxWidth: '400px' }}>
                                    <img 
                                        src={course.instructor_profile.image || "https://via.placeholder.com/60"} 
                                        alt={course.instructorName} 
                                        className="rounded-circle border border-2 border-primary" 
                                        style={{ width: '60px', height: '60px', objectFit: 'cover' }} 
                                    />
                                    <div>
                                        <h6 className="mb-0">{course.instructorName}</h6>
                                        <small className="text-light opacity-75">{course.instructor_profile.bio}</small>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="col-lg-4 text-center mt-4 mt-lg-0">
                            <img 
                                // UPDATED: Changed .image to .imageUrl
                                src={course.imageUrl || "https://images.unsplash.com/photo-1498050108023-c5249f4df085"} 
                                alt={course.title} 
                                className="img-fluid rounded-4 shadow-lg border border-secondary border-opacity-25"
                                style={{ maxHeight: '300px', width: '100%', objectFit: 'cover' }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content & Sidebar */}
            <div className="container px-4 pb-5">
                <div className="row g-4">
                    <div className="col-lg-8">
                        <div className="card border-0 shadow-sm p-4 mb-4 rounded-4">
                            <h3 className="fw-bold mb-4">What you'll learn</h3>
                            <div className="row g-3">
                                {["Industry Standard Practices", "Hands-on Projects", "Certification Ready", "Life-time Access"].map((item, i) => (
                                    <div key={i} className="col-md-6 d-flex align-items-center gap-2">
                                        <span className="text-success fw-bold">✓</span> {item}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Related Courses Section */}
                        {relatedCourses.length > 0 && (
                            <div className="mt-5">
                                <h4 className="fw-bold mb-4">Related Courses</h4>
                                <div className="row g-3">
                                    {relatedCourses.map(rc => (
                                        <div key={rc.id} className="col-md-6">
                                            {/* UPDATED: Path matches App.js route */}
                                            <Link to={`/course/${rc.id}`} className="text-decoration-none">
                                                <div className="card h-100 shadow-sm border-0 rounded-3 overflow-hidden">
                                                    <img 
                                                        // UPDATED: Changed .image to .imageUrl
                                                        src={rc.imageUrl || "https://images.unsplash.com/photo-1498050108023-c5249f4df085"} 
                                                        alt={rc.title} 
                                                        className="card-img-top" 
                                                        style={{ height: '160px', objectFit: 'cover' }}
                                                    />
                                                    <div className="card-body p-3">
                                                        <h6 className="fw-bold text-dark mb-1">{rc.title}</h6>
                                                        <small className="text-muted">{rc.instructorName}</small>
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar Sticky Card */}
                    <div className="col-lg-4">
                        <div className="card border-0 shadow-lg sticky-top rounded-4 overflow-hidden" style={{ top: '100px', zIndex: '10' }}>
                            <div className="card-body p-4 text-center">
                                <h2 className="fw-bold mb-3">{formatCoursePrice(course.price)}</h2>
                                <button 
                                    onClick={handleEnroll} 
                                    className={`btn btn-lg w-100 fw-bold mb-3 shadow-sm py-3 rounded-pill ${enrolled ? 'btn-success' : 'btn-primary'}`}
                                    disabled={enrolled}
                                >
                                    {enrolled ? (
                                        <>
                                            <i className="bi bi-check-circle me-2"></i>
                                            Already Enrolled
                                        </>
                                    ) : (
                                        <>
                                            <i className="bi bi-credit-card me-2"></i>
                                            Enroll Now
                                        </>
                                    )}
                                </button>
                                <p className="small text-muted mb-0">30-Day Money-Back Guarantee</p>
                                <hr className="my-3 text-muted opacity-25" />
                                <ul className="text-start small list-unstyled ps-2 mb-0">
                                    <li className="mb-2">📱 Access on mobile and TV</li>
                                    <li className="mb-2">📜 Certificate of completion</li>
                                    <li>♾️ Full lifetime access</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Payment Modal */}
            <PaymentModal
                course={course}
                user={user}
                isOpen={showPaymentModal}
                onClose={() => setShowPaymentModal(false)}
                onPaymentSuccess={handlePaymentSuccess}
            />
            </div>
        </>
    );
};

export default CourseDetails;