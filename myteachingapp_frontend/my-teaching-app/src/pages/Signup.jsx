import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axiosInstance';
import toast from 'react-hot-toast'; // Replaced alert with toast for consistency

const Signup = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        roles: ['USER']
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await API.post('/auth/signup', formData);
            toast.success("Account created! Please login. ✨");
            navigate('/login');
        } catch (error) {
            toast.error("Signup failed. Email or Username might be taken. ❌");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-wrapper d-flex align-items-center justify-content-center min-vh-100 bg-light p-3">
            <div className="card border-0 shadow-sm" style={{ maxWidth: '400px', width: '100%', borderRadius: '16px' }}>
                <div className="card-body p-4">
                    
                    {/* Header */}
                    <div className="text-center mb-4">
                        <h3 className="fw-bold text-dark mb-1">Join Us ✨</h3>
                        <p className="text-muted small">Create your account to start</p>
                    </div>

                    <form onSubmit={handleSignup}>
                        <fieldset disabled={loading} className="border-0 p-0">
                            
                            {/* Username Field */}
                            <div className="mb-3">
                                <label className="form-label small fw-bold text-secondary">
                                    👤 Username
                                </label>
                                <input 
                                    type="text" 
                                    className="form-control bg-light border-0 py-2" 
                                    placeholder="johndoe"
                                    required
                                    onChange={(e) => setFormData({...formData, username: e.target.value})} 
                                    style={{ borderRadius: '10px' }}
                                />
                            </div>

                            {/* Email Field */}
                            <div className="mb-3">
                                <label className="form-label small fw-bold text-secondary">
                                    📧 Email Address
                                </label>
                                <input 
                                    type="email" 
                                    className="form-control bg-light border-0 py-2" 
                                    placeholder="name@example.com"
                                    required
                                    onChange={(e) => setFormData({...formData, email: e.target.value})} 
                                    style={{ borderRadius: '10px' }}
                                />
                            </div>

                            {/* Password Field */}
                            <div className="mb-4">
                                <label className="form-label small fw-bold text-secondary">
                                    🔑 Password
                                </label>
                                <input 
                                    type="password" 
                                    className="form-control bg-light border-0 py-2" 
                                    placeholder="••••••••"
                                    required
                                    onChange={(e) => setFormData({...formData, password: e.target.value})} 
                                    style={{ borderRadius: '10px' }}
                                />
                            </div>
                            
                            {/* Signup Button */}
                            <button 
                                type="submit" 
                                className="btn btn-primary w-100 fw-bold py-2 mb-2 shadow-sm" 
                                style={{ borderRadius: '10px' }}
                            >
                                {loading ? (
                                    <span className="spinner-border spinner-border-sm"></span>
                                ) : (
                                    "Create Account 🚀"
                                )}
                            </button>
                        </fieldset>
                    </form>

                    <div className="mt-4 text-center">
                        <p className="text-muted small mb-0">Already a member?</p>
                        <Link to="/login" className="text-primary fw-bold text-decoration-none small">
                            Login here 🔐
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;