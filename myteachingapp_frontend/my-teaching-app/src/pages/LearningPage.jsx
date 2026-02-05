import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axiosInstance';

const LearningPage = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourseDetails = async () => {
            try {
                const res = await API.get(`/courses/${courseId}`);
                setCourse(res.data);
            } catch (err) {
                console.error("Error loading course", err);
            } finally {
                setLoading(false);
            }
        };
        fetchCourseDetails();
    }, [courseId]);

    if (loading) return <div className="text-center py-5 mt-5"><div className="spinner-border text-primary"></div></div>;

    return (
        <div className="container-fluid p-0 bg-dark min-vh-100 text-white">
            {/* Simple Header */}
            <div className="bg-secondary p-3 d-flex align-items-center gap-3">
                <button onClick={() => navigate('/dashboard')} className="btn btn-outline-light btn-sm">← Back to Hub</button>
                <h5 className="mb-0">{course?.title}</h5>
            </div>

            <div className="row g-0">
                {/* VIDEO PLAYER AREA */}
                <div className="col-lg-9">
                    <div className="ratio ratio-16x9 bg-black shadow-lg">
                        {/* If you have video URLs in your DB, use them here */}
                        <iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" title="Video" allowFullScreen></iframe>
                    </div>
                    <div className="p-4 bg-white text-dark">
                        <h3>About this Course</h3>
                        <p>{course?.description}</p>
                    </div>
                </div>

                {/* LESSONS LIST / SIDEBAR */}
                <div className="col-lg-3 bg-light text-dark border-start vh-100 overflow-auto">
                    <div className="p-3 border-bottom bg-white sticky-top">
                        <h6 className="fw-bold mb-0">Course Content</h6>
                    </div>
                    <div className="list-group list-group-flush">
                        <button className="list-group-item list-group-item-action active">1. Introduction</button>
                        <button className="list-group-item list-group-item-action">2. Getting Started</button>
                        <button className="list-group-item list-group-item-action">3. Advanced Concepts</button>
                        <button className="list-group-item list-group-item-action text-muted">4. Final Project (Locked)</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LearningPage;