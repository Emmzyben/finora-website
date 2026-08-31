import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiRequest } from '../lib/api';

const ForgotPasswordPage = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [resetToken, setResetToken] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const submitRequest = async (event) => {
        event.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);

        try {
            const result = await apiRequest('request-password-reset', {
                method: 'POST',
                body: { email: email.trim().toLowerCase() },
                skipAuth: true,
            });
            setEmail(email.trim().toLowerCase());
            setMessage(result.message || 'Check your email for a reset code.');
            setStep(2);
        } catch (err) {
            setError(err.message || 'Unable to request a password reset.');
        } finally {
            setLoading(false);
        }
    };

    const submitCode = async (event) => {
        event.preventDefault();
        setError('');
        setMessage('');

        if (!/^\d{6}$/.test(code)) {
            setError('Enter the 6-digit reset code from your email.');
            return;
        }

        setLoading(true);
        try {
            const result = await apiRequest('verify-reset-code', {
                method: 'POST',
                body: { email, reset_code: code },
                skipAuth: true,
            });
            setResetToken(result.reset_token);
            setStep(3);
        } catch (err) {
            setError(err.message || 'The reset code is invalid or expired.');
        } finally {
            setLoading(false);
        }
    };

    const submitPassword = async (event) => {
        event.preventDefault();
        setError('');

        if (password.length < 8) {
            setError('Password must be at least 8 characters long.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setLoading(true);
        try {
            const result = await apiRequest('reset-password', {
                method: 'POST',
                body: {
                    email,
                    reset_token: resetToken,
                    new_password: password,
                    confirm_password: confirmPassword,
                },
                skipAuth: true,
            });
            setMessage(result.message || 'Password reset successfully.');
            setTimeout(() => navigate('/sign-in'), 1200);
        } catch (err) {
            setError(err.message || 'Unable to reset your password.');
        } finally {
            setLoading(false);
        }
    };

    const title = step === 1 ? 'Forgot Password' : step === 2 ? 'Enter Reset Code' : 'Create New Password';
    const description = step === 1
        ? "Enter your email address and we'll send you a password reset code."
        : step === 2
            ? `Enter the 6-digit code sent to ${email}.`
            : 'Choose a new password for your account.';

    return (
        <div className="container-fluid appointment py-5">
            <div className="container py-5">
                <div className="row g-5 justify-content-center">
                    <div className="col-lg-6 wow fadeIn" data-wow-delay="0.2s">
                        <div className="appointment-form rounded p-5">
                            <p className="fs-4 text-uppercase text-primary text-center">Account Recovery</p>
                            <h1 className="display-5 mb-4 text-center text-white">{title}</h1>
                            <p className="text-white-50 text-center mb-4">{description}</p>
                            {error && <div className="alert alert-danger">{error}</div>}
                            {message && <div className="alert alert-success">{message}</div>}
                            <form onSubmit={step === 1 ? submitRequest : step === 2 ? submitCode : submitPassword}>
                                <div className="row gy-3 gx-4">
                                    {step === 1 && (
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
                                    )}
                                    {step === 2 && (
                                        <div className="col-12">
                                            <input
                                                type="text"
                                                inputMode="numeric"
                                                autoComplete="one-time-code"
                                                maxLength="6"
                                                className="form-control py-3 border-primary bg-transparent text-white text-center fs-4"
                                                placeholder="000000"
                                                value={code}
                                                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                                required
                                            />
                                        </div>
                                    )}
                                    {step === 3 && (
                                        <>
                                            <div className="col-12">
                                                <input
                                                    type="password"
                                                    className="form-control py-3 border-primary bg-transparent text-white"
                                                    placeholder="New Password"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <div className="col-12">
                                                <input
                                                    type="password"
                                                    className="form-control py-3 border-primary bg-transparent text-white"
                                                    placeholder="Confirm New Password"
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </>
                                    )}
                                    <div className="col-12 mt-4">
                                        <button type="submit" className="btn btn-primary text-white w-100 py-3 px-5" disabled={loading}>
                                            {loading ? 'PLEASE WAIT...' : step === 1 ? 'SEND RESET CODE' : step === 2 ? 'VERIFY CODE' : 'RESET PASSWORD'}
                                        </button>
                                    </div>
                                    {step === 2 && (
                                        <div className="col-12 text-center mt-2">
                                            <button type="button" className="btn btn-link text-primary" onClick={() => setStep(1)}>Use a different email</button>
                                        </div>
                                    )}
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
