import React, { useState, useEffect, useCallback } from 'react';
import { apiRequest, setCurrentUser } from '../lib/api';

const EmailVerification = ({ email, onVerified, autoSend = false }) => {
    const [code, setCode] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);

    // Lock the user on this page — prevent back navigation until verified
    useEffect(() => {
        window.history.pushState(null, '', window.location.href);
        const handlePopState = () => {
            window.history.pushState(null, '', window.location.href);
        };
        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    const handleVerify = async (event) => {
        event.preventDefault();
        setError('');
        setMessage('');

        if (!/^\d{6}$/.test(code)) {
            setError('Enter the 6-digit verification code from your email.');
            return;
        }

        setLoading(true);
        try {
            const result = await apiRequest('verify-email', {
                method: 'POST',
                body: { verification_code: code },
            });
            setCurrentUser(result.user);
            onVerified(result.user);
        } catch (err) {
            setError(err.message || 'Verification failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleResend = useCallback(async (silent = false) => {
        setError('');
        setMessage('');
        setResending(true);

        try {
            const result = await apiRequest('resend-verification-email', {
                method: 'POST',
                body: {},
            });
            if (!silent) {
                setMessage(result.message || 'A new verification code has been sent.');
            }
        } catch (err) {
            if (!silent) {
                setError(err.message || 'Unable to resend the verification code.');
            }
        } finally {
            setResending(false);
        }
    }, []);

    useEffect(() => {
        if (autoSend) {
            handleResend(true);
        }
    }, [autoSend, handleResend]);

    return (
        <div className="container-fluid appointment py-5">
            <div className="container py-5">
                <div className="row g-5 justify-content-center">
                    <div className="col-lg-6">
                        <div className="appointment-form rounded p-5">
                            <p className="fs-4 text-uppercase text-primary text-center">Account Verification</p>
                            <h1 className="display-5 mb-4 text-center text-white">Verify Your Email</h1>
                            <p className="text-white-50 text-center mb-4">
                                Enter the 6-digit code sent to <strong className="text-white">{email}</strong>.
                            </p>
                            {error && <div className="alert alert-danger">{error}</div>}
                            {message && <div className="alert alert-success">{message}</div>}
                            <form onSubmit={handleVerify}>
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    autoComplete="one-time-code"
                                    maxLength="6"
                                    className="form-control py-3 border-primary bg-transparent text-white text-center fs-4"
                                    placeholder="000000"
                                    value={code}
                                    onChange={(event) => setCode(event.target.value.replace(/\D/g, '').slice(0, 6))}
                                    required
                                />
                                <button type="submit" className="btn btn-primary text-white w-100 py-3 mt-4" disabled={loading}>
                                    {loading ? 'VERIFYING...' : 'VERIFY EMAIL'}
                                </button>
                            </form>
                            <button type="button" className="btn btn-link text-primary w-100 mt-3" onClick={handleResend} disabled={resending}>
                                {resending ? 'SENDING...' : 'Resend verification code'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmailVerification;
