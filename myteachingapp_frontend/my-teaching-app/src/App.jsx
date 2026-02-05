import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

// Layout and Security
import Layout from './components/layout';
import PrivateRoute from './routes/PrivateRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/login';
import Signup from './pages/signup';
import Dashboard from './pages/Dashboard';
import CourseDetails from './pages/CourseDetails';
import LearnCourse from './pages/LearnCourse';
import Courses from './pages/Courses'; // The essential page for Search & Dropdowns
import LearningPage from './pages/LearningPage';

function App() {
    return (
        <Router>
            <AuthProvider>
                {/* Global notifications for enrollment success/failure */}
                <Toaster 
                    position="top-right" 
                    toastOptions={{
                        duration: 3000,
                        style: {
                            borderRadius: '10px',
                            background: '#333',
                            color: '#fff',
                        },
                    }} 
                />
                
                <Routes>
                    {/* All routes inside Layout will share the Navbar and Footer */}
                    <Route path="/" element={<Layout />}>
                        
                        {/* 1. Public Routes */}
                        <Route index element={<Home />} />
                        <Route path="login" element={<Login />} />
                        <Route path="signup" element={<Signup />} />
                        
                        {/* 2. Course Discovery Routes (Search & Categories) 
                            - /courses: Show all or search results
                            - /courses/:category: Show specific categories (AI, Cloud, etc.)
                        */}
                        <Route path="courses" element={<Courses />} />
                        <Route path="courses/category/:category" element={<Courses />} />
                        
                        {/* 3. Individual Course Details */}
                        <Route path="course/:id" element={<CourseDetails />} />

                        {/* 4. Learning course */}
                        <Route path="/learn/:courseId" element={<LearningPage />} />

                        {/* 5. Protected Routes (User must be logged in) */}
                        <Route 
                            path="dashboard" 
                            element={
                                <PrivateRoute>
                                    <Dashboard />
                                </PrivateRoute>
                            } 
                        />

                        <Route 
                            path="learn/:id" 
                            element={
                                <PrivateRoute>
                                    <LearnCourse />
                                </PrivateRoute>
                            } 
                        />

                        {/* 5. 404 Not Found fallback */}
                        <Route path="*" element={
                            <div className="container text-center mt-5 py-5">
                                <div className="card shadow-sm border-0 p-5 rounded-4">
                                    <h1 className="display-1 fw-bold text-primary">404</h1>
                                    <h2 className="fw-bold">Page Not Found</h2>
                                    <p className="text-muted mb-4">
                                        The classroom you're looking for doesn't exist or has moved.
                                    </p>
                                    <div>
                                        <a href="/" className="btn btn-primary rounded-pill px-4 py-2 fw-bold">
                                            Return Home 🏠
                                        </a>
                                    </div>
                                </div>
                            </div>
                        } />

                    </Route>
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;