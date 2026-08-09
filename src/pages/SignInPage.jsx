import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const SignInPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Sign In Data:', formData);
    };

    return (
        <div className="container-fluid appointment py-5">
            <div className="container py-5">
                <div className="row g-5 justify-content-center">
                    <div className="col-lg-6 wow fadeIn" data-wow-delay="0.2s">
                        <div className="appointment-form rounded p-5">
                            <p className="fs-4 text-uppercase text-primary text-center">Welcome Back</p>
                            <h1 className="display-5 mb-4 text-center text-white">Sign In</h1>
                            <form onSubmit={handleSubmit}>
                                <div className="row gy-3 gx-4">
                                    <div className="col-12">
                                        <input 
                                            type="email" 
                                            name="email"
                                            className="form-control py-3 border-primary bg-transparent text-white" 
                                            placeholder="Email Address" 
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="col-12">
                                        <input 
                                            type="password" 
                                            name="password"
                                            className="form-control py-3 border-primary bg-transparent text-white" 
                                            placeholder="Password" 
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="col-12 mt-2 text-end">
                                        <Link to="/forgot-password" className="text-white-50 text-decoration-none">Forgot Password?</Link>
                                    </div>
                                    <div className="col-12">
                                        <button type="submit" className="btn btn-primary text-white w-100 py-3 px-5">SIGN IN</button>
                                    </div>
                                    <div className="col-12 text-center mt-4">
                                        <p className="text-white mb-0">Don't have an account? <Link to="/sign-up" className="text-primary fw-bold">Register Here</Link></p>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignInPage;
