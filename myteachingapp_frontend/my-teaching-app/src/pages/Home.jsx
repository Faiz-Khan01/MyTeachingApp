import { useEffect, useState } from 'react';
import API from '../api/axiosInstance';
import CourseCard from '../components/CourseCard';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';

const Home = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch all courses on component mount
    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = () => {
        setLoading(true);
        // Fetches data from Spring Boot: /api/courses
        API.get('/courses')
            .then(res => {
                setCourses(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching courses", err);
                toast.error("Failed to load courses. Please check your connection.");
                setLoading(false);
            });
    };

    const handleEnroll = async (courseId) => {
        try {
            await API.post(`/courses/${courseId}/enroll`);
            toast.success("Successfully enrolled!");
            
            // OPTIONAL: Update local state so the button changes immediately
            setCourses(prevCourses => 
                prevCourses.map(c => 
                    c.id === courseId ? { ...c, enrolled: true } : c
                )
            );
        } catch (err) {
            const errorMsg = err.response?.data?.message || "Please login to enroll in courses.";
            toast.error(errorMsg);
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="container-fluid py-5 px-3 px-md-5 bg-light min-vh-100">
            {/* Minimalist Section Header */}
            <div className="d-flex justify-content-between align-items-center mb-5">
                <div>
                    <h2 className="fw-bold text-dark mb-1">Explore Courses</h2>
                    <p className="text-muted mb-0">Learn from industry experts and upgrade your skills.</p>
                </div>
                <div className="d-none d-md-block">
                    <span className="badge rounded-pill bg-white text-primary border border-primary px-3 py-2 shadow-sm fs-6">
                        {courses.length} Programs Available
                    </span>
                </div>
            </div>

            {/* Responsive Course Grid */}
            {courses.length > 0 ? (
                <div className="row g-4">
                    {courses.map(course => (
                        <div className="col-12 col-md-6 col-lg-4" key={course.id}>
                            {/* isEnrolled is passed to CourseCard to toggle 
                               between 'Enroll' and 'Go to Lessons' 
                            */}
                            <CourseCard 
                                course={course} 
                                onEnroll={handleEnroll} 
                                isEnrolled={course.enrolled} 
                            />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-5 mt-5">
                    <div className="mb-4">
                        <i className="bi bi-search text-muted display-1"></i>
                    </div>
                    <h3 className="fw-bold text-secondary">No courses found</h3>
                    <p className="text-muted lead">The course library is currently empty or the server is offline.</p>
                    <button className="btn btn-primary rounded-pill px-4 py-2 mt-3" onClick={fetchCourses}>
                        <i className="bi bi-arrow-clockwise me-2"></i>Retry Connection
                    </button>
                </div>
            )}
        </div>
    );
};

export default Home;