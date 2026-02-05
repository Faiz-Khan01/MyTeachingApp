
import { useEffect, useState } from 'react';
import { useLocation, useParams, Link, useNavigate } from 'react-router-dom';
import API from '../api/axiosInstance';
import CourseCard from '../components/CourseCard';

const Courses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();
    const { category } = useParams();

    const queryParams = new URLSearchParams(location.search);
    const searchTerm = queryParams.get('search');

    const handleEnroll = async (courseId) => {
        try {
            await API.post(`/users/enroll/${courseId}`);
            alert("Enrolled successfully!");
            navigate('/dashboard');
        } catch (err) {
            console.error("Enrollment failed", err);
            alert(err.response?.data?.message || "Failed to enroll. Are you logged in?");
        }
    };

    useEffect(() => {
        const fetchCourses = async () => {
            setLoading(true);
            try {
                let url = '/courses';
                if (searchTerm) {
                    url = `/courses/search?q=${encodeURIComponent(searchTerm)}`;
                } 
                else if (category) {
                    url = `/courses/category/${category}`;
                }

                const res = await API.get(url);
                setCourses(res.data);
            } catch (err) {
                console.error("Error fetching courses:", err);
                setCourses([]);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, [searchTerm, category]);

    return (
        <div className="container py-5">
            {/* 1. ADDED BREADCRUMBS: This sits at the very top */}
            {/* {(category || searchTerm) && (
                <nav aria-label="breadcrumb" className="mb-3">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                            <Link to="/" className="text-decoration-none">Home</Link>
                        </li>
                        <li className="breadcrumb-item">
                            <Link to="/courses" className="text-decoration-none">All Courses</Link>
                        </li>
                        <li className="breadcrumb-item active" aria-current="page">
                            {category ? category.charAt(0).toUpperCase() + category.slice(1) : "Search"}
                        </li>
                    </ol>
                </nav>
            )} */}

            {/* 2. HEADER SECTION: Modified to include the Clear Filter button */}
            <div className="mb-4 d-flex justify-content-between align-items-end">
                <div>
                    <h2 className="fw-bold">
                        {searchTerm ? `Showing results for "${searchTerm}"` : 
                         category ? `${category.charAt(0).toUpperCase() + category.slice(1)} Courses` : 
                         "All Courses"}
                    </h2>
                    <p className="text-muted mb-0">
                        {courses.length} {courses.length === 1 ? 'course' : 'courses'} found
                    </p>
                </div>

                {/* This button appears on the right side of the header */}
                {(category || searchTerm) && (
                    <Link to="/courses" className="btn btn-outline-secondary btn-sm rounded-pill px-3">
                        ✕ Clear Filters
                    </Link>
                )}
            </div>

            {/* 3. LOADING & COURSE GRID */}
            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : (
                <div className="row g-4">
                    {courses.length > 0 ? (
                        courses.map(course => (
                            <div key={course.id} className="col-12 col-md-6 col-lg-4">
                                <CourseCard 
                                    course={course} 
                                    onEnroll={handleEnroll} 
                                />
                            </div>
                        ))
                    ) : (
                        <div className="col-12 text-center py-5 shadow-sm rounded-4 bg-light">
                            <div className="display-1">🔎</div>
                            <h3 className="mt-3 fw-bold">No courses found</h3>
                            <p className="text-muted">Try searching for something else.</p>
                            <Link to="/courses" className="btn btn-primary rounded-pill px-4">
                                View All Courses
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Courses;