import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { apiRequest, clearAuth, setAuthToken, setCurrentUser } from '../lib/api';
import EmailVerification from '../components/EmailVerification';

const SignInPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        clearAuth();
    }, []);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [verificationUser, setVerificationUser] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const normalizedEmail = formData.email.trim().toLowerCase();
            const result = await apiRequest('login', {
                method: 'POST',
                body: {
                    email: normalizedEmail,
                    password: formData.password,
                },
            });

            setAuthToken(result.token);
            setCurrentUser(result.user);
            
            if (result.user.is_admin) {
                navigate('/admin');
            } else if (!result.user.email_verified) {
                setVerificationUser(result.user);
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (verificationUser) {
        return (
            <EmailVerification
                email={verificationUser.email}
                autoSend={true}
                onVerified={() => {
                    if (verificationUser.is_admin) {
                        navigate('/admin');
                    } else {
                        navigate('/dashboard');
                    }
                }}
            />
        );
    }

    return (
        <div className="container-fluid appointment py-5">
            <div className="container py-5">
                <div className="row g-5 justify-content-center">
                    <div className="col-lg-6 wow fadeIn" data-wow-delay="0.2s">
                        <div className="appointment-form rounded p-5">
                            <p className="fs-4 text-uppercase text-primary text-center">Welcome Back</p>
                            <h1 className="display-5 mb-4 text-center text-white">Sign In</h1>
                            {error && (
                                <div className="alert alert-danger mb-3">{error}</div>
                            )}
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
                                        <div className="position-relative">
                                            <input 
                                                type={showPassword ? 'text' : 'password'} 
                                                name="password"
                                                className="form-control py-3 border-primary bg-transparent text-white pe-5" 
                                                placeholder="Password" 
                                                value={formData.password}
                                                onChange={handleChange}
                                                required
                                            />
                                            <button
                                                type="button"
                                                className="btn btn-link position-absolute end-0 top-50 translate-middle-y text-white-50 p-0 me-3"
                                                style={{ lineHeight: 1 }}
                                                onClick={() => setShowPassword((prev) => !prev)}
                                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                                            >
                                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="col-12 mt-2 text-end">
                                        <Link to="/forgot-password" className="text-white-50 text-decoration-none">Forgot Password?</Link>
                                    </div>
                                    <div className="col-12">
                                        <button type="submit" className="btn btn-primary text-white w-100 py-3 px-5" disabled={loading}>
                                            {loading ? 'SIGNING IN...' : 'SIGN IN'}
                                        </button>
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
