import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const { login, loginWithGoogle } = useAuth();
    const navigate = useNavigate();

    const GOOGLE_CLIENT_ID = "111537290548-9l9mlbfcrtbv1g9ad2nq695uueep3ul3.apps.googleusercontent.com";

    useEffect(() => {
        /* global google */
        if (window.google) {
            google.accounts.id.initialize({
                client_id: GOOGLE_CLIENT_ID,
                callback: handleGoogleResponse,
            });

            google.accounts.id.renderButton(
                document.getElementById("googleSignInBtn"),
                { 
                    theme: "outline", 
                    size: "large", 
                    width: "320", 
                    text: "signin_with",
                    shape: "pill" 
                }
            );
        }
    }, []);

    const handleGoogleResponse = async (response) => {
        setLoading(true);
        try {
            await loginWithGoogle(response.credential);
            toast.success("Welcome! 🚀");
            navigate('/dashboard');
        } catch (error) {
            toast.error("Google login failed ❌");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await API.post('/auth/login', credentials);
            await login(response.data); 
            toast.success("Welcome back! 👋");
            navigate('/dashboard');
        } catch (error) {
            toast.error("Invalid email or password 👤");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-wrapper d-flex align-items-center justify-content-center min-vh-100 bg-light p-3">
            <div className="card border-0 shadow-sm" style={{ maxWidth: '400px', width: '100%', borderRadius: '16px' }}>
                <div className="card-body p-4">
                    
                    {/* Header with Emoji */}
                    <div className="text-center mb-4">
                        <h3 className="fw-bold text-dark mb-1">Login 🔐</h3>
                        <p className="text-muted small">Great to see you again!</p>
                    </div>
                    
                    <form onSubmit={handleSubmit}>
                        <fieldset disabled={loading} className="border-0 p-0">
                            
                            {/* Email Field with Emoji */}
                            <div className="mb-3">
                                <label className="form-label small fw-bold text-secondary">
                                    📧 Email Address
                                </label>
                                <input 
                                    type="email" 
                                    className="form-control bg-light border-0 py-2" 
                                    placeholder="hello@example.com"
                                    required
                                    value={credentials.email}
                                    onChange={(e) => setCredentials({...credentials, email: e.target.value})} 
                                    style={{ borderRadius: '10px' }}
                                />
                            </div>

                            {/* Password Field with Emoji */}
                            <div className="mb-3">
                                <label className="form-label small fw-bold text-secondary">
                                    🔑 Password
                                </label>
                                <input 
                                    type="password" 
                                    className="form-control bg-light border-0 py-2" 
                                    placeholder="••••••••"
                                    required
                                    value={credentials.password}
                                    onChange={(e) => setCredentials({...credentials, password: e.target.value})} 
                                    style={{ borderRadius: '10px' }}
                                />
                            </div>
                            
                            {/* Login Button with Emoji */}
                            <button 
                                type="submit" 
                                className="btn btn-primary w-100 fw-bold py-2 mb-3 shadow-sm" 
                                style={{ borderRadius: '10px' }}
                            >
                                {loading ? (
                                    <span className="spinner-border spinner-border-sm"></span>
                                ) : (
                                    "Login 🚀"
                                )}
                            </button>
                        </fieldset>
                    </form>

                    <div className="d-flex align-items-center mb-4">
                        <hr className="flex-grow-1 m-0 text-muted opacity-25" />
                        <span className="mx-3 text-muted small fw-bold">OR</span>
                        <hr className="flex-grow-1 m-0 text-muted opacity-25" />
                    </div>

                    <div className="d-flex justify-content-center mb-4">
                        <div id="googleSignInBtn"></div>
                    </div>

                    <div className="text-center pt-2">
                        <span className="text-muted small">New user? </span>
                        <Link to="/signup" className="text-primary fw-bold text-decoration-none small">
                            Create Account ✨
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;