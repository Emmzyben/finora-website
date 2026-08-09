import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Reset password link sent to:', email);
        // Handle password reset logic
    };

    return (
        <div className="container-fluid appointment py-5">
            <div className="container py-5">
                <div className="row g-5 justify-content-center">
                    <div className="col-lg-6 wow fadeIn" data-wow-delay="0.2s">
                        <div className="appointment-form rounded p-5">
                            <p className="fs-4 text-uppercase text-primary text-center">Account Recovery</p>
                            <h1 className="display-5 mb-4 text-center text-white">Forgot Password</h1>
                            <p className="text-white-50 text-center mb-4">Enter your email address and we'll send you a link to reset your password.</p>
                            <form onSubmit={handleSubmit}>
                                <div className="row gy-3 gx-4">
                                    <div className="col-12">
                                        <input 
                                            type="email" 
                                            name="email"
                                            className="form-control py-3 border-primary bg-transparent text-white" 
                                            placeholder="Email Address" 
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="col-12 mt-4">
                                        <button type="submit" className="btn btn-primary text-white w-100 py-3 px-5">SEND RESET LINK</button>
                                    </div>
                                    <div className="col-12 text-center mt-4">
                                        <p className="text-white mb-0">Remember your password? <Link to="/sign-in" className="text-primary fw-bold">Sign In</Link></p>
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

export default ForgotPasswordPage;
