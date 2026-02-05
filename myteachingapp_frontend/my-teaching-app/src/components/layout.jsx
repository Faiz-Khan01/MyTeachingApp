import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = () => {
    return (
        /* d-flex flex-column min-vh-100: Ensures the footer is pushed 
           to the bottom of the screen even on empty pages.
        */
        <div className="d-flex flex-column min-vh-100 bg-light">
            {/* Header / Navigation */}
            <Navbar />
            
            {/* Main Page Content */}
            <main className="flex-grow-1">
                {/* We remove the 'container' from here if pages like 
                   'Home' or 'CourseDetails' have their own full-width 
                   sections (like Hero banners).
                */}
                <Outlet /> 
            </main>

            {/* Global Footer */}
            <Footer />
        </div>
    );
};

export default Layout;