const Footer = () => {
    return (
        <footer className="bg-dark text-white py-4 mt-auto border-top border-secondary border-opacity-25">
            <div className="container">
                <div className="text-center">
                    <p className="small mb-0 text-secondary opacity-75">
                        &copy; {new Date().getFullYear()} MyTeachingApp. Designed with <span className="text-danger mx-1">❤️</span> for learners.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;