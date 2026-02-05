

import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Initialize state from URL so the text doesn't disappear on refresh
    const [searchQuery, setSearchQuery] = useState(
        new URLSearchParams(location.search).get('search') || ""
    );

    // Sync search bar text if the URL changes (e.g., clicking a category or back button)
    useEffect(() => {
        const query = new URLSearchParams(location.search).get('search');
        setSearchQuery(query || "");
    }, [location.search]);

    // --- AUTOMATIC SEARCH LOGIC (Debounced) ---
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            const currentParams = new URLSearchParams(location.search).get('search') || "";
            
            // Only navigate if the user typed something different than what's already in the URL
            if (searchQuery.trim() !== currentParams) {
                if (searchQuery.trim()) {
                    navigate(`/courses?search=${encodeURIComponent(searchQuery.trim())}`);
                } else if (searchQuery === "" && location.pathname === "/courses") {
                    // If user clears the bar while on courses page, show all
                    navigate("/courses");
                }
            }
        }, 400); // 400ms delay

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery, navigate, location.pathname]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/courses?search=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm sticky-top">
            <div className="container">
                <Link className="navbar-brand fw-bold d-flex align-items-center" to="/">
                    <span className="fs-3 me-2">🎓</span>
                    <span className="d-none d-md-inline">TeachingApp</span>
                </Link>

                <div className="dropdown ms-2">
                    <button className="btn btn-primary dropdown-toggle border-0" type="button" data-bs-toggle="dropdown">
                        Explore
                    </button>
                    <ul className="dropdown-menu shadow border-0 mt-2">
                         <li><Link className="dropdown-item py-2" to="/courses/category/fullstack">💻 Fullstack</Link></li>
                         <li><Link className="dropdown-item py-2" to="/courses/category/cloud">☁️ Cloud</Link></li>
                         <li><Link className="dropdown-item py-2" to="/courses/category/cyber">🛡️ Cybersecurity</Link></li>
                         <li><Link className="dropdown-item py-2" to="/courses/category/aiml">🤖 AI & ML</Link></li>
                         <li><Link className="dropdown-item py-2" to="/courses/category/datascience">📊 Data Science</Link></li>
                    </ul>
                </div>

                <button className="navbar-toggler border-0 shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <div className="mx-auto mt-2 mt-lg-0 px-lg-3" style={{ width: '100%', maxWidth: '400px' }}>
                        <form className="input-group" onSubmit={handleSearch}>
                            <input 
                                type="text" 
                                className="form-control border-0 bg-light shadow-none" 
                                placeholder="Search courses..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{ borderRadius: '20px 0 0 20px', fontSize: '14px' }}
                            />
                            <button className="btn btn-light border-0 px-3" type="submit" style={{ borderRadius: '0 20px 20px 0' }}>
                                🔍
                            </button>
                        </form>
                    </div>

                    <ul className="navbar-nav ms-auto align-items-center">
                        {user ? (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link px-3" to="/dashboard">My Learning</Link>
                                </li>
                                <li className="nav-item ms-lg-2">
                                    <div className="d-flex align-items-center bg-white bg-opacity-10 rounded-pill px-3 py-1">
                                        <span className="text-white small me-2">Hi, {user.username || 'User'}! 👋</span>
                                        <button className="btn btn-sm btn-light rounded-pill fw-bold" style={{fontSize: '12px'}} onClick={logout}>
                                            Logout
                                        </button>
                                    </div>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link px-3" to="/login">Login 🔐</Link>
                                </li>
                                <li className="nav-item ms-lg-2 mt-2 mt-lg-0">
                                    <Link className="btn btn-warning btn-sm rounded-pill px-4 fw-bold shadow-sm" to="/signup">
                                        Join ✨
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;