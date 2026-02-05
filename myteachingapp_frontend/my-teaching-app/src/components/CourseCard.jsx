import { useNavigate } from 'react-router-dom';

// 1. Added onRemove to props
const CourseCard = ({ course, onEnroll, isEnrolled, onRemove }) => {
    const navigate = useNavigate();

    const getFallbackImage = (title) => {
        const lowerTitle = title.toLowerCase();
        if (lowerTitle.includes('java')) return "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500";
        if (lowerTitle.includes('sql') || lowerTitle.includes('database')) return "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=500";
        if (lowerTitle.includes('react') || lowerTitle.includes('web')) return "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=500";
        return "https://images.unsplash.com/photo-1586717791821-3f44a563dc4c?w=500";
    };

    return (
        <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden hover-lift bg-white">
            <div className="position-relative">
                <img 
                    src={course.imageUrl || getFallbackImage(course.title)} 
                    className="card-img-top" 
                    alt={course.title} 
                    style={{ height: '180px', objectFit: 'cover' }}
                />
                {isEnrolled && (
                    <div className="position-absolute top-0 start-0 m-2">
                        <span className="badge bg-success shadow-sm">Enrolled</span>
                    </div>
                )}
            </div>

            <div className="card-body p-3 d-flex flex-column">
                <h6 className="fw-bold mb-1 text-dark text-truncate" title={course.title}>
                    {course.title}
                </h6>
                
                <p className="text-muted small mb-3">by {course.instructorName || "Expert Instructor"}</p>
                
                <div className="mt-auto">
                    {!isEnrolled ? (
                        <div className="d-flex justify-content-between align-items-center">
                            <span className="fw-bold text-primary fs-5">${course.price}</span>
                            <div className="btn-group gap-2">
                                <button 
                                    onClick={() => navigate(`/course/${course.id}`)} 
                                    className="btn btn-sm btn-outline-secondary rounded-pill px-3"
                                >
                                    Details
                                </button>
                                <button 
                                    onClick={() => onEnroll(course.id)} 
                                    className="btn btn-sm btn-primary rounded-pill px-3"
                                >
                                    Enroll
                                </button>
                            </div>
                        </div>
                    ) : (
                        /* 2. UPDATED ENROLLED SECTION WITH REMOVE BUTTON */
                        <div className="d-flex gap-2">
                            <button 
                                className="btn btn-sm btn-success flex-grow-1 fw-bold rounded-pill py-2"
                                onClick={() => navigate(`/learn/${course.id}`)}
                            >
                                Continue Learning →
                            </button>
                            <button 
                                className="btn btn-sm btn-outline-danger rounded-circle d-flex align-items-center justify-content-center"
                                onClick={(e) => {
                                    e.stopPropagation(); // Prevents clicking the card background
                                    onRemove();
                                }}
                                style={{ width: '38px', height: '38px' }}
                                title="Remove Course"
                            >
                                <i className="bi bi-trash"></i> 🗑️
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CourseCard;