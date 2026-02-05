import { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axiosInstance';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const verifyUser = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await API.get('/auth/me');
                    setUser(response.data);
                } catch (err) {
                    localStorage.removeItem('token');
                    setUser(null);
                }
            }
            setLoading(false);
        };
        verifyUser();
    }, []);

   const login = async (authResponse) => {
    // Check if backend sent an object { token: "..." } or just the string
    const token = typeof authResponse === 'string' ? authResponse : authResponse.token;
    
    localStorage.setItem('token', token);
    
    // Now that token is in localStorage, the interceptor will 
    // automatically add it to this next request:
    const profile = await API.get('/auth/me');
    setUser(profile.data);
    navigate('/dashboard');
};
    const loginWithGoogle = async (idToken) => {
        try {
            const response = await API.post('/auth/google', { token: idToken });
            await login(response.data);
            toast.success("Signed in with Google!");
        } catch (error) {
            toast.error("Google login failed");
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        navigate('/login');
        toast.success("Logged out");
    };

    return (
        <AuthContext.Provider value={{ user, login, loginWithGoogle, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);