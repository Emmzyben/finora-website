import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
    const location = useLocation();

    return (
        <div className="container-fluid position-relative p-0">
            <nav className="navbar navbar-expand-lg navbar-light bg-white px-4 px-lg-5 py-3 py-lg-0">
                <Link to="/" className="navbar-brand p-0">
                    <h1 className="text-primary m-0"><i className="fas fa-piggy-bank me-3"></i>Finora</h1>
                </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
                    <span className="fa fa-bars"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarCollapse">
                    <div className="navbar-nav ms-auto py-0">
                        <Link to="/" className={`nav-item nav-link ${location.pathname === '/' ? 'active' : ''}`}>Home</Link>
                        <Link to="/about" className={`nav-item nav-link ${location.pathname === '/about' ? 'active' : ''}`}>About</Link>
                        <Link to="/services" className={`nav-item nav-link ${location.pathname === '/services' ? 'active' : ''}`}>Services</Link>

                        <Link to="/contact" className={`nav-item nav-link ${location.pathname === '/contact' ? 'active' : ''}`}>Contact Us</Link>
                    </div>
                    <Link to="/sign-up" className="btn btn-primary rounded-pill text-white py-2 px-4 flex-wrap flex-sm-shrink-0">Open Account</Link>

                    <Link to="/sign-in" className="btn btn-outline-primary rounded-pill text-black border border-primary py-2 px-4 m-2 flex-wrap flex-sm-shrink-0">Sign In</Link>
                </div>
            </nav>
        </div>
    );
};

export default Navbar;
